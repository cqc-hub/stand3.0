<template>
  <view class="list-container">
    <view v-for="pat in list" :key="pat.patientId">
      <List-Item
        :pat="pat"
        @card-click="cardClick"
        @profile-click="profileClick"
      >
        <template #footer>
          <view>
            <slot name="footer" :pat="pat" />
          </view>
        </template>
      </List-Item>
    </view>
  </view>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue';
  import { IPat } from '@/stores/type';

  import ListItem from './PatListItem.vue';

  export default defineComponent({
    components: {
      ListItem,
    },

    options: {
      styleIsolation: 'shared',
    },

    emits: ['profile-click', 'card-click'],

    props: {
      list: {
        type: Array as PropType<IPat[]>,
        default: (): IPat[] => [],
      },
    },

    setup(props, ctx) {
      const { emit } = ctx;

      const profileClick = (pat: IPat) => {
        emit('profile-click', pat);
      };

      const cardClick = (pat: IPat) => {
        emit('card-click', pat);
      };

      return {
        profileClick,
        cardClick,
      };
    },
  });
</script>

<style lang="scss" scoped>
  .list-container {
    margin: 0 32rpx;

    :deep(.container) {
      margin-bottom: 16rpx;
    }
  }
</style>
