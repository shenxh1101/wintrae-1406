import React from 'react';
import { View, Text } from '@tarojs/components';
import { useCamping } from '@/store/CampingContext';
import classnames from 'classnames';
import styles from './index.module.scss';

interface InfoItem {
  key: keyof ReturnType<typeof useCamping>['state']['campInfo'];
  title: string;
  icon: string;
  iconClass: string;
}

const infoItems: InfoItem[] = [
  { key: 'waterSource', title: '水源', icon: '💧', iconClass: styles.iconWater },
  { key: 'toilet', title: '厕所', icon: '🚻', iconClass: styles.iconToilet },
  { key: 'parking', title: '停车', icon: '🅿️', iconClass: styles.iconParking },
  { key: 'signal', title: '信号', icon: '📶', iconClass: styles.iconSignal },
  { key: 'fireRule', title: '禁火规则', icon: '🔥', iconClass: styles.iconFire }
];

const CampPage: React.FC = () => {
  const { state } = useCamping();

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.campName}>{state.campInfo.name}</Text>
        <Text className={styles.campLabel}>营地信息一览</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.infoGrid}>
          {infoItems.map(item => (
            <View key={item.key} className={styles.infoCard}>
              <View className={classnames(styles.infoIcon, item.iconClass)}>
                <Text>{item.icon}</Text>
              </View>
              <Text className={styles.infoTitle}>{item.title}</Text>
              <Text className={styles.infoDesc}>{state.campInfo[item.key]}</Text>
            </View>
          ))}
        </View>

        <View className={styles.notesCard}>
          <Text className={styles.notesTitle}>
            <Text className={styles.notesIcon}>📝</Text>
            营地备注
          </Text>
          <Text className={styles.notesContent}>{state.campInfo.notes}</Text>
        </View>
      </View>
    </View>
  );
};

export default CampPage;
