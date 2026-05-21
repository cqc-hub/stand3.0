<template>
  <view class="flex items-center">
    <img
      :src="getAvatar(gStores.userStore.patChoose.patientSex)"
      class="user-avatar g-fade-in mr24"
    />

    <view v-if="gStores.globalStore.isLogin" class="flex-1">
      <view
        v-if="gStores.userStore.patList.length"
        class="flex items-center"
        @click="togglePat"
      >
        <view class="color-111">
          <text
            v-if="gStores.userStore.patChoose.patientName"
            @click.stop="isClose = !isClose"
            class="mr24"
          >
            <text class="mr12 font-semibold">
              {{
                isClose
                  ? nameConvert(gStores.userStore.patChoose.patientName)
                  : gStores.userStore.patChoose.patientName
              }}
            </text>

            <text :class="`iconfont icon-resize`">
              {{ isClose ? '&#xe6d4;' : '&#xe6db;' }}
            </text>
          </text>

          <text
            v-if="gStores.userStore.patChoose._showId"
            class="font-semibold"
          >
            <text class="mr12">ID</text>
            <text>{{ gStores.userStore.patChoose._showId }}</text>
          </text>
        </view>

        <view class="flex-1" />

        <img
          :src="globalGl.BASE_IMG + 'stand3-home-pat-toggle-icon.png'"
          class="user-avatar"
        />
      </view>
      <view v-else class="flex items-center">
        <view class="font-semibold mr24 color-111">
          {{ getLangLabel('home:已登录') }}
        </view>

        <view class="flex-1" />

        <view>
          <view
            @click="addPatient"
            class="btn btn-primary btn-size-small bg-blue-light color-blue"
          >
            新增就诊人
          </view>
        </view>
      </view>
    </view>

    <view v-else class="flex-1 flex items-center color-111">
      <view>
        <text class="font-semibold mr24">
          {{ getLangLabel('home:请登录') }}
        </text>
        <text class="color-888 f28">登录后享受更多服务</text>
      </view>

      <view class="flex-1" />

      <view>
        <view class="btn btn-primary btn-size-small bg-blue-light color-blue">
          去登录
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { GStores, nameConvert } from '@/utils';
  import { getLangLabel } from '@/config/lang';
  import { getAvatar } from '@/stores';
  import globalGl from '@/config/global';
  import { ref } from 'vue';

  const gStores = new GStores();
  const isClose = ref(true);

  const emits = defineEmits(['toggle-pat', 'add-pat']);
  const togglePat = () => {
    emits('toggle-pat');
  };

  const addPatient = () => {
    emits('add-pat');
  };
</script>

<style lang="scss" scoped>
  .user-avatar {
    width: 64rpx;
    height: 64rpx;
    border-radius: 100px;
  }
</style>
