import React, { useState, useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
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

type ViewMode = 'category' | 'person' | 'unclaimed';

const viewModeLabels: Record<ViewMode, string> = {
  category: '分类',
  person: '人员',
  unclaimed: '未认领'
};

const GearPage: React.FC = () => {
  const { state, toggleGear, claimGear, unclaimGear } = useCamping();
  const [activeTab, setActiveTab] = useState<GearCategory>('tent');
  const [viewMode, setViewMode] = useState<ViewMode>('category');

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

  const unclaimedGear = useMemo(() => {
    return state.gearList.filter(g => !g.claimedBy);
  }, [state.gearList]);

  const unclaimedCount = unclaimedGear.length;

  const personGroups = useMemo(() => {
    const groups: { name: string; items: typeof state.gearList }[] = [];
    const claimedNames = new Set<string>();
    state.gearList.forEach(g => {
      if (g.claimedBy) {
        claimedNames.add(g.claimedBy);
      }
    });
    claimedNames.forEach(name => {
      const items = state.gearList.filter(g => g.claimedBy === name);
      groups.push({ name, items });
    });
    const unclaimedItems = state.gearList.filter(g => !g.claimedBy);
    if (unclaimedItems.length > 0) {
      groups.push({ name: '未认领', items: unclaimedItems });
    }
    return groups;
  }, [state.gearList]);

  const getInitial = (name: string) => {
    return name ? name.slice(0, 1) : '?';
  };

  const handleClaim = (gearId: string, _currentClaim: string | undefined) => {
    const memberNames = state.members.map(m => m.name);
    if (memberNames.length === 0) {
      Taro.showToast({ title: '请先在同行页添加人员', icon: 'none' });
      return;
    }
    const options = [...memberNames, '取消认领'];
    Taro.showActionSheet({
      itemList: options,
      success: (res) => {
        const idx = res.tapIndex;
        if (idx === options.length - 1) {
          unclaimGear(gearId);
        } else {
          claimGear(gearId, memberNames[idx]);
        }
      },
      fail: (err) => {
        console.error('[GearPage] ActionSheet error:', err);
      }
    });
  };

  const renderGearItem = (gear: typeof state.gearList[0]) => (
    <View key={gear.id} className={styles.gearItem}>
      <View
        className={classnames(
          styles.checkbox,
          gear.checked && styles.checkboxChecked
        )}
        onClick={() => toggleGear(gear.id)}
      />
      <View className={styles.gearInfo}>
        <Text className={classnames(
          styles.gearName,
          gear.checked && styles.gearNameChecked
        )}>
          {gear.name}
        </Text>
        <Text className={styles.gearQty}>数量：{gear.quantity}</Text>
      </View>
      <View
        className={classnames(
          styles.claimArea,
          gear.claimedBy && styles.claimAreaActive
        )}
        onClick={() => handleClaim(gear.id, gear.claimedBy)}
      >
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
    </View>
  );

  const renderCategoryView = () => (
    <>
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
          filteredGear.map(renderGearItem)
        )}
      </View>
    </>
  );

  const renderPersonView = () => (
    <View className={styles.gearList}>
      {personGroups.length === 0 ? (
        <View className={styles.emptyState}>暂无物资</View>
      ) : (
        personGroups.map(group => {
          const checkedCount = group.items.filter(g => g.checked).length;
          const totalCount = group.items.length;
          const isUnclaimed = group.name === '未认领';
          return (
            <View key={group.name} className={styles.personSection}>
              <View className={styles.personHeader}>
                <Text className={classnames(
                  styles.personHeader,
                  isUnclaimed && styles.personHeaderUnclaimed
                )}>
                  {group.name}
                </Text>
                <Text className={styles.statsLine}>
                  已准备 {checkedCount}/{totalCount} 项
                </Text>
              </View>
              <View className={styles.personGearList}>
                {group.items.map(gear => (
                  <View
                    key={gear.id}
                    className={classnames(
                      styles.personGearItem,
                      gear.checked ? styles.personGearChecked : styles.personGearUnchecked
                    )}
                  >
                    <View
                      className={classnames(
                        styles.checkbox,
                        gear.checked && styles.checkboxChecked
                      )}
                      onClick={() => toggleGear(gear.id)}
                    />
                    <View className={styles.gearInfo}>
                      <Text className={classnames(
                        styles.gearName,
                        gear.checked && styles.gearNameChecked
                      )}>
                        {gear.name}
                      </Text>
                      <Text className={styles.gearQty}>
                        数量：{gear.quantity}
                        {!isUnclaimed && (
                          <Text className={styles.gearCategoryTag}>
                            {' · '}{categoryMap[gear.category].label}
                          </Text>
                        )}
                      </Text>
                    </View>
                    <View
                      className={classnames(
                        styles.claimArea,
                        gear.claimedBy && styles.claimAreaActive
                      )}
                      onClick={() => handleClaim(gear.id, gear.claimedBy)}
                    >
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
                  </View>
                ))}
              </View>
            </View>
          );
        })
      )}
    </View>
  );

  const renderUnclaimedView = () => (
    <View className={styles.gearList}>
      {unclaimedGear.length === 0 ? (
        <View className={styles.emptyState}>所有物资已认领 🎉</View>
      ) : (
        unclaimedGear.map(renderGearItem)
      )}
    </View>
  );

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

      <View className={styles.viewModeToggle}>
        {(Object.keys(viewModeLabels) as ViewMode[]).map(mode => (
          <View
            key={mode}
            className={classnames(
              styles.viewModeBtn,
              viewMode === mode && styles.viewModeBtnActive
            )}
            onClick={() => setViewMode(mode)}
          >
            <Text>{viewModeLabels[mode]}</Text>
            {mode === 'unclaimed' && unclaimedCount > 0 && (
              <Text className={styles.unclaimedBadge}>{unclaimedCount}</Text>
            )}
          </View>
        ))}
      </View>

      {viewMode === 'category' && renderCategoryView()}
      {viewMode === 'person' && renderPersonView()}
      {viewMode === 'unclaimed' && renderUnclaimedView()}
    </View>
  );
};

export default GearPage;
