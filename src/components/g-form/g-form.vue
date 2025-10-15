<template>
  <view class="">
    <view v-if="list.length" class="container">
      <view
        v-for="item in list"
        :key="item.key"
        :class="{
          'form-item-horizontal': item.direction === 'horizontal',
          'g-border-bottom': !hideRowBorder,
          'form-item-icon': item.field === 'select',
          'item-for-show': item.isForShow,
          'form-item-bold': bodyBold,
          'form-item-disabled': item.disabled,
          'form-item-filled': !!value[item.key],
          'form-item-error': warningKeys.includes(item.key),
          [`form-item-${item.field}`]: true,
        }"
        :style="`--label-width: ${item.labelWidth || '190rpx'}; ${
          item.rowStyle || ''
        }`"
        @tap.prevent.stop="clickContainer(item)"
        class="form-item"
      >
        <view
          :class="{
            'item-require':
              item.required && (showRequireIcon || item.showRequireIcon),
          }"
          class="label text-no-wrap"
          :style="item.labelStyle"
        >
          <view>{{ item.label }}</view>
          <view v-if="item.subLabel" class="sub-label f24 color-888 ml16">
            {{ item.subLabel }}
          </view>
        </view>

        <view :style="item.bodyStyle" class="container-body">
          <block v-if="item.isForShow">
            <view class="content-show" :style="item.showBodyStyle">
              <slot :item="item" :value="getShowLabel(item)" name="showbody">
                {{ getShowLabel(item) }}
              </slot>
            </view>
          </block>

          <block v-if="!item.isForShow">
            <view
              v-if="
                item.field === 'input-text' || item.field === 'input-verify'
              "
              class="flex1"
            >
              <uni-easyinput
                :placeholder="item.placeholder"
                :inputBorder="false"
                :clearable="false"
                :placeholderStyle="inputPlaceHolderStyle(item)"
                :value="maskValueItem(item)"
                :type="item.inputType"
                :maxlength="item.maxlength"
                :disabled="item.disabled"
                @input="(e) => changeInput(item, e)"
                @blur="inputBlur(item, $event)"
                :class="{
                  'my-disabled': item.disabled,
                  'my-disabled-color': item.disabled,
                }"
                autoHeight
                class="form-input"
              />

              <!-- #ifndef MP-ALIPAY -->
              <view
                v-if="
                  item.field === 'input-text' &&
                  item.inputType === 'textarea' &&
                  item.maxlength
                "
                class="warn-text-number-box"
              >
                <text class="warn-text-number f24">
                  {{
                    `${(value[item.key] && value[item.key].length) || 0}/${
                      item.maxlength
                    }`
                  }}
                </text>
              </view>
              <!-- #endif -->
            </view>

            <view
              v-if="item.field === 'select'"
              :class="{
                'my-disabled': item.disabled,
              }"
              class="full-item"
            >
              <view class="select-item">
                <uni-easyinput
                  :disabled="item.disabled"
                  :placeholder="item.placeholder"
                  :inputBorder="false"
                  :clearable="false"
                  :placeholderStyle="inputPlaceHolderStyle(item)"
                  :value="getShowLabel(item)"
                  class="form-input"
                />
              </view>
            </view>

            <view
              v-if="item.field === 'address'"
              :class="{
                'my-disabled': item.disabled,
              }"
              class="full-item"
            >
              <view class="my-disabled">
                <uni-easyinput
                  :placeholder="item.placeholder"
                  :inputBorder="false"
                  :clearable="false"
                  :placeholderStyle="inputPlaceHolderStyle(item)"
                  :value="getShowLabel(item)"
                  class="form-input"
                />
              </view>
            </view>

            <view
              v-if="item.field === 'time-picker'"
              :class="{
                'my-disabled': item.disabled,
              }"
              class="full-item"
            >
              <uni-datetime-picker
                :modelValue="value[item.key]"
                :type="item.type"
                :start="item.start"
                :end="item.end"
                :disabled="item.disabled"
                @change="changeTimePicker(item, $event)"
              >
                <view class="my-disabled">
                  <uni-easyinput
                    :placeholder="item.placeholder"
                    :inputBorder="false"
                    :clearable="false"
                    :placeholderStyle="inputPlaceHolderStyle(item)"
                    :value="value[item.key]"
                    class="form-input"
                  />
                </view>
              </uni-datetime-picker>
            </view>

            <view
              v-if="item.field === 'switch'"
              :class="{
                'my-disabled': item.disabled,
                'container-body-switch-align-left': item.align === 'left',
              }"
              class="container-body-switch"
            >
              <switch
                :checked="!!value[item.key]"
                :disabled="item.disabled"
                @change="(e: any) => changeSwitch(item, e)"
                color="var(--hr-brand-color-6)"
              >
                <text class="ml12">
                  {{
                    (item.labelFormatter &&
                      item.labelFormatter(value[item.key])) ||
                    ''
                  }}
                </text>
              </switch>
            </view>

            <view
              v-if="item.field === 'file-image'"
              :class="{
                'my-disabled': item.disabled,
              }"
              class="w-full"
            >
              <uni-file-picker
                :title="' '"
                :disabled="item.disabled"
                :del-icon="!item.disabled"
                :limit="item.imgLimit || 1"
                :auto-upload="false"
                :modelValue="value[item.key]"
                :sourceType="'album'"
                :sizeType="['compressed']"
                :image-styles="{
                  width: 80,
                  height: 80,
                  border: {
                    style: 'dashed',
                    color: '#CCCCCC',
                    radius: '8px',
                  },
                }"
                @select="imgSelect($event, item)"
                @delete="imgDelete($event, item)"
                mode="grid"
              >
                <template #default>
                  <view class="iconfont relative z-0">&#xe6c3;</view>
                </template>
              </uni-file-picker>

              <view v-if="item.placeholder" class="color-bbb mt24">
                {{ item.placeholder || '' }}
              </view>
            </view>

            <view
              v-if="item.field === 'input-verify'"
              @tap="requestVerify(item)"
              :class="{
                'form-item-verify-disabled': verifyTip || item.disabled,
                'my-disabled': verifyTip || item.disabled,
              }"
              class="verify-btn"
            >
              {{ verifyTip || item.verifyBtnText }}
            </view>

            <view
              v-if="item.ocr"
              @click="useOcrAction"
              :class="{
                'my-disabled': item.ocrDisabled,
              }"
              class="ocr"
            >
              <view class="iconfont icon-camera">&#xe6be;</view>
              <view>身份证识别</view>
            </view>
          </block>
          <slot name="suffix" :item="item" :value="getShowLabel(item)" />

          <view
            v-if="item.showSuffixArrowIcon"
            class="iconfont icon-resize icon_arrow color-888"
          >
            &#xe66b;
          </view>
        </view>
      </view>
    </view>

    <view class="form-picker">
      <uni-data-picker
        :map="{ text: 'label', value: 'value' }"
        :localdata="actionSheetOpt"
        :clear-icon="false"
        @change="pickerChange"
        ref="dataPicker"
        isHideSlot
      >
        <view />
      </uni-data-picker>
    </view>

    <uv-picker
      :columns="addressList"
      :loading="addressLoading"
      @change="_addressChange"
      @confirm="addressConfirm"
      ref="refAddressPicker"
      keyName="label"
      showToolbar
    />

    <wyb-action-sheet
      ref="actionSheet"
      :options="_actionSheetOpt"
      :showCancel="false"
      :duration="100"
      :minHeight="isShowSelectSearch ? 'calc(100vh - 200rpx)' : undefined"
      @itemclick="actionItemClick"
      title=""
    >
      <!-- @vue-expect-error -->
      <template #header>
        <view v-if="isShowSelectSearch" class="bg-white w-full">
          <view class="pr12 pt12 pl12 pb12">
            <uni-search-input
              v-model:value="searchOpt"
              type="2"
              class="bg-white"
              inputBorder
              placeholder="搜索"
            />
          </view>
        </view>
      </template>
    </wyb-action-sheet>

    <view class="form-picker">
      <uni-data-picker
        :map="{ text: 'label', value: 'value' }"
        :localdata="actionSheetOpt"
        :clear-icon="false"
        @change="pickerChange"
        isHideSlot
        ref="_actionSheet"
      >
        <view />
      </uni-data-picker>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, withDefaults, computed } from 'vue';

  import {
    TInstance,
    ISelectOptions,
    IRule,
    IInputVerifyInstance,
    ISwitchInstance,
    useAddress,
    ISelectInstance,
    IImgInstance,
  } from '@/components/g-form/index';
  import { useMessageStore } from '@/stores';
  import { cacheUtil, ServerStaticData, upImgOss, useOcr, wait } from '@/utils';
  import api from '@/service/api';

  import wybActionSheet from '@/components/wyb-action-sheet/wyb-action-sheet.vue';

  /**
   * 部分函数、正则等特殊对象在小程序无法prop传递， 请使用 setList(list)
   */

  const props = withDefaults(
    defineProps<{
      value: BaseObject;
      // 加粗内容
      bodyBold?: boolean;

      hideRowBorder?: boolean;
      // 是否展示必填的 * 号
      showRequireIcon?: boolean;
      // 使用 uni 的选择器
      selectInUniDataPicker?: boolean;
      // 使用 uni 的 toast
      warningInUni?: boolean;
    }>(),
    {
      value: () => ({}),
      bodyBold: false,
      showRequireIcon: false,
    }
  );

  const warningKeys = ref<string[]>([]);
  const messageOptions = computed(() => {
    return {
      uniToast: props.warningInUni || false,
    };
  });

  const emits = defineEmits([
    'update:value',
    'submit',
    'change',
    'picker-change',
    'input-blur',
    'select-change',
    'address-change',
    'ocr-ident',
    'row-click',
    'disabled-click',
  ]);

  const maskValueItem = (item: TInstance) => {
    const { key, inputMask } = item;

    const v = props.value[key];
    if (inputMask) {
      return inputMask(v, item);
    } else {
      return v;
    }
  };

  const inputPlaceHolderStyle = (item: TInstance) => {
    const key = item.key;
    if (warningKeys.value.includes(key)) {
      if (props.value[item.key]) {
        return `color: var(--hr-neutral-color-5);
  		font-size: var(--hr-font-size-base);`;
      } else {
        return `
        font-size: var(--hr-font-size-base);
        color: red;
        `;
      }
    } else {
      return `color: var(--hr-neutral-color-5);
  		font-size: var(--hr-font-size-base);`;
    }
  };

  const _actionSheet = ref();
  const dataPicker = ref();
  const actionSheet = ref();
  const actionSheetOpt = ref<ISelectOptions[]>([]);
  const _actionSheetOpt = computed(() => {
    const filterOptions = (clickItem.value as ISelectInstance).filterOptions;
    if (searchOpt.value && filterOptions) {
      return filterOptions(actionSheetOpt.value, searchOpt.value);
    }
    return actionSheetOpt.value;
  });

  const list = ref<TInstance[]>([]);
  const messageStore = useMessageStore();

  const verifyTip = ref<string>('');
  let cacheItem: null | TInstance = null;
  let timer: null | number = null;

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
      verifyTip.value = '';
    }
  };

  const useOcrAction = () => {
    useOcr().then((res) => {
      emits('ocr-ident', res);
    });
  };

  const { addressList, addressLoading, getAddressList, refAddressPicker } =
    useAddress();
  const _addressChange = (e) => {
    const { index, columnIndex } = e;
    const addressItem = addressList.value[columnIndex][index];

    getAddressList(addressItem);
  };
  const addressConfirm = (e) => {
    const { value } = e;
    value.map((o) => {
      o.text = o.label;
    });
    addressChange(cacheItem!, value);
  };
  const getShowLabel = (item: TInstance) => {
    if (item.field === 'select') {
      return ServerStaticData.getOptionsLabel(
        item.options,
        props.value[item.key]
      );
    }

    return props.value[item.key];
  };

  const requestVerify = async (item: IInputVerifyInstance) => {
    if (timer) {
      clearTimer();
    } else {
      const { phoneKey } = item;

      const phoneItem = list.value.find((o) => o.key === phoneKey);

      if (phoneItem) {
        const phone = props.value[phoneItem.key];
        await validatorItem(phoneItem, phone);

        uni.showLoading({
          title: '请求中...',
          mask: true,
        });

        if (item.submitVerify) {
          await item.submitVerify(phone);
        } else {
          await api.sendVerifyCode({
            patientPhone: phone,
          });
        }

        let waitTime = item.verifySecond;

        verifyTip.value = `${waitTime--}s后重新发送`;
        timer = setInterval(() => {
          verifyTip.value = `${waitTime--}s后重新发送`;

          if (waitTime <= -1) {
            clearTimer();
          }
        }, 1000) as unknown as number;
        uni.hideLoading();
      } else {
        messageStore.showMessage(
          '请检查 短信对应 phone 字段是否存在',
          3000,
          messageOptions.value
        );
      }
    }
  };

  const setList = async function (initList: TInstance[]) {
    // #ifdef MP-TOUTIAO
    await wait(80);
    // #endif

    const defaultKeys = Reflect.ownKeys(props.value);
    const cache: BaseObject = {};

    const len = initList.length >>> 0;
    let k = 0;

    while (k < len) {
      const o = initList[k++];
      const { key, field } = o;
      if (!defaultKeys.includes(key)) {
        if (field === 'switch') {
          cache[key] = false;
        } else {
          cache[key] = '';
        }
      }

      if (field === 'address' && !o.options) {
        // o.options = await ServerStaticData.getAddressData();
        getAddressList();
      }

      if (field === 'select') {
        const { autoOptions, options } = o;

        if (!options.length && autoOptions) {
          switch (autoOptions) {
            case 'nationTerms':
              o.options = await ServerStaticData.getNationTerms();
              break;

            case 'patientTypeTerms':
              o.options = await ServerStaticData.getPatientTypeTerms();
              break;

            case 'idTypeTerms':
              o.options = await ServerStaticData.getIdTypeTerms();
              break;

            case 'countries':
              o.options = await ServerStaticData.getCountryList();
              break;

            default:
              const r = await cacheUtil.getSystemConfig(autoOptions)();
              if (r[autoOptions]) {
                o.options = r[autoOptions];
              } else {
                console.error(
                  'g-form: autoOptions 获取数据失败---',
                  autoOptions
                );
              }

              break;
          }
        }
      }
    }

    setData(cache);
    list.value = initList;
  };

  const clickItem = ref({
    filterOptions: '' as any,
  } as TInstance);
  const isShowSelectSearch = ref(false);
  const searchOpt = ref('');
  const clickContainer = function (item: TInstance) {
    if (item.disabled) {
      emits('disabled-click', item);
      return;
    }

    emits('row-click', { item });
    clickItem.value = item;
    isShowSelectSearch.value = !!(item as any).filterOptions;
    if (item.field === 'select' || item.field === 'address') {
      const { options } = item;
      cacheItem = item;

      if (item.field === 'address') {
        // dataPicker.value.show();
        refAddressPicker.value.open();
        return;
      }

      if (!options) {
        return;
      }

      actionSheetOpt.value = options;

      if (item.field === 'select') {
        searchOpt.value = '';
        clickItem.value = item;
        if (props.selectInUniDataPicker) {
          _actionSheet.value.show();
        } else {
          actionSheet.value.showActionSheet();
        }
      }
    }
  };

  const actionItemClick = function ({ item }: { item: ISelectOptions }) {
    if (!cacheItem) return;
    const { value } = item;

    clearItemWarning(cacheItem.key);

    emits('select-change', {
      item: { ...cacheItem },
      value,
    });

    if (cacheItem.field === 'select') {
      changeSelect(cacheItem, value);
      cacheItem = null;
    }
  };

  const imgSelect = async (e, item: IImgInstance) => {
    const { tempFiles } = e;
    const { key } = item;
    const waitList: any[] = [];

    tempFiles.map((o) => {
      waitList.push(
        upImgOss(o.path, {
          data: {
            functionType: 'WJ',
          },
        })
      );
    });

    uni.showLoading({
      title: '上传图片中',
      mask: true,
    });

    const fRes = await Promise.all(waitList).finally(() => {
      uni.hideLoading();
    });

    tempFiles.map((fileItem, i) => {
      // 一次只一张
      fileItem.url = fRes[i].url;
      fileItem.progress = 100;
      fileItem._isUpLoad = true;
    });

    setData({
      [key]: [...(props.value[key] || []), ...tempFiles],
    });
  };

  const imgDelete = (e, item: IImgInstance) => {
    const { key } = item;
    const { tempFile } = e;
    const oldValue = props.value[key] || [];
    const newValue = oldValue.filter((o) => o.uuid !== tempFile.uuid);

    setData({
      [key]: newValue,
    });
  };

  const pickerChange = function (e: {
    detail: { value: { text: string; value: any }[] };
  }) {
    if (!cacheItem) return;
    const { value: choose } = e.detail;
    const { key, field } = cacheItem;

    clearItemWarning(key);
    if (field === 'address') {
      addressChange(cacheItem, choose);
    } else if (field === 'select') {
      actionItemClick({
        item: choose[0] as any,
      });
    } else {
      emits('picker-change', {
        item: cacheItem,
        value: choose,
      });
    }
  };

  const addressChange = async (item: TInstance, v) => {
    const { key, field } = item;

    clearItemWarning(key);
    if (field === 'address') {
      const selLabels = v.map((o) => o.text).join('');
      setData({
        [key]: selLabels,
      });

      emits('address-change', {
        item: item,
        value: v,
      });
    }
  };

  const clearItemWarning = (key: string) => {
    if (warningKeys.value.length) {
      const idx = warningKeys.value.findIndex((o) => o === key);

      if (idx !== -1) {
        warningKeys.value.splice(idx, 1);
      }
    }
  };

  const clearWarning = () => {
    warningKeys.value = [];
  };

  const setData = function (value: BaseObject, item?: TInstance) {
    const oldValue = item ? props.value[item.key] : undefined;

    emits('update:value', {
      ...props.value,
      ...value,
    });

    if (item) {
      const key = Object.keys(value)[0];

      clearItemWarning(key);

      emits('change', {
        item,
        value: value[key],
        oldValue,
      });
    }
  };

  const ruleMatch = (rule: IRule | IRule[], value: string, item: TInstance) => {
    const matchValue = (r: IRule) => {
      const _rule = r.rule;
      const _r = value.match(_rule);

      if (_r) {
        const [_matchValue] = _r;
        return _matchValue === value;
      } else {
        return false;
      }
    };

    if (Array.isArray(rule)) {
      rule.map((o) => {
        const flag = matchValue(o);
        if (!flag) {
          messageStore.showMessage(o.message, 3000, messageOptions.value);
          const key = item.key;

          if (!warningKeys.value.includes(key)) {
            warningKeys.value.push(key);
          }
          throw new Error(item.label + ': 校验失败(rule)');
        }
      });
    } else {
      const flag = matchValue(rule);
      if (!flag) {
        messageStore.showMessage(rule.message, 3000, messageOptions.value);
        const key = item.key;

        if (!warningKeys.value.includes(key)) {
          warningKeys.value.push(key);
        }
        throw new Error(item.label + ': 校验失败(rule)');
      }
    }
  };

  const validatorItem = async (item: TInstance, v: any) => {
    const { rule, key, required, emptyMessage, validator } = item;
    let isFillValue: boolean;
    if (Array.isArray(v)) {
      isFillValue = !!v.length;
    } else {
      isFillValue = !!(v || v === 0);
    }

    if (required && !isFillValue) {
      const defaultEmptyMessage = item.label + ' 不能为空';
      messageStore.showMessage(
        emptyMessage || defaultEmptyMessage,
        3000,
        messageOptions.value
      );

      if (!warningKeys.value.includes(key)) {
        warningKeys.value.push(key);
      }
      throw new Error(item.label + ': 校验失败(empty)');
    }

    if (rule && isFillValue) {
      ruleMatch(rule, v, item);
    }

    if (validator) {
      const { success, message } = await validator(v, item);

      if (!success) {
        messageStore.showMessage(message, 3000, messageOptions.value);
        if (!warningKeys.value.includes(key)) {
          warningKeys.value.push(key);
        }
        throw new Error(item.label + ': 校验失败(validator)');
      }
    }
  };

  const submit = async function () {
    const data = props.value;
    const len = list.value.length >>> 0;
    let k = 0;

    while (k < len) {
      const item = list.value[k++];

      await validatorItem(item, data[item.key]);
    }

    const tramData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        let v = value;
        if (typeof v === 'string') {
          v = v.trim();
        }
        return [key, v];
      })
    );

    emits('submit', {
      data: tramData,
    });
  };

  const changeInput = (item: TInstance, v: string) => {
    // 微信有bug 需要判断下
    if (typeof v === 'string') {
      setData(
        {
          [item.key]: v,
        },
        item
      );
    }
  };

  const inputBlur = (item: TInstance, e) => {
    const {
      detail: { value },
    } = e;

    emits('input-blur', {
      item,
      value,
    });

    changeInput(item, value);
  };

  const changeSelect = function (item: TInstance, v: any) {
    if (item.field !== 'select') return;

    setData(
      {
        [item.key]: v,
      },
      item
    );
  };

  const changeTimePicker = function (item: TInstance, v: any) {
    const value = typeof v == 'string' ? v : v.join(' - ');

    setData(
      {
        [item.key]: value,
      },
      item
    );
  };

  const changeSwitch = function (item: ISwitchInstance, { detail }) {
    setData(
      {
        [item.key]: detail.value,
      },
      item
    );
  };

  defineExpose({
    setList,
    submit,
    clearWarning,
    clearItemWarning,
    clearTimer,
  });
</script>

<style lang="scss" scoped>
  @import './css';
</style>
