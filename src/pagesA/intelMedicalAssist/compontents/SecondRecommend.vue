<template>
  <view class="">
    <scroll-view class="scroll-view w100p" scroll-x>
      <view class="flex-start mr24">
        <view v-for="o in list" class="box p24 mr24">
          <view class="g-break-word f32 mb32">
            {{ getDes(o.type) }}
          </view>

          <view class="box-item mb32">
            <view
              v-for="item in o.items"
              @click="itemClick(item)"
              class="item f28 pt12 pb12 pr32 pl32 text-no-wrap"
            >
              {{ item.content }}
            </view>
          </view>

          <view @click="moreClick(o.type)" class="g-flex-rc-cc">
            <image
              :src="imgUrl + 'zzdz-second-recommend-symptom.png'"
              class="icon-btn mr8"
            />

            <view class="color-blue f32">
              {{ o.type === "symptom" ? "更多部位症状" : "更多药品查询" }}
            </view>
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
  export default {
    props: {
      list: {
        type: Array,
        default: () => [],
      },
    },

    data() {
      return {
        imgUrl: this.$GLOBAL.BASE_IMG3,
        sysCode: uni.getStorageSync("sysCode") || this.$GLOBAL.SYS_CODE,
      };
    },

    methods: {
      itemClick(item) {
        const { type, id, content } = item;
        console.log(item);

        if (type === "drug") {
          this.$Router.push({
            path: "/pagesA/common/commonWebview",
            query: {
              url: `https://h5.eheren.com/v3_h5/#/pagesA/diseaseCyclopedia/drugsDetail?title=药品详情&label=${content}&id=${id}&sysCode=0`,
              // url: `https://h5.eheren.com/v3_h5/#/pagesA/diseaseCyclopedia/drugsDetail?title=药品详情&label=${content}&id=${id}&sysCode=${this.sysCode}`,
            },
          });
        } else {
          this.$Router.push({
            path: "/pagesA/common/commonWebview",
            query: {
              url: `${this.$GLOBAL.v3H5Url}pagesC/IntelligentGuidance/select?sysCode=${this.sysCode}&symptomId=${id}`,
            },
          });
        }
      },

      getDes(type) {
        const desMap = {
          symptom: "您可以详细描述症状,让我来帮您找科室找医生吧~",
          drug: "您可以描述药品名称,让我来帮您推荐药品使用说明书~",
        };

        return desMap[type] || "我不知道推荐啥";
      },

      /**
       *
       * @param { 'symptom' | 'drug' } type
       */
      moreClick(type) {
        if (type === "drug") {
          this.$Router.push({
            path: "/pagesA/common/commonWebview",
            query: {
              url:
                "https://h5.eheren.com/v3_h5/#/pagesA/diseaseCyclopedia/index?tabIndex=2&sysCode=" +
                this.sysCode,
            },
          });
        } else {
          this.$Router.push({
            path: "/pagesA/common/commonWebview",
            query: {
              url:
                this.$GLOBAL.v3H5Url +
                "pagesC/IntelligentGuidance/select?sysCode=" +
                this.sysCode+'&mulSelect=true',
            },
          });
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .scroll-view {
    .box {
      background: #ffffff;
      border-radius: 0px 8px 8px 8px;
      min-width: 260px;

      .box-item {
        display: flex;
        align-items: center;
        gap: 16rpx;
        flex-wrap: wrap;

        .item {
          line-height: 28rpx;
          text-align: center;
          background: #f6f6f6;
          border-radius: 8px;
        }
      }
    }
  }

  .icon-btn {
    width: 18px;
    height: 18px;
  }
</style>
