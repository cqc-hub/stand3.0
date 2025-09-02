<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >  
    <view class="mt24 ml16 flex items-center justify-between">
      <view class="department-doc-title g-bold f36"> 名医列表({{ _allDocList.length }}) </view>

      <view @click="isFilterDoctor = !isFilterDoctor" class="flex-normal pt6 pb6 mr32">
        <text class="iconfont f48">
          {{ isFilterDoctor ? "&#xe6d0;" : "&#xe6ce;" }}
        </text>
        <text>只看有号</text>
      </view>
    </view>
    <view v-if="isComplete && _allDocList.length" class="pr24 pl24">
      <view class="safe-height"></view>
      <docList :list="_allDocList" @item-click="docCLick" />
    </view>

    <view v-else-if="isComplete && _allDocList.length === 0" class="empty-list">
      <g-empty :current="1" />
    </view>
    <g-massage />
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import { GStores } from "@/utils";
import { joinQueryForUrl, cloneUtil } from "@/common";

import api from "@/service/api";

import docList from "./components/docList.vue";

const pageProps = ref<{
  famousDoctorType: string;
  hosId: string;
  hosDeptId: string;
}>({
  famousDoctorType: "",
  hosId: "",
  hosDeptId: "",
});

const gStores = new GStores();
const list = ref([] as any[]);
const isComplete = ref(true);
const isFilterDoctor = ref(false);
const getList = async () => {
  const { famousDoctorType, hosId, hosDeptId } = pageProps.value;
  isComplete.value = false;
  list.value = [];
  const { result = [] } = await api
    .getDoctorByDeptAndHos({
      famousDoctorType,
      hosId,
      hosDeptId,
    })
    .finally(() => {
      isComplete.value = true;
    });
  list.value = result;
};

const _allDocList = computed(() => {
  if (isFilterDoctor.value) {
    // 直接筛选 docAppointStatus 为 '1' 的医生
    return list.value.filter((doctor) => {
      return doctor.docAppointStatus === "1";
    });
  }
  // 不过滤时返回所有数据
  return list.value;
});
const docCLick = (item) => {
  const { hosDocId, hosId, hosDeptId, docAppointStatus } = item;
    // 有排班
    uni.navigateTo({
      url: joinQueryForUrl("/pagesA/MyRegistration/DoctorDetails", {
        hosDocId,
        hosId,
        hosDeptId,
      }),
    });
};

onLoad(async (opt) => {
  pageProps.value = opt as any;
  getList();
});
</script>

<style lang="scss" scoped></style>
