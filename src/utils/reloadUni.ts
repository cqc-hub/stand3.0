export const reloadUni = () => {
  uni.addInterceptor('showLoading', {
    invoke(args = {}) {
      const { title } = args;

      if (!title) {
        args.title = '加载中...';
      }
    },
  });
};
