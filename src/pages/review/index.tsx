import React, { useMemo } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useCamping } from '@/store/CampingContext';
import styles from './index.module.scss';

const ReviewPage: React.FC = () => {
  const { state, copyFromPastTrip } = useCamping();

  const stats = useMemo(() => {
    const totalTrips = state.pastTrips.length;
    const totalCost = state.pastTrips.reduce((sum, t) => sum + t.totalCost, 0);
    const latestDate = state.pastTrips.length > 0 ? state.pastTrips[0].date : '-';
    return { totalTrips, totalCost, latestDate };
  }, [state.pastTrips]);

  const handleCopy = (tripId: string, tripName: string) => {
    copyFromPastTrip(tripId);
    Taro.showToast({
      title: `已复制「${tripName}」`,
      icon: 'success',
      duration: 2000
    });
  };

  return (
    <View className={styles.page}>
      <View className={styles.summaryCard}>
        <Text className={styles.summaryTitle}>露营总览</Text>
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

      <ScrollView scrollY className={styles.content}>
        {state.pastTrips.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🏕️</Text>
            <Text className={styles.emptyText}>还没有露营记录，出发去露营吧！</Text>
          </View>
        ) : (
          state.pastTrips.map(trip => (
            <View key={trip.id} className={styles.tripCard}>
              <View className={styles.tripHeader}>
                <Text className={styles.tripTitle}>{trip.tripName}</Text>
                <Text className={styles.tripDate}>{trip.date}</Text>
              </View>

              {trip.photos.length > 0 && (
                <View className={styles.photoSection}>
                  <Text className={styles.photoLabel}>
                    <Text className={styles.photoIcon}>📷</Text>
                    精彩瞬间 ({trip.photos.length})
                  </Text>
                  <ScrollView scrollX className={styles.photoScroll}>
                    {trip.photos.map(photo => (
                      <View key={photo.id} className={styles.photoItem}>
                        <Image
                          className={styles.photoImg}
                          src={photo.url}
                          mode="aspectFill"
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}

              {trip.actualCost.length > 0 && (
                <View className={styles.costSection}>
                  {trip.actualCost.map((cost, idx) => (
                    <View key={cost.id}>
                      <View className={styles.costRow}>
                        <Text className={styles.costItemName}>{cost.name}</Text>
                        <Text className={styles.costItemAmount}>¥{cost.amount}</Text>
                      </View>
                      {idx < trip.actualCost.length - 1 && (
                        <View className={styles.costDivider} />
                      )}
                    </View>
                  ))}
                  <View className={styles.costDivider} />
                  <View className={styles.costTotalRow}>
                    <Text className={styles.costTotalLabel}>总花费</Text>
                    <Text className={styles.costTotalAmount}>¥{trip.totalCost}</Text>
                  </View>
                </View>
              )}

              {trip.missedItems.length > 0 && (
                <View className={styles.missedSection}>
                  <Text className={styles.missedLabel}>
                    <Text className={styles.missedIcon}>⚠️</Text>
                    遗漏物品（下次记得带）
                  </Text>
                  <View className={styles.missedTags}>
                    {trip.missedItems.map((item, idx) => (
                      <View key={idx} className={styles.missedTag}>
                        <Text>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {trip.notes && (
                <View className={styles.notesSection}>
                  <Text className={styles.notesLabel}>
                    <Text className={styles.notesIcon}>📝</Text>
                    心得记录
                  </Text>
                  <Text className={styles.notesText}>{trip.notes}</Text>
                </View>
              )}

              <View
                className={styles.copyButton}
                onClick={() => handleCopy(trip.id, trip.tripName)}
              >
                <Text>📋 复制为新计划</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default ReviewPage;
