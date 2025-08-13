<template>
  <view
    :class="{
      [gStores.globalStore.getPageClass]: true,
    }"
    class="g-page"
  >
    <view class="search-input">
      <uni-search-input
      v-if="pageProp.type === 'hos'"
        v-model:value="searchValue"
        @change="searchList"
        placeholder="请输入医院/科室名称"
      />
       <uni-search-input
       v-else
        v-model:value="searchValue"
        @change="searchList"
        placeholder="请输入科室名称"
      />
    </view>

    <view class="g-container hidden-scrollbar" scroll-y>
      <view
        :class="{
          animate__slideInLeft: !isCollapseListLv1,
          animate__slideOutLeft: isCollapseListLv1,
          w0: isHideLv1,
        }"
        class="content-lv1 animate__animated"
      >
        <g-side-list
          :list="list"
          :field="fieldLv1"
          :value="clickLv1"
          @item-click="itemClick"
          defaultChoose
        />
      </view>
      <scroll-view class="flex1 content-lv2" scroll-y>
        <List-Lv2
          v-if="isComplete"
          :list="listLv2"
          @item-click="itemClickLv2"
        />

        <view v-if="isComplete && !listLv2.length" class="empty-list">
          <g-empty :current="4" text="未查询到相关科室" noTransformY />
        </view>
      </scroll-view>
    </view>
    <g-message />
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { onLoad } from '@dcloudio/uni-app';

  import { type ListItem, type TDeptItem } from './utils/DepartmentCard';
  import { joinQueryForUrl } from '@/common';
  import { debounce, GStores } from '@/utils';
  import api from '@/service/api';

  import ListLv2 from './components/DepartmentCard/listLv2.vue';
 
   // 该页面支持
  const pageProp = ref<{
    hosId?: string;
    type?: 'hos'; //表示名医汇过来的数据  不传为原来的科室名片
    key?: string; 
  }>({
    hosId: '',
  });
  const gStores = new GStores();
  const searchValue = ref('');
  const list = ref<ListItem[]>([]);
  const listLv2 = ref<TDeptItem[]>([]);
  const clickLv1 = ref('');
  const fieldLv1 = {
    label: 'deptName',
    value: 'id',
  };
  const isComplete = ref(false);
  const isCollapseListLv1 = ref(false);
  const isHideLv1 = ref(false);

  const getList = async () => {
    const { hosId } = pageProp.value;

    clearData();
    const { result } = await api
      .getDeptCardList({
        hosId,
      })
      .finally(() => {
        isComplete.value = true;

        setTimeout(() => {
          if (!list.value.length) {
            isHideLv1.value = true;
          }
        }, 80);
      });

    list.value = result || [];
  };
    const getHosList = async () => {
    const { hosId } = pageProp.value;

    clearData();
    // const { result } = await api
    //   .getDeptCardList({
    //     hosId,
    //   })
    //   .finally(() => {
        isComplete.value = true;

    //     setTimeout(() => {
    //       if (!list.value.length) {
    //         isHideLv1.value = true;
    //       }
    //     }, 80);
    //   });

    // list.value = result || [];
      setTimeout(() => {
          if (!list.value.length) {
            isHideLv1.value = true;
          }
        }, 80);
    list.value = [{
	"deptName": "妇科",
	"deptList": [{
		"deptName": "苍南医院",
		"recommendation": "咸阳市第一人民医院白内障屈光手术中心是以白内障诊疗、眼内屈光矫正及疑难眼病诊治为专业的临床学科。拥有主任医师3人，副主任医师3人，主治医师6人，其中硕士研究生导师2人，硕士研究生6人，白内障年手术量近4000余台。\n诊疗范围:常规白内障、小儿先天性白内障、外伤性白内障、并发性白内障、晶状体脱位等复杂难治性白内障、二期人工晶体植入术。\n诊疗特色:开展有晶体眼人工晶体植入术矫治高度近视、多焦点人工晶体植入术、连续视程人工晶体植入术、微切口白内障超声乳化手术，并为白内障患者提供日间手术服务。\n科室电话:33284392(医办) 33280059(护办)\n科室地址:新住院大楼20层南侧",
		"id": 11
	}, {
		"deptName": "其他医院",
		"recommendation": "综合眼病中心以白内障、青光眼、泪道病、角膜眼表疾病、\n眼部整形美容为专业特色的省级重点学科。现有主任医师1人，副主任医师2人，硕士研究生导师1人，硕士研究生4人，年手术量近2000余台。\n开展复杂性白内障、难治性青光眼手术，青光眼早期诊断及\n分期靶点干预个性化治疗。采用多方法治疗各类角膜、眼表疾病，各类眼部整形美容、小儿及成人泪道疾病诊治及手术、微创鼻内窥镜下泪囊鼻腔吻合术治疗急慢性泪囊炎。\n科室电话:33280077(护办)33284371(医办)\n科室地址:新住院大楼21层北侧",
		"id": 12
	}, {
		"deptName": "乐清医院",
		"recommendation": "视光中心开设屈光不正门诊，开展个体化激光手术治疗及各类医学验光配镜工作。科室拥有主任医师1人，副主任医师2人，主治视光医师3人，专业高级验光师7人，高级眼镜定配师2人，眼科专业医护人员共计21人。\n特色开展各类飞秒激光辅助的LASIK手术及LASEK手术、PTK和PRK手术、有晶体眼后房型人工晶体植入手术；视功能训练指导以及视觉康复训练项目；可定配各类功能性镜片及多种品类角膜塑形镜、离焦软镜及治疗性硬性高透氧性角膜接触镜（RGP）。\n科室电话：33131978\n科室地址：门诊部四楼",
		"id": 26
	}],
	"showNo": 1,
	"id": "2268"
}, {
	"deptName": "超声诊断课",
	"deptList": [{
		"deptName": "神经外二科",
		"recommendation": "神经外科二病区，是咸阳市第一批市级重点学科，目前开放床位30张， 现有医护人员20人，其中高级职称4人，博硕士4人，陕西省劳动模范1人，咸阳市有突出贡献专家1人，拥有咸阳市优秀科技人才、咸阳市“三五”人才、咸阳市科技青年、咸阳市“健康卫士”等荣誉称号者3人。设有咸阳市脑神经疾病研究室，为“北京脑胶质瘤会诊中心”咸阳协作医、“全国颅内血肿微创清除技术”研究与推广协作医院，高血压脑出血微创治疗技术科研团队为咸阳市科技创新团队。\n科室电话：33285970（护办），33285870（医办）\n科室地址：新住院大楼12层北侧 ",
		"id": 91
	}, {
		"deptName": "神经外一科",
		"recommendation": "神经外科一病区以神经肿瘤、脑血管病和脊柱脊髓疾病\n显微手术为专业方向、以脑出血微创治疗为专业特色。\n医疗团队:咸阳市有突出贡献专家2人，主任医师2人，副主任医师3人，硕士研究生导师1人，博士1人，硕士4人。\n专科特色:特重症颅脑损伤的重症监护和救治、颅脑和脊髓\n肿瘤显微手术;高血压脑出血、脑积水、三叉神经痛及面肌\n痉挛微创手术;脑动脉瘤微创介入和手术治疗;颈椎病、颈\n腰椎间盘突出微创显微手术;长期昏迷和植物人的催醒康复、重症颅内感染患者的救治。\n联系电话:33288228\n地址:住院大楼12楼南侧",
		"id": 13
	}, {
		"deptName": "神经内一科",
		"recommendation": "神经内科2020年获国家卫健委脑防委授予的“高级卒中中心”单位，系急性脑卒中医疗救治定点单位，以“省级劳动模范” 鱼丽萍主任医师为首席专家，神内一病区开放床位40张，拥有副主任医师1名，主治医师5名，住院医师1名。\n神经内科一病区诊治主要病种：脑血管病、中枢神经系统感染、眩晕疾病、变性疾病、周围神经病变、脊髓疾病、脱髓鞘疾病、神经肌肉接头疾病、运动神经元病等。针对急性脑梗死的治疗，科室已经开展有静脉溶栓、动脉溶栓、急诊取栓等治疗。\n科室电话：3288232（神内一护办）33280004（神内一医办）\n科室地址：新住院大楼13楼南侧",
		"id": 32
	}, {
		"deptName": "神经内二科",
		"recommendation": "神经内科二单元是省级重点专科，国家级“高级卒中中心”，以国家“三八红旗手” 鱼丽萍主任医师为首席专家，副主任医师2名，主治医师3名，住院医师3名，其中硕士研究生4名。\n主要诊治：脑血管病（脑梗死、脑出血），睡眠障碍，颅内感染，头晕，肌肉神经疾病，脊髓疾病，脱髓鞘疾病等。急性脑梗死的动静脉溶栓、支架取栓、颅内外支架置入等高精尖诊疗技术，在省内处于领先水平。\n科室电话：33248055（医办）；33248063（护办）\n科室地址：新住院大楼13楼北边",
		"id": 68
	}, {
		"deptName": "神经内三科",
		"recommendation": "咸阳市第一人民医院神经内科三病区是以脑血管疾病、癫痫、眩晕、头痛、帕金森病、痴呆、锥体外系疾病、中枢神经系统感染疾病、脱髓鞘疾病、睡眠障碍等疾病诊断治疗为特色的专科。尤其是在脑梗死超急性期静脉溶栓治疗、脑血管造影、颈动脉支架、急诊动脉溶栓，支架取栓以及血栓抽吸等方面积累大量经验，在省内神经介入领域处于领先地位。癫痫作为科室另外一大特色，在难治性癫痫、癫痫持续状态方面积累了大量经验，得到患者及家属一致好评。\n科室以“省级劳动模范” 鱼丽萍主任医师为首席专家组建，技术力量雄厚、检验检查设备先进，对神经内科常见病、多发病诊疗有丰富的临床经验，疗效显著。同时与天坛天坛、交大一附院、西京医院等长期合作。现开放床位40张，重症床位6张，医护人员21名。包括主任医师1名，副主任医师2名，主治医师2名，硕士研究生5名，主管护师1名，三级健康管理师3名，病区环境优雅、明亮、舒适。  \n护办：33284383  医办：33282235\n地址：新住院大楼14层北边神经内科三病区",
		"id": 69
	}, {
		"deptName": "康复医学科",
		"recommendation": "康复医学科是集康复医疗、预防保健、科研教学为一体\n的综合性科室。设有康复门诊、康复治疗区、康复病房、面\n积约1600平方米。现有康复医生7人、康复治疗师6人。其中\n高级职称2人、硕士研究生导师1人。\n科室配备下肢康复训练机器人、下肢智能反馈训练系统、经\n颅磁刺激仪、智能数字OT等先进康复智能设备。开展物理疗\n法、作业疗法、认知疗法、吞咽言语疗法等项目，主治:脑\n外伤、脑出血、脑梗后遗症、脊髓损伤、骨科康复、颈肩腰\n腿疼等。\n科室电话:33280074(医办) 33248103(护办) \n科室地址:康养中心4楼",
		"id": 14
	}],
	"showNo": 2,
	"id": "2269"

}]
  };

  const clearData = () => {
    isComplete.value = false;
    isHideLv1.value = false;
    list.value = [];
    listLv2.value = [];
  };

  const itemClick = ({ item }: { item: ListItem }) => {
    clickLv1.value = item[fieldLv1.value];
    listLv2.value = item.deptList || [];
  };

  const itemClickLv2 = (item: TDeptItem) => {
    const { id, deptName } = item;
    const { hosId } = pageProp.value;

    uni.navigateTo({
      url: joinQueryForUrl('/pagesA/MyRegistration/DepartmentCardDetail', {
        id,
        deptName,
        hosId,
      }),
    });
  };

  const searchList = debounce(
    async () => {
      const searchContent = searchValue.value;
      clearData();
      isHideLv1.value = false;

      if (searchContent) {
        const { hosId } = pageProp.value;

        const requestArg = {
          searchContent,
          hosId,
        };
        isCollapseListLv1.value = true;

        const { result } = await api
          .getDeptCardListSearch(requestArg)
          .finally(() => {
            setTimeout(() => {
              isComplete.value = true;
            }, 300);
          });

        setTimeout(() => {
          isHideLv1.value = true;
          listLv2.value = result || [];
        }, 300);
      } else {
        isCollapseListLv1.value = false;
        await getList();
      }
    },
    600,
    false
  );

  const init = async () => {
    if(pageProp.value.type === 'hos'){
      await getHosList();
    }else{
     await getList();
    }
  };

  onLoad((opt) => {
    pageProp.value = opt as any;

    init();
  });
</script>

<style lang="scss" scoped>
  .g-page {
    background-color: #fff;

    .g-container {
      display: flex;
      .content-lv1 {
        width: 33%;
        height: 100%;
        position: relative;
        z-index: 3;
      }

      .w0 {
        width: 0;
      }
    }
  }

  .search-input {
    margin: 16rpx 32rpx;
  }
</style>
