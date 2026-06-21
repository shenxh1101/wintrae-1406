import React, { useState } from 'react';
import { View, Text, Input, ScrollView } from '@tarojs/components';
import { useCamping } from '@/store/CampingContext';
import { Destination } from '@/types/camping';
import { genId } from '@/utils/id';
import TagBadge from '@/components/TagBadge';
import classnames from 'classnames';
import styles from './index.module.scss';

const destTypes: { value: Destination['type']; label: string }[] = [
  { value: 'meeting', label: '集合点' },
  { value: 'destination', label: '目的地' },
  { value: 'return', label: '返程' }
];

const getDestTypeLabel = (type: string) => {
  const map: Record<string, { text: string; tag: 'primary' | 'accent' | 'secondary' }> = {
    destination: { text: '目的地', tag: 'primary' },
    meeting: { text: '集合点', tag: 'accent' },
    return: { text: '返程', tag: 'secondary' }
  };
  return map[type] || { text: '地点', tag: 'default' as const };
};

const TripPage: React.FC = () => {
  const { state, toggleChecklist, addDestination, addChecklistItem } = useCamping();
  const [showModal, setShowModal] = useState(false);
  const [activeDayId, setActiveDayId] = useState('');
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formType, setFormType] = useState<Destination['type']>('destination');
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  const [checklistDayId, setChecklistDayId] = useState('');
  const [checklistTitle, setChecklistTitle] = useState('');

  const openAddDest = (dayId: string) => {
    setActiveDayId(dayId);
    setFormName('');
    setFormAddress('');
    setFormTime('');
    setFormType('destination');
    setShowModal(true);
  };

  const handleSaveDest = () => {
    if (!formName.trim() || !formTime.trim()) return;
    addDestination(activeDayId, {
      id: genId(),
      name: formName.trim(),
      address: formAddress.trim(),
      time: formTime.trim(),
      type: formType
    });
    setShowModal(false);
  };

  const openAddChecklist = (dayId: string) => {
    setChecklistDayId(dayId);
    setChecklistTitle('');
    setShowChecklistForm(true);
  };

  const handleSaveChecklist = () => {
    if (!checklistTitle.trim()) return;
    addChecklistItem(checklistDayId, {
      id: genId(),
      title: checklistTitle.trim(),
      completed: false
    });
    setShowChecklistForm(false);
  };

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

            <View className={styles.addButtons}>
              <View className={styles.addBtnSmall} onClick={() => openAddDest(day.id)}>
                <Text className={styles.addBtnText}>+ 添加路线点</Text>
              </View>
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
              <View className={styles.addChecklistBtn} onClick={() => openAddChecklist(day.id)}>
                <Text className={styles.addChecklistText}>+ 添加检查项</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {showModal && (
        <View className={styles.modalMask} onClick={() => setShowModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>添加路线点</Text>

            <View className={styles.typeSelector}>
              {destTypes.map(t => (
                <View
                  key={t.value}
                  className={classnames(styles.typeOption, formType === t.value && styles.typeOptionActive)}
                  onClick={() => setFormType(t.value)}
                >
                  <Text className={classnames(styles.typeOptionText, formType === t.value && styles.typeOptionTextActive)}>{t.label}</Text>
                </View>
              ))}
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>名称</Text>
              <Input
                className={styles.formInput}
                placeholder="如：莫干山露营基地"
                value={formName}
                onInput={e => setFormName(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>地址</Text>
              <Input
                className={styles.formInput}
                placeholder="如：湖州市德清县莫干山镇"
                value={formAddress}
                onInput={e => setFormAddress(e.detail.value)}
              />
            </View>

            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>时间</Text>
              <Input
                className={styles.formInput}
                placeholder="如：10:30"
                value={formTime}
                onInput={e => setFormTime(e.detail.value)}
              />
            </View>

            <View className={styles.modalActions}>
              <View className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                <Text className={styles.cancelBtnText}>取消</Text>
              </View>
              <View className={styles.confirmBtn} onClick={handleSaveDest}>
                <Text className={styles.confirmBtnText}>保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {showChecklistForm && (
        <View className={styles.modalMask} onClick={() => setShowChecklistForm(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>添加检查项</Text>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>检查内容</Text>
              <Input
                className={styles.formInput}
                placeholder="如：检查车辆油量"
                value={checklistTitle}
                onInput={e => setChecklistTitle(e.detail.value)}
              />
            </View>
            <View className={styles.modalActions}>
              <View className={styles.cancelBtn} onClick={() => setShowChecklistForm(false)}>
                <Text className={styles.cancelBtnText}>取消</Text>
              </View>
              <View className={styles.confirmBtn} onClick={handleSaveChecklist}>
                <Text className={styles.confirmBtnText}>保存</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default TripPage;
