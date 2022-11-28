<template>
  <view class="g-page">
    <view class="search-header">
      <view class="search-input">
        <uni-search-input
          v-model:value="r.searchText.value"
          placeholder="请输入医生/科室/症状"
          @confirm="confirmInput"
          @change="changeInput"
        >
          <template #suffixRight>
            <view
              v-if="r.searchText.value"
              class="suffix-right f28"
              @click="cancelInput"
            >
              取消
            </view>
          </template>
        </uni-search-input>
      </view>

      <view
        v-if="r.searchText.value && r.isComplete.value"
        class="g-border-bottom animate__fadeIn"
      >
        <g-tabs
          v-model:value="r.tabCurrent.value"
          :tabs="r.tabField"
          :scroll="false"
          @change="tabChange"
          field="label"
          style="width: 100%"
        />
      </view>
    </view>

    <block v-if="r.searchText.value && r.isComplete.value">
      <swiper
        :current="r.tabCurrent.value"
        :duration="300"
        @change="({ detail: { current } }) => tabChange(current)"
        class="g-container animate__animated animate__fadeIn"
      >
        <swiper-item v-for="item in r.tabField" :key="item.key">
          <scroll-view scroll-y class="swiper-item uni-bg-red">
            <view class="container">
              <block v-if="item.key === 0">
                <Doc-List
                  :list="r.docInfoResultList.value"
                  @item-click="goDocDetail"
                />
              </block>

              <block v-if="item.key === 1">
                <Doc-List
                  :list="r.symptomResultList.value"
                  @item-click="goDocDetail"
                />
              </block>

              <block v-if="item.key === 2">
                <Search-Dept-List
                  :list="r.deptResultList.value"
                  :hosId="r.pageProp.value.hosId"
                  @item-click="goDeptList"
                />
              </block>
            </view>

            <view class="safe-height" />
          </scroll-view>
        </swiper-item>
      </swiper>
    </block>

    <view v-else class="g-container his-bg animate__animated animate__fadeIn">
      <view class="container">
        <block v-if="r.searchHistory.value.length">
          <view class="flex-normal-between mt40 his-row">
            <view class="f32 g-bold">搜索历史</view>

            <view
              @click="isDelHisShow = true"
              class="iconfont f40 color-666 del-icon"
            >
              &#xe6cf;
            </view>
          </view>

          <Search-His-List
            :list="r.searchHistory.value"
            @item-click="sechHistoryAgin"
          />
        </block>

        <block v-if="r.hotSearchList.value.length">
          <view class="flex-normal-between mt40 his-row">
            <view class="f32 g-bold">热门搜索</view>
          </view>

          <Search-His-List
            :list="r.hotSearchList.value"
            @item-click="sechHistoryAgin"
          />
        </block>
      </view>
    </view>

    <g-message />
    <xy-dialog
      title=""
      content="是否删除记录?"
      :show="isDelHisShow"
      @cancelButton="isDelHisShow = false"
      @confirmButton="delHistory"
    />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { deQueryForUrl } from '@/common';
  import {
    UseRegSearch,
    clearSearchHistory,
    type IRegSearchHistoryItem,
  } from './utils/RegSearch';

  import { onLoad } from '@dcloudio/uni-app';

  import DocList from './components/RegSearch/docList.vue';
  import SearchDeptList from './components/RegSearch/searchDeptList.vue';
  import SearchHisList from './components/RegSearch/searchHisList.vue';

  const r = new UseRegSearch();
  const isDelHisShow = ref(false);

  const confirmInput = (str) => {
    r.confirmSearch(str);
  };

  const changeInput = (str) => {
    r.searchTextChange(str);
  };

  const tabChange = (idx) => {
    r.tabChange(idx);
  };

  const cancelInput = () => {
    const pages = getCurrentPages();

    if (pages.length > 1) {
      uni.navigateBack();
    } else {
      r.searchText.value = '';
      r.searchTextChange('');
    }
  };

  const delHistory = () => {
    isDelHisShow.value = false;

    clearSearchHistory();
    r.resetResList();
  };

  const goDocDetail = (e) => {
    r.goDocDetail(e);
  };

  const goDeptList = (e) => {
    r.goDeptList(e);
  };

  const sechHistoryAgin = (item: IRegSearchHistoryItem) => {
    const { label } = item;
    confirmInput(label);
  };

  onLoad((opt) => {
    r.init(deQueryForUrl(opt));
  });
</script>

<style lang="scss" scoped>
  .search-input {
    margin: 16rpx 32rpx;
  }

  .search-header {
    background-color: #fff;
  }

  .suffix-right {
    padding-right: 20rpx;
  }

  .swiper-item {
    height: 100%;
    // padding: 0 32rpx;
  }

  .his-bg {
    background-color: #fff;

    .his-row {
      padding: 32rpx 0;
      align-items: center;
    }
  }

  .container {
    padding: 0 32rpx;
  }

  .del-icon {
    padding-left: 32rpx;
  }
</style>
