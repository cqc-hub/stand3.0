<template>
  <view class="">
    <view v-if="list.length" class="container">
      <view
        v-for="item in list"
        :key="item.key"
        :class="{
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
            'item-require': item.required && showRequireIcon,
          }"
          class="label"
          :style="item.labelStyle"
        >
          {{ item.label }}
        </view>

        <view :style="item.bodyStyle" class="container-body">
          <block v-if="item.isForShow">
            <view class="content-show" :style="item.showBodyStyle">
              <slot
                :item="item"
                :value="
                  item.field === 'select'
                    ? ServerStaticData.getOptionsLabel(
                        item.options,
                        value[item.key]
                      )
                    : value[item.key]
                "
                name="showBody"
              >
                {{
                  item.field === 'select'
                    ? ServerStaticData.getOptionsLabel(
                        item.options,
                        value[item.key]
                      )
                    : value[item.key]
                }}
              </slot>
            </view>
          </block>

          <block v-else>
            <uni-easyinput
              v-if="
                item.field === 'input-text' || item.field === 'input-verify'
              "
              :placeholder="item.placeholder"
              :inputBorder="false"
              :clearable="false"
              :placeholderStyle="inputPlaceHolderStyle(item)"
              :value="value[item.key]"
              :type="item.inputType"
              :maxlength="item.maxlength"
              :disabled="item.disabled"
              @input="(e) => changeInput(item, e)"
              @blur="inputBlur(item, $event)"
              :class="{
                'my-disabled': item.disabled,
                'my-disabled-color': item.disabled,
              }"
              class="form-input"
            />

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
                  :value="
                    ServerStaticData.getOptionsLabel(
                      item.options,
                      value[item.key]
                    )
                  "
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
                  :value="value[item.key]"
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
              }"
              class="container-body-switch"
            >
              <switch
                :checked="!!value[item.key]"
                :disabled="item.disabled"
                @change="(e: any) => changeSwitch(item, e)"
                color="var(--hr-brand-color-6)"
              />
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
          <slot name="suffix" :item="item" />

          <view
            v-if="item.showSuffixArrowIcon"
            class="iconfont icon-resize icon_arrow"
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
      >
        <view />
      </uni-data-picker>
    </view>

    <wyb-action-sheet
      ref="actionSheet"
      :options="actionSheetOpt"
      :showCancel="false"
      :duration="100"
      @itemclick="actionItemClick"
      title=""
    />

    <view class="form-picker">
      <uni-data-picker
        :map="{ text: 'label', value: 'value' }"
        :localdata="actionSheetOpt"
        :clear-icon="false"
        @change="pickerChange"
        ref="_actionSheet"
      >
        <view />
      </uni-data-picker>
    </view>
  </view>
</template>

<script lang="ts" setup>
  import { ref, withDefaults, computed } from 'vue';
  import type {
    TInstance,
    ISelectOptions,
    IRule,
    IInputVerifyInstance,
    ISwitchInstance,
  } from '@/components/g-form/index';
  import wybActionSheet from '@/components/wyb-action-sheet/wyb-action-sheet.vue';
  import { useMessageStore } from '@/stores';
  import { ServerStaticData, useOcr } from '@/utils';
  import api from '@/service/api';

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
  ]);

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
  const list = ref<TInstance[]>([]);
  const messageStore = useMessageStore();

  const verifyTip = ref<string>('');
  let cacheItem: null | TInstance = null;
  let timer: null | number = null;
  const wait = (n: number) => new Promise((r) => setTimeout(r, n));

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

        await api.sendVerifyCode({
          patientPhone: phone,
        });

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
        o.options = await ServerStaticData.getAddressData();
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

            case 'sysTerms':
              o.options = await ServerStaticData.getSystemTerms();
              break;

            case 'idTypeTerms':
              o.options = await ServerStaticData.getIdTypeTerms();
              break;

            default:
              break;
          }
        }
      }
    }

    setData(cache);
    list.value = initList;
  };

  const clickContainer = function (item: TInstance) {
    if (item.disabled) {
      return;
    }

    emits('row-click', { item });
    if (item.field === 'select' || item.field === 'address') {
      const { options } = item;

      if (!options) {
        return;
      }

      actionSheetOpt.value = options;
      cacheItem = item;

      if (item.field === 'select') {
        if (props.selectInUniDataPicker) {
          _actionSheet.value.show();
        } else {
          actionSheet.value.showActionSheet();
        }
      }

      if (item.field === 'address') {
        dataPicker.value.show();
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

  const pickerChange = function (e: {
    detail: { value: { text: string; value: any }[] };
  }) {
    if (!cacheItem) return;
    const { value: choose } = e.detail;
    const { key, field } = cacheItem;

    clearItemWarning(cacheItem.key);
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

  const addressChange = (item: TInstance, v) => {
    const { key, field } = item;

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
    const isFillValue = !!(v || v === 0);

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

    emits('submit', {
      data,
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
  });
</script>

<style lang="scss" scoped>
  @import './css';
</style>
