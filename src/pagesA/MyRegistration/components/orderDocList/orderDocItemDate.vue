<template>
  <view>
    <Order-Doc-List-Container
      :item="item"
      @avatar-click="emits('avatar-click', item)"
    >
      <template #footer>
        <view>
          <order-Doc-Clinic-Time :item="item" />
          <view
            v-for="(_item, i) in item.schemeList"
            :key="i"
            class="sch-item mb8 animate__animated animate__fadeIn"
          >
            <Doc-Shc-Item :item="_item" @reg-click="regClick" />
          </view>
        </view>
      </template>
    </Order-Doc-List-Container>
  </view>
</template>

<script lang="ts" setup>
  import { IDocListByDate } from '../../utils';

  import OrderDocListContainer from './orderDocListContainer.vue';
  import DocShcItem from '../DoctorDetails/docShcItem.vue';
  import orderDocClinicTime from './orderDocClinicTime.vue';

  const emits = defineEmits(['reg-click', 'avatar-click']);
  type IItem = IDocListByDate['schDateList'][number]['schemeList'][number];
  defineProps<{
    item: IItem;
  }>();

  const warnSchStateMap = {
    1: '停诊',
    2: '约满',
    3: '未放号',
  };

  const regClick = (scheme: IItem['schemeList'][number]) => {
    emits('reg-click', {
      scheme,
    });
  };
</script>

<style lang="scss" scoped></style>
