import React, { ReactNode } from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface PageCardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}

const PageCard: React.FC<PageCardProps> = ({ title, action, children }) => {
  return (
    <View className={styles.pageCard}>
      {(title || action) && (
        <View className={styles.cardHeader}>
          {title && <Text className={styles.cardTitle}>{title}</Text>}
          {action && <View className={styles.cardAction}>{action}</View>}
        </View>
      )}
      <View className={styles.cardContent}>{children}</View>
    </View>
  );
};

export default PageCard;
