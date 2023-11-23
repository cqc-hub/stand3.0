<template>
  <scroll-view class="g-page" scroll-y>
    <view class="pt32">
      <Pro-List :list="list" />
    </view>
  </scroll-view>

  <g-message />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { deQueryForUrl } from '@/common/utils';
  import { GStores, ServerStaticData, type ISystemConfig } from '@/utils';

  import ProList from '../components/ProList.vue';
  import { NotNullable } from '@/typeUtils';

  type TListItemContainer = NotNullable<ISystemConfig['BusinessMenu']['menus']>;
  type TListItem = TListItemContainer[keyof TListItemContainer][number];

  const pageProps = ref(
    <
      {
        index: string; // 对应业务菜单编号
      }
    >{}
  );
  const pageConfig = ref(<ISystemConfig['BusinessMenu']>{});
  const gStores = new GStores();
  const list = ref(<TListItem[]>[]);

  const init = async () => {
    const { index } = pageProps.value;
    const { menus } = pageConfig.value;

    list.value = [];

    if (!index) {
      gStores.messageStore.showMessage('路由参数未指定菜单 id', 3000);
      return;
    }

    if (menus && Object.keys(menus).length) {
      const configList = menus[index];
      if (configList && configList.length) {
        list.value = configList;
      } else {
        gStores.messageStore.showMessage(
          '未查询到系统配置的菜单: ' + index,
          3000
        );
      }
    } else {
      gStores.messageStore.showMessage('系统未配置菜单数据', 3000);
    }
  };

  onLoad(async (opt) => {
    pageConfig.value = await ServerStaticData.getSystemConfig('BusinessMenu');
    pageProps.value = deQueryForUrl(deQueryForUrl(opt));
    init();
  });
</script>

<style lang="scss" scoped></style>
