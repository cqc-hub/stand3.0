// import { defineStore } from 'pinia';
// import { IPat } from '@/stores/type';
// import { nameList } from '@/components/g-form';
// import globalGl from '@/config/global';
// import { GStores, ServerStaticData } from '@/utils';
// const hosStore = defineStore('hospital', {
//   persist: {
//     key: 'hospital',
//   },

//   state: () => {
//     return {
//       patientTab: <nameList[]>[],
//       inPatientPrePay: [],
//       isHosTotallist: '',
//       isHosDaylist: '',
//       isQueryPreRecord: '',
//     };
//   },

//   actions: {
//     getSystemHospitalEvent() {
//       const result = ServerStaticData.getSystemConfig('hospitalCare');
//       console.log(result, 'resultStrore');
//     },
//   },

//   getters: {},
// });

// export const useHosStore = function () {
//   return hosStore();
// };
