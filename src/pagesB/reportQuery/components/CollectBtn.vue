<template>
  <view
    @click.stop="collectClick"
    class="btn btn-round btn-size-small btn-border btn-warning"
  >
    <text class="iconfont f36 mr12">
      {{ isCollected ? '&#xe6ff;' : '&#xe700;' }}
    </text>

    <text class="text-no-wrap">
      {{ isCollected ? '已收藏' : '收藏' }}
    </text>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';
  import { GStores } from '@/utils';
  import api from '@/service/api';

  const props = defineProps<{
    info: BaseObject;
  }>();
  const isCollected = ref(false);
  const gStore = new GStores();

  const collectClick = () => {
    (isCollected.value && removeCollect()) || addCollect();
  };

  const addCollect = async () => {
    const {
      repName,
      deptName,
      applyDoc,
      reportType,
      repTime,
      extend,
      repType,
      deptId,
      repId,
      serialNo,
      hosId
    } = props.info;

    const arg = {
      collectType: 4,
      content: repName,
      deptName,
      deptId,
      docName: applyDoc,
      orderType: reportType,
      source: gStore.globalStore.browser.source,
      time: repTime,
      extend,
      repType,
      serialNo,
      orderId: repId,
      patientId: gStore.userStore.patChoose.patientId,
      patientName: gStore.userStore.patChoose.patientName,
      hosId
    };

    await api.addCollect(arg);
    isCollected.value = true;
  };

  const removeCollect = async () => {
    const { repId } = props.info;

    const arg = {
      orderId: repId,
      collectType: 4,
      patientId: gStore.userStore.patChoose.patientId,
      patientName: gStore.userStore.patChoose.patientName,
    };

    await api.delMyCollect(arg);

    isCollected.value = false;
  };

  const getStatus = async () => {
    const { repId } = props.info;

    const { result } = await api.queryCollect({
      collectType: 4,
      orderId: repId,
      patientId: gStore.userStore.patChoose.patientId,
    });

    isCollected.value = result;
  };

  getStatus();
</script>

<style lang="scss" scoped></style>
