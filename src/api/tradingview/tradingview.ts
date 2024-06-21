import { defHttp } from '@/utils/http/axios';

enum Api {
  StockSearch = '/stock-info/searchSymbols',
  GetDayWeekYearData = '/stock-info/getDayWeekYearData',
}
// export const stockSearch = (params?: any) => defHttp.get<any>({ url: Api.StockSearch, params });
export const stockSearch = (params?: any) => {
  return [
    {
      full_name: 'SH:600000/RMB',
      symbol: '600000',
      description: '上证',
      exchange: 'SH',
      type: 'stock',
    },
  ];
};

// export const getDayWeekYearData = (params: any) =>
//   defHttp.post<any>({ url: Api.GetDayWeekYearData, params });
export const getDayWeekYearData = (params: any) => {
  return [{
    time: number;
        low: number;
        high: number;
        open: number;
        close: number;
        volume: number;
  }];
};

enum Api {
  isFirst = '/tradingview/isFirst',
}

export const isFirst = (params: any) => defHttp.get<Boolean>({ url: Api.isFirst, params });
