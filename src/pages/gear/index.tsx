import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import { useCamping } from '@/store/CampingContext';
import { GearCategory } from '@/types/camping';
import classnames from 'classnames';
import styles from './index.module.scss';

const categoryMap: Record<GearCategory, { label: string; key: GearCategory }> = {
  tent: { label: '帐篷', key: 'tent' },
  cooking: { label: '炊具', key: 'cooking' },
  food: { label: '食材', key: 'food' },
  emergency: { label: '应急', key: 'emergency' }
};

const categories: GearCategory[] = ['tent', 'cooking', 'food', 'emergency'];

const GearPage: React.FC = () => {
  const { state, toggleGear } = useCamping();
  const [activeTab, setActiveTab] = useState<GearCategory>('tent');

  const totalProgress = useMemo(() => {
    const total = state.gearList.length;
    const checked = state.gearList.filter(g => g.checked).length;
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  }, [state.gearList]);

  const categoryProgress = useMemo(() => {
    const result: Record<GearCategory, number> = { tent: 0, cooking: 0, food: 0, emergency: 0 };
    categories.forEach(cat => {
      const items = state.gearList.filter(g => g.category === cat);
      const checked = items.filter(g => g.checked).length;
      result[cat] = items.length > 0 ? Math.round((checked / items.length) * 100) : 0;
    });
    return result;
  }, [state.gearList]);

  const filteredGear = useMemo(() => {
    return state.gearList.filter(g => g.category === activeTab);
  }, [state.gearList, activeTab]);

  const getInitial = (name: string) => {
    return name ? name.slice(-1) : '?';
  };

  return (
    <View className={styles.page}>
      <View className={styles.progressCard}>
        <View className={styles.progressHeader}>
          <Text className={styles.progressTitle}>物资准备进度</Text>
          <Text className={styles.progressPercent}>{totalProgress}%</Text>
        </View>
        <View className={styles.categoryProgress}>
          {categories.map(cat => (
            <View key={cat} className={styles.catProgressItem}>
              <Text className={styles.catProgressLabel}>{categoryMap[cat].label}</Text>
              <View className={styles.catProgressBar}>
                <View
                  className={styles.catProgressFill}
                  style={{ width: `${categoryProgress[cat]}%` }}
                />
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className={styles.tabs}>
        {categories.map(cat => (
          <View
            key={cat}
            className={classnames(styles.tabItem, activeTab === cat && styles.tabActive)}
            onClick={() => setActiveTab(cat)}
          >
            <Text>{categoryMap[cat].label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.gearList}>
        {filteredGear.length === 0 ? (
          <View className={styles.emptyState}>暂无物资</View>
        ) : (
          filteredGear.map(gear => (
            <View
              key={gear.id}
              className={styles.gearItem}
              onClick={() => toggleGear(gear.id)}
            >
              <View className={classnames(
                styles.checkbox,
                gear.checked && styles.checkboxChecked
              )} />
              <View className={styles.gearInfo}>
                <Text className={classnames(
                  styles.gearName,
                  gear.checked && styles.gearNameChecked
                )}>
                  {gear.name}
                </Text>
                <Text className={styles.gearQty}>数量：{gear.quantity}</Text>
              </View>
              {gear.claimedBy ? (
                <View className={styles.claimTag}>
                  <View className={styles.claimAvatar}>
                    <Text>{getInitial(gear.claimedBy)}</Text>
                  </View>
                  <Text className={styles.claimName}>{gear.claimedBy}</Text>
                </View>
              ) : (
                <View className={styles.claimEmpty}>认领</View>
              )}
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default GearPage;
