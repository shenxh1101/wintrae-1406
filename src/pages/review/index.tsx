import React, { useState, useMemo } from 'react';
import { View, Text, Image, Input, ScrollView, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useCamping } from '@/store/CampingContext';
import { genId } from '@/utils/id';
import { Member, Vehicle } from '@/types/camping';
import styles from './index.module.scss';

interface DepartureSnapshotProps {
  snapshot: {
    members: Member[];
    vehicles: Vehicle[];
    gearClaimedBy: Record<string, string[]>;
  };
}

const DepartureSnapshot: React.FC<DepartureSnapshotProps> = ({ snapshot }) => {
  const memberMap = useMemo(() => {
    const map: Record<string, Member> = {};
    snapshot.members.forEach(m => {
      map[m.id] = m;
    });
    return map;
  }, [snapshot.members]);

  return (
    <View className={styles.departureSnapshotSection}>
      <Text className={styles.snapshotSectionTitle}>📋 出发确认</Text>

      {snapshot.vehicles.map(vehicle => {
        const passengerNames = vehicle.passengers
          .map(pid => memberMap[pid]?.name)
          .filter(Boolean);
        return (
          <View key={vehicle.id} className={styles.snapshotVehicleBlock}>
            <Text className={styles.snapshotVehicleName}>
              🚗 {vehicle.brand} · {vehicle.plate}（司机：{vehicle.driver}）
            </Text>
            <View className={styles.snapshotPassengerTags}>
              <View className={`${styles.snapshotPassengerTag} ${styles.snapshotDriverTag}`}>
                <Text>司机：{vehicle.driver}</Text>
              </View>
              {passengerNames.map((name, idx) => (
                <View key={idx} className={styles.snapshotPassengerTag}>
                  <Text>{name}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      })}

      {snapshot.members.map(member => {
        const gear = snapshot.gearClaimedBy[member.name] || [];
        return (
          <View key={member.id} className={styles.snapshotMemberRow}>
            <View className={styles.snapshotMemberAvatar}>
              <Text>{member.name.charAt(0)}</Text>
            </View>
            <View className={styles.snapshotMemberInfo}>
              <View style={{ display: 'flex', alignItems: 'center', gap: '12rpx' }}>
                <Text className={styles.snapshotMemberName}>{member.name}</Text>
                <Text style={{ fontSize: '22rpx', color: '#999' }}>· {member.role}</Text>
              </View>
              <View style={{ marginTop: '8rpx' }}>
                {gear.length > 0 ? (
                  <Text className={styles.snapshotGearLine}>🎒 负责: {gear.join('、')}</Text>
                ) : (
                  <Text className={styles.snapshotGearLine}>无认领物资</Text>
                )}
              </View>
            </View>
            {member.confirmed ? (
              <View className={styles.snapshotConfirmedBadge}>
                <Text>✅ 已确认</Text>
              </View>
            ) : (
              <View className={styles.snapshotUnconfirmedBadge}>
                <Text>⚠️ 未确认</Text>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
};

const ReviewPage: React.FC = () => {
  const {
    state,
    addReviewPhoto, removeReviewPhoto,
    addActualCost, removeActualCost,
    addMissedItem, removeMissedItem,
    updateReviewNotes,
    archiveReview,
    copyFromPastTrip
  } = useCamping();

  const [costName, setCostName] = useState('');
  const [costAmount, setCostAmount] = useState('');
  const [missedItem, setMissedItem] = useState('');
  const [showCostForm, setShowCostForm] = useState(false);
  const [showMissedForm, setShowMissedForm] = useState(false);

  const stats = useMemo(() => {
    const totalTrips = state.pastTrips.length;
    const totalCost = state.pastTrips.reduce((sum, t) => sum + t.totalCost, 0);
    const latestDate = state.pastTrips.length > 0 ? state.pastTrips[0].date : '-';
    return { totalTrips, totalCost, latestDate };
  }, [state.pastTrips]);

  const reviewTotalCost = useMemo(() => {
    return state.review.actualCost.reduce((sum, c) => sum + c.amount, 0);
  }, [state.review.actualCost]);

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 9,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        res.tempFilePaths.forEach(path => {
          addReviewPhoto({ id: genId(), url: path });
        });
      },
      fail: (err) => {
        console.error('[ReviewPage] chooseImage error:', err);
      }
    });
  };

  const handleAddCost = () => {
    if (!costName.trim() || !costAmount.trim()) return;
    addActualCost({ id: genId(), name: costName.trim(), amount: Number(costAmount) || 0 });
    setCostName('');
    setCostAmount('');
    setShowCostForm(false);
  };

  const handleAddMissed = () => {
    if (!missedItem.trim()) return;
    addMissedItem(missedItem.trim());
    setMissedItem('');
    setShowMissedForm(false);
  };

  const handleCopy = (tripId: string) => {
    const success = copyFromPastTrip(tripId);
    if (success) {
      Taro.showToast({ title: '已复制为新计划', icon: 'success', duration: 1500 });
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/trip/index' });
      }, 1500);
    } else {
      Taro.showToast({ title: '该行程无计划快照', icon: 'none' });
    }
  };

  const handleArchive = () => {
    const hasContent = state.review.photos.length > 0
      || state.review.actualCost.length > 0
      || state.review.missedItems.length > 0
      || state.review.notes.trim().length > 0;
    if (!hasContent) {
      Taro.showToast({ title: '请先填写复盘内容', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '归档确认',
      content: '归档后当前复盘将移入历史行程，是否继续？',
      success: (res) => {
        if (!res.confirm) return;
        archiveReview();
        Taro.showToast({ title: '已归档到历史行程', icon: 'success' });
      }
    });
  };

  const currentDepartureSnapshot = state.review.planSnapshot?.departureSnapshot;

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.scrollContent}>
        <View className={styles.currentTrip}>
          <View className={styles.currentTitleRow}>
            <Text className={styles.currentTitle}>当前行程复盘</Text>
            {state.review.archived && (
              <View className={styles.archivedBadge}>
                <Text className={styles.archivedBadgeText}>已归档</Text>
              </View>
            )}
          </View>

          <View className={styles.photoSection}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionLabel}>📷 精彩瞬间 ({state.review.photos.length})</Text>
            </View>
            {state.review.photos.length > 0 && (
              <ScrollView scrollX className={styles.photoScroll}>
                {state.review.photos.map(photo => (
                  <View key={photo.id} className={styles.photoItemWrap}>
                    <Image className={styles.photoImg} src={photo.url} mode="aspectFill" />
                    <View
                      className={styles.photoDelete}
                      onClick={() => removeReviewPhoto(photo.id)}
                    >
                      <Text className={styles.photoDeleteText}>✕</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
            <View className={styles.uploadBtn} onClick={handleChooseImage}>
              <Text className={styles.uploadBtnText}>+ 上传照片</Text>
            </View>
          </View>

          <View className={styles.costSection}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionLabel}>💰 实际花费 (¥{reviewTotalCost})</Text>
              <View className={styles.smallAddBtn} onClick={() => { setCostName(''); setCostAmount(''); setShowCostForm(true); }}>
                <Text className={styles.smallAddBtnText}>+ 添加</Text>
              </View>
            </View>
            {state.review.actualCost.map(cost => (
              <View key={cost.id} className={styles.costRow}>
                <Text className={styles.costRowName}>{cost.name}</Text>
                <View className={styles.costRowRight}>
                  <Text className={styles.costRowAmount}>¥{cost.amount}</Text>
                  <View className={styles.costDeleteBtn} onClick={() => removeActualCost(cost.id)}>
                    <Text className={styles.costDeleteText}>✕</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View className={styles.missedSection}>
            <View className={styles.sectionHeader}>
              <Text className={styles.sectionLabel}>⚠️ 遗漏物品</Text>
              <View className={styles.smallAddBtn} onClick={() => { setMissedItem(''); setShowMissedForm(true); }}>
                <Text className={styles.smallAddBtnText}>+ 添加</Text>
              </View>
            </View>
            <View className={styles.missedTags}>
              {state.review.missedItems.map((item, idx) => (
                <View key={idx} className={styles.missedTag}>
                  <Text className={styles.missedTagText}>{item}</Text>
                  <Text
                    className={styles.missedTagDelete}
                    onClick={() => removeMissedItem(idx)}
                  >✕</Text>
                </View>
              ))}
            </View>
          </View>

          <View className={styles.notesSection}>
            <Text className={styles.sectionLabel}>📝 心得记录</Text>
            <Textarea
              className={styles.notesTextarea}
              placeholder="记录本次露营的感想和经验..."
              value={state.review.notes}
              onInput={e => updateReviewNotes(e.detail.value)}
              maxlength={500}
            />
          </View>

          <View className={styles.archiveBtn} onClick={handleArchive}>
            <Text className={styles.archiveBtnText}>📦 归档到历史行程</Text>
          </View>

          {state.review.archived && currentDepartureSnapshot && (
            <DepartureSnapshot snapshot={currentDepartureSnapshot} />
          )}
        </View>

        <View className={styles.divider}></View>

        <View className={styles.summaryCard}>
          <Text className={styles.summaryTitle}>历史总览</Text>
          <View className={styles.summaryStats}>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{stats.totalTrips}</Text>
              <Text className={styles.statLabel}>出行次数</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>¥{stats.totalCost}</Text>
              <Text className={styles.statLabel}>累计花费</Text>
            </View>
            <View className={styles.statItem}>
              <Text className={styles.statValue}>{stats.latestDate.slice(5)}</Text>
              <Text className={styles.statLabel}>最近出行</Text>
            </View>
          </View>
        </View>

        {state.pastTrips.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🏕️</Text>
            <Text className={styles.emptyText}>还没有露营记录，出发去露营吧！</Text>
          </View>
        ) : (
          state.pastTrips.map(trip => (
            <View key={trip.id} className={styles.tripCard}>
              <View className={styles.tripHeader}>
                <View className={styles.tripTitleRow}>
                  <Text className={styles.tripTitle}>{trip.tripName}</Text>
                  {trip.archived && (
                    <View className={styles.archivedBadge}>
                      <Text className={styles.archivedBadgeText}>已归档</Text>
                    </View>
                  )}
                </View>
                <Text className={styles.tripDate}>{trip.date}</Text>
              </View>

              {trip.planSnapshot?.departureSnapshot && (
                <DepartureSnapshot snapshot={trip.planSnapshot.departureSnapshot} />
              )}

              {trip.photos.length > 0 && (
                <View className={styles.pastPhotoSection}>
                  <ScrollView scrollX className={styles.photoScroll}>
                    {trip.photos.map(photo => (
                      <View key={photo.id} className={styles.pastPhotoItem}>
                        <Image className={styles.photoImg} src={photo.url} mode="aspectFill" />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {trip.actualCost.length > 0 && (
                <View className={styles.pastCostSection}>
                  {trip.actualCost.map((cost, idx) => (
                    <View key={cost.id}>
                      <View className={styles.pastCostRow}>
                        <Text className={styles.pastCostName}>{cost.name}</Text>
                        <Text className={styles.pastCostAmount}>¥{cost.amount}</Text>
                      </View>
                      {idx < trip.actualCost.length - 1 && <View className={styles.costDivider} />}
                    </View>
                  ))}
                  <View className={styles.costDivider} />
                  <View className={styles.pastCostTotal}>
                    <Text className={styles.pastCostTotalLabel}>总花费</Text>
                    <Text className={styles.pastCostTotalAmount}>¥{trip.totalCost}</Text>
                  </View>
                </View>
              )}

              {trip.missedItems.length > 0 && (
                <View className={styles.pastMissedSection}>
                  <Text className={styles.pastMissedLabel}>⚠️ 遗漏物品</Text>
                  <View className={styles.missedTags}>
                    {trip.missedItems.map((item, idx) => (
                      <View key={idx} className={styles.missedTag}>
                        <Text className={styles.missedTagText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {trip.notes && (
                <View className={styles.pastNotesSection}>
                  <Text className={styles.pastNotesText}>{trip.notes}</Text>
                </View>
              )}

              <View className={styles.copyButton} onClick={() => handleCopy(trip.id)}>
                <Text className={styles.copyButtonText}>📋 复制为新计划</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {showCostForm && (
        <View className={styles.modalMask} onClick={() => setShowCostForm(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>添加实际花费</Text>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>费用名称</Text>
              <Input className={styles.formInput} placeholder="如：油费" value={costName} onInput={e => setCostName(e.detail.value)} />
            </View>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>金额</Text>
              <Input className={styles.formInput} type="digit" placeholder="请输入金额" value={costAmount} onInput={e => setCostAmount(e.detail.value)} />
            </View>
            <View className={styles.modalActions}>
              <View className={styles.cancelBtn} onClick={() => setShowCostForm(false)}>
                <Text className={styles.cancelBtnText}>取消</Text>
              </View>
              <View className={styles.confirmBtn} onClick={handleAddCost}>
                <Text className={styles.confirmBtnText}>保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {showMissedForm && (
        <View className={styles.modalMask} onClick={() => setShowMissedForm(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>添加遗漏物品</Text>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>物品名称</Text>
              <Input className={styles.formInput} placeholder="如：防晒霜" value={missedItem} onInput={e => setMissedItem(e.detail.value)} />
            </View>
            <View className={styles.modalActions}>
              <View className={styles.cancelBtn} onClick={() => setShowMissedForm(false)}>
                <Text className={styles.cancelBtnText}>取消</Text>
              </View>
              <View className={styles.confirmBtn} onClick={handleAddMissed}>
                <Text className={styles.confirmBtnText}>保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ReviewPage;
