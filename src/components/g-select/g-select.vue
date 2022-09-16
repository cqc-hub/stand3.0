<template>
  <view class="">
    <Gl-Popup ref="popup" :title="title" @hide="hide">
      <view>
        <view v-for="(item, i) in option" :key="i" class="popup-row">
          <view class="popup-row-label">{{ item[field.label] }}</view>
          <view>233</view>
        </view>
      </view>
    </Gl-Popup>
  </view>
</template>

<script lang="ts" setup>
  import { watch, ref } from 'vue';
  import GlPopup from '@/components/g-popup/g-popup.vue';

  const props = withDefaults(
    defineProps<{
      show: boolean;
      title?: string;
      option: any[];
      value: any;
      field?: {
        label: string;
        value: string;
      };
    }>(),
    {
      title: '',
      field: () => ({
        label: 'label',
        value: 'value'
      })
    }
  );

  const popup = ref<InstanceType<typeof GlPopup>>();
  const emits = defineEmits(['update:show', 'update:value']);

  const hide = () => {
    emits('update:show', false);
  };

  watch(
    () => props.show,
    () => {
      if (props.show) {
        popup.value?.show();
      } else {
        popup.value?.hide();
      }
    }
  );
</script>

<style lang="scss" scoped>
  .popup-row {
    display: flex;
    align-items: center;

    &-label {
      flex: 1;
    }
  }
</style>
