import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import classnames from 'classnames';

interface TagBadgeProps {
  text: string;
  type?: 'primary' | 'secondary' | 'accent' | 'default';
}

const TagBadge: React.FC<TagBadgeProps> = ({ text, type = 'default' }) => {
  return (
    <View className={classnames(styles.tagBadge, styles[type])}>
      <Text>{text}</Text>
    </View>
  );
};

export default TagBadge;
