<template>
  <view class="form-textarea">
    <view class="title">
      <label></label>
      照片附件
    </view>
    <view>
      <view class="list-cell">
        <view
          hover-class="uploader-hover"
          v-for="(item, index) in uploadImgList"
          :key="index"
          class="uploader-inputbox show-img"
        >
          <image :src="item"></image>
          <text @click="deleteImage(index)">x</text>
        </view>
        <view
          v-if="uploadImgList.length < count"
          hover-class="uploader-hover"
          class="uploader-inputbox camera-photo"
          @tap="addPhoto"
        >
          <image :src="cameraPhoto"></image>

          <view>上&nbsp;&nbsp;传</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
  import { ref, defineProps, withDefaults, defineEmits } from 'vue';
  import { GStores } from '@/utils';
  import env from '@/config/env';
  let $emit = defineEmits(['update:uploadImgList']);
  const props = withDefaults(
    defineProps<{
      uploadImgList: string[];
      uploadUrl: string;
      imageName: string;
      count: number;
    }>(),
    {
      uploadImgList: () => [],
      uploadUrl: `${env.baseApi}/phs-base/upload/imageUpload`,
      //上传的图片名前缀,默认接口上传后后端会重新命名图片，此配置无效
      imageName: 'feedbackAdd_photo',
      //做多可上传图片数
      count: 3,
    }
  );
  const gStores = new GStores();
  //   const uploadImgList = ref(<String[]>[]);
  const cameraPhoto =
    'https://phs-dev.oss-cn-hangzhou.aliyuncs.com/pcloud/image/srm_p.png';
  const addPhoto = async () => {
    uni.chooseImage({
      count: props.count - props.uploadImgList.length,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        for (let i = 0, len = res.tempFilePaths.length; i < len; i++) {
          uni.uploadFile({
            url: props.uploadUrl,
            filePath: res.tempFilePaths[i],
            name: 'file',
            fileType: 'image',
            formData: {
              imageName: `${
                props.imageName
              }_${new Date().getTime()}${res.tempFilePaths[i].slice(
                res.tempFilePaths[i].lastIndexOf('.')
              )}`,
              sysCode: gStores.globalStore.sysCode,
              Authorization: gStores.globalStore.token.accessToken,
            },

            success: function (res) {
              var data = JSON.parse(res.data) as {
                code: number;
                result: string;
                message: string;
              };

              if (JSON.parse(res.data).code == '0') {
                // TODO: JPEG格式文件未处理
                // 增加错误提示
                gStores.messageStore.showMessage(
                  JSON.parse(res.data).message,
                  2000
                );
              }
              if (data.code == 0) {
                $emit('update:uploadImgList', [
                  ...props.uploadImgList,
                  data.result,
                ]);
              } else {
                gStores.messageStore.showMessage(data.message, 2000);
              }
            },
          });
        }
      },
      fail: function (err) {
        console.warn(err);
      },
    });
  };
  const deleteImage = async (index) => {
    let tmpData = props.uploadImgList
      .slice(0, index)
      .concat(props.uploadImgList.slice(index + 1));
    $emit('update:uploadImgList', tmpData);
  };
</script>
<style lang="scss" scoped>
  .form-textarea {
    padding: 20rpx 30rpx;

    .title {
      color: #666;
      margin-bottom: 10rpx;
      label {
        color: #e5493b;
        margin-left: 10px;
      }
    }
    .list-cell {
      display: flex;
      .uploader-hover {
      }
      .uploader-inputbox {
        position: relative;
        margin-bottom: 16rpx;
        box-sizing: border-box;
        background-color: #ededed;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;

        .uploader-img-wrap {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        }
      }
      .show-img {
        width: 162rpx;
        height: 162rpx;
        margin-right: 20rpx;
        image {
          width: 162rpx;
          height: 162rpx;
          border-radius: 8rpx;
        }
        text {
          position: absolute;
          right: 20rpx;
          top: -5rpx;
          color: #fff;
        }
      }
      .camera-photo {
        width: 162rpx;
        height: 162rpx;
        image {
          width: 100rpx;
          height: 100rpx;
        }
        text {
          color: #666;
          font-size: 28rpx;
          position: relative;
          top: 0rpx;
        }
      }
    }
  }
</style>
