import { BasicColumn, FormSchema } from '@/components/Table';

export const columns: BasicColumn[] = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 120,
  },
  {
    title: 'SpringBean名称',
    dataIndex: 'beanName',
    width: 120,
  },
  {
    title: '执行参数',
    dataIndex: 'params',
    width: 120,
  },
  {
    title: 'cron表达式',
    dataIndex: 'cronExpres',
    width: 120,
  },
  {
    title: '任务状态',
    dataIndex: 'state',
    width: 180,
  },
  {
    title: '备注',
    dataIndex: 'remark',
    width: 200,
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'beanName',
    label: 'SpringBean名称',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'beanName',
    label: 'SpringBean名称',
    component: 'Input',
    helpMessage: ['SpringBean名称不能重复'],
    rules: [
      {
        required: true,
        message: '请输入SpringBean',
      },
    ],
  },
  {
    field: 'id',
    label: 'id',
    component: 'Input',
    required: false,
    ifShow: false,
  },
  {
    field: 'params',
    label: '执行参数',
    component: 'Input',
    required: false,
  },
  {
    field: 'cronExpres',
    label: 'cron表达式',
    component: 'Input',
    required: true,
  },
  {
    label: '任务状态',
    field: 'state',
    component: 'Select',
    componentProps: {
      options: [
        {
          label: '正常',
          value: '1',
          key: '1',
        },
        {
          label: '暂停',
          value: '2',
          key: '2',
        },
      ],
    },
    required: true,
  },

  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
