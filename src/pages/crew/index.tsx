import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import { useCamping } from '@/store/CampingContext';
import SectionHeader from '@/components/SectionHeader';
import styles from './index.module.scss';

const costColors = ['#2D6A4F', '#E76F51', '#E9C46A', '#264653', '#40916C'];

const CrewPage: React.FC = () => {
  const { state } = useCamping();

  const totalEstimated = useMemo(() => {
    return state.estimatedCost.reduce((sum, c) => sum + c.amount, 0);
  }, [state.estimatedCost]);

  const getInitial = (name: string) => {
    return name ? name.slice(0, 1) : '?';
  };

  return (
    <View className={styles.page}>
      <View className={styles.content}>
        <View className={styles.section}>
          <SectionHeader title={`同行人员 (${state.members.length})`} />
          <View className={styles.memberList}>
            {state.members.map(member => (
              <View key={member.id} className={styles.memberItem}>
                <View className={styles.avatar}>
                  <Text className={styles.avatarText}>{getInitial(member.name)}</Text>
                </View>
                <View className={styles.memberInfo}>
                  <View className={styles.memberNameRow}>
                    <Text className={styles.memberName}>{member.name}</Text>
                    <View className={styles.roleTag}>
                      <Text>{member.role}</Text>
                    </View>
                  </View>
                  <Text className={styles.memberPhone}>{member.phone}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <SectionHeader title={`出行车辆 (${state.vehicles.length})`} />
          <View className={styles.vehicleList}>
            {state.vehicles.map(vehicle => (
              <View key={vehicle.id} className={styles.vehicleItem}>
                <View className={styles.vehicleIcon}>
                  <Text>🚗</Text>
                </View>
                <View className={styles.vehicleInfo}>
                  <Text className={styles.vehicleBrand}>{vehicle.brand}</Text>
                  <Text className={styles.vehicleDetail}>司机：{vehicle.driver} · {vehicle.seats}座</Text>
                  <Text className={styles.vehiclePlate}>{vehicle.plate}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles.section}>
          <SectionHeader title="费用预估" />
          <View className={styles.costCard}>
            <View className={styles.costHeader}>
              <Text className={styles.costTotalLabel}>总预算</Text>
              <Text className={styles.costTotalAmount}>¥{totalEstimated}</Text>
            </View>
            <View className={styles.costList}>
              {state.estimatedCost.map((cost, idx) => (
                <View key={cost.id} className={styles.costItem}>
                  <View className={styles.costItemLeft}>
                    <View
                      className={styles.costDot}
                      style={{ background: costColors[idx % costColors.length] }}
                    />
                    <Text className={styles.costName}>{cost.name}</Text>
                  </View>
                  <Text className={styles.costAmount}>¥{cost.amount}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View className={styles.section}>
          <SectionHeader title="紧急联系人" />
          <View className={styles.emergencyList}>
            {state.emergencyContacts.map(contact => (
              <View key={contact.id} className={styles.emergencyItem}>
                <View className={styles.emergencyAvatar}>
                  <Text className={styles.emergencyAvatarText}>{getInitial(contact.name)}</Text>
                </View>
                <View className={styles.emergencyInfo}>
                  <View className={styles.emergencyNameRow}>
                    <Text className={styles.emergencyName}>{contact.name}</Text>
                    <View className={styles.relationTag}>
                      <Text>{contact.relation}</Text>
                    </View>
                  </View>
                  <Text className={styles.emergencyPhone}>{contact.phone}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default CrewPage;
