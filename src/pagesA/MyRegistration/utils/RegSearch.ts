import { nextTick, ref } from 'vue';
import { debounce, GStores } from '@/utils';
import api from '@/service/api';

interface IPageProp {
  hosId: string;
  clinicalType: string;
}

// export const useRegSearch = () => {
//   const whole = {
//     searchText: ref(''),
//     pageProp: ref(<IPageProp>{}),
//   };

//   return whole;
// };

interface IDocResItem {
  academicAchievements: string;
  docName: string;
  docPhoto: string;
  docTitleName: string;
  goodAt: string;
  hosDeptId: string;
  hosDocId: string;
  intro: string;
}

export class UseRegSearch extends GStores {
  pageProp = ref(<IPageProp>{});
  searchText = ref('');
  isComplete = ref(false);

  deptResultList = ref([]);
  docInfoResultList = ref([]);
  symptomResultList = ref<IDocResItem[]>([]);

  confirmSearch = debounce((str) => {
    console.log({
      str,
    });

    this.searchList(str);
  }, 1000);

  searchTextChange(str: string) {
    if (str.trim() === '') {
      this.resetResList();

      nextTick(() => {
        this.searchText.value = '';
      });
    }
  }

  async searchList(searchContent: string) {
    const { hosId, clinicalType } = this.pageProp.value;
    const { source } = this.globalStore.browser;

    const args = {
      searchContent,
      hosId,
      clinicalType,
      source,
    };

    this.isComplete.value = false;
    this.resetResList();

    const { result } = await api.searchDocAndDeptByWords(args).finally(() => {
      this.isComplete.value = true;
    });

    const { deptResultList, docInfoResultList, symptomResultList } = result;

    this.deptResultList.value = deptResultList;
    this.docInfoResultList.value = docInfoResultList;
    this.symptomResultList.value = symptomResultList;
  }

  resetResList() {
    this.deptResultList.value = [];
    this.docInfoResultList.value = [];
    this.symptomResultList.value = [];
  }

  init(opt: IPageProp) {
    this.pageProp.value = opt;
  }
}
