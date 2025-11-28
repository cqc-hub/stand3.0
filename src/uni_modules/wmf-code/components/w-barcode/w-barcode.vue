<template>
  <view @longtap.stop="longtap">
    <canvas
      :width="info.orient == 'vertical' ? info.destHeight : info.destWidth"
      :height="info.orient == 'vertical' ? info.destWidth : info.destHeight"
      :canvas-id="item.id"
      :id="item.id"
      :style="{
        width: info.orient == 'vertical' ? info.height : info.width,
        height: info.orient == 'vertical' ? info.width : info.height,
      }"
      v-for="item in info.listCode"
      :key="item.id"
      class="relative z-1"
      @error="handleError"
    ></canvas>
  </view>
</template>

<script setup name="WBarcode">
  import {
    reactive,
    watch,
    onMounted,
    nextTick,
    getCurrentInstance,
  } from 'vue';
  import { BarCode, GetImg, GetPixelRatio, GetPx } from '../../js_sdk/index.js';
  import { getUUid, deepClone, platform } from '../../common/helper.js';
  //定义props
  const props = defineProps({
    options: {
      type: Object,
      required: true,
      default: () => {
        return {};
      },
    },
  });
  const emits = defineEmits(['generate', 'press', 'error']);
  let opt = props.options;
  const that = getCurrentInstance();
  const HSize = opt.text ? opt.text.size || 40 + opt.text.padding || 20 : 0;
  let info = reactive({
    id: getUUid(),
    destWidth: GetPixelRatio() * GetPx(opt.width) + 'px',
    destHeight: GetPixelRatio() * GetPx(opt.height + HSize) + 'px',
    width: GetPx(opt.width) + 'px',
    height: GetPx(opt.height + HSize) + 'px',
    orient: opt.orient || 'horizontal',
    listCode: [],
  });
  onMounted(() => {
    SpecialTreatment(opt);
    nextTick(() => {
      generateCode(opt);
    });
  });
  watch(
    () => props.options,
    (val) => {
      opt = val;
      SpecialTreatment(val);
      const HSize = val.text ? val.text.size || 40 + val.text.padding || 20 : 0;
      ((info.destWidth = GetPixelRatio() * GetPx(val.width) + 'px'),
        (info.destHeight = GetPixelRatio() * GetPx(val.height + HSize) + 'px'),
        (info.orient = val.orient || 'horizontal'),
        (info.width = GetPx(val.width) + 'px'),
        (info.height = GetPx(val.height + HSize) + 'px'),
        setTimeout(() => {
          generateCode(val);
        }, 100));
    },
    { deep: true }
  );
  const generateCode = (val) => {
    try {
      const parameter = {
        ...val,
        orient: info.orient,
        source: platform(),
        id: info.id,
        ctx: that,
      };
      console.log('bar-code-----');
      console.log(parameter);
      BarCode(parameter, (res) => {
        emits('generate', res);
      });
    } catch (err) {
      console.warn(err);
    }
  };
  const GetCodeImg = async () => {
    try {
      return await GetImg({
        id: info.id,
        source: platform(),
        width: opt.orient == 'vertical' ? opt.height : opt.width,
        height: opt.orient == 'vertical' ? opt.width : opt.height,
        ctx: that,
      });
    } catch (e) {
      console.warn(e);
    }
  };
  const SpecialTreatment = (val) => {
    //渲染多个canvas特殊处理
    let obj = deepClone(val);
    obj.id = info.id;
    info.listCode = [obj];
  };
  // 长按事件
  const longtap = (e) => {
    emits('press', e);
  };
  // canvas创建错误 触发
  const handleError = (e) => {
    emits('error', e.detail);
  };
  defineExpose({
    GetCodeImg,
    SpecialTreatment,
    generateCode,
  });
</script>
