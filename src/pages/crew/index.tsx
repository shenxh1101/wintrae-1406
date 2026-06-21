import React, { useState, useMemo } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useCamping } from '@/store/CampingContext';
import { genId } from '@/utils/id';
import SectionHeader from '@/components/SectionHeader';
import classnames from 'classnames';
import styles from './index.module.scss';

const costColors = ['#2D6A4F', '#E76F51', '#E9C46A', '#264653', '#40916C'];

type ModalType = 'member' | 'vehicle' | 'cost' | 'emergency' | 'costSplit' | 'vehiclePassenger' | '';

const CrewPage: React.FC = () => {
  const {
    state,
    addMember, removeMember,
    addVehicle, removeVehicle,
    addEstimatedCost, removeEstimatedCost,
    addEmergencyContact, removeEmergencyContact,
    updateVehiclePassengers,
    updateCostSplit,
    toggleMemberConfirm
  } = useCamping();

  const [modalType, setModalType] = useState<ModalType>('');
  const [mName, setMName] = useState('');
  const [mPhone, setMPhone] = useState('');
  const [mRole, setMRole] = useState('');
  const [vBrand, setVBrand] = useState('');
  const [vPlate, setVPlate] = useState('');
  const [vDriver, setVDriver] = useState('');
  const [vSeats, setVSeats] = useState('5');
  const [cName, setCName] = useState('');
  const [cAmount, setCAmount] = useState('');
  const [eName, setEName] = useState('');
  const [ePhone, setEPhone] = useState('');
  const [eRelation, setERelation] = useState('');

  const [splitCostId, setSplitCostId] = useState('');
  const [splitSelectedIds, setSplitSelectedIds] = useState<string[]>([]);
  const [passengerVehicleId, setPassengerVehicleId] = useState('');
  const [passengerSelectedIds, setPassengerSelectedIds] = useState<string[]>([]);

  const totalEstimated = useMemo(() => {
    return state.estimatedCost.reduce((sum, c) => sum + c.amount, 0);
  }, [state.estimatedCost]);

  const memberTotalShare = useMemo(() => {
    const shares: Record<string, number> = {};
    state.members.forEach(m => { shares[m.id] = 0; });
    state.estimatedCost.forEach(cost => {
      if (cost.splitMemberIds && cost.splitMemberIds.length > 0) {
        const perPerson = cost.amount / cost.splitMemberIds.length;
        cost.splitMemberIds.forEach(id => {
          if (shares[id] !== undefined) {
            shares[id] += perPerson;
          }
        });
      }
    });
    return shares;
  }, [state.estimatedCost, state.members]);

  const hasAnySplit = useMemo(() => {
    return state.estimatedCost.some(c => c.splitMemberIds && c.splitMemberIds.length > 0);
  }, [state.estimatedCost]);

  const boardStats = useMemo(() => {
    const total = state.members.length;
    const confirmedCount = state.members.filter(m => m.confirmed).length;
    const assignedCount = state.members.filter(m => {
      return state.vehicles.some(v => v.passengers.includes(m.id) || v.driver === m.name);
    }).length;
    return { total, confirmedCount, assignedCount };
  }, [state.members, state.vehicles]);

  const getMemberVehicle = (memberId: string) => {
    const member = state.members.find(m => m.id === memberId);
    if (!member) return null;
    const vehicle = state.vehicles.find(v =>
      v.passengers.includes(memberId) || v.driver === member.name
    );
    return vehicle || null;
  };

  const getMemberClaimedGear = (memberName: string) => {
    return state.gearList.filter(g => g.claimedBy === memberName).map(g => g.name);
  };

  const hasPassengerConflict = (memberId: string, currentVehicleId: string) => {
    return state.vehicles.find(v => v.id !== currentVehicleId && v.passengers.includes(memberId));
  };

  const getInitial = (name: string) => {
    return name ? name.slice(0, 1) : '?';
  };

  const getMemberName = (id: string) => {
    const member = state.members.find(m => m.id === id);
    return member ? member.name : '未知';
  };

  const openModal = (type: ModalType) => {
    setModalType(type);
    if (type === 'member') { setMName(''); setMPhone(''); setMRole(''); }
    if (type === 'vehicle') { setVBrand(''); setVPlate(''); setVDriver(''); setVSeats('5'); }
    if (type === 'cost') { setCName(''); setCAmount(''); }
    if (type === 'emergency') { setEName(''); setEPhone(''); setERelation(''); }
  };

  const openSplitModal = (costId: string) => {
    const cost = state.estimatedCost.find(c => c.id === costId);
    setSplitCostId(costId);
    setSplitSelectedIds(cost?.splitMemberIds || []);
    setModalType('costSplit');
  };

  const openPassengerModal = (vehicleId: string) => {
    const vehicle = state.vehicles.find(v => v.id === vehicleId);
    setPassengerVehicleId(vehicleId);
    setPassengerSelectedIds(vehicle?.passengers || []);
    setModalType('vehiclePassenger');
  };

  const toggleSplitMember = (memberId: string) => {
    setSplitSelectedIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const togglePassengerMember = (memberId: string) => {
    const vehicle = state.vehicles.find(v => v.id === passengerVehicleId);
    const maxPassengers = vehicle ? vehicle.seats - 1 : 0;
    const alreadySelected = passengerSelectedIds.includes(memberId);

    if (!alreadySelected && passengerSelectedIds.length >= maxPassengers) {
      Taro.showToast({ title: '座位已满', icon: 'none' });
      return;
    }

    setPassengerSelectedIds(prev =>
      alreadySelected
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSave = () => {
    if (modalType === 'member') {
      if (!mName.trim()) return;
      addMember({ id: genId(), name: mName.trim(), phone: mPhone.trim(), role: mRole.trim() || '成员' });
    } else if (modalType === 'vehicle') {
      if (!vBrand.trim()) return;
      addVehicle({ id: genId(), brand: vBrand.trim(), plate: vPlate.trim(), driver: vDriver.trim(), seats: Number(vSeats) || 5, passengers: [] });
    } else if (modalType === 'cost') {
      if (!cName.trim() || !cAmount.trim()) return;
      addEstimatedCost({ id: genId(), name: cName.trim(), amount: Number(cAmount) || 0 });
    } else if (modalType === 'emergency') {
      if (!eName.trim()) return;
      addEmergencyContact({ id: genId(), name: eName.trim(), phone: ePhone.trim(), relation: eRelation.trim() || '亲友' });
    } else if (modalType === 'costSplit') {
      updateCostSplit(splitCostId, splitSelectedIds);
    } else if (modalType === 'vehiclePassenger') {
      updateVehiclePassengers(passengerVehicleId, passengerSelectedIds);
    }
    setModalType('');
  };

  const confirmDelete = (type: string, id: string, name: string) => {
    Taro.showModal({
      title: '确认删除',
      content: `确定删除「${name}」吗？`,
      success: (res) => {
        if (!res.confirm) return;
        if (type === 'member') removeMember(id);
        else if (type === 'vehicle') removeVehicle(id);
        else if (type === 'cost') removeEstimatedCost(id);
        else if (type === 'emergency') removeEmergencyContact(id);
      }
    });
  };

  const getAvailablePassengers = (vehicleId: string) => {
    const vehicle = state.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return state.members;
    return state.members.filter(m => m.name !== vehicle.driver);
  };

  const currentVehicle = state.vehicles.find(v => v.id === passengerVehicleId);
  const remainingSeats = currentVehicle
    ? Math.max(0, currentVehicle.seats - 1 - passengerSelectedIds.length)
    : 0;

  return (
    <View className={styles.page}>
      <ScrollView scrollY className={styles.content}>
        <View className={styles.departureBoard}>
          <View className={styles.boardHeader}>
            <Text className={styles.boardTitle}>出发确认看板</Text>
            <Text className={styles.boardStats}>
              已确认 {boardStats.confirmedCount}/{boardStats.total} 人 · 已分配车辆 {boardStats.assignedCount}/{boardStats.total} 人
            </Text>
          </View>
          {state.members.map(member => {
            const memberVehicle = getMemberVehicle(member.id);
            const claimedGear = getMemberClaimedGear(member.name);
            const isReady = member.confirmed && !!memberVehicle;
            return (
              <View
                key={member.id}
                className={classnames(styles.boardMemberRow, {
                  [styles.boardReady]: isReady,
                  [styles.boardNotReady]: !isReady
                })}
              >
                <View className={styles.boardAvatar}>
                  <Text className={styles.boardAvatarText}>{getInitial(member.name)}</Text>
                </View>
                <View className={styles.boardMemberInfo}>
                  <View className={styles.boardMemberName}>
                    <Text style={{ fontWeight: 600 }}>{member.name}</Text>
                    <View className={styles.boardRoleTag}>
                      <Text>{member.role}</Text>
                    </View>
                  </View>
                  <View className={styles.boardStatusLine}>
                    <View
                      className={styles.confirmToggle}
                      onClick={() => toggleMemberConfirm(member.id)}
                    >
                      <Text className={member.confirmed ? styles.statusOk : styles.statusWarn}>
                        {member.confirmed ? '✅' : '❌'}
                      </Text>
                    </View>
                    {memberVehicle ? (
                      <Text className={styles.statusOk}>
                        🚗 已分配: {memberVehicle.brand} · {memberVehicle.plate}
                      </Text>
                    ) : (
                      <Text className={styles.statusWarn}>⚠️ 未分配车辆</Text>
                    )}
                  </View>
                  <View className={styles.boardGearLine}>
                    {claimedGear.length > 0 ? (
                      <Text className={styles.statusOk}>🎒 负责: {claimedGear.join('、')}</Text>
                    ) : (
                      <Text className={styles.statusWarn}>⚠️ 无认领物资</Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <SectionHeader title={`同行人员 (${state.members.length})`} />
            <View className={styles.addBtn} onClick={() => openModal('member')}>
              <Text className={styles.addBtnText}>+ 添加</Text>
            </View>
          </View>
          <View className={styles.memberList}>
            {state.members.map(member => (
              <View key={member.id} className={styles.memberItem}>
                <View className={styles.avatar}>
                  <Text className={styles.avatarText}>{getInitial(member.name)}</Text>
                </View>
                <View className={styles.memberInfo}>
                  <View className={styles.memberNameRow}>
                    <Text className={styles.memberName}>{member.name}</Text>
                    <View className={styles.roleTag}>
                      <Text>{member.role}</Text>
                    </View>
                  </View>
                  <Text className={styles.memberPhone}>{member.phone}</Text>
                </View>
                <View className={styles.deleteBtn} onClick={() => confirmDelete('member', member.id, member.name)}>
                  <Text className={styles.deleteIcon}>✕</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <SectionHeader title={`出行车辆 (${state.vehicles.length})`} />
            <View className={styles.addBtn} onClick={() => openModal('vehicle')}>
              <Text className={styles.addBtnText}>+ 添加</Text>
            </View>
          </View>
          <View className={styles.vehicleList}>
            {state.vehicles.map(vehicle => (
              <View key={vehicle.id} className={styles.vehicleItem}>
                <View className={styles.vehicleRow}>
                  <View className={styles.vehicleIcon}>
                    <Text>🚗</Text>
                  </View>
                  <View className={styles.vehicleInfo}>
                    <Text className={styles.vehicleBrand}>{vehicle.brand}</Text>
                    <Text className={styles.vehicleDetail}>司机：{vehicle.driver} · {vehicle.seats}座</Text>
                    <Text className={styles.vehiclePlate}>{vehicle.plate}</Text>
                  </View>
                  <View className={styles.deleteBtn} onClick={() => confirmDelete('vehicle', vehicle.id, vehicle.brand)}>
                    <Text className={styles.deleteIcon}>✕</Text>
                  </View>
                </View>
                <View className={styles.passengerSection}>
                  <View className={styles.passengerHeader}>
                    <Text className={styles.seatUsage}>
                      {(vehicle.passengers?.length || 0) + 1}/{vehicle.seats} 座
                    </Text>
                    <View className={styles.assignPassengerBtn} onClick={() => openPassengerModal(vehicle.id)}>
                      <Text className={styles.assignPassengerBtnText}>分配乘客</Text>
                    </View>
                  </View>
                  {vehicle.passengers && vehicle.passengers.length > 0 && (
                    <View className={styles.passengerTags}>
                      {vehicle.passengers.map(pid => {
                        const conflict = hasPassengerConflict(pid, vehicle.id);
                        return (
                          <View key={pid} className={styles.passengerTag}>
                            <Text className={styles.passengerTagText}>{getMemberName(pid)}</Text>
                            {conflict && (
                              <Text className={styles.statusWarn} style={{ marginLeft: 4 }}>⚠️</Text>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <SectionHeader title="费用预估" />
            <View className={styles.addBtn} onClick={() => openModal('cost')}>
              <Text className={styles.addBtnText}>+ 添加</Text>
            </View>
          </View>
          <View className={styles.costCard}>
            <View className={styles.costHeader}>
              <Text className={styles.costTotalLabel}>总预算</Text>
              <Text className={styles.costTotalAmount}>¥{totalEstimated}</Text>
            </View>
            <View className={styles.costList}>
              {state.estimatedCost.map((cost, idx) => (
                <View key={cost.id} className={styles.costItemWrapper}>
                  <View className={styles.costItem}>
                    <View className={styles.costItemLeft}>
                      <View
                        className={styles.costDot}
                        style={{ background: costColors[idx % costColors.length] }}
                      />
                      <Text className={styles.costName}>{cost.name}</Text>
                    </View>
                    <View className={styles.costItemRight}>
                      <Text className={styles.costAmount}>¥{cost.amount}</Text>
                      <View className={styles.costSplitBtn} onClick={() => openSplitModal(cost.id)}>
                        <Text className={styles.costSplitBtnText}>分摊</Text>
                      </View>
                      <View className={styles.deleteBtnSmall} onClick={() => confirmDelete('cost', cost.id, cost.name)}>
                        <Text className={styles.deleteIconSmall}>✕</Text>
                      </View>
                    </View>
                  </View>
                  {cost.splitMemberIds && cost.splitMemberIds.length > 0 && (
                    <View className={styles.costSplitInfo}>
                      <Text className={styles.costSplitPerPerson}>
                        每人 ¥{(cost.amount / cost.splitMemberIds.length).toFixed(2)}
                      </Text>
                      <View className={styles.splitMemberTags}>
                        {cost.splitMemberIds.map(mid => (
                          <View key={mid} className={styles.splitMemberTag}>
                            <Text className={styles.splitMemberTagText}>{getMemberName(mid)}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
            {hasAnySplit && (
              <View className={styles.splitOverview}>
                <Text className={styles.splitOverviewTitle}>分摊总览</Text>
                {state.members.map(member => (
                  <View key={member.id} className={styles.splitOverviewItem}>
                    <Text className={styles.splitOverviewName}>{member.name}</Text>
                    <Text className={styles.splitOverviewAmount}>
                      ¥{memberTotalShare[member.id]?.toFixed(2) || '0.00'}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionHeader}>
            <SectionHeader title="紧急联系人" />
            <View className={styles.addBtn} onClick={() => openModal('emergency')}>
              <Text className={styles.addBtnText}>+ 添加</Text>
            </View>
          </View>
          <View className={styles.emergencyList}>
            {state.emergencyContacts.map(contact => (
              <View key={contact.id} className={styles.emergencyItem}>
                <View className={styles.emergencyAvatar}>
                  <Text className={styles.emergencyAvatarText}>{getInitial(contact.name)}</Text>
                </View>
                <View className={styles.emergencyInfo}>
                  <View className={styles.emergencyNameRow}>
                    <Text className={styles.emergencyName}>{contact.name}</Text>
                    <View className={styles.relationTag}>
                      <Text>{contact.relation}</Text>
                    </View>
                  </View>
                  <Text className={styles.emergencyPhone}>{contact.phone}</Text>
                </View>
                <View className={styles.deleteBtn} onClick={() => confirmDelete('emergency', contact.id, contact.name)}>
                  <Text className={styles.deleteIcon}>✕</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {modalType && (
        <View className={styles.modalMask} onClick={() => setModalType('')}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            {modalType === 'member' && (
              <>
                <Text className={styles.modalTitle}>添加同行人员</Text>
                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>姓名</Text>
                  <Input className={styles.formInput} placeholder="请输入姓名" value={mName} onInput={e => setMName(e.detail.value)} />
                </View>
                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>电话</Text>
                  <Input className={styles.formInput} placeholder="请输入电话" value={mPhone} onInput={e => setMPhone(e.detail.value)} />
                </View>
                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>角色</Text>
                  <Input className={styles.formInput} placeholder="如：领队、厨师" value={mRole} onInput={e => setMRole(e.detail.value)} />
                </View>
              </>
            )}
            {modalType === 'vehicle' && (
              <>
                <Text className={styles.modalTitle}>添加车辆</Text>
                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>车型</Text>
                  <Input className={styles.formInput} placeholder="如：特斯拉 Model Y" value={vBrand} onInput={e => setVBrand(e.detail.value)} />
                </View>
                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>车牌</Text>
                  <Input className={styles.formInput} placeholder="如：浙A·12345" value={vPlate} onInput={e => setVPlate(e.detail.value)} />
                </View>
                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>司机</Text>
                  <Input className={styles.formInput} placeholder="请输入司机姓名" value={vDriver} onInput={e => setVDriver(e.detail.value)} />
                </View>
                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>座位数</Text>
                  <Input className={styles.formInput} type="number" placeholder="5" value={vSeats} onInput={e => setVSeats(e.detail.value)} />
                </View>
              </>
            )}
            {modalType === 'cost' && (
              <>
                <Text className={styles.modalTitle}>添加费用项</Text>
                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>费用名称</Text>
                  <Input className={styles.formInput} placeholder="如：油费/过路费" value={cName} onInput={e => setCName(e.detail.value)} />
                </View>
                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>金额</Text>
                  <Input className={styles.formInput} type="digit" placeholder="请输入金额" value={cAmount} onInput={e => setCAmount(e.detail.value)} />
                </View>
              </>
            )}
            {modalType === 'emergency' && (
              <>
                <Text className={styles.modalTitle}>添加紧急联系人</Text>
                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>姓名</Text>
                  <Input className={styles.formInput} placeholder="请输入姓名" value={eName} onInput={e => setEName(e.detail.value)} />
                </View>
                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>电话</Text>
                  <Input className={styles.formInput} placeholder="请输入电话" value={ePhone} onInput={e => setEPhone(e.detail.value)} />
                </View>
                <View className={styles.formGroup}>
                  <Text className={styles.formLabel}>关系</Text>
                  <Input className={styles.formInput} placeholder="如：父亲、母亲" value={eRelation} onInput={e => setERelation(e.detail.value)} />
                </View>
              </>
            )}
            {modalType === 'costSplit' && (
              <>
                <Text className={styles.modalTitle}>选择分摊人员</Text>
                <ScrollView scrollY className={styles.checkboxScroll}>
                  {state.members.map(member => {
                    const checked = splitSelectedIds.includes(member.id);
                    return (
                      <View
                        key={member.id}
                        className={`${styles.checkboxItem} ${checked ? styles.checkboxChecked : ''}`}
                        onClick={() => toggleSplitMember(member.id)}
                      >
                        <View className={styles.checkboxRow}>
                          <View className={`${styles.checkboxBox} ${checked ? styles.checkboxActive : ''}`}>
                            {checked && <Text className={styles.checkboxTick}>✓</Text>}
                          </View>
                          <Text className={styles.checkboxLabel}>{member.name}</Text>
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </>
            )}
            {modalType === 'vehiclePassenger' && (
              <>
                <Text className={styles.modalTitle}>分配乘客</Text>
                <View className={styles.modalInfoRow}>
                  <Text className={classnames(styles.modalInfoText, {
                    [styles.seatWarning]: remainingSeats === 0
                  })}>
                    剩余 {remainingSeats} 座
                  </Text>
                </View>
                <ScrollView scrollY className={styles.checkboxScroll}>
                  {getAvailablePassengers(passengerVehicleId).map(member => {
                    const checked = passengerSelectedIds.includes(member.id);
                    const conflictVehicle = hasPassengerConflict(member.id, passengerVehicleId);
                    return (
                      <View
                        key={member.id}
                        className={`${styles.checkboxItem} ${checked ? styles.checkboxChecked : ''}`}
                        onClick={() => togglePassengerMember(member.id)}
                      >
                        <View className={styles.checkboxRow}>
                          <View className={`${styles.checkboxBox} ${checked ? styles.checkboxActive : ''}`}>
                            {checked && <Text className={styles.checkboxTick}>✓</Text>}
                          </View>
                          <Text className={styles.checkboxLabel}>{member.name}</Text>
                          {conflictVehicle && (
                            <View className={styles.passengerConflictBadge}>
                              <Text>已在 {conflictVehicle.brand}</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
              </>
            )}
            <View className={styles.modalActions}>
              <View className={styles.cancelBtn} onClick={() => setModalType('')}>
                <Text className={styles.cancelBtnText}>取消</Text>
              </View>
              <View className={styles.confirmBtn} onClick={handleSave}>
                <Text className={styles.confirmBtnText}>保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CrewPage;
