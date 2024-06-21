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
  return [
    {
      time: 1717173816000,
      open: 49,
      close: 50,
      high: 55,
      low: 48,
      volume: 12,
    },
    {
      time: 1717260216000,
      open: 48.76,
      close: 48.76,
      high: 48.76,
      low: 48.76,
      volume: 3,
    },
    {
      time: 1717346616000,
      open: 48.52,
      close: 48.52,
      high: 48.52,
      low: 48.52,
      volume: 2,
    },
    {
      time: 1717433016000,
      open: 48.28,
      close: 48.28,
      high: 48.28,
      low: 48.28,
      volume: 7,
    },
    {
      time: 1717519416000,
      open: 48.04,
      close: 48.04,
      high: 48.04,
      low: 48.04,
      volume: 2,
    },
    {
      time: 1717605816000,
      open: 47.8,
      close: 47.8,
      high: 47.8,
      low: 47.8,
      volume: 4,
    },
    {
      time: 1717692216000,
      open: 47.56,
      close: 47.56,
      high: 47.56,
      low: 47.56,
      volume: 15,
    },
    {
      time: 1717778616000,
      open: 47.08,
      close: 47.08,
      high: 47.08,
      low: 47.08,
      volume: 8,
    },
    {
      time: 1717865016000,
      open: 46.84,
      close: 46.84,
      high: 46.84,
      low: 46.84,
      volume: 5,
    },
  ];
};

enum Api {
  isFirst = '/tradingview/isFirst',
}

export const isFirst = (params: any) => defHttp.get<Boolean>({ url: Api.isFirst, params });
