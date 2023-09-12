import globalGl from '@/config/global';

const { BASE_IMG } = globalGl;

export const MEDICAL_PHOTOS = <const>[
  // 患者
  {
    value: '1',
    url: `${BASE_IMG}medRecord_photos_6@2x.png`,
    label: '身份证正面',
  },
  {
    value: '2',
    url: `${BASE_IMG}medRecord_photos_4@2x.png`,
    label: '身份证反面',
  },
  {
    value: '3',
    url: `${BASE_IMG}medRecord_photos_9@2x.png`,
    label: '手持身份证',
  },

  // 代理人
  {
    value: '4',
    url: `${BASE_IMG}medRecord_photos_8@2x.png`,
    label: '身份证正面',
  },
  {
    value: '5',
    url: `${BASE_IMG}medRecord_photos_7@2x.png`,
    label: '身份证反面',
  },
  {
    value: '6',
    url: `${BASE_IMG}medRecord_photos_10@2x.png`,
    label: '手持身份证',
  },

  {
    value: '7',
    url: `${BASE_IMG}medRecord_photos_11@2x.png`,
    label: '户口本',
  },
  {
    value: '8',
    url: `${BASE_IMG}medRecord_photos_13@2x.png`,
    label: '出生医学证明',
  },
  {
    value: '9',
    url: `${BASE_IMG}medRecord_photos_14@2x.png`,
    label: '直系亲属关系证明',
  },
  {
    value: '10',
    url: `${BASE_IMG}medRecord_photos_15@2x.png`,
    label: '死亡证明',
  },

  {
    value: '11',
    url: `${BASE_IMG}medRecord_photos_16@2x.png`,
    label: '其他证明材料',
  },
];

export const MEDICAL_PHOTO_MODE = <const>{
  // 本人办理，
  1: {
    photos: ['1', '2', '3'],
    label: '本人办理',
  },
  // 代成年人办理
  2: {
    photos: ['1', '2', '4', '5', '6'],
    label: '代成年人办理',
  },
  // 代未成年人办理
  3: {
    photos: ['4', '5', '6', '7'],
    label: '代未成年人办理',
  },
  // 代死亡人员办理
  4: {
    photos: ['4', '5', '6', '8', '9', '10'],
    label: '代死亡人员办理',
  },
};
