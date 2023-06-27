<template>
  <view
    :class="{
      'system-mode-old': gStores.globalStore.modeOld,
    }"
    class="g-page"
  >
    <view class="g-container">
      <view class="container-view">
        <view class="container-view-card">
          <Reg-Confirm-Card
            v-model:hosName="hosName"
            :my-props="props"
            :systemModeOld="gStores.globalStore.modeOld"
            isPreConfirm
          >
            <template #slot1>
              <view class="f28">
                <view class="g-bold f36 mb32">
                  <text class="mr12">{{ props.categorName }}</text>
                  <text>
                    <text class="color-blue">{{ props.fee }}</text>
                    元
                  </text>
                </view>

                <view>
                  <text class="reg-title-num">放号数量</text>
                  <text class="color-blue">{{ props.regNumber }}</text>
                </view>

                <view>
                  <text class="reg-title-num">已登记数</text>
                  <text class="color-blue">{{ restRegNumbers }}</text>
                </view>
              </view>
            </template>
          </Reg-Confirm-Card>
        </view>

        <view>
          <Reg-Confirm-ChoosePat @go-choose-pat="showPatChoose" isUnSelPat />
        </view>
      </view>

      <g-flag typeFg="114" isShowFgTip />
    </view>

    <view class="g-footer flex-column">
      <view class="flex1">
        <button class="btn btn-primary" @click="dialogShow = true">
          确认登记
        </button>
      </view>
    </view>

    <g-message />

    <xy-dialog
      :show="dialogShow"
      :content="'确认登记?'"
      @confirmButton="regConfirm"
      @cancelButton="dialogShow = false"
    />

    <Choose-Pat @choose-pat="choosePatHandler" ref="actionSheet" />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import { onLoad } from '@dcloudio/uni-app';

  import { IPrePageProps } from './utils/regConfirm';
  import { GStores } from '@/utils';
  import { deQueryForUrl, joinQueryForUrl } from '@/common/utils';

  import api from '@/service/api';

  import RegConfirmCard from './components/RegConfirmCard/RegConfirmCard.vue';
  import RegConfirmChoosePat from './components/RegConfirmChoosePat/RegConfirmChoosePat.vue';
  import ChoosePat from '@/components/g-choose-pat/choose-pat-action.vue';

  const gStores = new GStores();
  const actionSheet = ref<InstanceType<typeof ChoosePat>>();
  const dialogShow = ref(false);
  const props = ref<IPrePageProps>({} as IPrePageProps);
  const hosName = ref('');
  const restRegNumbers = computed(() => {
    if (props.value.regNumber) {
      // @ts-expect-error
      return props.value.regNumber * 1 - props.value.residueNumber * 1;
    } else {
      return '0';
    }
  });

  const choosePatHandler = ({ item }: { item: any; number: number }) => {
    gStores.userStore.updatePatChoose(item);
  };

  const showPatChoose = () => {
    if (actionSheet.value) {
      actionSheet.value.show();
    }
  };

  const regConfirm = async () => {
    dialogShow.value = false;
    const { patientId } = gStores.userStore.patChoose;
    const { hosId, hosDocId, docName, regNumber, categorName, categorNamePY } =
      props.value;

    const requestArg = {
      status: '0',
      patientId,
      docId: hosDocId,
      hosId,
      docName,
      categorName,
      categorNamePy: categorNamePY,
      regNumber,
      hosName: hosName.value,
    };

    await api.preregistrationSave(requestArg);

    gStores.messageStore.showMessage('您的挂号预约登记成功!', 3000, {
      closeCallBack() {
        uni.navigateBack({
          delta: 1,
        });
      },
    });
  };

  onLoad((p) => {
    props.value = deQueryForUrl<IPrePageProps>(deQueryForUrl(p));
    console.log(props.value, 'props.value');
  });
</script>

<style lang="scss" scoped>
  .g-container {
    z-index: 2;
    .container-view {
      padding: 0 32rpx;

      .container-view-card {
        padding-top: 24rpx;
        padding-bottom: 16rpx;
      }
    }
  }

  .g-footer {
    z-index: 1;
  }

  .fg-agree {
    display: flex;
    font-size: var(--hr-font-size-xs);
    align-items: flex-start;

    .fg-agree-name {
      color: var(--hr-brand-color-6);
    }

    .check-box {
      color: var(--hr-neutral-color-7);
      font-size: var(--h-size-40);
      margin-right: 4rpx;
      transform: translateY(-5rpx);

      &.is-check {
        color: var(--hr-brand-color-6);
      }
    }
  }

  .system-mode-old {
    .check-box {
      font-size: 48rpx;
    }
  }

  .reg-title-num {
    margin-right: 16rpx;
    color: var(--hr-neutral-color-7);
  }
</style>
