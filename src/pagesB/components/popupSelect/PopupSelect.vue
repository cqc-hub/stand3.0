<template>
  <view class="choose-pat">
    <g-popup :title="title" ref="refActionSheet">
      <view class="choose-pat-container g-flex-rc-cc">
        <view class="pt32" style="width: 100%">
          <List-Item :list="list" :field="field" @item-click="itemClick" />

          <slot />
        </view>
      </view>
    </g-popup>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';

  import ListItem from './ListItem.vue';

  const refActionSheet = ref<any>('');

  const props = withDefaults(
    defineProps<{
      list: Record<string, any>[];
      field?: { label: string; value: string };
      autoInOne?: boolean;
      title?: string;
    }>(),
    {
      field: () => ({ label: 'label', value: 'value' }),
    }
  );

  const emits = defineEmits(['item-click']);

  const hide = () => {
    refActionSheet.value.close();
  };

  const show = () => {
    if (props.autoInOne && props.list.length === 1) {
      const item = props.list[0];
      itemClick({ item, index: 0 });
    } else {
      refActionSheet.value.show();
    }
  };

  const itemClick = (e) => {
    const { index, item } = e;

    emits('item-click', item);
    hide();
  };

  defineExpose({
    show,
    hide,
  });
</script>

<style lang="scss" scoped>
  .choose-pat {
    .choose-pat-container {
      width: 100%;
      min-height: 30vh;
      align-items: flex-start;
    }
  }
</style>
