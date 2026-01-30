<template>
  <view>
    <g-login>
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
            <view class="font-semibold">
              <text class="mr24">
                {{ gStores.userStore.patChoose.patientNameEncry }}
              </text>
              <text v-if="gStores.userStore.patChoose._showId">
                <text class="mr12">ID</text>
                <text>{{ gStores.userStore.patChoose._showId }}</text>
              </text>
            </view>

            <view class="flex-1"></view>

            <img
              :src="globalGl.BASE_IMG + 'stand3-home-pat-toggle-icon.png'"
              class="user-avatar"
            />
          </view>
          <view v-else class="flex items-center">
            <view class="font-semibold mr24">
              {{ getLangLabel('home:已登录') }}
            </view>

            <view class="flex-1"></view>

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

        <view v-else class="flex-1 flex items-center">
          <view>
            <text class="font-semibold mr24">
              {{ getLangLabel('home:请登录') }}
            </text>
            <text class="color-888 f28">登录后享受更多服务</text>
          </view>

          <view class="flex-1"></view>

          <view>
            <view
              class="btn btn-primary btn-size-small bg-blue-light color-blue"
            >
              去登录
            </view>
          </view>
        </view>
      </view>
    </g-login>
  </view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';

  import { GStores } from '@/utils';
  import { getLangLabel } from '@/config/lang';
  import globalGl from '@/config/global';
  import { getAvatar } from '@/stores';

  const gStores = new GStores();

  const getAvatarSrc = computed(() => {
    return gStores.userStore.getAvatar;
  });

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
