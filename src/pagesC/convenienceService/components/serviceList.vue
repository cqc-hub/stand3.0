<template>
  <view class="">
    <view v-for="(item, i) in listData" :key="i" class="item">
      <view class="g-bold">
        <view class="flex-normal f32 title">
          {{ item.itemName }}
          <view
            class="iconfont"
            v-if="!isNoShowMore"
            @click="iconClick(item, i)"
          >
            &#xe6d6;
          </view>
        </view>
        <view class="fee f28 mt8">{{ item.fee }}元</view>
      </view>
      <view class="text-no-wrap number-box-content">
        <uni-number-box
          :value="item.num"
          :min="0"
          icon="circle"
          :max="9999"
          @change="boxChange($event, i)"
        />
      </view>
    </view>
    <Order-Reg-Confirm
      :title="serviceItem.itemName"
      @confirm="regDialogConfirm.hide"
      height="50vh"
      confirmText="添加项目"
      headerIcon=""
      ref="regDialogConfirm"
      isShowCloseIcon
      footerBtnIsometric
    >
      <view>
        <view class="mb40">
          <view v-if="serviceItem.tips" class="dialog-t f32">
            <text class="dt-width color-888">项目说明</text>
            <text class="g-bolder g-break-word">
              {{ serviceItem.tips }}{{ serviceItem.tips }}{{ serviceItem.tips }}
            </text>
          </view>
          <view class="dialog-t f32">
            <text class="dt-width color-888">费用金额</text>
            <text class="dt-red g-bolder">{{ serviceItem.fee }}元</text>
          </view>
        </view>
        <view class="amount">
          <uni-number-box
            :value="serviceItem.num"
            :min="0"
            icon="circle"
            :max="9999"
            @change="boxChange($event, serviceIndex)"
          />
        </view>
      </view>
      <template #footer>
        <view class="addItem">
          <button
            class="btn g-bord btn-primary f36"
            @click="regDialogConfirm.hide"
          >
            <text class="iconfont f36 color-fff">&#xe718;</text>
            <text>添加项目</text>
          </button>
        </view>
      </template>
    </Order-Reg-Confirm>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref, watch, nextTick } from 'vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  const regDialogConfirm = ref<any>('');
  const serviceItem = ref<any>('');
  const serviceIndex = ref<any>();
  const props = defineProps<{
    list: any[];
    isNoShowMore?: boolean;
    zzz?: boolean;
  }>();
  const listData = ref(props.list);
  const emits = defineEmits(['update:value', 'zzz']);

  const boxChange = (e, i) => {
    listData.value[i].num = e;
    emits('update:value', listData.value);
  };
  const iconClick = (item, i) => {
    if (props.zzz) {
      emits('zzz', {
        item,
        i,
      });
      return;
    }
    regDialogConfirm.value.show();
    serviceItem.value = item;
    serviceIndex.value = i;
  };
  const goWithdrawal = () => {};

  defineExpose({
    iconClick
  })
  watch(
    () => props.list,
    (v) => {
      if (v) {
        nextTick(() => {
          listData.value = v;
        });
      }
    },
    { deep: true }
  );
</script>

<style lang="scss" scoped>
  .item {
    padding: 32rpx 0;
    box-shadow: 0px -1px 0px 0px #e6e6e6 inset;
    display: flex;
    justify-content: space-between;
    .title {
      margin-right: 46rpx;
      .iconfont {
        margin-left: 9rpx;
        color: var(--hr-neutral-color-5);
        font-size: var(--hr-font-size-xl);
        font-weight: 400;
        transform: rotateX(180deg);
      }
    }
    .fee {
      color: var(--hr-error-color-6);
    }
  }
  .dialog-t {
    margin-bottom: 22rpx;
    display: flex;
    justify-content: flex-start;
    .dt-width {
      min-width: 144rpx;
    }
    .dt-red {
      color: var(--hr-error-color-6);
    }
  }
  .amount {
    display: flex;
    justify-content: flex-end;
  }
  .addItem {
    margin: 32rpx;
    .btn {
      display: flex;
      align-items: center;
    }
    .iconfont {
      margin-right: 22rpx;
    }
  }
</style>
