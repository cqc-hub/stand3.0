<template>
    <view class="page" v-if="costInfoDetal">
        <view class="container">
            <view class="top">
                <view class="title">{{costInfoDetal.costTypeName}}</view>
                <view class="information">
                    <view class="item">
                        <view class="item-title">患者姓名</view>
                        <view class="item-content">{{patName}}({{patientId}})</view></view>
                    <view class="item">
                        <view class="item-title">费用时间</view>
                        <view class="item-content">{{costDate}}</view></view>
                    <view class="item">
                        <view class="item-title">病区床号</view>
                        <view class="item-content">{{costInfoDetal.hospitalWard}} {{costInfoDetal.inpatientBed}}床</view></view>
                    <view class="item">
                        <view class="item-title">住院号</view>
                        <view class="item-content">{{inpatientNo}}</view></view>
                    <view class="item">
                        <view class="item-title">费用总额</view>
                        <view class="item-content-money">{{costInfoDetal.totalCost}}元</view></view>
                </view>
            </view>
            <view class="bottom">
                <view class="title">费用明细</view>
                <template v-for="(item,index) in costInfoDetal.costList" :key="index">
                    <view class="item">
                        <view  @click="isShowBtn(index)" class="item-top">
                            <view class="type">{{item.category}}</view>
                            <view class="money">{{item.categoryCost}}元
                                <text v-if="!isShow[index]" style="color:#888888;" class="iconfont">&#xe6c4;</text>
                                <text v-else style="color:#888888;" class="iconfont">&#xe6c5;</text>
                            </view>
                        </view>
                        <template  v-if="item.category!='中药'">
                            <view  v-show="isShow[index]" v-for="(sub,i) in item.subCostList" :key="i">
                                <view  class="item-content" :class="{spacing:i>0}">
                                    <view class="left">
                                        <view class="name">{{sub.costName}}</view>
                                        <view class="count">
                                            <view class="unit">{{sub.unitPrice}}元/{{sub.unit}}</view>
                                            <view class="quantity">x{{sub.quantity}}</view>
                                        </view>
                                    </view>
                                    <view class="right">{{sub.valuationAmount}}元</view>
                                </view>
                            </view>
                        </template>
                        <template v-else>
                            <view class="zcy-content" :class="{padding:isShow[index]}">
                                <view v-show="isShow[index]" v-for="(sub,i) in item.subCostList" :key="i">
                                    <view class="zcy-name">{{sub.costName}}&nbsp;&nbsp;<text style="color:#888888">{{sub.quantity}}{{sub.unit}}</text></view>
                                </view>
                            </view>
                        </template>
                    </view>
                </template>
            </view>
        </view>
    </view>
</template>
<script setup lang="ts">
import { ref } from "vue"
import api from '@/service/api';
import { getQueryUrl } from '@/common/utils';
import { inHospitalCostInfo } from '../utils/inpatientInfo';
import { onLoad } from '@dcloudio/uni-app';
import { GStores } from '@/utils';

const costInfoDetal=ref<inHospitalCostInfo>({} as inHospitalCostInfo)
const costDate=ref('')
const inpatientNo=ref('')
const patName=ref('')
const patientId=ref('')
const gStores = new GStores();
let isShow=ref<boolean[]>([])
const isShowBtn=(index)=>{
    isShow.value[index]=!isShow.value[index]
}
const init=async ()=>{
    patName.value=gStores.userStore.patChoose.patientName
    patientId.value=gStores.userStore.patChoose._showId
    const pages = getCurrentPages();
    const fullPathNow = (pages[pages.length - 1] as any).$page.fullPath as string;
    console.log(fullPathNow,'xxx')
    costDate.value=getQueryUrl(fullPathNow).costDate;
    inpatientNo.value=getQueryUrl(fullPathNow).inpatientNo;
    const params={
        // costDay:costDate.value,
        // costType:'1',
        // hosId: '',
        // hospitalId:'',
        // patientId: '10763642',
        // timesHospitalization:'',
        costDay:"2022-05-02",
        costType:"1",
        patientId:"10763642",
    }
    const {result}=await api.getInHospitalCostInfo(params)
    costInfoDetal.value=result
    costInfoDetal.value.costList.push(
        {
                "categoryCost":"26",
                "category":"中药",
                "subCostList":[
                    {
                        "unitPrice":"26",
                        "unit":"g",
                        "quantity":"10",
                        "costName":"人参",
                        "valuationAmount":"26"
                    },{
                        "unitPrice":"26",
                        "unit":"g",
                        "quantity":"10",
                        "costName":"人参",
                        "valuationAmount":"26"
                    },{
                        "unitPrice":"26",
                        "unit":"g",
                        "quantity":"10",
                        "costName":"人参",
                        "valuationAmount":"26"
                    },{
                        "unitPrice":"26",
                        "unit":"g",
                        "quantity":"10",
                        "costName":"人参",
                        "valuationAmount":"26"
                    },{
                        "unitPrice":"26",
                        "unit":"g",
                        "quantity":"10",
                        "costName":"人参",
                        "valuationAmount":"26"
                    },{
                        "unitPrice":"26",
                        "unit":"g",
                        "quantity":"10",
                        "costName":"人参",
                        "valuationAmount":"26"
                    },{
                        "unitPrice":"26",
                        "unit":"g",
                        "quantity":"10",
                        "costName":"人参",
                        "valuationAmount":"26"
                    },{
                        "unitPrice":"26",
                        "unit":"g",
                        "quantity":"10",
                        "costName":"人参",
                        "valuationAmount":"26"
                    },{
                        "unitPrice":"26",
                        "unit":"g",
                        "quantity":"10",
                        "costName":"人参",
                        "valuationAmount":"26"
                    },
                ]
            }
    )
    costInfoDetal.value.costList.push(
        {
                "categoryCost":"1000",
                "category":"西药",
                "subCostList":[
                    {
                        "unitPrice":"250",
                        "unit":"瓶",
                        "quantity":"2",
                        "costName":"注射用水",
                        "valuationAmount":"500"
                    },{
                        "unitPrice":"50",
                        "unit":"盒",
                        "quantity":"5",
                        "costName":"甲氨蝶呤",
                        "valuationAmount":"500"
                    }
                ]
            }
    ) 
    for(var i=0;i<costInfoDetal.value.costList.length;i++){
        isShow.value.push(false)
    }
}

onLoad(() => {
  init();
});
</script>
<style scoped lang="scss">
.page{
    height: auto;
    width: 100%;
    .container{
        height: auto;
        width: 686rpx;
        margin-left: 32rpx;
        .top{
            height: auto;
            width: 686rpx;
            background: linear-gradient(180deg,#ffffff 0%, #e9f0ff 100%);
            border: 1rpx solid #e6e6e6;
            border-radius: 16rpx 16rpx 0px 0px;
            padding-bottom: 40rpx;
            .title{
                text-align: center;
                font-size: 36rpx;
                font-weight: 600;
                margin-top: 40rpx;
            }
            .information{
                margin-top: 20rpx;
                font-size: 28rpx;
                margin-left: 32rpx;
                .item{
                    margin-top: 12rpx;
                    display: flex;
                    .item-title{
                        width: 112rpx;
                        height: 44rpx;
                        color: #888888;
                    }
                    .item-content{
                        color: #111111;
                        margin-left: 24rpx;
                    }
                    .item-content-money{
                        margin-left: 24rpx;
                        color: #FF5040;
                    }
                }
            }
        }
        .bottom{
            height: auto;
            width: 686rpx;
            border-radius: 0px 0px 16rpx 16rpx;
            background-color: #fff;
            border-left:  1rpx solid #e6e6e6;
            border-right:  1rpx solid #e6e6e6;
            border-bottom:  1rpx solid #e6e6e6;
            padding-bottom: 20rpx;
            .title{
                padding-top: 40rpx;
                margin-left: 32rpx;
                font-size: 32rpx;
                color: #888888;
            }
            .item{
                height: auto;
                width: 622rpx;
                margin-top: 8rpx;
                margin-left: 32rpx;
                .item-top{
                    height: 96rpx;
                    width: 622rpx;
                    display: flex;
                    justify-content:space-between;
                    line-height: 96rpx;
                    font-size: 32rpx;
                    font-weight: 600;
                    .money{
                        color: #FF5040;
                    }
                }
                .item-content{
                    width: 622rpx;
                    height: auto;
                    background-color: #F6F6F6;
                    display: flex;
                    justify-content: space-between;
                    font-size: 28rpx;
                    padding-bottom: 16rpx;
                    border-radius: 8rpx;
                    &.spacing{
                        margin-top: 8rpx;
                    }
                }
                .left{
                    margin-left: 24rpx;
                    margin-top: 16rpx;
                    .count{
                        color: #888888;
                        font-size: 24rpx;
                        display: flex;
                        margin-top: 4rpx;
                        .quantity{
                            margin-left: 40rpx;
                        }
                    }
                }
                .right{
                    margin-top: 16rpx;
                    margin-right: 24rpx;
                }
            }
            .zcy-content{
                width: 622rpx;
                height: auto;
                background-color: #F6F6F6;
                font-size: 28rpx;
                border-radius: 8rpx;
                display: flex;
                flex-flow: row wrap;
                &.padding{
                    padding-bottom: 16rpx;
                }
                .zcy-name{
                    height: auto;
                    width: 287rpx;
                    margin-left: 24rpx;
                    margin-top: 16rpx;
                }
            }
        }
    }
}
</style>