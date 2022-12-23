<template>
    <view class="page">
        <dailyExpenseListDetial  :isHosDaylist="props.isHosDaylist"  :isHosTotallist="props.isHosTotallist"  :costDay="props.costDay"/>
    </view>
</template>
<script setup lang="ts">
import dailyExpenseListDetial from './components/dailyExpenseListDetial.vue';

const props = defineProps<{
  costDay?: string;
  isHosDaylist?: string;
  isHosTotallist?: string;
}>();
</script>
<style scoped lang="scss">
.page{
    height: auto;
    width: 100%;
    padding-top: 20rpx;
}

</style>
