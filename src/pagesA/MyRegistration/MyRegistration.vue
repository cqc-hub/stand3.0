<template>
  <view class="g-page">
    <view class="flex-normal header">
      <view
        :class="{
          'sel-active': false,
        }"
        class="flex-normal"
      >
        <view>111</view>
        <view class="iconfont">&#xe6e8;</view>
      </view>

      <view
        :class="{
          'sel-active': isSelPatient,
        }"
        @click="isSelPatient = !isSelPatient"
        class="flex-normal"
      >
        <view>{{ selPatName }}</view>
        <view class="iconfont">&#xe6e8;</view>
      </view>
    </view>
    <view class="g-container">
      <block v-if="list.length && isComplete">233</block>

      <view class="empty-list" v-else-if="isComplete">
        <g-empty :current="1" />
      </view>
    </view>

    <g-select
      v-model:value="selPatId"
      v-model:show="isSelPatient"
      :option="patList"
      :field="{
        label: 'patientName',
        value: 'patientId',
      }"
      title="筛选医院"
      type="top"
    >
      <template #header>
        <view class="flex-normal header">
          <view
            :class="{
              'sel-active': false,
            }"
            class="flex-normal"
          >
            <view>111</view>
            <view class="iconfont">&#xe6e8;</view>
          </view>

          <view
            :class="{
              'sel-active': isSelPatient,
            }"
            @click="isSelPatient = !isSelPatient"
            class="flex-normal"
          >
            <view>{{ selPatName }}</view>
            <view class="iconfont">&#xe6e8;</view>
          </view>
        </view>
      </template>
    </g-select>
  </view>
</template>

<script lang="ts" setup>
  import { GStores } from '@/utils';
  import { computed, ref } from 'vue';
  import api from '@/service/api';

  const gStores = new GStores();
  const isSelPatient = ref(false);
  const isSelStatus = ref(false);
  const isComplete = ref(false);

  const list = ref<any[]>([]);

  const getList = async () => {
    isComplete.value = false;
    const { result } = await api
      .getRegOrderList<any[]>({
        source: gStores.globalStore.browser.source,
        herenId: gStores.globalStore.herenId,
      })
      .finally(() => {
        isComplete.value = true;
      });

    list.value = result;
  };

  const init = async () => {
    getList();
  };

  const patList = computed(() => {
    return [
      {
        patientId: '',
        patientName: '所有就诊人',
      },
      ...gStores.userStore.patList,
    ];
  });
  const selPatId = ref('');
  const selPatName = computed(() => {
    return patList.value.find((o) => o.patientId === selPatId.value)
      ?.patientName;
  });

  init();
</script>

<style lang="scss" scoped>
  .header {
    background-color: #fff;
    > view {
      flex: 1;
      justify-content: center;
      padding: 24rpx 0;
    }

    .sel-active {
      font-weight: 600;
      color: var(--hr-brand-color-6);
      .iconfont {
        transform: rotate(0.5turn);
      }
    }
  }
</style>
