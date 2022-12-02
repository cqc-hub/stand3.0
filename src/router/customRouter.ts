import { beforeEach } from './index';

const reLaunch = uni.reLaunch;
const navigateTo = uni.navigateTo;
const redirectTo = uni.redirectTo;

uni.reLaunch = async (options: UniNamespace.ReLaunchOptions) => {
  await beforeEach(options);
  reLaunch(options);
};

uni.navigateTo = async (options: UniApp.NavigateToOptions) => {
  await beforeEach(options);
  navigateTo(options);
};

uni.redirectTo = async (options: UniApp.RedirectToOptions) => {
  await beforeEach(options);
  redirectTo(options);
};

uni.onAppShow(() => {
  const updateManager = uni.getUpdateManager();

  updateManager.onCheckForUpdate(function (res) {
    if (res.hasUpdate) {
      updateManager.onUpdateReady(function (res) {
        uni.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          },
        });
      });
    }
  });
});
