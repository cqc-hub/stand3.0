import globalGl from '@/config/global';

const { BASE_IMG } = globalGl;

export const MEDICAL_PHOTOS = <const>[
  // 患者
  {
    key: '1',
    url: BASE_IMG + 'medRecord_photos_6@2x.png',
    label: '身份证正面',
  },
  {
    key: '2',
    url: BASE_IMG + 'medRecord_photos_4@2x.png',
    label: '身份证反面',
  },
  {
    key: '3',
    url: BASE_IMG + 'medRecord_photos_9@2x.png',
    label: '手持身份证',
  },

  // 代理人
  {
    key: '4',
    url: BASE_IMG + 'medRecord_photos_8@2x.png',
    label: '身份证正面',
  },
  {
    key: '5',
    url: BASE_IMG + 'medRecord_photos_7@2x.png',
    label: '身份证反面',
  },
  {
    key: '6',
    url: BASE_IMG + 'medRecord_photos_10@2x.png',
    label: '手持身份证',
  },

  {
    key: '7',
    url: BASE_IMG + 'medRecord_photos_11@2x.png',
    label: '户口本',
  },
  {
    key: '8',
    url: BASE_IMG + 'medRecord_photos_13@2x.png',
    label: '出生医学证明',
  },
  {
    key: '9',
    url: BASE_IMG + 'medRecord_photos_14@2x.png',
    label: '直系亲属关系证明',
  },
  {
    key: '10',
    url: BASE_IMG + 'medRecord_photos_15@2x.png',
    label: '死亡证明',
  },
];
