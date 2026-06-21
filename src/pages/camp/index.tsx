import React, { useState } from 'react';
import { View, Text, Textarea } from '@tarojs/components';
import { useCamping } from '@/store/CampingContext';
import { CampInfo } from '@/types/camping';
import classnames from 'classnames';
import styles from './index.module.scss';

interface InfoItem {
  key: keyof CampInfo;
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
  const { state, updateCampInfo } = useCamping();
  const [showEdit, setShowEdit] = useState(false);
  const [editKey, setEditKey] = useState<keyof CampInfo>('notes');
  const [editTitle, setEditTitle] = useState('');
  const [editValue, setEditValue] = useState('');

  const openEdit = (key: keyof CampInfo, title: string) => {
    setEditKey(key);
    setEditTitle(title);
    setEditValue(state.campInfo[key]);
    setShowEdit(true);
  };

  const handleSave = () => {
    updateCampInfo(editKey, editValue);
    setShowEdit(false);
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.campName}>{state.campInfo.name}</Text>
        <Text className={styles.campLabel}>点击卡片可编辑</Text>
      </View>

      <View className={styles.content}>
        <View className={styles.infoGrid}>
          {infoItems.map(item => (
            <View
              key={item.key}
              className={styles.infoCard}
              onClick={() => openEdit(item.key, item.title)}
            >
              <View className={classnames(styles.infoIcon, item.iconClass)}>
                <Text>{item.icon}</Text>
              </View>
              <View className={styles.infoTitleRow}>
                <Text className={styles.infoTitle}>{item.title}</Text>
                <Text className={styles.editHint}>编辑</Text>
              </View>
              <Text className={styles.infoDesc}>{state.campInfo[item.key]}</Text>
            </View>
          ))}
        </View>

        <View className={styles.notesCard} onClick={() => openEdit('notes', '营地备注')}>
          <View className={styles.notesTitleRow}>
            <Text className={styles.notesTitle}>
              <Text className={styles.notesIcon}>📝</Text>
              营地备注
            </Text>
            <Text className={styles.editHint}>编辑</Text>
          </View>
          <Text className={styles.notesContent}>{state.campInfo.notes}</Text>
        </View>
      </View>

      {showEdit && (
        <View className={styles.modalMask} onClick={() => setShowEdit(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>编辑{editTitle}</Text>
            <View className={styles.formGroup}>
              <Textarea
                className={styles.formTextarea}
                placeholder={`请输入${editTitle}信息`}
                value={editValue}
                onInput={e => setEditValue(e.detail.value)}
                maxlength={500}
              />
            </View>
            <View className={styles.modalActions}>
              <View className={styles.cancelBtn} onClick={() => setShowEdit(false)}>
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

export default CampPage;
