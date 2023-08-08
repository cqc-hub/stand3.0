<template>
    <view class="page">
        <dailyExpenseListDetial  :isHosDaylist="props.isHosDaylist"  :isHosTotallist="props.isHosTotallist" :hospitalId="props.hospitalId"  :costDay="props.costDay"  ref="aaa"/>
    </view>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from "@dcloudio/uni-app";

import dailyExpenseListDetial from './components/dailyExpenseListDetial.vue';

const props = defineProps<{
  costDay?: string;
  isHosDaylist?: string;
  isHosTotallist?: string;
  hospitalId?: string;
}>();

const aaa = ref<any>('')

onLoad((opt) => {
    uni.showLoading({
        mask: true
    })
    setTimeout(async () => {
        await aaa.value.init(opt)
        uni.hideLoading()
    }, 600)
})
</script>
<style scoped lang="scss">
.page{
    height: auto;
    width: 100%;
    padding-top: 20rpx;
}

</style>
