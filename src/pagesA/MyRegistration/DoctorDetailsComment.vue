<template>
  <view class="g-page">
    <view class="g-container">
      <Scroll-List ref="scrollListRef" :option="option" @load="loadList">
        <view class="list-content">
          <view class="safe-height"></view>
          <view v-for="(item, i) in list" :key="i">
            <Doc-Comment-Item :item="item" :tagList="tagList" />
          </view>

          <!-- <Doc-Comment :list="list" :total="total" /> -->
        </view>
      </Scroll-List>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { deQueryForUrl } from '@/common';
  import { type ICommentItem } from './utils/DoctorDetails';

  import api from '@/service/api';

  import ScrollList from '@/components/scroll-list/scroll-list.vue';
  import DocCommentItem from '@/pagesA/MyRegistration/components/DoctorDetails/DocCommentItem.vue';

  const pageProps = ref(
    {} as {
      hosDocId: string;
    }
  );
  const scrollListRef = ref('' as any);
  const total = ref(0);
  const list = ref<ICommentItem[]>([]);
  const tagList = ref([] as any[]);

  const option = ref({
    size: 10,
    auto: true,
  });

  const loadList = async (pageInfo) => {
    const { hosDocId } = pageProps.value;
    const { page, size } = pageInfo;

    return api
      .getAllSatisfactions({
        hosDocId,
        pageSize: size,
        index: page,
      })
      .then(({ result }) => {
        const { satisfactionResultList, totalNum } = result;

        list.value = [...list.value, ...satisfactionResultList];
        total.value = totalNum * 1;

        const returnArg = {
          list: list.value,
          total: total.value,
        };

        scrollListRef.value.loadSuccess(returnArg);
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
    .list-content {
      padding: 0 32rpx;
      background-color: #fff;
    }
  }
</style>
