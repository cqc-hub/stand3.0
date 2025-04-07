<template>
  <view class="SecondRecommend">
    <scroll-view class="scroll-view" :scroll-x="true">
      <view class="flex-start mr24" v-if="list && list.length">
        <view
          v-for="(o, i) in list"
          :key="'recommend1' + i"
          class="box p24 mr24"
        >
          <view class="g-break-word f28 mb32 mt16 descible">
            {{ getDes(o?.type) }}
          </view>
          <view class="box-item mb16">
            <template v-if="o?.type === 'symptom'">
              <view
                v-for="(item, index) in o?.items"
                :key="'box-item' + index"
                @click="itemClick(item)"
                class="item f28 pt12 pb12 pr32 pl32 text-no-wrap"
              >
                {{ item?.content }}
              </view>
              <view @click="moreClick(o?.type)" class="g-flex-rc-cc button-item mt32">
            <image
              :src="'https://phsdevoss.eheren.com/pcloud/phs3.0/intelMedicalAssist_more.png'"
              class="icon-btn mr8"
            />

            <view class="color-blue f28 ">
              {{ o?.type === 'symptom' ? '更多部位症状' : '更多药品查询' }}
            </view>
          </view>
            </template>
            <template v-else>
              <view class="guess-content">
                <view class="guess-grid">
                  <view
                    class="grid-item"
                    v-for="(item, index) in o?.items"
                    :key="'grid-item' + index"
                    @click="handleClickServer(item)"
                  >
                    <img :src="imgUrl + item.icon" alt="" class="icon" />
                    <view class="label f28">{{ item.text }}</view>
                  </view>
                </view>
              </view>
            </template>
          </view>

      
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  import globalGl from '@/config/global';

  import { useTBanner } from '@/utils';
  import api from '@/service/api';
  export default {
    props: {
      serverArray: {
        type: Array,
        default: () => [],
        // [{"type":"symptom","items":[{"id":24,"type":"symptom","content":"双下肢水肿"},{"id":16,"type":"symptom","content":"咳嗽"},{"id":9,"type":"symptom","content":"头晕"},{"id":10,"type":"symptom","content":"头痛"},{"id":33,"type":"symptom","content":"尿频"},{"id":17,"type":"symptom","content":"胸闷"}]},{"type":"drug","items":[{"id":146476,"type":"drug","content":"复方磺胺甲噁唑片"},{"id":146183,"type":"drug","content":"柳氮磺吡啶肠溶片"},{"id":147273,"type":"drug","content":"柳氮磺吡啶肠溶片"},{"id":146270,"type":"drug","content":"柳氮磺吡啶栓"},{"id":146803,"type":"drug","content":"左氧氟沙星氯化钠注射液"},{"id":146341,"type":"drug","content":"甲磺酸左氧氟沙星注射液"}]}]
      },
    },

    data() {
      return {
        imgUrl: globalGl.BASE_IMG,
        list: [],
      };
    },
    async created() {
      const { result } = await api.smartGuideDft({});
      this.list = [
        {
          type: 'symptom',
          items: result.map((item) => {
            return {
              id: item.id,
              type: 'symptom',
              content: item.symptom,
            };
          }),
        },
        {
          type: 'server',
          items: this.serverArray.slice(0, 8),
        },
      ];
    },
    methods: {
      itemClick(item) {
        const { type, id, content } = item;
        // if (type === 'drug') {
        //   useTBanner({
        //     type: 'h5',
        //     path: `https://h5.eheren.com/v3_h5/#/pagesA/diseaseCyclopedia/drugsDetail?title=药品详情&label=${content}&id=${id}&sysCode=0`,
        //   });
        // } else {
        //   useTBanner({
        //     type: 'h5',
        //     path: `${globalGl.h5Url}pagesC/IntelligentGuidance/select?sysCode=${globalGl.SYS_CODE}&symptomId=${id}`,
        //   });
        // }
        this.$emit('sendMsgSymptom', content);
      },
      handleClickServer(item) {
        this.$emit('click-server', item);
      },
      getDes(type) {
        const desMap = {
          symptom: '您可以详细描述症状,让我来帮您找科室找医生吧~',
          drug: '您可以描述药品名称,让我来帮您推荐药品使用说明书~',
          server:'您可能会需要以下服务~'
        };

        return desMap[type] || '我不知道推荐啥';
      },

      /**
       *
       * @param { 'symptom' | 'drug' } type
       */
      moreClick(type) {
        if (type === 'drug') {
          useTBanner({
            type: 'h5',
            path:
              'https://h5.eheren.com/v3_h5/#/pagesA/diseaseCyclopedia/index?tabIndex=2&sysCode=' +
              globalGl.SYS_CODE,
          });
        } else {
          useTBanner({
            type: 'h5',
            path:
              globalGl.h5Url +
              'pagesC/IntelligentGuidance/select?sysCode=' +
              globalGl.SYS_CODE +
              '&mulSelect=true',
          });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .scroll-view {
    width: 100vw;
    .box {
      background: #ffffff;
      border-radius: 0px 8px 8px 8px;
      min-width: 260px;
      background: linear-gradient(180deg, #f2faff 3%, #ffffff);
      border: 2rpx solid #ffffff;
      border-radius: 0px 12px 12px 12px;
      box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.06);

      .box-item {
        display: flex;
        align-items: center;
        gap: 16rpx;
        flex-wrap: wrap;

        .item {
          line-height: 28rpx;
          text-align: center;
          background: #e8fcff;
          border: 1rpx solid #baf2fc;
          border-radius: 8px;
        }
      }
    }
  }

  .icon-btn {
    width: 18px;
    height: 18px;
  }
  .descible {
    color: #002a80;
  }
  .guess-content {
    // width: 95vw;
    margin: 0 2.5vw;
    .guess-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      .grid-item {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #e8fcff;
        border: 2rpx solid #baf2fc;
        border-radius: 18rpx;
        padding: 12rpx;
        margin: 12rpx 10rpx;
        .icon {
          width: 45rpx;
          height: 45rpx;
          margin-right: 10rpx;
        }
        .label {
          white-space: nowrap; //不换行
        }
      }
    }
  }
  .color-blue{
    color:#296FFF
  }
  .button-item{
    width:100%
  }
</style>
