import { defineStore } from 'pinia';
import { IPat } from '@/stores/type';
import globalGl from '@/config/global';

const userStore = defineStore('user', {
  persist: {
    key: '_user',
    paths: [
      'name',
      'sex',
      'idNo',
      'cellPhoneNum',
      'phoneNum',
      'patientId',
      'cacheUser',
      'patList',
      'patChoose',
      'clickPat',
    ],
  },

  state: () => {
    return {
      name: '',
      sex: '',
      idNo: '',
      cellPhoneNum: '',
      phoneNum: '', // 加密的手机号(微信才有)
      patientId: '',
      patList: <IPat[]>[],
      patChoose: <IPat>{},

      // 页面传递时候用
      clickPat: <IPat>{},

      cacheUser: {
        userName: '',
        mobile: '',
        certNo: '',
        certType: '',
        gender: '',
      },
    };
  },

  actions: {
    updateName(name: string) {
      this.name = name;
    },

    updateSex(sex: string) {
      this.sex = sex;
    },

    updateIdNo(id: string) {
      this.idNo = id;
    },

    updatePhone(data: { phone: string; phoneNum: string }) {
      this.cellPhoneNum = data.phone;
      this.phoneNum = data.phoneNum;
    },

    updateCacheUser(
      cache: Partial<{
        userName: string;
        mobile: string;
        certNo: string;
        certType: string;
        gender: string;
      }>
    ) {
      Object.entries(cache).map(([key, value]) => {
        if (value) {
          this.cacheUser[key] = value;
        }
      });
    },

    updatePatList(patList: IPat[]) {
      this.patList = patList;

      if (!Object.keys(this.patChoose).length) {
        const patDefault = patList.find((o) => o.defaultFlag === '1');
        if (patDefault) {
          this.updatePatChoose(patDefault);
        } else {
          if (patList.length) {
            this.updatePatChoose(patList[0]);
          }
        }
      }
    },

    updatePatChoose(pat: IPat) {
      this.patChoose = pat;
    },

    updatePatClick(pat: IPat) {
      this.clickPat = pat;
    },

    updatePatListDefault(data: { patientId: string; defaultFalg: boolean }) {
      const { patientId, defaultFalg } = data;
      const pat = <IPat>this.patList.find((o) => o.patientId === patientId);

      if (defaultFalg) {
        this.patList.map((o) => {
          o.defaultFlag = '0';
        });

        pat.defaultFlag = '1';
        this.updatePatChoose(pat);
      } else {
        if (this.clickPat.patientId === patientId) {
          this.patList.map((o) => {
            o.defaultFlag = '0';
          });

          const pat =
            this.patList[0].patientId === patientId
              ? this.patList[1]
              : this.patList[0];

          if (pat) {
            pat.defaultFlag = '1';
            this.updatePatChoose(pat);
          }
        }
      }
    },

    deletePat(patientId: string) {
      const oldPat = <IPat>this.patList.find((o) => o.patientId === patientId);

      this.patList.splice(
        this.patList.findIndex((o) => o.patientId === patientId),
        1
      );

      if (this.patList.length) {
        const pat = this.patList[0];
        // 切换默认人
        // if (oldPat.defaultFlag === '1') {
        // 	this.updatePatListDefault({
        // 		defaultFalg: true,
        // 		patientId: pat.patientId
        // 	});
        // }

        if (oldPat.patientId === this.patChoose.patientId) {
          this.updatePatChoose(pat);
        }
      } else {
        this.updatePatChoose(<IPat>{});
      }
    },

    clearStore() {
      this.$reset();
    },
  },

  getters: {
    double(): number {
      return this.name.length * 2;
    },

    getAvatar(): string {
      return getAvatar(this.sex);
    },
  },
});

export const getAvatar = function (sex) {
  let path = '';
  if (sex === '男') {
    path = '/static/image/img_tx_patient_male.png';
  } else if (sex === '女') {
    path = '/static/image/img_tx_patient_female.png';
  } else {
    path = '/static/image/img_tx_nor.png';
  }

  return path;
};

export const useUserStore = function () {
  return userStore();
};

export const getUserShowLabel = (pat: IPat) => {
  if (isAreaProgram()) {
    return pat.patientName;
  } else {
    return `${pat.patientName} ` + (pat._showId && `(${pat._showId})`) || '';
  }
};

// 是否区域项目 不显示id
export const isAreaProgram = (): boolean => {
  const sysCode = globalGl.SYS_CODE;

  if (sysCode === '1001049') {
    return true;
  }
  return globalGl.SYS_CODE.startsWith('2');
};
