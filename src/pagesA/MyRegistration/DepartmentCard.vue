<template>
  <view class="g-page">
    <view class="search-input">
      <uni-search-input
        v-model:value="searchValue"
        @change="searchList"
        placeholder="请输入科室名称"
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
        <List-Lv2
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
  import { computed, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { type ListItem, type TDeptItem } from './utils/DepartmentCard';
  import { joinQueryForUrl } from '@/common';
  import { debounce } from '@/utils';

  import api from '@/service/api';

  import ListLv2 from './components/DepartmentCard/listLv2.vue';

  const pageProp = ref({
    hosId: '',
  });
  const searchValue = ref('');
  const list = ref<ListItem[]>([]);
  const listLv2 = ref<TDeptItem[]>([]);
  const clickLv1 = ref('');
  const fieldLv1 = {
    label: 'deptName',
    value: 'id',
  };
  const isComplete = ref(false);
  const isCollapseListLv1 = ref(false);
  const isHideLv1 = ref(false);

  const getList = async () => {
    const { hosId } = pageProp.value;

    clearData();
    const { result } = await api
      .getDeptCardList({
        hosId,
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
  };

  const clearData = () => {
    isComplete.value = false;
    isHideLv1.value = false;
    list.value = [];
    listLv2.value = [];
  };

  const itemClick = ({ item }: { item: ListItem }) => {
    clickLv1.value = item[fieldLv1.value];
    listLv2.value = item.deptList || [];
  };

  const itemClickLv2 = (item: TDeptItem) => {
    const { id, deptName } = item;

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/DepartmentCardDetail', {
        id,
        deptName,
      }),
    });
  };

  let searchList = async () => {
    const searchContent = searchValue.value;
    clearData();
    isHideLv1.value = false;

    if (searchContent) {
      const { hosId } = pageProp.value;

      const requestArg = {
        searchContent,
        hosId,
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
      await getList();
    }
  };
  searchList = debounce(searchList, 600, false);

  const init = async () => {
    await getList();
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

      .content-lv2 {
        padding: 0 32rpx;
      }
    }
  }

  .search-input {
    margin: 16rpx 32rpx;
  }
</style>
