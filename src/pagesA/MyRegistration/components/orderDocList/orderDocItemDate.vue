<template>
  <view>
    <Order-Doc-List-Container :item="item">
      <template #footer>
        <view>{{ item }}</view>
        <!-- {{  }} -->
      </template>
    </Order-Doc-List-Container>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref, reactive } from 'vue';
  import { IDocListByDate } from '../../utils';
  import dayjs from 'dayjs';

  import OrderDocListContainer from './orderDocListContainer.vue';

  const props = defineProps<{
    item: IDocListByDate['schDateList'][number]['schemeList'][number]['schemeList'][number];
  }>();
</script>

<style lang="scss" scoped></style>
