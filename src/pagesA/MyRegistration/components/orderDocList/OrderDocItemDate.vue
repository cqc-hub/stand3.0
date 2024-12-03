<template>
  <view>
    <Order-Doc-List-Container
      :item="item"
      :isShowHosNameWithDeptName="pageConfig.isShowHosNameWithDeptName === '1'"
      @avatar-click="emits('avatar-click', item)"
      @preregistration-click="emits('preregistration-click', $event)"
    >
      <template #footer>
        <view>
          <Order-Doc-Clinic-Time :item="docInfo" />
          <view
            v-for="(_item, i) in item.schemeList"
            :key="i"
            class="sch-item mb8 animate__animated animate__fadeIn"
          >
            <Doc-Shc-Item
              :item="_item"
              :pageConfig="pageConfig"
              :systemModeOld="systemModeOld"
              :patient="patient"
              @reg-click="regClick"
              @wait-reg-click="waitRegClick"
            />
          </view>
        </view>
      </template>
    </Order-Doc-List-Container>
  </view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { IDocListByDate } from '../../utils';

  import OrderDocListContainer from './OrderDocListContainer.vue';
  import DocShcItem from '../DoctorDetails/DocShcItem.vue';
  import OrderDocClinicTime from './OrderDocClinicTime.vue';

  import { type ISystemConfig } from '@/utils';

  const emits = defineEmits([
    'reg-click',
    'wait-reg-click',
    'avatar-click',
    'preregistration-click',
  ]);
  type IItem = IDocListByDate['schDateList'][number]['schemeList'][number];
  const props = defineProps<{
    item: IItem;
    pageConfig: ISystemConfig['order'];
    systemModeOld?: boolean;
    patient?: boolean;
  }>();

  const docInfo = computed(() => {
    if (props.item.schemeList && props.item.schemeList.length) {
      return props.item.schemeList[0];
    } else {
      return {};
    }
  });

  const regClick = (scheme: IItem['schemeList'][number]) => {
    emits('reg-click', {
      scheme,
    });
  };

  const waitRegClick = ({ scheme }) => {
    emits('wait-reg-click', {
      scheme,
    });
  };
</script>

<style lang="scss" scoped></style>
