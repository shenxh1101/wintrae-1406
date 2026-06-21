import React, { useState, useMemo } from 'react';
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

const getTodayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const TripPage: React.FC = () => {
  const { state, toggleChecklist, addDestination, addChecklistItem, markDestArrived } = useCamping();
  const [showModal, setShowModal] = useState(false);
  const [activeDayId, setActiveDayId] = useState('');
  const [formName, setFormName] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formType, setFormType] = useState<Destination['type']>('destination');
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  const [checklistDayId, setChecklistDayId] = useState('');
  const [checklistTitle, setChecklistTitle] = useState('');
  const [execMode, setExecMode] = useState(false);
  const [showAllChecklist, setShowAllChecklist] = useState(false);

  const todayStr = getTodayStr();

  const execDay = useMemo(() => {
    if (!execMode) return null;
    const todayMatch = state.tripDays.find(d => d.date.startsWith(todayStr));
    return todayMatch || state.tripDays[0] || null;
  }, [execMode, state.tripDays, todayStr]);

  const execDayIdx = useMemo(() => {
    if (!execDay) return 0;
    const idx = state.tripDays.findIndex(d => d.id === execDay.id);
    return idx >= 0 ? idx : 0;
  }, [execDay, state.tripDays]);

  const nextUnarrivedId = useMemo(() => {
    if (!execDay) return null;
    const next = execDay.destinations.find(d => !d.arrived);
    return next ? next.id : null;
  }, [execDay]);

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

  const handleArrive = (dayId: string, destId: string) => {
    markDestArrived(dayId, destId);
  };

  const renderTimelineItem = (dayId: string, dest: Destination, isExec: boolean) => {
    const typeInfo = getDestTypeLabel(dest.type);
    const isMeeting = dest.type === 'meeting';
    const isReturn = dest.type === 'return';
    const isNext = isExec && dest.id === nextUnarrivedId;
    const isArrived = isExec && !!dest.arrived;

    return (
      <View
        key={dest.id}
        className={classnames(
          styles.timelineItem,
          isExec && isNext && styles.execHighlight,
          isExec && isArrived && styles.execArrived
        )}
      >
        {isNext ? (
          <View className={classnames(styles.timelineDot, styles.pulseDot)} />
        ) : isArrived ? (
          <View className={classnames(styles.timelineDot, styles.arrivedCheck)} />
        ) : (
          <View className={classnames(
            styles.timelineDot,
            isMeeting && styles.timelineDotMeeting,
            isReturn && styles.timelineDotReturn
          )} />
        )}
        <Text className={styles.timelineTime}>{dest.time}</Text>
        <Text className={styles.timelineName}>{dest.name}</Text>
        <Text className={styles.timelineAddr}>{dest.address}</Text>
        <View className={styles.timelineTag}>
          <TagBadge text={typeInfo.text} type={typeInfo.tag} />
        </View>
        {isExec && !dest.arrived && (
          <View className={styles.arriveBtn} onClick={() => handleArrive(dayId, dest.id)}>
            <Text className={styles.arriveBtnText}>到达</Text>
          </View>
        )}
      </View>
    );
  };

  const renderDayCard = (day: typeof state.tripDays[0], dayIdx: number, isExec: boolean) => (
    <View key={day.id} className={classnames(styles.dayCard, isExec && styles.execDayCard)}>
      <View className={styles.dayHeader}>
        <Text className={styles.dayDate}>{day.date}</Text>
        <Text className={styles.dayBadge}>第 {dayIdx + 1} 天</Text>
      </View>

      <View className={styles.timeline}>
        {day.destinations.map(dest => renderTimelineItem(day.id, dest, isExec))}
      </View>

      {!isExec && (
        <View className={styles.addButtons}>
          <View className={styles.addBtnSmall} onClick={() => openAddDest(day.id)}>
            <Text className={styles.addBtnText}>+ 添加路线点</Text>
          </View>
        </View>
      )}

      <View className={styles.checklistSection}>
        <View className={styles.checklistHeaderRow}>
          <Text className={styles.checklistTitle}>
            路线检查清单 ({day.checklist.filter(c => c.completed).length}/{day.checklist.length})
          </Text>
          {isExec && (
            <View
              className={styles.checklistFilter}
              onClick={() => setShowAllChecklist(v => !v)}
            >
              <Text className={styles.checklistFilterText}>
                {showAllChecklist ? '仅未完成' : '显示全部'}
              </Text>
            </View>
          )}
        </View>
        {(isExec && !showAllChecklist ? day.checklist.filter(c => !c.completed) : day.checklist).map(item => (
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
        {!isExec && (
          <View className={styles.addChecklistBtn} onClick={() => openAddChecklist(day.id)}>
            <Text className={styles.addChecklistText}>+ 添加检查项</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>{state.tripName}</Text>
        <View className={styles.headerRow}>
          <Text className={styles.headerSubtitle}>共 {state.tripDays.length} 天行程</Text>
          <View
            className={classnames(styles.modeToggle, execMode && styles.modeToggleActive)}
            onClick={() => setExecMode(v => !v)}
          >
            <Text className={classnames(styles.modeToggleText, execMode && styles.modeToggleTextActive)}>
              执行模式
            </Text>
          </View>
        </View>
      </View>

      <ScrollView scrollY className={styles.content}>
        {execMode && execDay ? (
          renderDayCard(execDay, execDayIdx, true)
        ) : (
          state.tripDays.map((day, dayIdx) => renderDayCard(day, dayIdx, false))
        )}
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
