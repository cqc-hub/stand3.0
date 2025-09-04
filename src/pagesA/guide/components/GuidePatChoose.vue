<template>
  <view class="">
    <view class="relative">
      <img
        :src="globalGl.BASE_IMG + 'stand3-guide-user-bg.png'"
        class="w-full bg-img relative"
        mode="widthFix"
        lazy-load
      />

      <view
        @click="chooseAction"
        class="content pl32 pr32 pt24 pb24 flex flex-between"
      >
        <view class="flex">
          <view
            class="qr-code bg-white rounded flex justify-center items-center mr32"
            @click.stop="goCardDetail"
          >
            <view class="iconfont color-blue">&#xe6a7;</view>
          </view>

          <view>
            <view class="f36">
              {{ patChoose.patientNameEncry || patChoose.patientName }}
            </view>
            <view v-if="getPatIdForShow" class="flex f26 pat-info-id">
              <view class="mr12">就诊ID</view>
              <view>{{ getPatIdForShow }}</view>
            </view>
          </view>
        </view>

        <view>
          <view
            class="btn btn-border btn-plain btn-round f26 pt8 pb8 pat-change-btn"
          >
            切换就诊人
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { GStores } from '@/utils';
  import { storeToRefs } from 'pinia';
  import { IPat, isAreaProgram } from '@/stores';
  import { goElectronicMedicalCard } from '@/pages/home/utils';
  import globalGl from '@/config/global';

  const gStores = new GStores();

  const { patChoose } = storeToRefs(gStores.userStore);
  const getPatIdForShow = computed(() => {
    return (!isAreaProgram() && patChoose.value._showId) || '';
  });
  const emits = defineEmits(['choose-pat']);

  const goCardDetail = () => {
    gStores.userStore.updatePatClick(patChoose.value);
    goElectronicMedicalCard();
  };

  const chooseAction = () => {
    emits('choose-pat');
  };

  const choosePatHandler = ({ item }: { item: IPat; number: number }) => {
    const { patientId, herenId } = item;

    // 自定义就诊人列表时候不带 herenId
    if (item.patientId) {
      if (herenId) {
        gStores.userStore.updatePatChoose(item);
      } else {
        const pat = gStores.userStore.patList.find(
          (o) => o.patientId === patientId
        );

        if (pat) {
          gStores.userStore.updatePatChoose(item);
        }
      }
    }
    emits('choose-pat', { item });
  };
</script>

<style lang="scss" scoped>
  .content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    color: #fff;

    .qr-code {
      width: 88rpx;
      height: 88rpx;

      .iconfont {
        font-size: 55rpx;
      }
    }

    .pat-info-id {
      opacity: 0.75;
    }

    .pat-change-btn {
      border-color: #fff;
      font-weight: normal;
    }
  }

  .bg-img {
    z-index: 0;
  }
</style>
