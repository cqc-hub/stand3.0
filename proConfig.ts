/// <reference path="./src/index.d.ts" />

export const miniProgramConfig: {
  [key: string]: ISystemGlobalItem;
} = {
  '1001033': {
    wxAppid: 'wxe26143481567cb97',
    alipayAppid: '2021002139602458',
    isvAlipayAppid: '2021003154665105',
    h5Appid: 'wx8e5a08ccb011d26c',
    h5AppidDisabledInTest: true,
    name: '台州市第一人民医院',

    isSearchInHos: true,
    isOpenOcr: true,
    sConfig: {
      isOpenAlipayZndz: true,
      isDrugDelivery: '1',
      isOpenHelpOld: '1',
      isOpenWechatSI: true,
      medicalMHelp: {
        wx: {
          crossProgramBizType: { clinic: 'iAZhaFg90P' },
          medicalPlugin: '1',
        },
        alipay: {
          medicalPlugin: {
            orgId: { '1279': 'H33100300340', '1281': 'H3310030034020' },
            cardType: '01',
          },
          medicalFiling: '1',
          isFamilyPayment: '1',
        },
      },
    },
  },
  '1001035': {
    wxAppid: 'wxacb96ee66c3dee84',
    h5Appid: 'wxa5cb8c1829e5603e',
    alipayAppid: '2021003104670597',
    isvAlipayAppid: '2021003104670597',
    toutiaoAppid: 'tt00a7761a9facebee01',
    harmonyBundleName: 'com.atomicservice.6917564602329951506',
    name: '江苏省中医院',

    isOpenOcr: false,
    isSearchInHos: true,
    sConfig: {
      homeNavTitleLogo:
        'https://phsdevoss.eheren.com/pcloud/phs3.0/jiangsushengzhonnavtitle.png',
      isOpenMessageAuth: '1',
      isOpenAssistMessage: '1',
      isMessageBtnShowNew: '1',
      isOpenPopularSci: { wx: '1' },
      isOpenWechatSI: true,
      isOpenHelpOld: '1',
      isWxShowToggleEcZh: '1',
      homeTopBanner: { topShow: true },
      medicalMHelp: {
        isOpenPatToMedicalPat: {},
        wx: {
          isMedicalOrder: '1',
          isGbFamilyPayment: '1',
          medicalFiling: '1',

          // cs
          // medical1001035: {
          //   auth: {
          //     appId: 'wxfde9fffbfa82be54',
          //     path: 'pages/allOutPayCashier/authUniPro/authUni',
          //     extraData: { appid: 'c4097ed72fc64e71818e6990dc6f9512' },
          //   },
          //   pay: {
          //     appId: 'wxfde9fffbfa82be54',
          //     path: 'pages/allOutPayCashier/cashierUniPro/cashierUni',
          //     extraData: {
          //       appid: 'c4097ed72fc64e71818e6990dc6f9512',
          //       channel_code: 'f6cd425b461444f3907808719fd30011',
          //       fixmedinsCode: 'H32010400468',
          //       fixmedinsName: '江苏省中医院',
          //     },
          //   },
          // },
          // zs
          medical1001035: {
            auth: {
              appId: 'wxfde9fffbfa82be54',
              path: 'pages/allOutPayCashier/authUniPro/authUni',
              extraData: { appid: '96391c9afe2c46b3bba52436351dd418' },
            },
            pay: {
              appId: 'wxfde9fffbfa82be54',
              path: 'pages/allOutPayCashier/cashierUniPro/cashierUni',
              extraData: {
                appid: '96391c9afe2c46b3bba52436351dd418',
                channel_code: 'b756bf71948144f993bcc768fe7b0910',
                fixmedinsCode: 'H32010400468',
                fixmedinsName: '江苏省中医院',
              },
            },
          },

          medicalNation: {
            appId: 'wxe183cd55df4b4369',
            path: 'auth/pages/bindcard/auth/index',
            pathExtraData: {
              openType: 'getAuthCode',
              bizType: '04107',
              cityCode: '320100',
              channel: 'AAH9tbKllV7sWIAT89M-Ziio',
              orgChnlCrtfCodg:
                'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtPYH4veMyOsoarTTx8iXr2',
              orgCodg: 'H32010400468',
              orgAppId: '1I4NTQGA605E8D430B0A00006E750DE8',
              sourceapp: 'wxacb96ee66c3dee84-1',
            },
          },
        },
      },
    },
  },
  '1001036': {
    wxAppid: 'wx8c42096613665ada',
    // h5AppidTest: 'wxab05eba59d902b5f',
    alipayAppid: '2021003120612222',
    isvAlipayAppid: '2021003120637143',
    name: '东部战区总医院',

    isOpenOcr: false,
    isSearchInHos: true,
    sConfig: {
      isHideHomeLogo: '1',
      homeNavTitleLogo:
        'https://phsdevoss.eheren.com/pcloud/image/1001036logo3.png',
      homeTopBanner: { topShow: true, bannerHeight: 230 },
    },
  },
  '1001038': {
    wxAppid: 'wxf64e84cf578fe0a7',
    alipayAppid: '2021002182620396',
    isvAlipayAppid: '2021002133632822',
    h5Appid: 'wx65a04aa1dc7776d8',
    name: '嘉兴市第二医院',
    isSearchInHos: true,

    isOpenOcr: true,
    sConfig: {
      isMessageBtnShowNew: '1',
      isOpenHelpOld: '1',
      isOpenHomeTabBarNetWorkBtn: '1',
      medicalMHelp: {
        wx: { medicalPlugin: '1' },
        alipay: {
          medicalPlugin: { orgId: { '13014': 'H33040200352' }, cardType: '01' },
        },
      },
    },
  },
  '1001040': {
    wxAppid: 'wxfa6c5f0835eedf08',
    alipayAppid: '2021002143620963',
    h5Appid: 'wx32db6c8548b011c9',
    isvAlipayAppid: '2021002147662292',
    name: '湖州市第三人民医院',
    isSearchInHos: true,

    isOpenOcr: false,
    sConfig: {
      isOpenHomeTabBarNetWorkBtn: '1',
      isOpenHelpOld: '1',
      isOpenWechatSI: true,
      medicalMHelp: {
        isOpenPatToMedicalPat: {},
        wx: { medicalPlugin: '1' },
        alipay: {
          medicalPlugin: { orgId: { '12694': 'H33050200031' }, cardType: '01' },
          medicalFiling: '1',
        },
      },
    },
  },
  '1001041': {
    wxAppid: 'wx1b81e5b0858757ba',
    h5Appid: '',
    name: '大医二院普湾院区',
    isSearchInHos: false,

    isOpenOcr: false,
    sConfig: { isOpenHomeTabBarMessageBtn: '1' },
  },
  '1001044': {
    wxAppid: 'wxb54f397780bfacbc',
    h5Appid: 'wx43649b293a6ef63c',
    alipayAppid: '2021003164605058',
    isvAlipayAppid: '2021003164621092',
    name: '安康市中医医院',
    isSearchInHos: false,
    h5AppidDisabledInTest: true,
    isOpenOcr: false,
    sConfig: {
      homeNavTitleLogo:
        'https://phsdevoss.eheren.com/pcloud/phs3.0/ankangzhongnavtitle.png',
      login: {},
      medicalMHelp: {
        isOpenPatToMedicalPat: {},
        wx: {
          medicalNation: {
            appId: 'wxe183cd55df4b4369',
            path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=610900&channel=AAEfZXu8U-gLigchujuuMHOR&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxv7ltjDddRhreS6tc6M0416&orgCodg=H61090200044&orgAppId=1GTNPT4M90H576430B0A0000D5352BB7',
          },
        },
      },
    },
  },
  '1001045': {
    wxAppid: 'wx39ce500d25aa3328',
    alipayAppid: '2021003105653538',
    h5Appid: 'wxed31a7829838f998',
    name: '郸城县人民医院',
    isSearchInHos: false,

    isOpenOcr: false,
    sConfig: {
      medicalMHelp: { alipay: { medicalDefault: '1', medicalNation: {} } },
    },
  },
  '1001046': {
    wxAppid: 'wxb00075173e764492',
    alipayAppid: '2021003113623396',
    isvAlipayAppid: '2021003116641812',
    h5Appid: 'wx1be541208ab16799',
    name: '绍兴市人民医院',

    isSearchInHos: true,
    isOpenOcr: true,
    sConfig: {
      isOpenWechatSI: true,
      isOpenHomeTabBarMessageBtn: '1',
      login: { isAliAuthBase: '1' },
      medicalMHelp: {
        isOpenPatToMedicalPat: {},
        wx: {
          crossProgramBizType: { clinic: '6f8FEzfB6q' },
          medicalPlugin: '1',
        },
        alipay: {
          medicalPlugin: {
            orgId: { '12930': 'H33060200131', '13178': 'H3306020013120' },
            appId: { '13178': '20' },
            cardType: '01',
          },
          medicalFiling: '1',
        },
      },
      isOpenHelpOld: '1',
    },
  },
  '1001048': {
    wxAppid: 'wx8358079c24acea42',
    h5Appid: 'wx6426f547693ab6e2',
    alipayAppid: '2021003144603328',
    name: '宜兴市人民医院',
    isSearchInHos: true,
    isOpenOcr: true,
    sConfig: {
      isOpenHelpOld: '1',
      medicalMHelp: {
        wx: {
          medicalNation: {
            appId: 'wxe183cd55df4b4369',
            path: 'auth/pages/bindcard/auth/index',
            // cs
            // pathExtraData: {
            //   openType: 'getAuthCode',
            //   cityCode: '320200',
            //   channel: 'AAGDjhBtPzo4LJTh9gCenRkB',
            //   orgChnlCrtfCodg:
            //     'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxvGdh09Ghvhyk/swHL2NBPe',
            //   orgCodg: 'H32028200358',
            //   bizType: '04107',
            //   orgAppId: '1GDAN3EEO0123F60C80A000061B81AB7',
            // },

            // zs
            pathExtraData: {
              openType: 'getAuthCode',
              cityCode: '320200',
              channel: 'AAGDjhBtPzo4LJTh9gCenRkB',
              orgChnlCrtfCodg:
                'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxvGdh09Ghvhyk/swHL2NBPe',
              orgCodg: 'H32028200358',
              bizType: '04107',
              orgAppId: '1GU9S5QVB01M76430B0A000038F064B8',
            },
            pathExtraDataConfig: {
              // 虚拟id 互联网医院处方外配
              // zs
              virtualHosId: {
                openType: 'getAuthCode',
                cityCode: '320200',
                channel: 'AAFEEOdTYZNbEzD1gmhG9skn',
                orgChnlCrtfCodg:
                  'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxvGdh09Ghvhyk/swHL2NBPe',
                orgCodg: 'H32028200358',
                bizType: '04104',
                orgAppId: '1GU9S5QVB01M76430B0A000038F064B8',
                sourceapp: 'wx8358079c24acea42-1',
              },
              // cs
              // virtualHosId: {
              //   openType: 'getAuthCode',
              //   cityCode: '320200',
              //   channel: 'AAFEEOdTYZNbEzD1gmhG9skn',
              //   orgChnlCrtfCodg:
              //     'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxvGdh09Ghvhyk/swHL2NBPe',
              //   orgCodg: 'H32028200358',
              //   bizType: '04104',
              //   orgAppId: '1GDAN3EEO0123F60C80A000061B81AB7',
              //   sourceapp: 'wx8358079c24acea42-1',
              // },
            },
            dongRuanMedicalInfo: {
              h5BaseUrl:
                // zs
                'https://ybj.jszwfw.gov.cn/mms/hsa-tiap-ui/#/pay-loading',

              // cs
              // 'https://ybj.jszwfw.gov.cn/mmc/hsa-mms-ui/#/pay-loading',
            },
          },
          isMedicalOrder: '1',
          isGbFamilyPayment: '1',
        },
      },
    },
  },
  '1001049': {
    wxAppid: 'wx5e97c199ecf8b8c3',
    alipayAppid: '',
    h5Appid: '',
    name: '渭南市中心医院',
    isOpenHealthCard: {
      healthCardText: '陕西省卫生健康委员会',
      hospitalId: '36784',
    },
    isSearchInHos: false,
    isOpenOcr: true,
  },
  '1001052': {
    wxAppid: 'wxf582e1fd4eb0142a',
    alipayAppid: '2021003173668243',
    isvAlipayAppid: '2021003159674187',
    h5Appid: 'wxd57b91aafadc73a1',
    h5AppidDisabledInTest: true,
    name: '乐清市人民医院',
    isSearchInHos: true,
    isOpenOcr: false,
    sConfig: {
      isDrugDelivery: '1',
      isOpenWechatSI: true,
      medicalMHelp: {
        wx: {
          crossProgramBizType: { clinic: '6vtqCjFiWg' },
          medicalPlugin: '1',
        },
        alipay: {
          medicalPlugin: { orgId: { '13001': 'H33038200118' }, cardType: '01' },
        },
      },
    },
  },
  '1001054': {
    wxAppid: 'wx7acc3ecadc08f7ea',
    alipayAppid: '2021003167607056',
    isvAlipayAppid: '2021003167607056',
    h5Appid: 'wxf57d660046a04f49',
    name: '咸阳市第一人民医院',
    isOpenHealthCard: {
      healthCardText: '陕西省卫生健康委员会',
      hospitalId: '37133',
    },
    isSearchInHos: true,
    alipayPid: 'ze2exd3di9dbye6cc+hfia==',
    isOpenOcr: true,
    sConfig: {
      homeTopBanner: { topShow: false, bannerHeight: 140 },
      isOpenHelpOld: '1',
      isOpenPopularSci: '1',
      homeNavTitleLogo:
        'https://phsdevoss.eheren.com/pcloud/phs3.0/xianyannavtitle.png',
      // isOpenHomeTabBarNetWorkBtn: '1',
      isOpenWechatSI: true,
      medicalMHelp: {
        isOpenPatToMedicalPat: {},
        wx: {
          medicalNation: {
            appId: 'wxe183cd55df4b4369',
            path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=610400&channel=AAFwLnLNBzDZNXVZVKdvs0v_&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtn+S/XPoOIr53u3xRWP6xq&orgCodg=H61040200092&orgAppId=1GLE8RTS20N376430B0A0000CAE3B2A4',
          },
          isMedicalOrder: '1',
        },
      },
    },
  },
  '1001055': {
    wxAppid: 'wxd9a9c329edc6e2b0',
    alipayAppid: '2021003164669106',
    isvAlipayAppid: '2021003164669106',
    name: '联勤保障部队第987医院',
    isOpenHealthCard: {
      healthCardText: '陕西省卫生健康委员会',
      hospitalId: '37139',
    },

    isSearchInHos: false,
    alipayPid: 'dl5dt/lx8x6q93cionolzw==',
    isOpenOcr: false,
    sConfig: { isOpenAlipayZndz: true, isHideHomeLogo: '1' },
  },
  '1001056': {
    wxAppid: 'wx4d8f68fdc6b6831c',
    alipayAppid: '2021003182673498',
    isvAlipayAppid: '2021003182653537',
    h5Appid: 'wxe8692caf9ede57e1',
    name: '中国人民解放军新疆军区总医院',
    isSearchInHos: false,

    isOpenOcr: false,
    isOpenHealthCard: {
      healthCardText: '新疆维吾尔自治区卫生健康委员会',
      hospitalId: '37164',
    },
    sConfig: {
      isOpenAlipayZndz: true,
      isOpenWechatSI: true,
      medicalMHelp: {
        wx: {
          medicalNation: {
            appId: 'wxe183cd55df4b4369',
            path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=650100&channel=AAHXJbrzmhk_q05MEUW1ioQn&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxuHF+LhHk733m/BRrPGb2V8&orgCodg=H65010300478&orgAppId=1GU9PR6L900C76430B0A00006D4C0BE7',
          },
        },
      },
    },
  },
  '1001057': {
    toutiaoAppid: 'ttbcd1ca6c23ed0a5401',
    wxAppid: 'wx7b1baac614ebed72',
    alipayAppid: '2021003173633521',
    isvAlipayAppid: '2021003172684536',
    h5Appid: 'wx69bb1d0f7210807b',
    name: '西安市红会互联网医院',
    isSearchInHos: true,
    h5AppidDisabledInTest: true,
    isOpenOcr: false,
    isOpenHealthCard: {
      healthCardText: '陕西省卫生健康委员会',
      hospitalId: '37218',
    },
    _des: '红会',
    sConfig: {
      isOpenPopularSci: '1',
      isOpenWechatSI: true,
      medicalCardDetailPackageDomain: 'https://01-h5-health.tengmed.com',
      medicalMHelp: {
        isOpenPatToMedicalPat: {},
        alipay: {
          medicalNation: {},
          isMedicalOrder: '1',
          isGbFamilyPayment: '1',
        },
        wx: {
          medicalNation: {
            appId: 'wxe183cd55df4b4369',
            path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=610100&channel=AAFCflpRouGx9rzCduR7IDwV&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxveJKftoNCw+TCAqUwy6fwh&orgCodg=H61010300557&orgAppId=1H39F4EL9015E2470B0A000095823F28',
          },
          crossProgramBizType: { clinic: 'mAuUBT4u0E', reg: 'w4XIxwNWzW' },
          isMedicalOrder: '1',
          isGbFamilyPayment: '1',
        },
      },
      isOpenHomeArticle: '1',
    },
  },
  '1001058': {
    wxAppid: 'wx86a78f7ced7dc55f',
    alipayAppid: '2021004144623038',
    h5Appid: 'wxc5f0f8f426249352',
    isvAlipayAppid: '2021004143660150',
    name: '濮阳市人民医院',
    isSearchInHos: true,
    isOpenOcr: false,

    sConfig: {
      isOpenWechatSI: true,
      login: { isAliAuthBase: '1' },
      isSearchHosForAddPatHasMoreThanOneCard: '1',
      medicalMHelp: {
        wx: {
          // cs
          // medicalNation: {
          //   appId: 'wxe183cd55df4b4369',
          //   path: 'auth/pages/bindcard/auth/index',
          //   pathExtraData: {
          //     openType: 'getAuthCode',
          //     bizType: '04107',
          //     cityCode: '410901',
          //     channel: 'AAESBm3dgscMbm3owOheQVk0',
          //     orgChnlCrtfCodg:
          //       'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtJRKQswprsB52V1kSQVkyD',
          //     orgCodg: 'H41090200004',
          //     orgAppId: '1HPSM9AQ20183F60C80A000061EF761F',
          //   },
          // },
          // zs
          medicalNation: {
            appId: 'wxe183cd55df4b4369',
            path: 'auth/pages/bindcard/auth/index',
            pathExtraData: {
              openType: 'getAuthCode',
              bizType: '04107',
              cityCode: '410901',
              channel: 'AAESBm3dgscMbm3owOheQVk0',
              orgChnlCrtfCodg:
                'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtJRKQswprsB52V1kSQVkyD',
              orgCodg: 'H41090200004',
              orgAppId: '1J9OSUVC502O8D430B0A000076517511',
            },
          },
          isMedicalOrder: '1',
          isGbFamilyPayment: '1',
        },
      },
    },
  },
  '1001059': {
    wxAppid: 'wxea8552a036115576',
    name: '濮阳市第五人民医院',
    isSearchInHos: true,
    isOpenOcr: false,
    sConfig: { isSearchHosForAddPatHasMoreThanOneCard: '1' },
  },
  '1001060': {
    wxAppid: 'wx799315279808c901',
    alipayAppid: '2021004103625411',
    isvAlipayAppid: '2021004105619008',
    name: '绍兴第二医院',
    h5Appid: 'wx13e186671d763023',

    isSearchInHos: true,
    isOpenOcr: false,
    sConfig: {
      isOpenHelpOld: '1',
      login: {},
      medicalMHelp: {
        alipay: {
          medicalPlugin: { orgId: { '13060': 'H33060300001' }, cardType: '01' },
        },
      },
    },
  },
  '1001062': {
    wxAppid: 'wxe09a59ebf1a15c3b',
    h5Appid: '',
    name: '大医二院普湾院区',
    isSearchInHos: false,

    isOpenOcr: false,
    _des: '这个老版本, 不知道啥用',
  },
  '1001063': {
    wxAppid: 'wx93d1e2c1e646e342',
    alipayAppid: '2021004134632001',
    h5Appid: '',
    isvAlipayAppid: '2021004134663007',
    name: '杭州口腔医院',
    isSearchInHos: false,

    isOpenOcr: false,
    sConfig: {
      login: { isSkipPerfect: '1', isAliAuthBase: '1' },
      isOpenAlipayFollow: '81fa167551234b1f8585325f56bd6726',
      isOpenWechatSI: true,
    },
  },
  '1001065': {
    wxAppid: 'wx78636dc13e06e91c',
    alipayAppid: '',
    h5Appid: '',
    name: '浙江省肿瘤医院国际保健中心',
    isSearchInHos: false,

    isOpenOcr: false,
    sConfig: { login: { isSkipPerfect: '1' } },
  },
  '1001066': {
    wxAppid: 'wxbe1f8ae346536759',
    alipayAppid: '2021004146614065',
    isvAlipayAppid: '2021004144613751',
    h5Appid: '',
    name: '宁波口腔医院',
    isSearchInHos: false,

    isOpenOcr: false,
    sConfig: {
      isOpenWechatSI: true,
      login: { isSkipPerfect: '1', isAliAuthBase: '1' },
    },
  },
  '1001067': {
    wxAppid: 'wx08440928b105c3bf',
    alipayAppid: '2021002129645591',
    h5Appid: 'wxce22d24a140ba4d5',
    name: '温医附二院就医助手',
    isSearchInHos: true,
    isOpenOcr: false,
    sConfig: {
      login: { isSkipPerfect: '1', isAliAuthBase: '1', isLoginByOpenId: '1' },
      isOpenHelpOld: '1',
      isOpenMessageAuth: '1',
      isOpenAssistMessage: '1',
      isOpenWechatSI: true,
      medicalMHelp: {
        alipay: {
          medicalPlugin: {
            orgId: {
              '13009': 'H33030200034',
              '13011': 'H33030200034',
              '13012': 'H33030200034',
              '13013': 'H33030200034',
            },
            cardType: '01',
          },
          medicalFiling: '1',
        },
      },
    },
  },
  '1001068': {
    wxAppid: 'wxb03ff137dabedd6d',
    alipayAppid: '',
    isvAlipayAppid: '',
    h5Appid: '',
    name: '宁波耳鼻喉医院',
    isSearchInHos: false,

    isOpenOcr: false,
    sConfig: { isOpenWechatSI: true },
  },
  '1001069': {
    wxAppid: 'wxf544358f2736cd20',
    alipayAppid: '2021003104674058',
    isvAlipayAppid: '2021003104624121',
    h5Appid: '',
    name: '浙江省人民医院毕节医院',

    isSearchInHos: false,
    isOpenOcr: false,
    sConfig: {
      isOpenWechatSI: true,
      medicalMHelp: {
        wx: {
          medicalNation: {
            appId: 'wxe183cd55df4b4369',
            path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=520500&channel=AAEBc2RH-gUYFz7T2U2NVQhi&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxuumfluttL87+gDtSEtCYLx&orgCodg=H52050200015&orgAppId=1JC80CJNJ03S8D430B0A0000471ED2B3',
          },
          isMedicalOrder: '1',
          isGbFamilyPayment: '1',
          medicalFiling: '1',
        },
      },
    },
  },
  '1001070': {
    wxAppid: 'wx0c0b335f85dee134',
    alipayAppid: '',
    h5Appid: '',
    isvAlipayAppid: '',
    name: '益阳医专附属口腔医院',
    isSearchInHos: false,

    isOpenOcr: false,
  },
  '1001071': {
    wxAppid: 'wxf98b0710887ab252',
    alipayAppid: '',
    h5Appid: '',
    name: '杭州口腔医院集团滨江门诊部',
    isSearchInHos: false,

    isOpenOcr: false,
    sConfig: {},
  },
  '1001073': {
    wxAppid: 'wxdd1ed079167189fa',
    h5Appid: '',
    name: '温医附二院就医助手',
    isSearchInHos: false,

    isOpenOcr: false,
    _des: '过渡板小程序引导跳转',
  },
  '1001074': {
    wxAppid: 'wxbef5313efdabfde1',
    alipayAppid: '2021004193658562',
    isvAlipayAppid: '2021004193629624',
    h5Appid: 'wxbba52ad9743cf8fe',
    name: '天水市第一人民医院',
    isSearchInHos: true,

    isOpenOcr: false,
    isOpenHealthCard: {
      healthCardText: '甘肃省卫生健康委员会',
      hospitalId: '39894',
      isCardQueryComp: true,
      isNewMode: false,
    },
    sConfig: {
      isHideHomeLogo: '1',
      isOpenWechatSI: true,
      login: {},
      medicalMHelp: {
        isOpenPatToMedicalPat: {},
        alipay: {},
        wx: {
          medicalNation: {
            appId: 'wxe183cd55df4b4369',
            path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=620500&channel=AAF-qIZucnqdnk72zjYzIJ38&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtjvE9yjYec3Tmc/8KSGSL7&orgCodg=H62050200075&orgAppId=1IC2S44OQ0028C430B0A0000A6FDEDE9',
          },
          isGbFamilyPayment: '1',
        },
      },
    },
  },
  '1001076': {
    wxAppid: 'wxe1c48c70681bfc56',
    alipayAppid: '2021004134632001',
    h5Appid: '',
    isvAlipayAppid: '2021004134663007',
    name: '昆明口腔医院',
    isSearchInHos: false,

    isOpenOcr: false,
    sConfig: { login: { isSkipPerfect: '1' } },
  },
  '1001077': {
    wxAppid: 'wx9dcb98a8c18d44ea',
    h5Appid: 'wx97fd54c614de79b4',
    alipayAppid: '2021005131642589',
    isvAlipayAppid: '2021005131668685',
    name: '陕西省中医医院',

    isOpenOcr: false,
    _des: '陕西省中医医院',
    sConfig: {
      login: { isAliAuthBase: '1' },
      medicalMHelp: {
        isOpenPatToMedicalPat: {},
        wx: {
          medicalNation: {
            appId: 'wxe183cd55df4b4369',
            path: 'auth/pages/bindcard/auth/index?openType=getAuthCode&bizType=04107&cityCode=610101&channel=AAEoVvqZuWU8BNSYVtMM15px&orgChnlCrtfCodg=BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxv2/NlHf1H5KZT+T46wCMi1&orgCodg=H61010400913&orgAppId=1IPJEE9D306C8C430B0A000022532554',
          },
          isMedicalOrder: '1',
          isGbFamilyPayment: '1',
        },
      },
    },
  },
  '1001078': {
    wxAppid: 'wx5a88bc0cf40aa66f',
    alipayAppid: '',
    h5Appid: '',
    isvAlipayAppid: '',
    name: '南京金陵口腔医院',
    isSearchInHos: false,

    isOpenOcr: false,
    sConfig: { login: { isSkipPerfect: '1' } },
  },
  '1001080': {
    wxAppid: 'wx58ffd2c3a557bef0',
    alipayAppid: '',
    h5Appid: '',
    name: '和仁智领医院',
    isSearchInHos: true,

    isOpenOcr: false,
    sConfig: {
      login: { isSkipPerfect: '1', isAliAuthBase: '1', isLoginByOpenId: '1' },
      isOpenHelpOld: '1',
      isOpenMessageAuth: '1',
      isOpenWechatSI: true,
      isOpenHomeTabBarNetWorkBtn: '1',
    },
  },
  '1001081': {
    wxAppid: 'wx55b38fca9c378c7b',
    h5Appid: '',
    alipayAppid: '',
    isvAlipayAppid: '',
    name: '浙江省健康人才发展协会',

    isOpenOcr: false,
    sConfig: {
      login: { isSkipPerfect: '1', isAliAuthBase: '1', isLoginByOpenId: '1' },
    },
  },
  '1001082': {
    wxAppid: 'wx7c53b0e82e20494e',
    h5Appid: 'wxa158d3a050857e9c',
    alipayAppid: '',
    isvAlipayAppid: '',
    name: '健康温州',

    isOpenOcr: false,
    sConfig: {
      isOpenPopularSci: '1',
      login: { isAliAuthBase: '1' },
      isOpenWechatSI: true,
    },
  },
  '1001083': {
    wxAppid: 'wxc3ee6623e27269a7',
    h5Appid: 'wx2b7984632a3bad88',
    alipayAppid: '2021005172668444',
    isvAlipayAppid: '2021005178602372',
    name: '温州市人民医院',
    isSearchInHos: true,
    h5AppidDisabledInTest: true,
    isOpenOcr: false,
    sConfig: {
      homeNavTitleLogo:
        'https://phsdevoss.eheren.com/pcloud/image/1001083logo1.png',
      login: { isSkipPerfect: '1' },
      medicalMHelp: {
        wx: {
          crossProgramBizType: {
            clinic: 'yYwA6fRicn',
            medicalFiling: 'xNetpdsuXc',
          },
          medicalFiling: '1',
          medicalPlugin: '1',
        },
        alipay: {
          medicalPlugin: {
            orgId: { '13140': 'H33030200021', '131401': 'H33030200021' },
            cardType: '01',
          },
          medicalFiling: '1',
          isFamilyPayment: '1',
        },
      },
    },
  },
  '1001084': {
    wxAppid: 'wxa50129d260033b82',
    h5Appid: 'wx679f3d1ba8fc1635',
    alipayAppid: '2021005176652664',
    isvAlipayAppid: '2021005178607990',
    name: '溧阳市人民医院',

    isOpenOcr: false,
    isSearchInHos: true,
    sConfig: {
      login: { isAliAuthBase: '1', isLoginByOpenId: '1' },
      medicalMHelp: {
        wx: {
          medicalNation: {
            appId: 'wxe183cd55df4b4369',
            path: 'auth/pages/bindcard/auth/index',
            pathExtraData: {
              openType: 'getAuthCode',
              cityCode: '320400',
              orgCodg: 'H32048100095',
              orgChnlCrtfCodg:
                'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxvXg/++7e1yfc/kbkno5H2B',
              bizType: '04107',
              orgAppId: '1I4IKUE4808A8C430B0A000072CBC284',
              channel: 'AAGIeU0wtURqrsaTlQYAvi6z',
            },
            dongRuanMedicalInfo: {
              h5BaseUrl: 'https://ybj.jscz.org.cn/cashierui',
            },
          },
          isMedicalOrder: '1',
          isGbFamilyPayment: '1',
        },
      },
    },
  },
  '1001085': {
    wxAppid: 'wx3a24f824ca86d6dc',
    h5Appid: 'wxfca4d96e3a9edf91',
    alipayAppid: '2021006124681484',
    isvAlipayAppid: '',
    name: '温州市中西医结合医院',

    isOpenOcr: false,
    isSearchInHos: true,
    sConfig: {
      login: { isSkipPerfect: '1', isAliAuthBase: '1' },
      medicalMHelp: {
        alipay: {
          medicalPlugin: {
            orgId: { '13142': 'H33030200022' },
            cardType: '01',
          },
          medicalFiling: '1',
          isFamilyPayment: '1',
        },
      },
    },
  },
  '1001087': {
    wxAppid: 'wxe48cc8a9a8ec915f',
    alipayAppid: '',
    h5Appid: '',
    isvAlipayAppid: '',
    name: '益阳口腔医院康富院区',
    isSearchInHos: false,

    isOpenOcr: false,
  },
  '1001088': {
    wxAppid: 'wx01a21ac04e7a9f37',
    alipayAppid: '',
    h5Appid: '',
    isvAlipayAppid: '',
    name: '沅江口腔医院',
    isSearchInHos: false,

    isOpenOcr: false,
  },
  '1001092': {
    wxAppid: 'wxbf7aab8afef3603a',
    alipayAppid: '2021005190632301',
    isvAlipayAppid: '2021005194657067',
    h5Appid: 'wxe8e295d7903d57d1',
    name: '延安市人民医院',

    isOpenOcr: false,
    isSearchInHos: true,
    sConfig: {
      isOpenHelpOld: '1',
      login: { isAliAuthBase: '1', isSkipPerfect: '1' },
      medicalMHelp: {
        isOpenPatToMedicalPat: {},
        wx: {
          medicalNation: {
            appId: 'wxe183cd55df4b4369',
            path: 'auth/pages/bindcard/auth/index',
            pathExtraData: {
              openType: 'getAuthCode',
              bizType: '04107',
              cityCode: '610600',
              channel: 'AAFjWNlsD_YjoGPGECfQP-LW',
              orgChnlCrtfCodg:
                'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtVok110ttUbcrc5BbIj9rW',
              orgCodg: 'H61060200365',
              orgAppId: '1JAQFM29V01U8C430B0A0000C1B4E028',
            },
          },
          isMedicalOrder: '1',
          isGbFamilyPayment: '1',
        },
      },
    },
  },
  '1001093': {
    wxAppid: 'wx2e06292a91e9f162',
    alipayAppid: '2021003104628364',
    h5Appid: 'wx425067e6f6726598',
    isvAlipayAppid: '',
    h5AppidDisabledInTest: true,
    name: '浙江省肿瘤医院',

    isOpenOcr: false,
    isSearchInHos: true,
    sConfig: {
      // homeMyShowTogglePatComponent: '1',
      homeStyle: '1',
      isOpenHelpOld: '1',
      login: { isAliAuthBase: '1', isSkipPerfect: '1' },
      isOpenWechatSI: true,
      isWxShowToggleEcZh: '1',
      homeTopBanner: { topShow: true, bannerHeight: 230 },
      medicalMHelp: {
        wx: {
          medicalPlugin: '1',
          // medicalDefault: '1',
          medicalFiling: '1',
          crossProgramBizType: {
            clinic: 'T2loeEEdAO',
            medicalFiling: 'Xeu2ztYzX9',
          },
        },
        alipay: {
          medicalDefault: '1',
          medicalFiling: '1',
          isFamilyPayment: '1',
          medicalPlugin: { orgId: { '13152': 'H33010500310' }, cardType: '01' },
        },
      },
      homeTopBg:
        'https://phsdevoss.eheren.com/pcloud/phs3.0/stand3-1001093-home-topbg.png',
      homeNavTitleLogo:
        'https://phsdevoss.eheren.com/pcloud/phs3.0/stand3-1001093-home-navtitle.png',
    },
  },
  '1001094': {
    wxAppid: 'wx081a6fb9ee8778e4',
    h5Appid: 'wx082515d97bb4b974',
    name: '新疆维吾尔自治区中医医院',

    isOpenOcr: false,
    isSearchInHos: true,
    isOpenHealthCard: {
      healthCardText: '新疆维吾尔自治区卫生健康委员会',
      hospitalId: '40652',
    },
    sConfig: {
      isOpenAssistMessage: '1',
      homeNavTitleLogo:
        'https://phsdevoss.eheren.com/pcloud/phs3.0/xinjiangzhongyinavtitle.png',
      isOpenHelpOld: '1',
      isOpenPopularSci: '1',
      isOpenWechatSI: true,
      homeTopBanner: { topShow: true, bannerHeight: 200 },
      login: { isSkipPerfect: '1' },
      medicalMHelp: {
        isOpenPatToMedicalPat: {},
        wx: {
          isMedicalOrder: '1',
          medicalNation: {
            appId: 'wxe183cd55df4b4369',
            path: 'auth/pages/bindcard/auth/index',
            pathExtraData: {
              openType: 'getAuthCode',
              bizType: '04107',
              cityCode: '650100',
              channel: 'AAEZDc60WgTiVxo5xtoqTx-g',
              orgChnlCrtfCodg:
                'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxsNriL3sY3GfFVjZHL7b0de',
              orgCodg: 'H65010300208',
              orgAppId: '1GJ8TA8QI0IE75430B0A0000F938BFC7',
              sourceapp: 'wx081a6fb9ee8778e4-1',
            },
            pathExtraDataConfig: {
              '1314301': {
                openType: 'getAuthCode',
                bizType: '04107',
                cityCode: '650100',
                channel: 'AAEZDc60WgTiVxo5xtoqTx-g',
                orgChnlCrtfCodg:
                  'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxsNriL3sY3GfFVjZHL7b0de',
                orgCodg: 'H65010300208',
                orgAppId: '1GJ8TA8QI0IE75430B0A0000F938BFC7',
                sourceapp: 'wx081a6fb9ee8778e4-1',
              },
              '1314302': {
                openType: 'getAuthCode',
                bizType: '04107',
                cityCode: '650100',
                channel: 'AAFnB6FxCsnf4D2WcS3JifN8',
                orgChnlCrtfCodg:
                  'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxup9p6OTEwpdxuIGgYrHBhV',
                orgCodg: 'H65017100367',
                orgAppId: '1ISCR539P0048D430B0A000030129568',
                sourceapp: 'wx081a6fb9ee8778e4',
              },
              '1314303': {
                openType: 'getAuthCode',
                bizType: '04107',
                cityCode: '650100',
                channel: 'AAEZDc60WgTiVxo5xtoqTx-g',
                orgChnlCrtfCodg:
                  'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtvSq+Y54oo16Lhwmw3TH2y',
                orgCodg: 'H65010200368',
                orgAppId: '1H16HC3ND00I3F60C80A0000EEF6825C',
                sourceapp: 'wx081a6fb9ee8778e4',
              },
            },
          },
        },
      },
    },
  },
  '1001095': {
    wxAppid: 'wx41ed9678ac802d7e',
    alipayAppid: '2021002125637380',
    isvAlipayAppid: '',
    h5Appid: 'wxe815b1a8cf9e5067',
    name: '义乌市中心医院',

    isOpenOcr: false,
    isSearchInHos: true,
    sConfig: {
      login: { isSkipPerfect: '1' },
      homeNavTitleLogo:
        'https://phsdevoss.eheren.com/pcloud/phs3.0/yw_logoname.png',
    },
  },
  '1001097': {
    wxAppid: 'wx868bfb27a64b370c',
    h5Appid: 'wx329a8f2cab652552',
    alipayAppid: '2021002193673800',
    isvAlipayAppid: '',
    name: '舟山市普陀区人民医院',
    h5AppidDisabledInTest: true,

    isSearchInHos: true,
    isOpenOcr: false,
    sConfig: { isDrugDelivery: '1', isOpenHelpOld: '1' },
  },
  '1001098': {
    wxAppid: 'wxe57689990fa308f8',
    h5Appid: '',
    alipayAppid: '',
    isvAlipayAppid: '',
    name: '桂中医赛院附属中医门诊部',
    h5AppidDisabledInTest: true,

    isSearchInHos: false,
    isOpenOcr: false,
    sConfig: { isOpenHelpOld: '1' },
  },
  '1001099': {
    wxAppid: 'wx64d48b1de1c41cb8',
    h5Appid: 'wx00cb6182a8c21b09',
    alipayAppid: '2021002133687534',
    name: '郑州市中医院',
    h5AppidDisabledInTest: true,

    isSearchInHos: true,
    isOpenOcr: false,
    sConfig: {
      isOpenHelpOld: '1',
      isOpenWechatSI: true,
      login: { isSkipPerfect: '1' },
      medicalMHelp: {
        wx: {
          isMedicalOrder: '1',
          isGbFamilyPayment: '1',
          medicalNation: {
            appId: 'wxe183cd55df4b4369',
            path: 'auth/pages/bindcard/auth/index',
            // cs
            // pathExtraData: {
            //   openType: 'getAuthCode',
            //   bizType: '04107',
            //   cityCode: '410101',
            //   channel: 'AAG05QdjP5yQIRc05wpvThnI',
            //   orgChnlCrtfCodg:
            //     'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtqg5V3ila4Zg8ONhjCsZO5',
            //   orgCodg: 'H41010200019',
            //   orgAppId: '1JBCC0LUB14U4460C80A0000C7255DC3',
            // },

            // zs
            pathExtraData: {
              openType: 'getAuthCode',
              bizType: '04107',
              cityCode: '410101',
              channel: 'AAG05QdjP5yQIRc05wpvThnI',
              orgChnlCrtfCodg:
                'BqK1kMStlhVDgN2uHf4EsLK/F2LjZPYJ81nK2eYQqxtqg5V3ila4Zg8ONhjCsZO5',
              orgCodg: 'H41010200019',
              orgAppId: '1JFFNJORA0BQ8D430B0A0000DFBC6F57',
            },
          },
        },

        alipay: {
          medicalNation: {},
        },
      },
    },
  },
  '1001101': {
    wxAppid: 'wxb0cb07afbebac462',
    alipayAppid: '2021003154666616',
    h5Appid: 'wx7e88bc4968e4e9f0',
    name: '湖州市中心医院',
    h5AppidDisabledInTest: true,
    isSearchInHos: true,
    isOpenOcr: false,
    sConfig: {
      login: { isSkipPerfect: '1' },
    },
  },
  '1001102': {
    name: '绍兴市中医院',
    wxAppid: 'wxf343a92ddd77b40b',
    alipayAppid: '2021003148628093',
    h5Appid: 'wxdfe5ad8722bac411',

    isSearchInHos: true,
    isOpenOcr: false,
    sConfig: {
      login: { isSkipPerfect: '1' },
    },
  },
  '1001103': {
    wxAppid: 'wxf82fb22d5a87e9af',
    name: '上海儿童医学中心贵州医院',
    isSearchInHos: false,
    isOpenOcr: false,
    sConfig: {
      isOpenHelpOld: '1',
      isWxShowToggleEcZh: '1',

      login: { isSkipPerfect: '1' },
      homeNavTitleLogo:
        'https://phsdevoss.eheren.com/pcloud/phs3.0/1001103-home-nav-title.png',
    },
  },
  '1001109': {
    wxAppid: 'wxcddd0738d61b8737',
    name: '南湖家庭医生签约小程序',
    isSearchInHos: false,
    isOpenOcr: false,
    sConfig: {
      login: { isSkipPerfect: '1' }
    },
  },
  '2001004': {
    wxAppid: 'wx101158c57640d854',
    alipayAppid: '',
    h5Appid: '',
    name: '渭南电子健康卡',
    isOpenHealthCard: {
      healthCardText: '陕西省卫生健康委员会',
      hospitalId: '36658',
    },
    isSearchInHos: false,
    isOpenOcr: true,
  },
  '2001012': {
    wxAppid: 'wx15abd81c31993d20',
    alipayAppid: '',
    h5Appid: 'wx941119f41e867811',
    name: '健康清丰',
    isSearchInHos: false,
    isOpenOcr: false,
  },
  '2001013': {
    wxAppid: 'wxda3a65909cbc3e3c',
    alipayAppid: '2021002133632822',
    h5Appid: 'wx12f8b744255a6f5d',
    name: '健康金湖',

    isSearchInHos: false,
    isOpenOcr: false,
  },
};

export const manifestFileDataObj: any = {
  appid: '__UNI__DC06FC7',
  description: '',
  versionName: '1.0.0',
  versionCode: '100',
  transformPx: false,
  'app-plus': {
    usingComponents: true,
    nvueStyleCompiler: 'uni-app',
    compilerVersion: 3,
    splashscreen: {
      alwaysShowBeforeRender: true,
      waiting: true,
      autoclose: true,
      delay: 0,
    },
    modules: {},
    distribute: {
      android: {
        permissions: [
          '<uses-permission android:name="android.permission.CHANGE_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.MOUNT_UNMOUNT_FILESYSTEMS"/>',
          '<uses-permission android:name="android.permission.VIBRATE"/>',
          '<uses-permission android:name="android.permission.READ_LOGS"/>',
          '<uses-permission android:name="android.permission.ACCESS_WIFI_STATE"/>',
          '<uses-feature android:name="android.hardware.camera.autofocus"/>',
          '<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>',
          '<uses-permission android:name="android.permission.CAMERA"/>',
          '<uses-permission android:name="android.permission.GET_ACCOUNTS"/>',
          '<uses-permission android:name="android.permission.READ_PHONE_STATE"/>',
          '<uses-permission android:name="android.permission.CHANGE_WIFI_STATE"/>',
          '<uses-permission android:name="android.permission.WAKE_LOCK"/>',
          '<uses-permission android:name="android.permission.FLASHLIGHT"/>',
          '<uses-feature android:name="android.hardware.camera"/>',
          '<uses-permission android:name="android.permission.WRITE_SETTINGS"/>',
        ],
      },
      ios: {},
      sdkConfigs: {},
    },
  },
  quickapp: {},
  'mp-weixin': {
    appid: 'wxe26143481567cb97',
    __usePrivacyCheck__: true,
    setting: {
      urlCheck: false,
      postcss: false,
      minified: true,
      es6: true,
    },
    optimization: {
      subPackages: true,
      treeShaking: {
        enable: true, // 启用 Tree-Shaking
      },
    },
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序位置接口的效果展示',
      },
    },
    requiredPrivateInfos: ['chooseLocation', 'getLocation', 'chooseAddress'],
    usingComponents: true,
    plugins: {},
    mergeVirtualHostAttributes: true,
    lazyCodeLoading: 'requiredComponents',
    libVersion: 'latest',
  },
  'mp-alipay': {
    component2: true,
    usingComponents: true,
    plugins: {},
    mergeVirtualHostAttributes: true,
    appid: '2021002139602458',

    window: {
      navigationStyle: 'custom',
      defaultTitle: '',
      titleBarColor: '#ffffff',
    },

    'mini.project.json': {
      compileOptions: {
        codeObfuscation: {
          enable: true, // 启用混淆
          type: 'strong', // 混淆强度：normal/strong
        },
      },
    },
  },
  'mp-harmony': {
    distribute: {
      compileSdkVersion: 10,
      targetSdkVersion: 11,
      signingConfigs: {
        default: {
          certpath:
            '/Users/chaoqincai/Library/Application Support/HBuilder X/extensions/launcher/agc-certs/1772441480205.cer',
          keyAlias: 'debugKey',
          keyPassword:
            '0000001BFC8B5B3C076B42F630A5A14F2F64D2C3E01545CA5B8EB12247500BC58C076E3B13A01357CDAF53',
          profile:
            '/Users/chaoqincai/Library/Application Support/HBuilder X/extensions/launcher/agc-certs/1772441480205.p7b',
          signAlg: 'SHA256withECDSA',
          storeFile:
            '/Users/chaoqincai/Library/Application Support/HBuilder X/extensions/launcher/agc-certs/1763103743000.p12',
          storePassword:
            '0000001BFC8B5B3C076B42F630A5A14F2F64D2C3E01545CA5B8EB12247500BC58C076E3B13A01357CDAF53',
        },
        release: {
          storeFile:
            '/Users/chaoqincai/Documents/resource/WorkSource/1001035/harmony/prod1001035.jks',
          storePassword:
            '000000303200C7034FC0C003C2FCD10FE23A171296A1A0E5C0D40F99FB97C96C719F6AA10CA5DBBE2D711B75F11A6CB33EF361D3C9702C30C1FC657C4C26C7F2',
          keyAlias: 'prodalias1001035',
          keyPassword:
            '00000030C7051F0929775DD81700DAF49DAF8A4B55B34451379F13369EA7A014B8D5782515A2579423C8ECF1656EBBB20B16729AFC52E3F74031E89A3BE91CC1',
          signAlg: 'SHA256withECDSA',
          profile:
            '/Users/chaoqincai/Documents/resource/WorkSource/1001035/harmony/prod1001035Release.p7b',
          certpath:
            '/Users/chaoqincai/Documents/resource/WorkSource/1001035/harmony/prod1001035.cer',
        },
      },
      bundleName: 'com.atomicservice.6917564602329951506',
    },
    domainList: [
      {
        domain: 'phs.jshtcm.com',
        type: 'business',
        description: '接口请求域名',
      },
      {
        domain: 'testphs.eheren.com',
        type: 'business',
        description: '接口请求域名',
      },
      {
        domain: 'netphs.eheren.com',
        type: 'business',
        description: '接口请求域名',
      },
    ],
  },
  'mp-baidu': {
    usingComponents: true,
  },
  'mp-toutiao': {
    usingComponents: true,
  },
  uniStatistics: {
    enable: false,
  },
  vueVersion: '3',
  name: '台州市第一人民医院',
  h5: {
    optimization: {
      treeShaking: {
        enable: false,
      },
    },
    router: {
      base: './',
    },
    sdkConfigs: {
      maps: {
        qqmap: {
          key: 'GH4BZ-SD6L3-2WN3U-3BAE5-7UYIH-3SFRJ',
        },
      },
    },
  },
};
