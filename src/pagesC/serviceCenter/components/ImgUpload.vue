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
          <image class="show-image" :src="item"></image>
          <text class="show-text" @click="deleteImage(index)">x</text>
        </view>
        <view
          v-if="uploadImgList.length < count"
          hover-class="uploader-hover"
          class="uploader-inputbox camera-photo"
          @tap="addPhoto"
        >
          <image class="camera-image" :src="cameraPhoto"></image>

          <view class="text">上&nbsp;&nbsp;传</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script lang="ts" setup>
  import { GStores, apiAsync } from '@/utils';
  import env from '@/config/env';
  const emits = defineEmits(['update:uploadImgList']);
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
    const { tempFilePaths } = await apiAsync(uni.chooseImage, {
      count: props.count - props.uploadImgList.length,
      sizeType: ['compressed', 'original'],
      sourceType: ['album', 'camera'],
    });
    for (let i = 0, len = tempFilePaths?.length; i < len; i++) {
      // @ts-expect-error
      const { data} = await apiAsync(uni.uploadFile, {
        url: props.uploadUrl,
        filePath: tempFilePaths[i],
        name: 'file',
        fileType: 'image',
        formData: {
          imageName: `${props.imageName}_${new Date().getTime()}${tempFilePaths[
            i
          ].slice(tempFilePaths[i].lastIndexOf('.'))}`,
          sysCode: gStores.globalStore.sysCode,
          Authorization: gStores.globalStore.token.accessToken,
        },
      });
      var jsonData = JSON.parse(data) as {
        code: number;
        result: string;
        message: string;
      };

      if (JSON.parse(data).code == '0') {
        // TODO: JPEG格式文件未处理
        // 增加错误提示
        gStores.messageStore.showMessage(JSON.parse(data).message, 2000);
      }
      if (jsonData.code == 0) {
        emits('update:uploadImgList', [
          ...props.uploadImgList,
          jsonData.result,
        ]);
      } else {
        gStores.messageStore.showMessage(jsonData.message, 2000);
      }
    }
  };
  const deleteImage = async (index) => {
    let tmpData = props.uploadImgList
      .slice(0, index)
      .concat(props.uploadImgList.slice(index + 1));
    emits('update:uploadImgList', tmpData);
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
        .show-image {
          width: 162rpx;
          height: 162rpx;
          border-radius: 8rpx;
        }
        .show-text {
          position: absolute;
          right: 20rpx;
          top: -5rpx;
          color: #fff;
        }
      }
      .camera-photo {
        width: 162rpx;
        height: 162rpx;
        .camera-image {
          width: 100rpx;
          height: 100rpx;
        }
        .text {
          color: #666;
          font-size: 28rpx;
          position: relative;
          top: 0rpx;
        }
      }
    }
  }
</style>
