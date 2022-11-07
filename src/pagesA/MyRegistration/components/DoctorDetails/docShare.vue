<template>
  <view class="">
    <uni-popup ref="popup" :isMaskClick="false" @change="change">
      <view>
        <view class="popup-content my-display-none">
          <w-qrcode :options="options" ref="qrcode" />
        </view>

        <view class="popup-content1 g-flex-rc-cc">
          <canvas
            class="shareCanvas"
            canvas-id="shareCanvas"
            id="shareCanvas"
            :style="{
              width: canvasInfo.width + 'px',
              height: canvasInfo.height + 'px',
            }"
          ></canvas>
        </view>
      </view>
    </uni-popup>

    <g-popup
      :maskAlpha="0"
      :duration="100"
      :maskClickClose="false"
      isHideNav
      ref="popupBottom"
    >
      <view class="footer">
        <view class="g-flex-rc-cc g-bold f36 footer-title">分享到</view>
        <view class="share-content flex-normal">
          <button @click="saveAsImg" class="share-btn">
            <view class="iconfont share-icon color-blue">&#xe705;</view>
            <view class="color-444 f28">保存图片</view>
          </button>

          <button open-type="share" class="share-btn">
            <view class="iconfont share-icon">&#xe704;</view>
            <view class="color-444 f28">转发给好友</view>
          </button>
        </view>

        <button @click="close" class="share-btn g-bold">
          <view class="cancel-btn g-border-top f32">取消</view>
        </button>
      </view>
    </g-popup>

    <xy-dialog
      title=""
      content="检测到未授权保存图片， 请确认授权"
      cancelText="取消"
      :show="isWxRequestQxDialogShow"
      @cancelButton="isWxRequestQxDialogShow = false"
    >
      <template #confirmBtn>
        <view @click="openSetting">去授权</view>
      </template>
    </xy-dialog>
  </view>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, ref, nextTick } from 'vue';
  import { previewImage, downFile, wait, GStores } from '@/utils';
  import { type IDocDetail, type IProps } from '../../utils/DoctorDetails';
  import globalGl from '@/config/global';
  import { joinQuery } from '@/common';

  const props = defineProps<{
    detail: IDocDetail;
    pageProp: IProps;
  }>();

  const change = ({ show }) => {
    if (show) {
      options.value.size = 200;
    } else {
      options.value.size = 0;
    }
  };

  const popup = ref<any>('');
  const popupBottom = ref<any>('');
  const qrcode = ref<any>('');
  const bgHeadHeight = ref('400rpx');
  const inst = getCurrentInstance();
  const gStores = new GStores();
  const isWxRequestQxDialogShow = ref(false);

  const qrImg = ref('');

  const show = () => {
    popup.value.open('center');
    popupBottom.value.show();
    options.value.code = joinQuery(
      `https://h5.eheren.com/scan/${globalGl.SYS_CODE}/DoctorDetails`,
      props.pageProp
    );

    setTimeout(async () => {
      await capture();
      initCanvas();
    }, 100);
  };

  const close = () => {
    popupBottom.value.close();
    popup.value.close();
  };

  const canvasInfo = ref({
    width: 352,
    height: 480,
  });

  const options = ref({
    // 二维码
    size: 200,
    code: '',
  });

  let loadingSuccess: (any) => any = async () => {};

  const openSetting = async () => {
    isWxRequestQxDialogShow.value = false;
    await new Promise(async (resolve, reject) => {
      wx.openSetting({
        async success(settingdata) {
          if (settingdata.authSetting['scope.writePhotosAlbum']) {
            resolve(void 0);
            show();
            await new Promise((r) => {
              loadingSuccess = r;
            });
            saveAsImg();
          } else {
            reject();
          }
        },

        fail: reject,
      });
    });
  };

  let isAndroid = false;
  const getSysInfo = (): Promise<UniApp.GetSystemInfoResult> => {
    return new Promise((resolve, fail) => {
      uni.getSystemInfo({
        success(e) {
          const { screenWidth, osName } = e;
          // canvasInfo.value.width = screenWidth;
          console.log('系统信息');
          console.log(e);
          isAndroid = osName === 'android';
          if (isAndroid) {
            // canvasInfo.value.width = 342;
          }

          resolve(e);
        },

        fail,
      });
    });
  };

  // 图片缩放
  const getScallSize = async (src: string, { height, width }) => {
    const { width: bgWidth, height: bgHeight } = await getImgInfo(src);

    let painWidth = 0; //绘画图片的宽度
    let painHeight = 0; //绘画图片的高度

    if (bgWidth > bgHeight) {
      //如果图片是宽大于高的长方形
      painWidth = (height / bgHeight) * bgWidth; //等比例获取宽度
      painHeight = height; //等比例获取高度
    }
    if (bgWidth == bgHeight) {
      //如果图片是宽等于高的正方形
      painWidth = width;
      painHeight = height;
    }
    if (bgWidth < bgHeight) {
      //如果图片是宽小于高的长方形
      painWidth = width; //等比例获取宽度
      painHeight = (width / bgWidth) * bgHeight; //等比例获取高度
    }

    return {
      painWidth,
      painHeight,
    };
  };

  const getImgInfo = (src: string): Promise<UniApp.GetImageInfoSuccessData> => {
    return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src,
        success(e) {
          resolve(e);
        },
        fail: reject,
      });
    });
  };

  const fillRoundRect = (
    cxt: UniApp.CanvasContext,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
    fillColor: string
  ) => {
    //圆的直径必然要小于矩形的宽高
    if (2 * radius > width || 2 * radius > height) {
      return false;
    }

    cxt.save();
    cxt.translate(x, y);
    //绘制圆角矩形的各个边
    drawRoundRectPath(cxt, width, height, radius);
    cxt.fillStyle = fillColor || '#000'; //若是给定了值就用给定的值否则给予默认值
    cxt.fill();
    cxt.restore();
  };

  const drawRoundRectPath = (
    cxt: UniApp.CanvasContext,
    width: number,
    height: number,
    radius: number
  ) => {
    cxt.beginPath();
    cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);

    //矩形下边线
    cxt.lineTo(radius, height);

    //左下角圆弧，弧度从1/2PI到PI
    cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);

    //矩形左边线
    cxt.lineTo(0, radius);

    //左上角圆弧，弧度从PI到3/2PI
    cxt.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);

    //上边线
    cxt.lineTo(width - radius, 0);

    //右上角圆弧
    cxt.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2);

    //右边线
    cxt.lineTo(width, height - radius);
    cxt.closePath();
  };

  const drawTextPrevWrap = (
    ctx: UniApp.CanvasContext,
    content: string,
    drawX,
    drawY,
    lineHeight,
    lineMaxWidth,
    lineNum,
    isTitle = false
  ) => {
    let drawTxt = ''; // 当前绘制的内容
    let drawLine = 1; // 第几行开始绘制
    let drawIndex = 0; // 当前绘制内容的索引

    //匹配这些中文标  。   ？      ！     ，     、     ；      ：     ”      '       ）     》     〉      】     』     」      〕    …      ￥
    let reg =
      /[\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201d|\u2019|\uff09|\u300b|\u3009|\u3011|\u300f|\u300d|\u3015|\u2026|\uffe5]/;

    // 判断内容是否可以一行绘制完毕
    if (ctx.measureText(content).width <= lineMaxWidth) {
      ctx.fillText(content.substring(drawIndex, -1), drawX, drawY);
    } else {
      for (var i = 0; i < content.length; i++) {
        drawTxt += content[i];
        if (content[i] === '\n') {
          ctx.fillText(content.substring(drawIndex, i + 1), drawX, drawY);
          drawIndex = i + 1;
          drawLine += 1;
          drawY += lineHeight;
          drawTxt = '';
          if (drawLine >= lineNum) {
            break;
          } else {
            continue;
          }
        }
        if (
          ctx.measureText(drawTxt).width >= lineMaxWidth &&
          !reg.test(content[i + 1]) &&
          i !== content.length - 1
        ) {
          if (drawLine >= lineNum) {
            ctx.fillText(content.substring(drawIndex, i) + '..', drawX, drawY);
            break;
          } else {
            ctx.fillText(content.substring(drawIndex, i + 1), drawX, drawY);
            drawIndex = i + 1;
            if (content[i + 1] !== '\n') {
              drawLine += 1;
              drawY += lineHeight;
            }
            drawTxt = '';
          }
          // drawLine -= 1;
        } else {
          // 内容绘制完毕，但是剩下的内容宽度不到lineMaxWidth
          if (i === content.length - 1) {
            ctx.fillText(content.substring(drawIndex), drawX, drawY);
          }
        }
      }
    }
  };

  // https://uniapp.dcloud.net.cn/api/canvas/CanvasContext.html#canvascontext-shadowoffsetx-number
  // https://blog.csdn.net/qq_30907845/article/details/126853488
  let [_avatar_img, _head_bg_img, _good_at_img] = ['', '', ''];
  const initCanvas = async () => {
    let {
      docPhoto,
      docName,
      docTitleName,
      goodAt: _goodAt,
      deptName,
    } = props.detail;
    docPhoto = '';

    docTitleName = docTitleName ?? '';
    uni.showLoading({
      mask: true,
    });

    let avatar_img = '/static/image/order/order-doctor-avatar.png';
    if (_avatar_img) {
      avatar_img = _avatar_img;
    } else {
      if (docPhoto) {
        avatar_img = await downFile(docPhoto);
        _avatar_img = avatar_img;
      }
    }

    const qr_code_img = qrImg.value;
    let [head_bg_img, good_at_img] = ['', ''];
    if (_head_bg_img && _good_at_img) {
      head_bg_img = _head_bg_img;
      good_at_img = _good_at_img;
    } else {
      [head_bg_img, good_at_img] = await Promise.all([
        downFile(globalGl.BASE_IMG + 'v3_doctor_bg_share_1.png'),
        downFile(globalGl.BASE_IMG + 'v3_doctor_card_major.png'),
      ]);
    }

    _head_bg_img = head_bg_img;
    _good_at_img = good_at_img;

    const { pixelRatio } = await getSysInfo();
    const boxWidth = canvasInfo.value.width;
    const boxHeight = canvasInfo.value.height;

    const ctx = uni.createCanvasContext('shareCanvas', inst);
    // ctx.scale(pixelRatio, pixelRatio);
    //清空画布
    ctx.clearRect(0, 0, boxWidth, boxHeight);

    const { painWidth: painWidthBg, painHeight: painHeightBg } =
      await getScallSize(head_bg_img, {
        width: boxWidth,
        height: boxHeight,
      });

    ctx.drawImage(head_bg_img, 0, 0, painWidthBg, painHeightBg);

    const avatarBox = {
      width: 70,
      height: 70,
      left: boxWidth - 65,
      top: 90,
    };
    //头像的白色边框
    ctx.arc(avatarBox.left, avatarBox.top, avatarBox.width / 2, 0, 2 * Math.PI);
    ctx.setFillStyle('rgba(255,255,255,0.50)');
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(
      avatarBox.left,
      avatarBox.top,
      avatarBox.width / 2 - 5,
      0,
      2 * Math.PI
    );
    ctx.clip();

    const { painHeight: painHeightAvatar, painWidth: painWidthAvatar } =
      await getScallSize(avatar_img, {
        width: avatarBox.width,
        height: avatarBox.height,
      });

    ctx.drawImage(
      avatar_img,
      avatarBox.left - 35,
      avatarBox.top / 2 + 10,
      painWidthAvatar,
      painHeightAvatar
    );

    ctx.restore();

    // 医生名字
    ctx.setFillStyle('#111111');
    ctx.setFontSize(24);
    ctx.fillText(docName, 32, avatarBox.top);
    ctx.fillText(docName, 32, avatarBox.top);
    ctx.fillText(docName, 32, avatarBox.top);

    ctx.save();

    const docTitle = docTitleName;
    ctx.setFontSize(12);

    fillRoundRect(
      ctx,
      28,
      avatarBox.top + 11,
      ctx.measureText(docTitle).width + 9,
      16,
      4,
      '#ccddff'
    );

    ctx.setFillStyle('#296fff');
    ctx.fillText(docTitle, 32, avatarBox.top + 24);

    ctx.restore();

    ctx.save();
    ctx.setFontSize(14);
    ctx.fillText(
      globalGl.systemInfo.name + (deptName ? `·${deptName}` : ''),
      32,
      avatarBox.top + 24 + 24
    );

    ctx.save();
    // ctx.setFillStyle('red');

    // ctx.fillText('浙江省人民医院·口腔科', 32, avatarBox.top + 24 + 24 + 30);
    ctx.setFontSize(14);
    ctx.setFillStyle('#444444');

    const goodAt = '         ' + _goodAt;

    drawTextPrevWrap(
      ctx,
      goodAt,
      42,
      avatarBox.top + 24 + 24 + 65,
      25,
      boxWidth - 100,
      3
    );

    ctx.save();

    ctx.drawImage(good_at_img, 44, avatarBox.top + 24 + 24 + 53, 30, 12);

    const _qr_dx = boxWidth / 2 - boxWidth / 8;
    const _qr_dy = avatarBox.top + 24 + 24 + 160 + 10;
    const _qr_width = 88;
    const _qr_pad = 2;

    ctx.drawImage(qr_code_img, _qr_dx, _qr_dy, _qr_width, _qr_width);

    ctx.beginPath();
    ctx.setLineWidth(0.08);
    ctx.setLineCap('round');
    ctx.moveTo(_qr_dx - _qr_pad - _qr_pad * 3, _qr_dy - _qr_pad * 3);
    ctx.lineTo(
      _qr_dx - _qr_pad + -_qr_pad * 3,
      _qr_dy + _qr_pad + _qr_width + _qr_pad * 2
    );

    ctx.lineTo(
      _qr_dx - _qr_pad + -_qr_pad * 3 + _qr_width + _qr_pad * 7,
      _qr_dy + _qr_pad + _qr_width + _qr_pad * 2
    );

    ctx.lineTo(
      _qr_dx - _qr_pad + -_qr_pad * 3 + _qr_width + _qr_pad * 7,
      _qr_dy - _qr_pad * 3
    );

    // ctx.closePath();

    ctx.lineTo(_qr_dx - _qr_pad - _qr_pad * 3, _qr_dy - _qr_pad * 3);

    ctx.stroke();

    ctx.save();

    ctx.setFontSize(12);
    ctx.setFillStyle('#888888');

    ctx.fillText(
      '用微信/支付宝扫描二维码 关注我吧',
      80,
      avatarBox.top + 24 + 24 + 260 + 20 + 10
    );

    ctx.draw();
    uni.hideLoading();
    loadingSuccess(void 0);
  };

  const capture = async () => {
    const { tempFilePath } = await qrcode.value.GetCodeImg();
    if (tempFilePath) {
      qrImg.value = tempFilePath;
      options.value.size = 0;
    }
  };

  const saveAsImg = async () => {
    // #ifdef  MP-WEIXIN
    await new Promise((r) => {
      uni.saveImageToPhotosAlbum({
        filePath: '',
        complete: r,
      });
    });
    // #endif
    uni.showLoading({
      mask: true,
    });
    uni.canvasToTempFilePath(
      {
        canvasId: 'shareCanvas',
        success: async ({ tempFilePath }) => {
          if (tempFilePath) {
            // #ifdef  MP-WEIXIN
            await new Promise((resolve, reject) => {
              uni.getSetting({
                async success({ authSetting }) {
                  if (authSetting['scope.writePhotosAlbum']) {
                    resolve(void 0);
                  } else {
                    close();
                    isWxRequestQxDialogShow.value = true;
                  }
                },
              });
            });

            // #endif

            uni.saveImageToPhotosAlbum({
              filePath: tempFilePath,
            });
          }
        },

        complete: uni.hideLoading,
      },
      inst
    );
  };

  defineExpose({
    show,
  });
</script>

<style lang="scss" scoped>
  .doc-major-goodat {
    width: 60rpx;
    position: relative;
    // #ifdef MP-ALIPAY
    margin-right: 12rpx;
    // #endif
  }

  .footer {
    .footer-title {
      padding: 28rpx;
    }

    .share-content {
      // height: 200rpx;
      padding: 0 32rpx;
    }

    .share-btn {
      padding: 0;
      margin: 0;
      border: none;
      background: transparent;

      display: inline-block;
      line-height: 1em;
      height: 100%;
      width: 100%;
      vertical-align: middle;

      &::after {
        border: none;
      }

      .share-icon {
        color: var(--hr-success-color-6);
        font-size: 68rpx;
        padding-bottom: 30rpx;
        transform: translateY(10rpx);
      }
    }

    .cancel-btn {
      padding: 26rpx;
      padding-bottom: 80rpx;
      margin-top: 20rpx;
    }
  }

  .shareCanvas {
    position: relative;
    z-index: 999;
    border-radius: 12rpx;
    transform: translateY(-188rpx);
  }
</style>
