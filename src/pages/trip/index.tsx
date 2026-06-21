import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { useCamping } from '@/store/CampingContext';
import TagBadge from '@/components/TagBadge';
import classnames from 'classnames';
import styles from './index.module.scss';

const getDestTypeLabel = (type: string) => {
  const map: Record<string, { text: string; tag: 'primary' | 'accent' | 'secondary' }> = {
    destination: { text: '目的地', tag: 'primary' },
    meeting: { text: '集合点', tag: 'accent' },
    return: { text: '返程', tag: 'secondary' }
  };
  return map[type] || { text: '地点', tag: 'default' };
};

const TripPage: React.FC = () => {
  const { state, toggleChecklist } = useCamping();

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>{state.tripName}</Text>
        <Text className={styles.headerSubtitle}>共 {state.tripDays.length} 天行程</Text>
      </View>

      <ScrollView scrollY className={styles.content}>
        {state.tripDays.map((day, dayIdx) => (
          <View key={day.id} className={styles.dayCard}>
            <View className={styles.dayHeader}>
              <Text className={styles.dayDate}>{day.date}</Text>
              <Text className={styles.dayBadge}>第 {dayIdx + 1} 天</Text>
            </View>

            <View className={styles.timeline}>
              {day.destinations.map(dest => {
                const typeInfo = getDestTypeLabel(dest.type);
                const isMeeting = dest.type === 'meeting';
                const isReturn = dest.type === 'return';
                return (
                  <View key={dest.id} className={styles.timelineItem}>
                    <View className={classnames(
                      styles.timelineDot,
                      isMeeting && styles.timelineDotMeeting,
                      isReturn && styles.timelineDotReturn
                    )} />
                    <Text className={styles.timelineTime}>{dest.time}</Text>
                    <Text className={styles.timelineName}>{dest.name}</Text>
                    <Text className={styles.timelineAddr}>{dest.address}</Text>
                    <View className={styles.timelineTag}>
                      <TagBadge text={typeInfo.text} type={typeInfo.tag} />
                    </View>
                  </View>
                );
              })}
            </View>

            <View className={styles.checklistSection}>
              <Text className={styles.checklistTitle}>
                路线检查清单 ({day.checklist.filter(c => c.completed).length}/{day.checklist.length})
              </Text>
              {day.checklist.map(item => (
                <View
                  key={item.id}
                  className={styles.checklistItem}
                  onClick={() => toggleChecklist(day.id, item.id)}
                >
                  <View className={classnames(
                    styles.checkbox,
                    item.completed && styles.checkboxChecked
                  )} />
                  <Text className={classnames(
                    styles.checklistText,
                    item.completed && styles.checklistTextDone
                  )}>
                    {item.title}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default TripPage;
