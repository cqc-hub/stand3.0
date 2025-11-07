<template>
  <div class="">
    {{ err }}
    {{ info.deptListLevel }}
    {{ info.hosId }}
    <testBtn />
    我是页面内容
  </div>
</template>

<script lang="ts" setup>
  import { onLoad } from '@dcloudio/uni-app';
  import testBtn from './components/testBtn.vue';
  import api from '@/service/api';
  import { ref } from 'vue';

  const info = ref({
    hosId: '',
    deptListLevel: '',
  });
  const err = ref();

  onLoad(async () => {
    const { result } = await api
      .getDeptList1001035({
        hosId: '12675',
      })
      .catch((e) => {
        err.value = e;
        throw Error('');
      });

    info.value = result;
  });
</script>

<style lang="less" scoped></style>
