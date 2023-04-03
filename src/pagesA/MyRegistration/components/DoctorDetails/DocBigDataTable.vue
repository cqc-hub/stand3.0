<template>
  <view class="">
    <uni-table emptyText="暂无数据">
      <!-- 表头行 -->
      <uni-tr :rowStyle="headerRowStyle">
        <uni-th
          v-for="col in columns"
          :key="col.key"
          :align="col.align || 'left'"
          :width="col.width"
        >
          <text class="header-col color-666 f28">{{ col.label }}</text>
        </uni-th>
      </uni-tr>

      <!-- 表格数据行 -->
      <uni-tr v-for="(row, idx) in tableData" :key="idx">
        <uni-td
          v-for="col in columns"
          :key="col.key"
          :align="col.align || 'left'"
          :rowStyle="rowStyle"
        >
          <slot name="td" :row="row" :field="col.key" :rowIndex="idx">
            <text v-if="row[col.key] !== undefined">{{ row[col.key] }}</text>
          </slot>
        </uni-td>
      </uni-tr>
    </uni-table>
  </view>
</template>

<script lang="ts" setup>
  import { defineComponent, ref } from 'vue';

  withDefaults(
    defineProps<{
      columns: {
        label: string;
        key: string;
        align?: 'left' | 'center' | 'right';
        width?: string;
      }[];
      tableData: any[];
      headerRowStyle?: string;
      rowStyle?: string;
    }>(),
    {}
  );
</script>

<style lang="scss" scoped>
  .header-col {
    font-weight: normal;
  }
</style>
