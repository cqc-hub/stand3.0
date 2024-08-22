<template>
  <view class="article-container">
    <view class="search-box flex-normal fade-in">
      <view v-if="isShowTopTab" v-show="!isSearch" class="search-tabs">
        <g-tabs
          v-if="compConfig.listTopTab?.length"
          :scroll="false"
          field="label"
          style="width: 100%"
          v-model:value="tabCurrentTop"
          :tabs="compConfig.listTopTab"
          :line-scale="0.5"
          @change="tabTopChange"
          blod
        />
      </view>
      <view class="flex1" v-if="hasInit">
        <uni-search-input
          v-model:value="searchValue"
          @change="goSearch"
          placeholder="请输入资讯内容搜索"
        />
      </view>
    </view>
    <view class="tab-box fade-in" v-show="!isSearch">
      <g-tabs
        v-if="tabs && tabs.length"
        v-model:value="tabCurrent"
        :tabs="tabs"
        :height="(isShowTopTab && '55rpx') || '88rpx'"
        :lineColor="isShowTopTab && '#fff'"
         :fontSize="
            isShowTopTab ? 'var(--hr-font-size-s)' : 'var(--hr-font-size-base)'
          "
        @change="tabChange"
        field="typeName"
        blod
      />
    </view>
    <swiper
      :current="tabCurrent"
      @change="(e) => tabChange(e.detail.current)"
      class="container"
      :style="{ height: (isSearch ? 0 : swiperHeight) + 'px' }"
    >
      <swiper-item v-for="(tab, i) in tabs" :key="i">
        <scroll-view :style="{ height: (isSearch ? 0 : swiperHeight) + 'px' }">
          <view
            class="container-scroll fade-in"
            :id="`Advisory-Item${tabCurrentTop}${tab.typeId}`"
            v-show="!isSearch"
          >
            <Advisory-Item
              v-for="(item, index) in pageList[tab.typeId]"
              :item="item"
              :isVideoTab="isVideoTab"
              @item-click="itemClick"
              class="fade-in"
            />
            <view class="f28 ">
              <view
                v-if="showMore"
                @click="readMore(tab.typeId)"
                class="read-more"
              >
                查看更多
              </view>
              <view v-else class="read-more">没有更多了</view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
    <view v-show="isSearch" class="container">
      <view class="container-scroll fade-in" :id="`Advisory-search-Item`">
        <Advisory-Item
          v-for="(item, index) in searchList"
          :item="item"
          :isVideoTab="isVideoTab"
          @item-click="itemClick"
          class="fade-in"
        />
        <view class="f28">
          <view v-if="showMore" @click="readMore('search')" class="read-more">
            点击查看更多
          </view>
          <view v-else class="read-more">没有更多了</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script setup lang="ts">
  import api from '@/service/api';
  import { onMounted, ref, nextTick, computed, getCurrentInstance } from 'vue';
  import { GStores, wait, useTBanner } from '@/utils';
  import { ITab, ICms } from './types';
  import GTabs from '@/components/g-tabs/g-tabs.vue';
  import AdvisoryItem from './components/advisoryItem.vue';

  const inst = getCurrentInstance();
  const tabCurrentMap = new Map<number, number>();

  const hasInit = ref(false);
  const pageList = ref<Record<string, ICms[]>>({});
  const searchList = ref<ICms[]>([]);
  const loading = ref(false);
  const searchValue = ref('');
  const tabCurrentTop = ref(0);
  const tabCurrent = ref(0);
  const tabs = ref<ITab[]>([]);
  const swiperHeight = ref(0);
  const isSearch = ref(false);
  const showMore = ref(false);
  const _typeId = ref('');
  const compConfig = ref(
    <
      {
        listTopTab: IOptions<'' | '1'>[]; // '' 咨询  '1' 视频
      }
    >{}
  );

  const isShowTopTab = computed(() => {
    return !!(
      compConfig.value.listTopTab && compConfig.value.listTopTab.length
    );
  });
  const getTopTabValue = computed(() => {
    return (
      compConfig.value.listTopTab &&
      compConfig.value.listTopTab[tabCurrentTop.value]?.value
    );
  });
  const isVideoTab = computed(() => {
    return getTopTabValue.value === '1';
  });

  const init = async () => {
    if (hasInit.value) {
      return;
    } else {
      hasInit.value = true;
    }
    const {
      result: { HEALTH_COUNSEL },
    } = await api.getParamsMoreBySysCode({
      paramCode: 'HEALTH_COUNSEL',
    });
    if (HEALTH_COUNSEL) {
      compConfig.value = JSON.parse(HEALTH_COUNSEL);
    }
    await getTabConfig();

    nextTick(() => {
      fetchData();
    });
  };
  const getTabConfig = async () => {
    tabs.value = [];
    const { result } = await api.getCmsTypeList({
      zoneType:
        compConfig.value.listTopTab &&
        compConfig.value.listTopTab[tabCurrentTop.value]?.value,
    });
    tabs.value = result || [];
    if (tabs.value.length) {
      tabs.value.map(({ typeId }, i) => {
        pageList.value[typeId] = [];
        if (typeId == _typeId.value) {
          //查找当前对应的tabCurrent
          tabCurrent.value = i;
        }
      });
    }
  };

  const fetchData = async () => {
    const typeId = tabs.value[tabCurrent.value].typeId;
    const requestArg = {
      pageNumber: 1,
      pageSize: 5,
      typeId,
    };

    loading.value = true;
    const { result, pageable } = (await api.getCmsList(requestArg)) as any;
    loading.value = false;

    if (result && result.length) {
      pageList.value[typeId] = [...result];
      nextTick(() => {
        getHeight(typeId);
      });
    }
    pageable.totalNum > 5 ? (showMore.value = true) : (showMore.value = false);
    const returnArg = {
      total: pageable.totalNum,
      list: pageList.value[typeId],
    };

    return returnArg;
  };
  const getHeight = (typeId: string) => {
    const view = uni
      .createSelectorQuery()
      .in(inst)
      .select(`#Advisory-Item${tabCurrentTop.value}${typeId}`);
    view
      .boundingClientRect((data) => {
        if (data) {
          // @ts-expect-error
          const { height: _height } = data;
          swiperHeight.value = _height < 80 ? 80 : _height;
        }
      })
      .exec();
  };
  const goSearch = async (value) => {
    if (value == '') {
      isSearch.value = false;
      searchList.value = [];
      fetchData();
      return;
    } else {
      isSearch.value = true;
    }
    const { result } = await api.getCmsListByWordSearch<ICms[]>({
      searchContent: value,
      // reqHiDoc:1
    });
    result.length > 5 ? (showMore.value = true) : (showMore.value = false);
    searchList.value = result.length > 5 ? result.slice(0, 5) : result;
  };
  const tabTopChange = async (e) => {
    const chooseTabHis = tabCurrentMap.get(e);
    pageList.value = {};
    await wait(0);
    await getTabConfig();
    tabCurrent.value = chooseTabHis || 0;
    await fetchData();
  };
  const tabChange = (e: number) => {
    tabCurrent.value = e;
    tabCurrentMap.set(tabCurrentTop.value, e);
    const tabNow = tabs.value[e];
    if (!pageList.value[tabNow.typeId].length) {
      fetchData();
    } else {
      nextTick(() => {
        getHeight(tabNow.typeId);
      });
    }
  };

  const itemClick = (item: ICms) => {
    const { informationLink, id, isVideo, fileUrl, typeId } = item;
    if (fileUrl && !isVideo) {
      useTBanner({
        type: 'h5',
        isSelfH5: '1',
        path: `pagesA/healthAdvisory/healthAdvisory?fileUrl=${fileUrl}&typeId=${typeId}`,
      });
    } else if (isVideo) {
      useTBanner({
        type: 'h5',
        isSelfH5: '1',
        path: `pagesA/healthAdvisory/healthAdvisoryVideoDetail?id=${id}`,
      });
    } else if (informationLink) {
      useTBanner({
        type: 'h5',
        path: informationLink,
      });
    } else {
      useTBanner({
        type: 'h5',
        isSelfH5: '1',
        path: `pagesA/healthAdvisory/healthAdvisoryDetail?id=${id}`,
      });
    }
  };
  const readMore = (type: string | undefined) => {
    if (type === 'search') {
      useTBanner({
        type: 'h5',
        isSelfH5: '1',
        path: `pagesA/healthAdvisory/healthAdvisotySearch?searchValue=${searchValue.value}`,
      });
    } else {
      useTBanner({
        type: 'h5',
        isSelfH5: '1',
        path: `pagesA/healthAdvisory/healthAdvisory?typeId=${type}`,
      });
    }
  };
  defineExpose({
    init,
  });
</script>
<style lang="scss" scoped>
  .article-container {
    width: 100%;
    background: var(--h-color-white);
    border: 2rpx solid #f3f3f3;
    box-shadow: 0px 8rpx 24rpx 0px rgba(0, 0, 0, 0.05);
    border-radius: 16rpx;
    .search-box {
      padding: 16rpx 32rpx 32rpx;
    }
    .search-tabs {
      width: fit-content;
    }

    .tab-box {
      padding: 0 10rpx 20rpx;
    }
    .container {
      flex: 1;
      overflow: hidden;
      height: 100%;
      // height:1200px;

      .container-scroll {
        height: fit-content;
        // padding: 13rpx 320rpx;
        width: calc(100% - 64rpx);
        margin-left: 32rpx;

        .empty-box {
          position: relative;
          transform: translateY(50%);
        }
      }
    }
  }
  .out-btn {
    border-radius: 8rpx;
    text-align: center;
    padding: 0 12rpx;
    white-space: nowrap;

    background: linear-gradient(0deg, #2970ffe3, #30b0ffe0);
    opacity: 0.8;
    color: #fff;
  }
  .read-more {
    color: #888;
    margin: auto;
    width: fit-content;
    padding-bottom:32rpx
  }
</style>
