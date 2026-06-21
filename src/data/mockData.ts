import { CampingState } from '@/types/camping';

export const initialState: CampingState = {
  tripName: '周末莫干山自驾露营',
  tripDays: [
    {
      id: 'd1',
      date: '2025-06-21（周六）',
      destinations: [
        { id: 'dest1', name: '公司停车场', address: '杭州市西湖区文三路', time: '08:00', type: 'meeting' },
        { id: 'dest2', name: '莫干山露营基地', address: '湖州市德清县莫干山镇', time: '10:30', type: 'destination' }
      ],
      checklist: [
        { id: 'c1', title: '检查车辆油量/电量', completed: true },
        { id: 'c2', title: '确认所有人员集合', completed: false },
        { id: 'c3', title: '购买途中饮用水和零食', completed: false }
      ]
    },
    {
      id: 'd2',
      date: '2025-06-22（周日）',
      destinations: [
        { id: 'dest3', name: '莫干山徒步路线', address: '莫干山景区', time: '09:00', type: 'destination' },
        { id: 'dest4', name: '杭州', address: '杭州市区', time: '16:00', type: 'return' }
      ],
      checklist: [
        { id: 'c4', title: '收拾营地垃圾', completed: false },
        { id: 'c5', title: '检查有无遗漏物品', completed: false }
      ]
    }
  ],
  gearList: [
    { id: 'g1', name: '双人帐篷', category: 'tent', quantity: 2, checked: true, claimedBy: '张三' },
    { id: 'g2', name: '防潮垫', category: 'tent', quantity: 4, checked: true, claimedBy: '李四' },
    { id: 'g3', name: '睡袋', category: 'tent', quantity: 4, checked: false },
    { id: 'g4', name: '天幕', category: 'tent', quantity: 1, checked: true, claimedBy: '张三' },
    { id: 'g5', name: '便携炉具', category: 'cooking', quantity: 2, checked: true, claimedBy: '王五' },
    { id: 'g6', name: '气罐', category: 'cooking', quantity: 4, checked: false },
    { id: 'g7', name: '锅具套装', category: 'cooking', quantity: 1, checked: true, claimedBy: '李四' },
    { id: 'g8', name: '餐具', category: 'cooking', quantity: 4, checked: true },
    { id: 'g9', name: '饮用水 5L', category: 'food', quantity: 3, checked: false },
    { id: 'g10', name: '火锅食材', category: 'food', quantity: 1, checked: false },
    { id: 'g11', name: '面包早餐', category: 'food', quantity: 2, checked: true, claimedBy: '王五' },
    { id: 'g12', name: '零食水果', category: 'food', quantity: 1, checked: false },
    { id: 'g13', name: '急救包', category: 'emergency', quantity: 1, checked: true, claimedBy: '张三' },
    { id: 'g14', name: '手电筒/头灯', category: 'emergency', quantity: 4, checked: true },
    { id: 'g15', name: '充电宝', category: 'emergency', quantity: 3, checked: false },
    { id: 'g16', name: '驱蚊液', category: 'emergency', quantity: 2, checked: true, claimedBy: '李四' }
  ],
  campInfo: {
    id: 'camp1',
    name: '莫干山星空露营基地',
    waterSource: '营地提供自来水，每天18:00-20:00供应热水',
    toilet: '公共卫生间，有抽水马桶和洗手台，卫生状况良好',
    parking: '营地门口有免费停车场，约30个车位，先到先得',
    signal: '移动信号良好，联通和电信信号较弱，建议下载离线地图',
    fireRule: '仅可在指定篝火区使用明火，禁止在帐篷附近吸烟',
    notes: '海拔约600米，夜间温度较低，建议带厚外套'
  },
  members: [
    { id: 'm1', name: '张三', phone: '13800138001', role: '领队' },
    { id: 'm2', name: '李四', phone: '13800138002', role: '副领队' },
    { id: 'm3', name: '王五', phone: '13800138003', role: '厨师' },
    { id: 'm4', name: '赵六', phone: '13800138004', role: '摄影师' }
  ],
  vehicles: [
    { id: 'v1', brand: '特斯拉 Model Y', plate: '浙A·12345', driver: '张三', seats: 5 },
    { id: 'v2', brand: '丰田 RAV4', plate: '浙A·67890', driver: '李四', seats: 5 }
  ],
  emergencyContacts: [
    { id: 'e1', name: '张爸', phone: '13900139001', relation: '父亲' },
    { id: 'e2', name: '李妈', phone: '13900139002', relation: '母亲' }
  ],
  estimatedCost: [
    { id: 'ec1', name: '油费/过路费', amount: 400 },
    { id: 'ec2', name: '营地费', amount: 300 },
    { id: 'ec3', name: '食材采购', amount: 500 },
    { id: 'ec4', name: '其他杂费', amount: 200 }
  ],
  review: {
    id: 'r1',
    tripName: '周末莫干山自驾露营',
    date: '2025-06-21',
    photos: [],
    actualCost: [],
    totalCost: 0,
    missedItems: [],
    notes: '',
    planSnapshot: {
      tripDays: [
        {
          id: 'd1',
          date: '2025-06-21（周六）',
          destinations: [
            { id: 'dest1', name: '公司停车场', address: '杭州市西湖区文三路', time: '08:00', type: 'meeting' },
            { id: 'dest2', name: '莫干山露营基地', address: '湖州市德清县莫干山镇', time: '10:30', type: 'destination' }
          ],
          checklist: [
            { id: 'c1', title: '检查车辆油量/电量', completed: true },
            { id: 'c2', title: '确认所有人员集合', completed: false },
            { id: 'c3', title: '购买途中饮用水和零食', completed: false }
          ]
        },
        {
          id: 'd2',
          date: '2025-06-22（周日）',
          destinations: [
            { id: 'dest3', name: '莫干山徒步路线', address: '莫干山景区', time: '09:00', type: 'destination' },
            { id: 'dest4', name: '杭州', address: '杭州市区', time: '16:00', type: 'return' }
          ],
          checklist: [
            { id: 'c4', title: '收拾营地垃圾', completed: false },
            { id: 'c5', title: '检查有无遗漏物品', completed: false }
          ]
        }
      ],
      gearList: [
        { id: 'g1', name: '双人帐篷', category: 'tent', quantity: 2, checked: true, claimedBy: '张三' },
        { id: 'g2', name: '防潮垫', category: 'tent', quantity: 4, checked: true, claimedBy: '李四' },
        { id: 'g3', name: '睡袋', category: 'tent', quantity: 4, checked: false },
        { id: 'g4', name: '天幕', category: 'tent', quantity: 1, checked: true, claimedBy: '张三' },
        { id: 'g5', name: '便携炉具', category: 'cooking', quantity: 2, checked: true, claimedBy: '王五' },
        { id: 'g6', name: '气罐', category: 'cooking', quantity: 4, checked: false },
        { id: 'g7', name: '锅具套装', category: 'cooking', quantity: 1, checked: true, claimedBy: '李四' },
        { id: 'g8', name: '餐具', category: 'cooking', quantity: 4, checked: true },
        { id: 'g9', name: '饮用水 5L', category: 'food', quantity: 3, checked: false },
        { id: 'g10', name: '火锅食材', category: 'food', quantity: 1, checked: false },
        { id: 'g11', name: '面包早餐', category: 'food', quantity: 2, checked: true, claimedBy: '王五' },
        { id: 'g12', name: '零食水果', category: 'food', quantity: 1, checked: false },
        { id: 'g13', name: '急救包', category: 'emergency', quantity: 1, checked: true, claimedBy: '张三' },
        { id: 'g14', name: '手电筒/头灯', category: 'emergency', quantity: 4, checked: true },
        { id: 'g15', name: '充电宝', category: 'emergency', quantity: 3, checked: false },
        { id: 'g16', name: '驱蚊液', category: 'emergency', quantity: 2, checked: true, claimedBy: '李四' }
      ],
      campInfo: {
        id: 'camp1',
        name: '莫干山星空露营基地',
        waterSource: '营地提供自来水，每天18:00-20:00供应热水',
        toilet: '公共卫生间，有抽水马桶和洗手台，卫生状况良好',
        parking: '营地门口有免费停车场，约30个车位，先到先得',
        signal: '移动信号良好，联通和电信信号较弱，建议下载离线地图',
        fireRule: '仅可在指定篝火区使用明火，禁止在帐篷附近吸烟',
        notes: '海拔约600米，夜间温度较低，建议带厚外套'
      },
      members: [
        { id: 'm1', name: '张三', phone: '13800138001', role: '领队' },
        { id: 'm2', name: '李四', phone: '13800138002', role: '副领队' },
        { id: 'm3', name: '王五', phone: '13800138003', role: '厨师' },
        { id: 'm4', name: '赵六', phone: '13800138004', role: '摄影师' }
      ],
      vehicles: [
        { id: 'v1', brand: '特斯拉 Model Y', plate: '浙A·12345', driver: '张三', seats: 5 },
        { id: 'v2', brand: '丰田 RAV4', plate: '浙A·67890', driver: '李四', seats: 5 }
      ],
      emergencyContacts: [
        { id: 'e1', name: '张爸', phone: '13900139001', relation: '父亲' },
        { id: 'e2', name: '李妈', phone: '13900139002', relation: '母亲' }
      ],
      estimatedCost: [
        { id: 'ec1', name: '油费/过路费', amount: 400 },
        { id: 'ec2', name: '营地费', amount: 300 },
        { id: 'ec3', name: '食材采购', amount: 500 },
        { id: 'ec4', name: '其他杂费', amount: 200 }
      ]
    }
  },
  pastTrips: [
    {
      id: 'past1',
      tripName: '千岛湖环湖露营',
      date: '2025-05-17',
      photos: [
        { id: 'p1', url: 'https://picsum.photos/id/1018/750/500' },
        { id: 'p2', url: 'https://picsum.photos/id/1015/750/500' },
        { id: 'p3', url: 'https://picsum.photos/id/1036/750/500' }
      ],
      actualCost: [
        { id: 'ac1', name: '油费/过路费', amount: 380 },
        { id: 'ac2', name: '营地费', amount: 240 },
        { id: 'ac3', name: '食材采购', amount: 460 },
        { id: 'ac4', name: '景区门票', amount: 320 }
      ],
      totalCost: 1400,
      missedItems: ['防晒霜', '额外的充电宝'],
      notes: '天气很好，湖边日落非常美。下次记得带折叠椅，坐地上不太舒服。',
      planSnapshot: {
        tripDays: [
          {
            id: 'pd1',
            date: '2025-05-17（周六）',
            destinations: [
              { id: 'pd1_1', name: '武林广场', address: '杭州市下城区', time: '07:30', type: 'meeting' },
              { id: 'pd1_2', name: '千岛湖营地', address: '淳安县千岛湖镇', time: '10:00', type: 'destination' }
            ],
            checklist: [
              { id: 'pc1', title: '检查车辆', completed: true },
              { id: 'pc2', title: '集合确认', completed: true }
            ]
          },
          {
            id: 'pd2',
            date: '2025-05-18（周日）',
            destinations: [
              { id: 'pd2_1', name: '千岛湖环湖骑行', address: '千岛湖绿道', time: '09:00', type: 'destination' },
              { id: 'pd2_2', name: '杭州', address: '杭州市区', time: '17:00', type: 'return' }
            ],
            checklist: [
              { id: 'pc3', title: '收拾营地', completed: true },
              { id: 'pc4', title: '检查遗漏物品', completed: false }
            ]
          }
        ],
        gearList: [
          { id: 'pg1', name: '双人帐篷', category: 'tent', quantity: 2, checked: true },
          { id: 'pg2', name: '防潮垫', category: 'tent', quantity: 4, checked: true },
          { id: 'pg3', name: '便携炉具', category: 'cooking', quantity: 1, checked: true },
          { id: 'pg4', name: '饮用水 5L', category: 'food', quantity: 2, checked: true },
          { id: 'pg5', name: '急救包', category: 'emergency', quantity: 1, checked: true }
        ],
        campInfo: {
          id: 'pcamp1',
          name: '千岛湖畔营地',
          waterSource: '营地内有自来水',
          toilet: '公共卫生间',
          parking: '免费停车',
          signal: '信号良好',
          fireRule: '禁止明火',
          notes: '湖边风大，注意防风'
        },
        members: [
          { id: 'pm1', name: '张三', phone: '13800138001', role: '领队' },
          { id: 'pm2', name: '李四', phone: '13800138002', role: '副领队' }
        ],
        vehicles: [
          { id: 'pv1', brand: '特斯拉 Model Y', plate: '浙A·12345', driver: '张三', seats: 5 }
        ],
        emergencyContacts: [
          { id: 'pe1', name: '张爸', phone: '13900139001', relation: '父亲' }
        ],
        estimatedCost: [
          { id: 'pec1', name: '油费/过路费', amount: 380 },
          { id: 'pec2', name: '营地费', amount: 240 },
          { id: 'pec3', name: '食材采购', amount: 460 }
        ]
      }
    },
    {
      id: 'past2',
      tripName: '径山古道露营',
      date: '2025-04-12',
      photos: [
        { id: 'p4', url: 'https://picsum.photos/id/1039/750/500' },
        { id: 'p5', url: 'https://picsum.photos/id/1044/750/500' }
      ],
      actualCost: [
        { id: 'ac5', name: '油费/过路费', amount: 200 },
        { id: 'ac6', name: '营地费', amount: 0 },
        { id: 'ac7', name: '食材采购', amount: 380 }
      ],
      totalCost: 580,
      missedItems: ['防蚊液', '保温毯'],
      notes: '野营地，没有厕所和水源，下次要选设施齐全的营地。',
      planSnapshot: {
        tripDays: [
          {
            id: 'qd1',
            date: '2025-04-12（周六）',
            destinations: [
              { id: 'qd1_1', name: '良渚文化村', address: '杭州市余杭区', time: '08:00', type: 'meeting' },
              { id: 'qd1_2', name: '径山古道营地', address: '余杭区径山镇', time: '09:30', type: 'destination' }
            ],
            checklist: [
              { id: 'qc1', title: '集合确认', completed: true },
              { id: 'qc2', title: '路线导航下载', completed: true }
            ]
          },
          {
            id: 'qd2',
            date: '2025-04-13（周日）',
            destinations: [
              { id: 'qd2_1', name: '径山寺', address: '径山寺景区', time: '09:00', type: 'destination' },
              { id: 'qd2_2', name: '良渚文化村', address: '杭州市余杭区', time: '14:00', type: 'return' }
            ],
            checklist: [
              { id: 'qc3', title: '收拾营地', completed: true }
            ]
          }
        ],
        gearList: [
          { id: 'qg1', name: '双人帐篷', category: 'tent', quantity: 1, checked: true },
          { id: 'qg2', name: '便携炉具', category: 'cooking', quantity: 1, checked: true },
          { id: 'qg3', name: '饮用水 3L', category: 'food', quantity: 2, checked: true },
          { id: 'qg4', name: '急救包', category: 'emergency', quantity: 1, checked: true }
        ],
        campInfo: {
          id: 'qcamp1',
          name: '径山古道野营地',
          waterSource: '无，需自带',
          toilet: '无',
          parking: '路边停车',
          signal: '信号较弱',
          fireRule: '严格禁止明火',
          notes: '野营地，设施不全'
        },
        members: [
          { id: 'qm1', name: '张三', phone: '13800138001', role: '领队' }
        ],
        vehicles: [
          { id: 'qv1', brand: '特斯拉 Model Y', plate: '浙A·12345', driver: '张三', seats: 5 }
        ],
        emergencyContacts: [],
        estimatedCost: [
          { id: 'qec1', name: '油费', amount: 200 },
          { id: 'qec2', name: '食材', amount: 380 }
        ]
      }
    }
  ]
};
