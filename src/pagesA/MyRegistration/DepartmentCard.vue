<template>
  <view class="g-page">
    <view class="search-input">
      <uni-search-input
        v-model:value="searchValue"
        placeholder="请输入科室名称"
      />
    </view>

    <view class="g-container hidden-scrollbar" scroll-y>
      <view class="content-lv1">
        <g-side-list
          :list="list"
          :field="fieldLv1"
          :value="clickLv1"
          @item-click="itemClick"
          defaultChoose
        />
      </view>
      <view class="flex1"></view>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { type ListItem } from './utils/DepartmentCard';

  import api from '@/service/api';

  const pageProp = ref({
    hosId: '',
  });
  const searchValue = ref('');
  const list = ref<ListItem[]>([]);
  const clickLv1 = ref('');
  const fieldLv1 = {
    label: 'deptName',
    value: 'id',
  };

  const getList = async () => {
    const { hosId } = pageProp.value;

    list.value = [];
    const { result } = await api.getDeptCardList({
      hosId,
    });

    result.length = 30;
    result.fill(JSON.parse(JSON.stringify({ deptName: '眼科病院', id: '23' })));
    result.map((o, i) => {
      o.id = '' + o.id + i;
    });

    console.log(result);

    list.value = (result && result.length && result) || [];
  };

  const itemClick = ({ item }) => {
    clickLv1.value = item[fieldLv1.value];
  };

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
      flex-direction: column;

      .content-lv1 {
        width: 33%;
        height: 100%;
      }
    }
  }

  .search-input {
    margin: 16rpx 32rpx;
  }
</style>
