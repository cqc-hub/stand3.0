<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <view class="search-input">
      <uni-search-input
        v-model:value="searchValue"
        @change="searchList"
        placeholder="请输入医院/科室名称"
      /> 
    </view>

    <view class="g-container hidden-scrollbar" scroll-y>
      <view
        :class="{
          animate__slideInLeft: !isCollapseListLv1,
          animate__slideOutLeft: isCollapseListLv1,
          w0: isHideLv1,
        }"
        class="content-lv1 animate__animated"
      >
        <g-side-list
          :list="list"
          :field="fieldLv1"
          :value="clickLv1"
          @item-click="itemClick"
          defaultChoose
        />
      </view>
      <scroll-view class="flex1 content-lv2" scroll-y>
        <Hos-Lv2
          v-if="isComplete"
          :list="listLv2"
          @item-click="itemClickLv2"
        />

        <view v-if="isComplete && !listLv2.length" class="empty-list">
          <g-empty :current="4" text="未查询到相关科室" noTransformY />
        </view>
      </scroll-view>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { type THosItem, type hosListItem } from './utils/DepartmentCard';
  import { joinQueryForUrl } from '@/common';
  import { debounce, GStores } from '@/utils';
  import api from '@/service/api';

  import HosLv2 from './components/hosList/hosLv2.vue';
 
   // 该页面支持
  const pageProp = ref<{
    famousDoctorType: string;  // 名医汇过来的数据
  }>({
    famousDoctorType:''
  });
  const gStores = new GStores();
  const searchValue = ref('');
  const list = ref<hosListItem[]>([]);
  const listLv2 = ref<THosItem[]>([]);
  const clickLv1 = ref('');
  let fieldLv1 = ref({
    label: 'hosDeptName',
    value: 'hosDeptId',
  });
  const isComplete = ref(false);
  const isCollapseListLv1 = ref(false);
  const isHideLv1 = ref(false);

    const getHosList = async () => {

    clearData();
    const { result } = await api
      .getDeptByFamousDoctorType({
        famousDoctorType: pageProp.value.famousDoctorType,
      })
      .finally(() => {
        isComplete.value = true;

        setTimeout(() => {
          if (!list.value.length) {
            isHideLv1.value = true;
          }
        }, 80);
      });

    list.value = result || [];
      setTimeout(() => {
          if (!list.value.length) {
            isHideLv1.value = true;
          }
        }, 80); 
  };

  const clearData = () => {
    isComplete.value = false;
    isHideLv1.value = false;
    list.value = [];
    listLv2.value = [];
  };

  const itemClick = ({ item }: { item: hosListItem }) => {
    clickLv1.value = item[fieldLv1.value.value];
    listLv2.value = item.hosInfoList || [];
  };

  const itemClickLv2 = (item: THosItem) => {
    const { hosId } = item;
    const { famousDoctorType } = pageProp.value;

    uni.navigateTo({
      url: joinQueryForUrl('/pagesD/recommendDocList/famousDocList', {
        hosId,
        hosDeptId:clickLv1.value,
        famousDoctorType,
      }),
    });
  };

  const searchList = debounce(
    async () => {
      const searchContent = searchValue.value;
      clearData();
      isHideLv1.value = false;

      if (searchContent) {
        const { famousDoctorType } = pageProp.value;

        const requestArg = {
          searchContent,
          famousDoctorType,
        };
        isCollapseListLv1.value = true;

        const { result } = await api
          .getDeptCardListSearch(requestArg)
          .finally(() => {
            setTimeout(() => {
              isComplete.value = true;
            }, 300);
          });

        setTimeout(() => {
          isHideLv1.value = true;
          listLv2.value = result || [];
        }, 300);
      } else {
        isCollapseListLv1.value = false;
        await getHosList();
      }
    },
    600,
    false
  );

  const init = async () => {
      await getHosList();
  };

  onLoad((opt) => {
    pageProp.value = opt as any;

    init();
  });
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: #fff;

    .g-container {
      display: flex;
      .content-lv1 {
        width: 33%;
        height: 100%;
        position: relative;
        z-index: 3;
      }

      .w0 {
        width: 0;
      }
    }
  }

  .search-input {
    margin: 16rpx 32rpx;
  }
</style>
