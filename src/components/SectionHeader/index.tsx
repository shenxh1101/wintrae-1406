import React, { ReactNode } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface SectionHeaderProps {
  title: string;
  extra?: ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, extra }) => {
  return (
    <View className={styles.sectionHeader}>
      <View className={styles.indicator}></View>
      <Text className={styles.title}>{title}</Text>
      {extra && <Text className={styles.extra}>{extra}</Text>}
    </View>
  );
};

export default SectionHeader;
