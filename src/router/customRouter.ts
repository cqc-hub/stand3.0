import { beforeEach } from './index';
import { getQueryUrl } from '@/common/utils';
import { setLocalStorage } from '@/common';

const reLaunch = uni.reLaunch;
const navigateTo = uni.navigateTo;
const redirectTo = uni.redirectTo;

uni.reLaunch = async (options: UniNamespace.ReLaunchOptions) => {
  await beforeEach(options);
  reLaunch(options);
};

uni.navigateTo = async (options: UniApp.NavigateToOptions) => {
  const thRegisterId = <string>getQueryUrl(<string>options.url)?.thRegisterId;

  thRegisterId && setLocalStorage({ thRegisterId });
  await beforeEach(options);
  navigateTo(options);
};

uni.redirectTo = async (options: UniApp.RedirectToOptions) => {
  await beforeEach(options);
  redirectTo(options);
};
