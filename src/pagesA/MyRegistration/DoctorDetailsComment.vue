<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page f32"
  >
    <view class="g-container">
      <Scroll-List
        ref="scrollListRef"
        :option="option"
        @load="loadList"
        @refresh="refreshList"
      >
        <template #default>
          <view class="list-content">
            <view class="safe-height"></view>
            <view v-for="(item, i) in list" :key="i">
              <Doc-Comment-Item
                :item="item"
                :tagList="tagList"
                :systemModeOld="gStores.globalStore.modeOld"
              />
            </view>
          </view>
        </template>

        <template #empty>
          <view class="empty-list">
            <g-empty :current="5" text="暂无患者评价" noTransformY />
          </view>
        </template>
      </Scroll-List>
    </view>

    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { deQueryForUrl } from '@/common';
  import { GStores } from '@/utils';
  import { type ICommentItem } from './utils/DoctorDetails';

  import api from '@/service/api';

  import ScrollList from '@/components/scroll-list/scroll-list.vue';
  import DocCommentItem from '@/pagesA/MyRegistration/components/DoctorDetails/DocCommentItem1.vue';

  const pageProps = ref(
    {} as {
      hosDocId: string;
    }
  );
  const gStores = new GStores();
  const scrollListRef = ref('' as any);
  const total = ref(0);
  const list = ref<ICommentItem[]>([]);
  const tagList = ref([] as any[]);

  const option = ref({
    size: 10,
    auto: true,
    emptyText: '暂无患者评价',
  });

  const getList = async (pageInfo) => {
    const { hosDocId } = pageProps.value;
    const { page, size } = pageInfo;

    const { result } = await api.getAllSatisfactions({
      hosDocId,
      pageSize: size,
      index: page,
    });

    const { satisfactionResultList, totalNum } = result;

    list.value = [...list.value, ...satisfactionResultList];
    total.value = totalNum * 1;

    return {
      list: list.value,
      total: total.value,
    };
  };

  const loadList = async (pageInfo) => {
    getList(pageInfo)
      .then((returnArg) => {
        scrollListRef.value.loadSuccess(returnArg);
      })
      .catch(() => {
        scrollListRef.value.loadFail();
      });
  };

  const refreshList = async (pageInfo) => {
    list.value = [];
    total.value = 0;
    getList(pageInfo)
      .then((r) => {
        scrollListRef.value.refreshSuccess(r);
      })
      .catch(() => {
        scrollListRef.value.refreshFail();
      });
  };

  const getConfig = async () => {
    const { result } = await api.getTermsBySysAndCode({
      domainCode: 'DOC_EVALUATION_CONTENT',
    });

    tagList.value = (result && result[0]?.terms) || [];
  };

  const init = async () => {
    await getConfig();
  };

  onLoad((opt) => {
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));

    init();
  });
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: #fff;

    .list-content {
      padding: 0 32rpx;
    }
  }
</style>
