<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class=""
  >
    <g-login @handler-next="routerJump">
      <!-- 登录之后 -->
      <block v-if="globalStore.isLogin">
        <view
          class="top-card flex-normal-between animate__animated animate__fadeIn"
        >
          <!-- 有就诊人时 -->
          <block v-if="getShowName">
            <view class="flex-normal">
              <view
                v-if="personConfig.isQrCodeDisabled !== '1'"
                @tap="cardClick"
                class="iconfont icon-size"
                :class="
                  gStores.globalStore.sysCode == '1001036' ? 'revent' : ''
                "
              >
                &#xe6a7;
              </view>
              <view class="patient">
                <text>
                  {{ getShowName }}
                </text>
                <text v-if="getShowPatId">
                  ID
                  {{ getShowPatId }}
                </text>
              </view>
            </view>
            <view class="switchPatient" @tap="chooseAction">更换就诊人</view>
          </block>
          <!-- 没有就诊人时 -->
          <block v-else>
            <view class="flex-normal">
              <view class="patient">
                <text v-if="gStores.globalStore.sysCode === '1001081'">
                  请认真填写问卷内容，保证如实填写
                </text>
                <text v-else>暂无就诊人</text>
              </view>
            </view>
            <view
              v-if="gStores.globalStore.sysCode !== '1001081'"
              class="switchPatient"
              @tap="addPatient"
            >
              添加就诊人
            </view>
          </block>
        </view>
      </block>
      <block v-else>
        <!-- 未登录 -->
        <view
          class="top-card flex-normal-between animate__animated animate__fadeIn"
        >
          <view class="flex-normal no-login">
            <text>{{ getLangLabel('home:请登录') }}</text>
            <text>
              {{ getLangLabel('home:登录后享受更多服务') }}
            </text>
          </view>

          <view
            v-if="gStores.globalStore.ev === 'alipay'"
            class="switchPatient no-login-tip"
          >
            {{ getLangLabel('home:请登录') }}
          </view>

          <button
            v-if="
              gStores.globalStore.ev &&
              ['wx', 'web', 'harmony'].includes(gStores.globalStore.ev)
            "
            class="login-btn"
          >
            {{ getLangLabel('home:请登录') }}
          </button>
        </view>
      </block>
    </g-login>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';

  import { GStores, routerJump, ISystemConfig } from '@/utils';
  import { IPat, isAreaProgram, useGlobalStore } from '@/stores';
  import { getLangLabel } from '@/config/lang';
  import { goElectronicMedicalCard } from '../utils';

  const globalStore = useGlobalStore();
  const gStores = new GStores();
  const emits = defineEmits(['choose-action', 'add-pat']);
  defineProps<{
    personConfig: ISystemConfig['person'];
  }>();

  const getShowName = computed(() => {
    return gStores.userStore.patChoose.patientName;
  });

  const getShowPatId = computed(() => {
    if (isAreaProgram()) {
      return '';
    }
    return gStores.userStore.patChoose._showId;
  });

  const chooseAction = () => {
    emits('choose-action');
  };

  const addPatient = () => {
    emits('add-pat');
  };

  const cardClick = (pat: IPat) => {
    gStores.userStore.updatePatClick(gStores.userStore.patChoose);
    goElectronicMedicalCard();
  };
</script>

<style lang="scss" scoped></style>
