import { nextTick, ref } from 'vue';
import { GStores, CDebounce } from '@/utils';
import { setLocalStorage, getLocalStorage, joinQuery } from '@/common';
import { type IRegSearchHistoryItem, ServerStaticData } from '@/utils';

import api from '@/service/api';

export { type IRegSearchHistoryItem } from '@/utils';
interface IPageProp {
  hosId: string;
  clinicalType: string;
}
export interface IDocResItem {
  academicAchievements: string;
  docName: string;
  docPhoto: string;
  docTitleName: string;
  goodAt: string;
  hosDeptId: string;
  hosDocId: string;
  intro: string;
  hosId: string;

  schQukCategor: string;
  specialClinicName: string;
  docJobName: string;
  deptName: string;
}

export interface IDeptItem {
  deptName: string;
  hosDeptId: string;
  hosId: string;
  hosName: string;
}

const KEY_REG_SEARCH_HISTORY = 'orgsearchhistory';

const setSearchHistory = (str: string) => {
  const oldHistory: IRegSearchHistoryItem[] =
    getLocalStorage(KEY_REG_SEARCH_HISTORY) || [];

  const idx = oldHistory.findIndex((o) => o.label === str);
  if (idx !== -1 && idx) {
    const oldValue = oldHistory[idx];
    oldHistory.splice(idx, 1);
    oldHistory.unshift(oldValue);
  } else if (idx !== 0) {
    oldHistory.unshift({
      label: str,
    });
  }

  if (oldHistory.length > 6) {
    oldHistory.length = 6;
  }

  setLocalStorage({
    [KEY_REG_SEARCH_HISTORY]: oldHistory,
  });
};

export const clearSearchHistory = () => {
  setLocalStorage({
    [KEY_REG_SEARCH_HISTORY]: [],
  });
};

export class UseRegSearch extends GStores {
  pageProp = ref(<IPageProp>{});
  searchText = ref('');
  isComplete = ref(false);
  tabCurrent = ref(0);
  tabField = [
    {
      label: '医生',
      key: 0,
    },
    {
      label: '症状',
      key: 1,
    },
    {
      label: '科室',
      key: 2,
    },
  ];
  searchHistory = ref(<IRegSearchHistoryItem[]>[]);
  // hotSearchList = ref(<IRegSearchHistoryItem[]>[{ label: '哮喘', hot: '1' }]);
  hotSearchList = ref(<IRegSearchHistoryItem[]>[]);

  deptResultList = ref(<IDeptItem[]>[]);
  docInfoResultList = ref<IDocResItem[]>([]);
  symptomResultList = ref<IDocResItem[]>([]);

  confirmSearch(str: string) {
    this.searchText.value = str;
    this.searchList(str);
  }

  @CDebounce(500)
  searchTextChange(str: string) {
    if (str.trim() === '') {
      this.resetResList();

      nextTick(() => {
        this.searchText.value = '';
      });
    }
  }

  goDocDetail(item: IDocResItem) {
    const {
      // deptName,
      docName,
      hosDocId,
      hosDeptId,
      docTitleName,
      hosId
    } = item;

    // const { hosId } = this.pageProp.value;

    const args = {
      // deptName,
      docName,
      hosDocId,
      // hosId,
      docTitleName,
      hosDeptId,
    };

    uni.navigateTo({
      url: joinQuery('/pagesA/MyRegistration/DoctorDetails', args),
    });
  }

  goDeptList(item: IDeptItem) {
    const { clinicalType } = this.pageProp.value;
    const { hosDeptId, deptName, hosId } = item;

    const args = {
      deptName,
      hosId,
      hosDeptId,
      clinicalType,
    };

    uni.navigateTo({
      url: joinQuery('/pagesA/MyRegistration/order', args),
    });
  }

  async searchList(searchContent: string) {
    const { clinicalType, hosId } = this.pageProp.value;
    const { source } = this.globalStore.browser;

    const args = {
      searchContent,
      hosId,
      clinicalType,
      source,
    };

    setSearchHistory(searchContent);

    this.resetResList();

    const { result } = await api.searchDocAndDeptByWords(args).finally(() => {
      this.isComplete.value = true;
    });

    const { deptResultList, docInfoResultList, symptomResultList } = result;

    this.deptResultList.value = deptResultList;
    this.docInfoResultList.value = docInfoResultList;
    this.symptomResultList.value = symptomResultList;

    if (docInfoResultList.length) {
      this.tabCurrent.value = 0;
    } else if (symptomResultList.length) {
      this.tabCurrent.value = 1;
    } else if (deptResultList.length) {
      this.tabCurrent.value = 2;
    }
  }

  tabChange(idx: number) {
    this.tabCurrent.value = idx;
  }

  resetResList() {
    this.isComplete.value = false;
    this.tabCurrent.value = 0;
    this.deptResultList.value = [];
    this.docInfoResultList.value = [];
    this.symptomResultList.value = [];
    this.searchHistory.value = getLocalStorage(KEY_REG_SEARCH_HISTORY) || [];
  }

  async getConfig() {
    const { hosRegHistory } = await ServerStaticData.getSystemConfig('order');

    if (hosRegHistory && hosRegHistory.length) {
      this.hotSearchList.value = hosRegHistory;
    }
  }

  async init(opt: IPageProp) {
    this.pageProp.value = opt;

    await this.getConfig();
    this.resetResList();
  }
}
