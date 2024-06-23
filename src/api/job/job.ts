import { defHttp } from '@/utils/http/axios';

enum Api {
  JobPageList = '/quartz-job/page',
  JobSave = '/quartz-job/job',
  JobRun = '/quartz-job/job/runOnce/',
  StockSearch = '/stock-info/searchSymbols',
  GetDayWeekYearData = '/stock-info/getDayWeekYearData',
}

export const jobPageList = (params: any) => defHttp.post<any>({ url: Api.JobPageList, params });

export const jobSave = (params: any) => defHttp.post({ url: Api.JobSave, params });
export const jobUpdate = (params: any) => defHttp.put({ url: Api.JobSave, params });
export const jobRun = (id: any) => defHttp.get({ url: Api.JobRun + id });
