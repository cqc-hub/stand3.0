<template>
  <div class="">
    <view
      :class="{
        'my-hide': !count,
        ['animate__fadeIn bg-mask']: visible,
        ['animate__fadeOut my-disabled']: !visible && count,
      }"
       class="animate__animated wrap-form"
    >
      <view
        :class="{
          ['animate__fadeInDown']: visible,
          animate__fadeOutUp: !visible && count,
        }"
        @click="cancel"
        class="animate__animated g-page"
      >
        <view class="g-container">
          <view @click.stop="() => {}" class="m32 p12 pt32 bg-white rounded">
            <g-form
              v-model:value="formData"
              @submit="formSubmit"
              @change="formChange"
              bodyBold
              ref="gform"
            />

            <view class="mt40">
              <g-flag
                :typeFg="formData.patientType === '-1' ? '1215' : '1216'"
                isShowFgTip
              />
            </view>

            <view class="flex p32">
              <button
                @click="cancel"
                class="btn btn-normal btn-border flex-1 mr24"
              >
                取消
              </button>
              <button @click="gform.submit" class="btn btn-primary flex-2">
                确定
              </button>
            </view>
          </view>
        </view>
      </view>
    </view>
  </div>
</template>

<script lang="ts" setup>
  import { TInstance } from '@/components/g-form';
  import { idValidator, ServerStaticData, wait } from '@/utils';
  import dayjs from 'dayjs';
  import { ref, watch } from 'vue';

  const props = defineProps<{
    visible: boolean;
  }>();
  const emits = defineEmits(['update:visible', 'submit', 'cancel']);
  const count = ref(0);

  const gform = ref<any>('');
  const formData = ref<BaseObject>({});
  const formChange = async ({ item, value, oldValue }) => {
    if (oldValue !== value) {
      if (['idType', 'patientType'].includes(item.key)) {
        formData.value['idType'] = '';
        formData.value['idCard'] = '';
        formData.value['sex'] = '';
        formData.value['birthday'] = '';
        await wait(0);
        medicalTypeChange(formData.value['patientType']);
      }
    }
  };

  const formSubmit = async () => {
    emits('submit', {
      ...formData.value,
    });
  };

  const init = async () => {
    formData.value = {
      patientType: '-1',
      idType: '01',
    };

    medicalTypeChange('-1');
  };

  /**
   *
   * @param value
   * 	-1  成人、儿童（有证件）
   * 	0  新生儿（无证件)
   *  1  军人
   *  2  军属
   */
  let oldFormList: any[] = [];
  const medicalTypeChange = async (value: '-1' | '0' | '1' | '2') => {
    const personConfig = await await ServerStaticData.getSystemConfig('person');
    const { isGuardianWithIdCard, ageChildren } = personConfig;

    const list: TInstance[] = [
      {
        required: true,
        showSuffixArrowIcon: true,
        label: '就诊人类型',
        placeholder: '请选择',
        key: 'patientType',
        field: 'select',
        options: [],
        autoOptions: 'patientTypeTerms',
        labelWidth: '220rpx',
      },

      {
        required: true,
        label: '真实姓名',
        field: 'input-text',
        placeholder: '请输入',
        key: 'patientName',
        labelWidth: '220rpx',
        maxlength: 50,
        validator(value) {
          const v = <string>value;

          if (v) {
            if (v.length < 2) {
              return Promise.resolve({
                success: false,
                message: '真实姓名需要大于2个字符',
              });
            }
            const isEng = v.match(/^[A-Za-z]+\s?[A-Za-z]+$/);

            if (isEng) {
              return Promise.resolve({
                success: true,
              });
            } else {
              // const result = v.match(
              //   /^[\u4e00-\u9fa5]{1,10}\.?\·?[\u4e00-\u9fa5]{1,10}$/
              // );

              // if (!result) {
              //   return Promise.resolve({
              //     success: false,
              //     message: '中文名字不能大于 20 个字符',
              //   });
              // }

              if (v.length > 50) {
                return Promise.resolve({
                  success: false,
                  message: '真实姓名不能大于 50 个字符 ',
                });
              }
            }
          }

          return Promise.resolve({
            success: true,
          });
        },
      },
      {
        required: true,
        showSuffixArrowIcon: true,
        label: '性别',
        placeholder: '请选择',
        key: 'sex',
        field: 'select',
        options: [
          {
            label: '男',
            value: '男',
          },
          {
            label: '女',
            value: '女',
          },
        ],
        labelWidth: '220rpx',
      },
      {
        required: true,
        showSuffixArrowIcon: true,
        label: '出生日期',
        placeholder: '请选择',
        key: 'birthday',
        field: 'time-picker',
        type: 'date',
        end: new Date().getTime(),
        start: '1900-01-01',
        labelWidth: '220rpx',
        async validator(date: string) {
          if (formData.value.patientType === '0') {
            const monthAgeAgo = dayjs()
              .subtract(ageChildren, 'month')
              .format('YYYY-MM-DD');

            if (
              monthAgeAgo !== date &&
              dayjs(date).isBefore(dayjs(monthAgeAgo))
            ) {
              return Promise.resolve({
                success: false,
                message: '新生儿年龄不能大于' + ageChildren + '个月',
              });
            }
          }

          return {
            success: true,
          };
        },
      },
      {
        required: true,
        showSuffixArrowIcon: true,
        label: '证件类型',
        placeholder: '请选择',
        key: 'idType',
        field: 'select',
        options: [],
        autoOptions: 'idTypeTerms',
        labelWidth: '220rpx',
      },
      {
        required: true,
        label: '证件号码',
        field: 'input-text',
        placeholder: '请输入',
        key: 'idCard',
        labelWidth: '220rpx',
      },

      {
        required: true,
        label: '联系电话',
        field: 'input-text',
        placeholder: '请输入',
        maxlength: 11,
        key: 'patientPhone',
        rule: [
          {
            message: '请确认联系电话是否有误',
            rule: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
          },
        ],
        labelWidth: '220rpx',
      },

      {
        required: true,
        maxlength: 6,
        label: '验证码',
        field: 'input-verify',
        placeholder: '请输入',
        key: 'verifyCode',
        verifyBtnText: '获取验证码',
        inputType: 'number',
        verifySecond: 60,
        rule: {
          message: '验证码必须是数字',
          rule: /\d+/,
        },
        phoneKey: 'patientPhone',
        labelWidth: '220rpx',
      },
    ];

    const listArr: string[] = ['patientType'];
    const _sexAndBirth = ['sex', 'birthday'];
    const _patientInfo: string[] = ['patientPhone', 'verifyCode'];

    switch (value) {
      case '-1':
        let lessThenSix: boolean = false;

        // 证件类型： 身份证
        if (formData.value['idType'] === '01') {
          // const idCard = formData.value['idCard'];
          const idCardItem = list.find((o) => o.key === 'idCard')!;
          idCardItem.validator = (v) => {
            const value = v as string;
            let isErr = false;
            if (formData.value['idType'] === '01') {
              if (!idValidator.checkIdCardNo(value)) {
                isErr = true;
              }
            }

            if (isErr) {
              return Promise.resolve({
                success: false,
                message: '请确认证件号码是否有误',
              });
            } else {
              return Promise.resolve({
                success: true,
              });
            }
          };

          // 有身份证不需要填写 生日、性别
          _sexAndBirth.length = 0;

          // if (idCard && idValidator.checkIdCardNo(idCard)) {
          //   const cardInfo = idValidator.getIdCardInfo(idCard);

          //   if (
          //     isGuardianWithIdCard &&
          //     cardInfo.age <= isGuardianWithIdCard * 1
          //   ) {
          //     lessThenSix = true;
          //   }
          // }
        }

        listArr.push(
          ...[
            'patientName',
            ..._sexAndBirth,
            'idType',
            'idCard',
            ..._patientInfo,
          ]
        );

        break;

      case '0':
        listArr.push(...['patientName', ..._sexAndBirth, ..._patientInfo]);
        break;
    }

    const completeFormList = listArr.join(',');
    if (completeFormList === oldFormList.join(',')) {
      return;
    } else {
      oldFormList = [...listArr];
    }

    await wait(0);
    gform.value.setList(list.filter((o) => oldFormList.includes(o.key)));
  };

  const cancel = () => {
    emits('update:visible', false);
    emits('cancel');
  };

  watch(
    () => props.visible,
    (v) => {
      if (v) {
        if (!count.value) {
          init();
          count.value++;
        }
      }
    }
  );
</script>

<style lang="scss" scoped>
  .wrap-form {
    position: absolute;
    z-index: 1;
    top: 0;
    width: 100vw;
    height: 100vh;

    animation-duration: 0.4s; /* don't forget to set a duration! */
  }

  .bg-mask {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
