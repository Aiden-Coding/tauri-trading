import type { AppRouteModule } from '@/router/types';
import { LAYOUT } from '@/router/constant';

const IFrame = () => import('@/views/sys/iframe/FrameBlank.vue');

const charts: AppRouteModule = {
  path: '/charting_view',
  name: 'charting_view',
  component: LAYOUT,
  redirect: '/charting_view/echarts/map',
  meta: {
    orderNo: 1,
    title: 'charting',
    icon: 'streamline:stock',
  },
  children: [
    {
      path: 'charting_library',
      name: 'charting_library',
      meta: {
        title: 'ChartingLibrary',
        icon: 'ant-design:stock-outlined',
      },
      component: () => import('@/views/charting/ChartingLibrary.vue'),
    },
    {
      path: 'tonghuashun',
      name: 'tonghuashun',
      component: IFrame,
      meta: {
        frameSrc: 'https://q.10jqka.com.cn/',
        title: '行情中心',
        icon: 'ant-design:stock-outlined',
      },
    },
    {
      path: 'tonghuashun_gn',
      name: 'tonghuashun_gn',
      component: IFrame,
      meta: {
        frameSrc: 'http://q.10jqka.com.cn/gn/',
        title: '概念',
        icon: 'ant-design:stock-outlined',
      },
    },
    {
      path: 'tonghuashun_bk',
      name: 'tonghuashun_bk',
      component: IFrame,
      meta: {
        frameSrc: 'http://q.10jqka.com.cn/thshy/',
        title: '行业',
        icon: 'ant-design:stock-outlined',
      },
    },
    {
      path: 'tonghuashun_longhu',
      name: 'tonghuashun_longhu',
      component: IFrame,
      meta: {
        frameSrc: 'http://data.10jqka.com.cn/market/longhu/',
        title: '龙虎榜',
        icon: 'ant-design:stock-outlined',
      },
    },
    {
      path: 'tonghuashun_hongkong',
      name: 'tonghuashun_hongkong',
      component: IFrame,
      meta: {
        frameSrc: 'http://q.10jqka.com.cn/hk/',
        title: '香港',
        icon: 'ant-design:stock-outlined',
      },
    },
    {
      path: 'tonghuashun_jishu',
      name: 'tonghuashun_jishu',
      component: IFrame,
      meta: {
        frameSrc: 'http://data.10jqka.com.cn/rank/cxg/',
        title: '技术',
        icon: 'ant-design:stock-outlined',
      },
    },
  ],
};

export default charts;
