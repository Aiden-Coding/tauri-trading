import { defHttp } from '@/utils/http/axios';

enum Api {
  StockSearch = '/stock-info/searchSymbols',
  GetDayWeekYearData = '/stock-info/getDayWeekYearData',
}
export const stockSearch = (params?: any) => defHttp.get<any>({ url: Api.StockSearch, params });

export const getDayWeekYearData = (params: any) =>
  defHttp.post<any>({ url: Api.GetDayWeekYearData, params });

enum Api {
  isFirst = '/tradingview/isFirst',
}

export const isFirst = (params: any) => defHttp.get<Boolean>({ url: Api.isFirst, params });
