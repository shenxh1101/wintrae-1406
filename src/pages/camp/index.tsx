import React, { useState } from 'react';
import { View, Text, Textarea, Input } from '@tarojs/components';
import { useCamping } from '@/store/CampingContext';
import { CampInfo } from '@/types/camping';
import { genId } from '@/utils/id';
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

const fireSafeOptions = ['适合', '不建议', '禁止'] as const;

const CampPage: React.FC = () => {
  const { state, updateCampInfo, addWeatherRecord } = useCamping();
  const [showEdit, setShowEdit] = useState(false);
  const [editKey, setEditKey] = useState<keyof CampInfo>('notes');
  const [editTitle, setEditTitle] = useState('');
  const [editValue, setEditValue] = useState('');

  const [showWeatherModal, setShowWeatherModal] = useState(false);
  const [wind, setWind] = useState('');
  const [rain, setRain] = useState('');
  const [nightTemp, setNightTemp] = useState('');
  const [fireSafe, setFireSafe] = useState('');

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

  const handleWeatherSave = () => {
    if (!wind || !rain || !nightTemp || !fireSafe) return;
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    addWeatherRecord({ id: genId(), wind, rain, nightTemp, fireSafe, timestamp });
    setWind('');
    setRain('');
    setNightTemp('');
    setFireSafe('');
    setShowWeatherModal(false);
  };

  const latestWeather = state.weatherRecords.length > 0
    ? state.weatherRecords[state.weatherRecords.length - 1]
    : null;

  const getBadgeClass = (value: string) => {
    if (value === '适合') return styles.badgeGreen;
    if (value === '不建议') return styles.badgeYellow;
    if (value === '禁止') return styles.badgeRed;
    return '';
  };

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.campName}>{state.campInfo.name}</Text>
        <Text className={styles.campLabel}>点击卡片可编辑</Text>

        {latestWeather ? (
          <View className={styles.weatherCard}>
            <View className={styles.weatherGrid}>
              <View className={styles.weatherItem}>
                <Text className={styles.weatherLabel}>🌬️ 风力</Text>
                <Text className={styles.weatherValue}>{latestWeather.wind}</Text>
              </View>
              <View className={styles.weatherItem}>
                <Text className={styles.weatherLabel}>🌧️ 降雨</Text>
                <Text className={styles.weatherValue}>{latestWeather.rain}</Text>
              </View>
              <View className={styles.weatherItem}>
                <Text className={styles.weatherLabel}>🌡️ 夜间温度</Text>
                <Text className={styles.weatherValue}>{latestWeather.nightTemp}</Text>
              </View>
              <View className={styles.weatherItem}>
                <Text className={styles.weatherLabel}>🔥 明火安全</Text>
                <Text className={classnames(styles.weatherRiskBadge, getBadgeClass(latestWeather.fireSafe))}>
                  {latestWeather.fireSafe}
                </Text>
              </View>
            </View>
            <Text className={styles.weatherTimestamp}>{latestWeather.timestamp}</Text>
          </View>
        ) : (
          <View className={styles.weatherCard}>
            <Text className={styles.weatherEmpty}>暂无天气记录</Text>
          </View>
        )}

        <View className={styles.addWeatherBtn} onClick={() => setShowWeatherModal(true)}>
          <Text className={styles.addWeatherBtnText}>+ 记录天气</Text>
        </View>
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

      {showWeatherModal && (
        <View className={styles.modalMask} onClick={() => setShowWeatherModal(false)}>
          <View className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <Text className={styles.modalTitle}>记录天气</Text>
            <View className={styles.formGroup}>
              <Input
                className={styles.formInput}
                placeholder="如：微风2级/大风5级"
                value={wind}
                onInput={e => setWind(e.detail.value)}
              />
            </View>
            <View className={styles.formGroup}>
              <Input
                className={styles.formInput}
                placeholder="如：无降雨/小雨"
                value={rain}
                onInput={e => setRain(e.detail.value)}
              />
            </View>
            <View className={styles.formGroup}>
              <Input
                className={styles.formInput}
                placeholder="如：12°C"
                value={nightTemp}
                onInput={e => setNightTemp(e.detail.value)}
              />
            </View>
            <View className={styles.formGroup}>
              <Text className={styles.formLabel}>是否适合明火</Text>
              <View className={styles.fireSafeSelector}>
                {fireSafeOptions.map(option => (
                  <View
                    key={option}
                    className={classnames(
                      styles.fireSafeOption,
                      fireSafe === option ? styles.fireSafeOptionActive : ''
                    )}
                    onClick={() => setFireSafe(option)}
                  >
                    <Text>{option}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View className={styles.modalActions}>
              <View className={styles.cancelBtn} onClick={() => setShowWeatherModal(false)}>
                <Text className={styles.cancelBtnText}>取消</Text>
              </View>
              <View className={styles.confirmBtn} onClick={handleWeatherSave}>
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
