<template>
  <view class="g-page">
    <scroll-view class="g-container" scroll-y>
      <image
        :src="$global.BASE_IMG + 'v3_doctor_card_top.png'"
        mode="widthFix"
        class="header-bg my-disabled"
      />
      <view class="content">
        <view class="header-box">
          <view class="content-box header-content-box g-border">
            <view class="header-transform">
              <view class="header mb16 flex-between">
                <image
                  :src="headerBg"
                  @click="previewImg"
                  mode="aspectFill"
                  class="doc-avatar g-border"
                />

                <view class="flex-normal header-btn">
                  <g-login @handler-next="collectDoc">
                    <button
                      @click="collectDoc"
                      class="btn btn-warning btn-round btn-size-small"
                    >
                      <text class="iconfont f36 mr12">
                        {{
                          docDetail.collectState == '2'
                            ? '&#xe6ff;'
                            : '&#xe700;'
                        }}
                      </text>
                      <text class="text-no-wrap">
                        {{ docDetail.collectState == '2' ? '已关注' : '关注' }}
                      </text>
                    </button>
                  </g-login>

                  <button
                    @click="refDocShare.show"
                    class="btn btn-warning btn-round btn-size-small share-btn color-blue"
                  >
                    <text class="iconfont f36 mr12">&#xe6e0;</text>
                    <text>分享</text>
                  </button>
                </view>
              </view>

              <view class="p32c header-content">
                <view class="flex-normal">
                  <view class="doc-name mr24 f48 g-bold">
                    {{ docDetail.docName }}
                  </view>

                  <view class="color-444 f28 g-split-line mr12 pr12">
                    {{ docDetail.docTitleName }}
                  </view>
                  <view class="color-444 f28">
                    {{ docDetail.docJobName }}
                  </view>
                </view>

                <view class="flex-normal">
                  <view
                    :class="{
                      'g-split-line': docDetail.deptName,
                    }"
                    class="color-444 f28 g-split-line mr12 pr12"
                  >
                    {{ $global.systemInfo.name }}
                  </view>
                  <view class="color-444 f28">
                    {{ docDetail.deptName }}
                  </view>
                </view>
              </view>

              <view class="flex-normal p32c doc-goodat">
                <image
                  v-if="docDetail.goodAt"
                  :src="$global.BASE_IMG + 'v3_doctor_card_major.png'"
                  class="doc-major-goodat mr12"
                  mode="widthFix"
                />

                <view class="color-666 f28 doc-goodat-content text-ellipsis">
                  <text v-if="docDetail.goodAt">{{ docDetail.goodAt }}</text>

                  <view
                    v-if="
                      docDetail.goodAt ||
                      docDetail.intro ||
                      docDetail.academicAchievements
                    "
                    @click="regDialogConfirm.show"
                    class="doc-show-intro f26 color-blue"
                  >
                    <text>查看简介</text>
                    <text class="iconfont">&#xe66b;</text>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="f36 g-bold mb16">门诊排班</view>
        <view class="content-box content-box-sch">
          <view class="content-sel-date mb16">
            <Order-Sel-Date
              :value="checkedDay"
              :choose-days="chooseDays"
              :enable-days="chooseDaysEnabled"
              @change="dateChange"
            />
          </view>

          <block v-if="Object.keys(schToday.schByHos).length">
            <view v-if="isShowHosNet">
              <text class="label-mark">
                <text class="color-fff f28 label-mark-content">到院就诊</text>
              </text>
            </view>

            <view
              v-for="_hosId in Object.keys(schToday.schByHos)"
              :key="_hosId"
              class="p32c mt12"
            >
              <view
                v-for="(item, idx) in schToday.schByHos[_hosId]"
                :key="item.schId"
              >
                <view v-if="!idx" class="f36 g-bold mb16">
                  {{ item.hosName }}
                </view>

                <view
                  :class="{
                    mb32: idx === schToday.schByHos[_hosId].length - 1,
                  }"
                  class="sch-item mb8 animate__animated animate__fadeIn"
                >
                  <Doc-Sch-Item :item="item" @reg-click="regClick" />
                </view>
              </view>
            </view>
          </block>

          <block v-if="Object.keys(schToday.schByNetHos).length">
            <view class="animate__animated animate__fadeIn">
              <view>
                <text class="label-mark mb8">
                  <text class="color-fff f28 label-mark-content">网络就诊</text>
                </text>
              </view>

              <view
                v-for="_hosId in Object.keys(schToday.schByNetHos)"
                :key="_hosId"
                class="p32c mt12"
              >
                <view
                  v-for="(item, idx) in schToday.schByNetHos[_hosId]"
                  :key="item.schId"
                >
                  <view v-if="!idx" class="f36 g-bold mb16">
                    {{ item.hosName }}
                  </view>

                  <view
                    :class="{
                      mb32: idx === schToday.schByHos[_hosId].length - 1,
                    }"
                    class="sch-item mb8"
                  >
                    <Doc-Sch-Item :item="item" @reg-click="regClick" />
                  </view>
                </view>
              </view>
            </view>
          </block>

          <!-- <view class="p32c mt12">
            <view class="f36 g-bold mb16">庆春院区</view>
          </view> -->
        </view>
      </view>

      <Order-Reg-Confirm title="医生简介" isHideFooter ref="regDialogConfirm">
        <Doc-Details :detail="docDetail" />
      </Order-Reg-Confirm>
    </scroll-view>
    <Doc-Share :pageProp="props" :detail="docDetail" ref="refDocShare" />

    <Order-Select-Source
      v-model:show="isSelectOrderSourceShow"
      v-model:selectSchInfos="selectSchInfos"
      v-model:value="selectOrderSourceNumId"
      :isComplete="isComplete"
      :orderSourceList="orderSourceList"
      :column="orderConfig.selOrderColumn"
      :is-blur="orderConfig.isOrderBlur"
      @item-click="orderSourceChoose"
      @am-change="amChange"
      ref="selectOrderSource"
    />
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';

  import { useOrder, IChooseDays, TSchInfo } from './utils';

  import {
    UseDoctorDetail,
    type IProps,
    type IDocDetail,
    type IDocSchListItem,
  } from './utils/DoctorDetails';
  import { deQueryForUrl, joinQuery } from '@/common';
  import { previewImage, GStores } from '@/utils';

  import OrderSelDate from './components/orderSelDate/orderSelDate.vue';
  import OrderRegConfirm from '@/components/orderRegConfirm/orderRegConfirm.vue';
  import DocDetails from './components/DoctorDetails/docDetails.vue';
  import DocShare from './components/DoctorDetails/docShare.vue';
  import DocSchItem from './components/DoctorDetails/docShcItem.vue';
  import OrderSelectSource from './components/orderSelectSource/orderSelectSource.vue';

  import api from '@/service/api';

  // api.getDocSch = () =>
  //   Promise.resolve({
  //     result: [
  //       {
  //         schDate: '2022-11-07',
  //         schDateList: [
  //           {
  //             deptName: '眼科',
  //             goodAt:
  //               '擅长于泪器疾病，白内障，青光眼，眼外伤，角膜病等眼前节疾病及部分眼科疑难杂症的诊断及治疗。',
  //             ampm: '2',
  //             hosDeptId: '10206000',
  //             fee: '12.00',
  //             ampmName: '下午',
  //             docPhoto:
  //               'http://eheren-dev.oss-cn-hangzhou.aliyuncs.com/hr-hos-mg/100104420210357.jpg',
  //             schDate: '2022-11-07',
  //             schId: '20200605000000000045',
  //             docName: '林优',
  //             categorName: '普通',
  //             numHadReg: '0',
  //             intro:
  //               '医学硕士，毕业于陕西中医药大学。主攻专业：眼科疾病的基础与临床研究。',
  //             numRemain: '39',
  //             hosName: '台州市第一人民医院',
  //             docJobName: '院长',
  //             hosId: '1279',
  //             empNo: '',
  //             showNo: '1',
  //             schState: '0',
  //             numCount: '39',
  //             categor: '2',
  //             clinicalType: '1',
  //             hosDocId: '0000003060',
  //             docTitleName: '医师',
  //             schQukCategor: '眼科林优[普]',
  //           },
  //           {
  //             deptName: '眼科',
  //             goodAt:
  //               '擅长于泪器疾病，白内障，青光眼，眼外伤，角膜病等眼前节疾病及部分眼科疑难杂症的诊断及治疗。',
  //             ampm: '2',
  //             hosDeptId: '10206000',
  //             fee: '12.00',
  //             ampmName: '下午',
  //             docPhoto:
  //               'http://eheren-dev.oss-cn-hangzhou.aliyuncs.com/hr-hos-mg/100104420210357.jpg',
  //             schDate: '2022-11-07',
  //             schId: '20200605000000000045',
  //             docName: '林优',
  //             categorName: '普通',
  //             clinicalType: '1',
  //             numHadReg: '0',
  //             intro:
  //               '医学硕士，毕业于陕西中医药大学。主攻专业：眼科疾病的基础与临床研究。',
  //             numRemain: '39',
  //             hosName: '台州市第二人民医院',
  //             docJobName: '院长',
  //             hosId: '1280',
  //             empNo: '',
  //             showNo: '1',
  //             schState: '0',
  //             numCount: '39',
  //             categor: '2',
  //             hosDocId: '0000003060',
  //             docTitleName: '医师',
  //             schQukCategor: '眼科林优[普]',
  //           },
  //           {
  //             deptName: '眼科',
  //             goodAt:
  //               '擅长于泪器疾病，白内障，青光眼，眼外伤，角膜病等眼前节疾病及部分眼科疑难杂症的诊断及治疗。',
  //             ampm: '2',
  //             hosDeptId: '10206000',
  //             fee: '12.00',
  //             ampmName: '下午',
  //             docPhoto:
  //               'http://eheren-dev.oss-cn-hangzhou.aliyuncs.com/hr-hos-mg/100104420210357.jpg',
  //             schDate: '2022-11-07',
  //             schId: '20200605000000000045',
  //             docName: '林优',
  //             categorName: '普通',
  //             clinicalType: '1',
  //             numHadReg: '0',
  //             intro:
  //               '医学硕士，毕业于陕西中医药大学。主攻专业：眼科疾病的基础与临床研究。',
  //             numRemain: '39',
  //             hosName: '台州市第三人民医院',
  //             docJobName: '院长',
  //             hosId: '1281',
  //             empNo: '',
  //             showNo: '1',
  //             schState: '0',
  //             numCount: '39',
  //             categor: '2',
  //             hosDocId: '0000003060',
  //             docTitleName: '医师',
  //             schQukCategor: '眼科林优[普]',
  //           },
  //         ],
  //       },
  //       {
  //         schDate: '2022-11-09',
  //         schDateList: [
  //           {
  //             deptName: '眼科',
  //             goodAt:
  //               '擅长于泪器疾病，白内障，青光眼，眼外伤，角膜病等眼前节疾病及部分眼科疑难杂症的诊断及治疗。',
  //             ampm: '2',
  //             hosDeptId: '10206000',
  //             fee: '12.00',
  //             ampmName: '下午',
  //             docPhoto:
  //               'http://eheren-dev.oss-cn-hangzhou.aliyuncs.com/hr-hos-mg/100104420210357.jpg',
  //             schDate: '2022-11-09',
  //             schId: '20200605000000000045',
  //             docName: '林优',
  //             categorName: '普通',
  //             numHadReg: '0',
  //             intro:
  //               '医学硕士，毕业于陕西中医药大学。主攻专业：眼科疾病的基础与临床研究。',
  //             numRemain: '40',
  //             hosName: '台州市第一人民医院',
  //             docJobName: '院长',
  //             hosId: '1279',
  //             empNo: '',
  //             showNo: '1',
  //             schState: '0',
  //             numCount: '40',
  //             categor: '2',
  //             hosDocId: '0000003060',
  //             docTitleName: '医师',
  //             clinicalType: '4',
  //             schQukCategor: '眼科林优[普]',
  //           },
  //           {
  //             deptName: '眼科',
  //             goodAt:
  //               '擅长于泪器疾病，白内障，青光眼，眼外伤，角膜病等眼前节疾病及部分眼科疑难杂症的诊断及治疗。',
  //             ampm: '2',
  //             hosDeptId: '10206000',
  //             fee: '12.00',
  //             ampmName: '下午',
  //             docPhoto:
  //               'http://eheren-dev.oss-cn-hangzhou.aliyuncs.com/hr-hos-mg/100104420210357.jpg',
  //             schDate: '2022-11-07',
  //             schId: '20200605000000000045',
  //             docName: '林优',
  //             categorName: '普通',
  //             numHadReg: '0',
  //             intro:
  //               '医学硕士，毕业于陕西中医药大学。主攻专业：眼科疾病的基础与临床研究。',
  //             numRemain: '39',
  //             hosName: '台州市第三人民医院',
  //             docJobName: '院长',
  //             hosId: '1281',
  //             empNo: '',
  //             showNo: '1',
  //             schState: '0',
  //             numCount: '39',
  //             categor: '2',
  //             hosDocId: '0000003060',
  //             docTitleName: '医师',
  //             clinicalType: '4',
  //             schQukCategor: '眼科林优[普]',
  //           },
  //           {
  //             deptName: '眼科',
  //             goodAt:
  //               '擅长于泪器疾病，白内障，青光眼，眼外伤，角膜病等眼前节疾病及部分眼科疑难杂症的诊断及治疗。',
  //             ampm: '2',
  //             hosDeptId: '10206000',
  //             fee: '12.00',
  //             ampmName: '下午',
  //             docPhoto:
  //               'http://eheren-dev.oss-cn-hangzhou.aliyuncs.com/hr-hos-mg/100104420210357.jpg',
  //             schDate: '2022-11-07',
  //             schId: '20200605000000000045',
  //             docName: '林优',
  //             categorName: '普通',
  //             numHadReg: '0',
  //             intro:
  //               '医学硕士，毕业于陕西中医药大学。主攻专业：眼科疾病的基础与临床研究。',
  //             numRemain: '39',
  //             hosName: '台州市第一人民医院',
  //             docJobName: '院长',
  //             hosId: '1279',
  //             empNo: '',
  //             showNo: '1',
  //             schState: '0',
  //             numCount: '39',
  //             categor: '2',
  //             clinicalType: '1',
  //             hosDocId: '0000003060',
  //             docTitleName: '医师',
  //             schQukCategor: '眼科林优[普]',
  //           },
  //           {
  //             deptName: '眼科',
  //             goodAt:
  //               '擅长于泪器疾病，白内障，青光眼，眼外伤，角膜病等眼前节疾病及部分眼科疑难杂症的诊断及治疗。',
  //             ampm: '2',
  //             hosDeptId: '10206000',
  //             fee: '12.00',
  //             ampmName: '下午',
  //             docPhoto:
  //               'http://eheren-dev.oss-cn-hangzhou.aliyuncs.com/hr-hos-mg/100104420210357.jpg',
  //             schDate: '2022-11-07',
  //             schId: '20200605000000000045',
  //             docName: '林优',
  //             categorName: '普通',
  //             clinicalType: '1',
  //             numHadReg: '0',
  //             intro:
  //               '医学硕士，毕业于陕西中医药大学。主攻专业：眼科疾病的基础与临床研究。',
  //             numRemain: '39',
  //             hosName: '台州市第二人民医院',
  //             docJobName: '院长',
  //             hosId: '1280',
  //             empNo: '',
  //             showNo: '1',
  //             schState: '0',
  //             numCount: '39',
  //             categor: '2',
  //             hosDocId: '0000003060',
  //             docTitleName: '医师',
  //             schQukCategor: '眼科林优[普]',
  //           },
  //           {
  //             deptName: '眼科',
  //             goodAt:
  //               '擅长于泪器疾病，白内障，青光眼，眼外伤，角膜病等眼前节疾病及部分眼科疑难杂症的诊断及治疗。',
  //             ampm: '2',
  //             hosDeptId: '10206000',
  //             fee: '12.00',
  //             ampmName: '下午',
  //             docPhoto:
  //               'http://eheren-dev.oss-cn-hangzhou.aliyuncs.com/hr-hos-mg/100104420210357.jpg',
  //             schDate: '2022-11-07',
  //             schId: '20200605000000000045',
  //             docName: '林优',
  //             categorName: '普通',
  //             clinicalType: '1',
  //             numHadReg: '0',
  //             intro:
  //               '医学硕士，毕业于陕西中医药大学。主攻专业：眼科疾病的基础与临床研究。',
  //             numRemain: '39',
  //             hosName: '台州市第三人民医院',
  //             docJobName: '院长',
  //             hosId: '1281',
  //             empNo: '',
  //             showNo: '1',
  //             schState: '0',
  //             numCount: '39',
  //             categor: '2',
  //             hosDocId: '0000003060',
  //             docTitleName: '医师',
  //             schQukCategor: '眼科林优[普]',
  //           },
  //         ],
  //       },
  //     ],
  //     timeTaken: 156,
  //     code: 0,
  //     functionVersion:
  //       '[{"functionType":"2","version":"v0.0.4"},{"functionType":"1","version":"v0.0.4"}]',
  //     innerMessage: '成功',
  //     message: '成功',
  //     respCode: 0,
  //   } as any);

  // api.getNumberSource = () =>
  //   Promise.resolve({
  //     result: [
  //       {
  //         numId: '2022113132020060900000000002911',
  //         timeDesc: '08:00',
  //         disNo: '1',
  //       },
  //       {
  //         numId: '2022113132020060900000000002912',
  //         timeDesc: '08:00',
  //         disNo: '2',
  //       },
  //       {
  //         numId: '2022113132020060900000000002913',
  //         timeDesc: '08:00',
  //         disNo: '3',
  //       },
  //       {
  //         numId: '2022113132020060900000000002914',
  //         timeDesc: '08:00',
  //         disNo: '4',
  //       },
  //       {
  //         numId: '2022113132020060900000000002915',
  //         timeDesc: '08:00',
  //         disNo: '5',
  //       },
  //       {
  //         numId: '2022113132020060900000000002917',
  //         timeDesc: '08:30',
  //         disNo: '7',
  //       },
  //       {
  //         numId: '2022113132020060900000000002918',
  //         timeDesc: '08:30',
  //         disNo: '8',
  //       },
  //       {
  //         numId: '2022113132020060900000000002919',
  //         timeDesc: '08:30',
  //         disNo: '9',
  //       },
  //       {
  //         numId: '20221131320200609000000000029110',
  //         timeDesc: '08:30',
  //         disNo: '10',
  //       },
  //       {
  //         numId: '20221131320200609000000000029111',
  //         timeDesc: '08:30',
  //         disNo: '11',
  //       },
  //       {
  //         numId: '20221131320200609000000000029112',
  //         timeDesc: '08:30',
  //         disNo: '12',
  //       },
  //       {
  //         numId: '20221131320200609000000000029113',
  //         timeDesc: '09:00',
  //         disNo: '13',
  //       },
  //       {
  //         numId: '20221131320200609000000000029114',
  //         timeDesc: '09:00',
  //         disNo: '14',
  //       },
  //       {
  //         numId: '20221131320200609000000000029115',
  //         timeDesc: '09:00',
  //         disNo: '15',
  //       },
  //       {
  //         numId: '20221131320200609000000000029116',
  //         timeDesc: '09:00',
  //         disNo: '16',
  //       },
  //       {
  //         numId: '20221131320200609000000000029117',
  //         timeDesc: '09:00',
  //         disNo: '17',
  //       },
  //       {
  //         numId: '20221131320200609000000000029118',
  //         timeDesc: '09:00',
  //         disNo: '18',
  //       },
  //       {
  //         numId: '20221131320200609000000000029119',
  //         timeDesc: '09:30',
  //         disNo: '19',
  //       },
  //       {
  //         numId: '20221131320200609000000000029120',
  //         timeDesc: '09:30',
  //         disNo: '20',
  //       },
  //       {
  //         numId: '20221131320200609000000000029121',
  //         timeDesc: '09:30',
  //         disNo: '21',
  //       },
  //       {
  //         numId: '20221131320200609000000000029122',
  //         timeDesc: '09:30',
  //         disNo: '22',
  //       },
  //       {
  //         numId: '20221131320200609000000000029123',
  //         timeDesc: '09:30',
  //         disNo: '23',
  //       },
  //       {
  //         numId: '20221131320200609000000000029124',
  //         timeDesc: '09:30',
  //         disNo: '24',
  //       },
  //       {
  //         numId: '20221131320200609000000000029125',
  //         timeDesc: '10:00',
  //         disNo: '25',
  //       },
  //       {
  //         numId: '20221131320200609000000000029126',
  //         timeDesc: '10:00',
  //         disNo: '26',
  //       },
  //       {
  //         numId: '20221131320200609000000000029127',
  //         timeDesc: '10:00',
  //         disNo: '27',
  //       },
  //       {
  //         numId: '20221131320200609000000000029128',
  //         timeDesc: '10:00',
  //         disNo: '28',
  //       },
  //       {
  //         numId: '20221131320200609000000000029129',
  //         timeDesc: '10:00',
  //         disNo: '29',
  //       },
  //       {
  //         numId: '20221131320200609000000000029130',
  //         timeDesc: '10:00',
  //         disNo: '30',
  //       },
  //       {
  //         numId: '20221131320200609000000000029131',
  //         timeDesc: '10:30',
  //         disNo: '31',
  //       },
  //       {
  //         numId: '20221131320200609000000000029132',
  //         timeDesc: '10:30',
  //         disNo: '32',
  //       },
  //       {
  //         numId: '20221131320200609000000000029133',
  //         timeDesc: '10:30',
  //         disNo: '33',
  //       },
  //       {
  //         numId: '20221131320200609000000000029134',
  //         timeDesc: '10:30',
  //         disNo: '34',
  //       },
  //       {
  //         numId: '20221131320200609000000000029135',
  //         timeDesc: '10:30',
  //         disNo: '35',
  //       },
  //       {
  //         numId: '20221131320200609000000000029136',
  //         timeDesc: '11:00',
  //         disNo: '36',
  //       },
  //       {
  //         numId: '20221131320200609000000000029137',
  //         timeDesc: '11:00',
  //         disNo: '37',
  //       },
  //       {
  //         numId: '20221131320200609000000000029138',
  //         timeDesc: '11:00',
  //         disNo: '38',
  //       },
  //       {
  //         numId: '20221131320200609000000000029139',
  //         timeDesc: '11:00',
  //         disNo: '39',
  //       },
  //       {
  //         numId: '20221131320200609000000000029140',
  //         timeDesc: '11:00',
  //         disNo: '40',
  //       },
  //     ],
  //     timeTaken: 92,
  //     code: 0,
  //     functionVersion:
  //       '[{"functionType":"2","version":"v0.0.4"},{"functionType":"1","version":"v0.0.4"}]',
  //     innerMessage: '成功',
  //     message: '成功',
  //     respCode: 0,
  //   } as any);

  /**
   * 医生名片分享:  后台新建普通链接二维码 https://h5.eheren.com/scan/${syscode}/DoctorDetails?${...props}
   */
  const props = ref({} as IProps);
  const gStores = new GStores();

  const refDocShare = ref<any>('');
  const docSchList = ref<IDocSchListItem[]>([]);
  const schToday = computed(() => {
    if (checkedDay.value) {
      return docSchList.value.find((o) => o.schDate === checkedDay.value)!;
    } else {
      return {
        schByHos: {},
        schByNetHos: {},
        schDate: '???',
      };
    }
  });
  const isShowHosNet = computed(() => {
    return !!Object.keys(schToday.value.schByNetHos).length;
  });

  let useDoctorDetail = {} as UseDoctorDetail;

  const {
    chooseDays,
    checkedDay,
    chooseDaysEnabled,
    orderConfig,
    init: OrderInit,
    selectSchInfos,
    isSelectOrderSourceShow,
    selectOrderSourceNumId,
    isComplete,
    orderSourceList,
    orderSourceChoose,
    amChange,
    regClick,
  } = useOrder(props as any);
  const regDialogConfirm = ref<any>('');

  const docDetail = ref(<IDocDetail>{
    docName: props.value.docName,
    deptName: props.value.deptName,
  });
  // const docDetail = computed(() => useDoctorDetail.value.docDetail);

  const headerBg = computed(() => {
    return (
      docDetail.value.docPhoto || '/static/image/order/order-doctor-avatar.png'
    );
  });

  const previewImg = () => {
    const photo = docDetail.value.docPhoto;
    if (photo) {
      previewImage([photo]);
    }
  };

  onLoad(async (opt) => {
    props.value = deQueryForUrl(deQueryForUrl(opt));
    // 扫码进来, 不处理
    if (props.value.q) {
      return;
    }

    useDoctorDetail = new UseDoctorDetail(props.value);
    init();

    setTimeout(() => {
      // regDialogConfirm.value.show();
      // refDocShare.value.show();
    }, 1200);
  });

  const dateChange = (item: IChooseDays) => {
    checkedDay.value = item.fullDay;
    // if (!dateDocList.value.length) {
    //   getListByDate({
    //     ...props,
    //     hosDeptId: hosDeptId.value,
    //     firstHosDeptId: firstHosDeptId.value,
    //     secondHosDeptId: secondHosDeptId.value,
    //   });
    // }
  };

  const getSchData = async () => {
    isComplete.value = false;
    const schList = await useDoctorDetail.getDocSch().finally(() => {
      isComplete.value = true;
    });
    const eDaysEnabled: string[] = [];

    if (schList.length) {
      schList.map((o) => {
        const { schDate } = o;

        if (!eDaysEnabled.includes(schDate)) {
          eDaysEnabled.push(schDate);
        }
      });

      chooseDaysEnabled.value = eDaysEnabled;
      checkedDay.value = schList[0].schDate;
      docSchList.value = schList;
    }
  };

  const collectDoc = async () => {
    await getDocDetail();
    const { collectState, docPhoto, docTitleName } = docDetail.value;
    const { deptName, docName, hosDocId, hosDeptId, hosId } = props.value;
    const {
      herenId,
      browser: { source },
    } = gStores.globalStore;

    const collectType = 2;

    if (collectState == '1') {
      const args = {
        collectType,
        deptName,
        docName,
        docPhoto,
        docTitleName,
        hosDocId,
        herenId,
        hosDeptId,
        hosId,
        source,
      };

      api
        .addCollect(args)
        .then(() => {
          docDetail.value.collectState = '2';
          gStores.messageStore.showMessage('关注成功', 1500);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const args = {
        collectType,
        herenId,
        hosDocId,
        hosId,
      };

      api
        .delMyCollect(args)
        .then(() => {
          docDetail.value.collectState = '1';
          gStores.messageStore.showMessage('已经取消关注', 1500);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getDocDetail = async () => {
    await useDoctorDetail.getDoctorDetail().then((r) => {
      docDetail.value = r;
    });
  };

  const init = async () => {
    await OrderInit();
    getDocDetail();
    getSchData();
  };

  onShareAppMessage((res) => {
    return {
      title: `${docDetail.value.docName}医生`,
      path: joinQuery('/pagesA/MyRegistration/DoctorDetails', props.value),
    };
  });
</script>

<style lang="scss" scoped>
  .header-bg {
    width: 100%;
    position: absolute;
    z-index: 1;
  }

  .content-box {
    // padding: 0 32rpx;
    background-color: #fff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    border-radius: 8px;

    &.header-content-box {
      height: calc(100% - 500rpx);
    }

    .content-sel-date {
      padding: 8rpx 16rpx;
    }

    &.content-box-sch {
      padding-bottom: 40rpx;
    }
  }

  .content {
    position: relative;
    z-index: 2;
    padding: 0 32rpx;
  }

  .header-box {
    margin-bottom: 56rpx;
    .header-transform {
      position: relative;

      transform: translateY(-50rpx);
    }

    .header {
      padding: 0 32rpx;
      position: relative;
      z-index: 2;
      align-items: flex-start;

      .doc-avatar {
        width: 136rpx;
        height: 136rpx;
        border-radius: 50%;
        overflow: hidden;
      }

      .header-btn {
        margin-top: 20rpx;
        button {
          &:not(:last-child) {
            margin-right: 16rpx;
          }
        }
      }
    }

    &::before {
      content: '';
      display: block;
      width: 100%;
      height: 88rpx;
      background-color: transparent;
    }

    .doc-goodat {
      align-items: flex-start;
      transform: translateY(24rpx);
      .doc-major-goodat {
        width: 60rpx;
        position: relative;
        top: 5rpx;
      }

      .doc-goodat-content {
        -webkit-line-clamp: 2;
        flex: 1;

        .doc-show-intro {
          position: absolute;
          right: 32rpx;
          bottom: 0;
          z-index: 2;
          display: flex;
          padding-left: 1.5em;
          align-items: center;
          justify-content: flex-end;
          background: linear-gradient(
            270deg,
            #fff 0,
            #fff 80%,
            rgba(255, 255, 255, 0.3) 100%
          );
        }
      }
    }
  }

  .share-btn {
    background-color: var(--hr-brand-color-3-light);
    margin-left: 12rpx;
  }

  .label-mark {
    position: relative;
    left: -10rpx;
    z-index: 2;

    .label-mark-content {
      padding: 7rpx 24rpx;
      border-radius: 8px 40px 40px 4px;
      background-color: #22c5ae;
    }

    &::after {
      content: '';
      display: block;
      width: 13rpx;
      height: 13rpx;
      position: relative;
      top: 5rpx;
      z-index: 1;
      background: linear-gradient(
        -135deg,
        #108f7d,
        #108f7d 50%,
        transparent 50%,
        transparent 100%
      );
    }
  }
</style>
