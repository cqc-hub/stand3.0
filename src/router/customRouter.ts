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
