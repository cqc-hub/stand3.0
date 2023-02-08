<template>
  <view>
    <Order-Doc-List-Container
      :item="item"
      @avatar-click="emits('avatar-click', item)"
      isAllDate
    >
      <template #footer>
        <view class="g-border-top pt24">
          <order-Doc-Clinic-Time :item="item" />

          <view class="date-container">
            <view class="sel-date">
              <view class="sel-label g-flex-rc-cc">可约日期:</view>
              <block v-if="getSelectData && getSelectData.length">
                <g-login
                  v-for="date in getSelectData"
                  :key="date.schDate"
                  @handler-next="dateClick(date)"
                  patient
                >
                  <view
                    :class="{
                      animate__fadeIn: !isCollapse,
                    }"
                    @click="dateClick(date)"
                    class="date-item g-flex-rc-cc animate__animated"
                  >
                    <view
                      :class="{
                        animate__fadeIn: isCollapse,
                      }"
                      class="animate__animated"
                    >
                      {{ getDateFormatter(date.schDate) }}
                    </view>
                  </view>
                </g-login>
              </block>

              <view v-else>
                <text class="f24 color-888">无号</text>
              </view>
            </view>

            <view class="arrow-content">
              <view
                class="icon-arrow1"
                v-if="item.schDocSubResultList.length > 3"
                @click="toggleCollapse"
              >
                <view
                  :class="{ 'open-arrow': isCollapse }"
                  class="iconfont ico-arrow"
                >
                  &#xe6c4;
                </view>
              </view>
            </view>
          </view>
        </view>
      </template>
    </Order-Doc-List-Container>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { IDocListAll } from '../../utils';
  import dayjs from 'dayjs';

  import OrderDocListContainer from './orderDocListContainer.vue';
  import orderDocClinicTime from './orderDocClinicTime.vue';

  const props = defineProps<{
    item: IDocListAll;
  }>();

  const emits = defineEmits(['date-click', 'avatar-click']);

  const isCollapse = ref(true);

  const getSelectData = computed(() => {
    if (isCollapse.value) {
      return props.item.schDocSubResultList.filter((o, i) => i < 3);
    } else {
      return props.item.schDocSubResultList;
    }
  });

  const getDateFormatter = (date: string) => {
    const _date = date.replace(/-/g, '/');
    return dayjs(_date).format('MM-DD');
  };

  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value;
  };

  const dateClick = (schInfo: any) => {
    emits('date-click', {
      item: props.item,
      schInfo,
    });
  };
</script>

<style lang="scss" scoped>
  .date-container {
    display: flex;

    .sel-date {
      flex: 1;

      display: grid;
      grid-template-columns: repeat(4, 1fr);
      justify-content: center;
      align-items: center;

      gap: 16rpx;

      .sel-label {
        height: 100%;
        justify-content: flex-start;
        color: var(--hr-neutral-color-8);
        font-size: var(--hr-font-size-xxxs);
      }

      .date-item {
        border-radius: 16rpx;
        background-color: var(--hr-brand-color-1);
        color: var(--hr-brand-color-6);
        font-size: var(--hr-font-size-xs);
        height: 56rpx;
      }
    }

    .icon-arrow1 {
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }

    .arrow-content {
      margin-left: 10rpx;
      min-width: 48rpx;
    }

    .ico-arrow {
      transition: all 0.1s linear;
      color: var(--hr-neutral-color-7);
      font-size: var(--hr-font-size-xxl);
      transform: rotate(-180deg);

      &.open-arrow {
        transform: rotate(0);
      }
    }
  }
</style>
