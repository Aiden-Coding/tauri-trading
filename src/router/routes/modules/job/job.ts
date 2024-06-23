import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const charts: AppRouteModule = {
  path: '/job',
  name: 'job',
  component: LAYOUT,
  redirect: '/job/job_list',
  meta: {
    orderNo: 500,
    title: 'job',
  },
  children: [
    {
      path: 'job_list',
      name: 'job_list',
      meta: {
        title: 'job_list',
      },
      component: () => import('@/views/job/index.vue'),
    },
  ],
};

export default charts;
