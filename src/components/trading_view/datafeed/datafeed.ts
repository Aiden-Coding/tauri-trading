/* eslint-disable @typescript-eslint/no-unused-vars */
import { DatafeedConfiguration } from './charting_library';
import { makeApiRequest, generateSymbol, parseFullSymbol } from './helper';
import { subscribeOnStream, unsubscribeFromStream } from './streaming.js';

import { stockSearch, getDayWeekYearData } from '@/api/tradingview/tradingview';

const lastBarsCache = new Map<string, any>();

interface Exchange {
  value: string;
  name: string;
  desc: string;
}

interface SymbolType {
  name: string;
  value: string;
}

const configurationData: DatafeedConfiguration = {
  supported_resolutions: [
    '1T',
    '5T',
    '100T', //tick
    '1S',
    '2S',
    '100S', //second
    '1',
    '2',
    '100', //minute
    '60',
    '120',
    '240', //hour
    '1D',
    '2D',
    '100D', //day
    '1W',
    '2W',
    '240W', //week
    '1M',
    '2M',
    '100M', //month
    '12M',
    '24M',
    '48M', //year
  ],
  exchanges: [
    {
      value: '',
      name: '所有市场',
      desc: '所有市场',
    },
    {
      value: 'SH',
      name: '上海交易所',
      desc: '上海交易所',
    },
    {
      value: 'SZ',
      name: '深圳交易所',
      desc: '深圳交易所',
    },
    {
      value: 'CHINA',
      name: '中国交易所',
      desc: '中国交易所',
    },
  ],
  symbols_types: [
    {
      name: '所有类型',
      value: '',
    },
    {
      name: 'A股票',
      value: 'stock',
    },
    {
      name: 'ETF',
      value: 'etf',
    },
    {
      name: '指数',
      value: 'index',
    },
    {
      name: '可转债',
      value: 'kzz',
    },
  ],
  supports_marks: true,
  supports_time: true,
};

export default {
  onReady: (callback: (data: ConfigurationData) => void) => {
    console.log('[onReady]: Method call');
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: (symbols: any[]) => void,
  ) => {
    console.log('[searchSymbols]: Method call');
    const symbols = await stockSearch({
      userInput: userInput,
      exchange: exchange,
      symbolType: symbolType,
    });
    onResultReadyCallback(symbols);
  },

  resolveSymbol: async (
    symbolName: string,
    onSymbolResolvedCallback: (symbolInfo: any) => void,
    onResolveErrorCallback: (error: string) => void,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    extension: any,
  ) => {
    console.log('[resolveSymbol]: Method call', symbolName);
    const symbols = await stockSearch({ ticker: symbolName });
    let symbolItem;
    if (symbols) {
      symbolItem = symbols[0];
    }
    if (!symbolItem) {
      console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
      onResolveErrorCallback('cannot resolve symbol');
      return;
    }
    // Symbol information object
    const symbolInfo: {
      ticker: string;
      full_name: string;
      name: string;
      description: string;
      type: string;
      session: string;
      timezone: string;
      exchange: string;
      minmov: number;
      pricescale: number;
      has_intraday: boolean;
      has_weekly_and_monthly: boolean;
      supported_resolutions: string[];
      volume_precision: number;
      // data_status: string
    } = {
      ticker: symbolItem.full_name,
      full_name: symbolItem.full_name,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      session: '0930-1500',
      timezone: 'Asia/Shanghai',
      exchange: symbolItem.exchange,
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      has_weekly_and_monthly: true,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      // data_status: 'treaming',
    };
    console.log('[resolveSymbol]: Symbol resolved', symbolName);
    onSymbolResolvedCallback(symbolInfo);
  },

  getBars: async (
    symbolInfo: any,
    resolution: string,
    periodParams: any,
    onHistoryCallback: (bars: any[], options: any) => void,
    onErrorCallback: (error: any) => void,
  ) => {
    const { from, to, firstDataRequest } = periodParams;
    try {
      const data = await getDayWeekYearData({
        symbol: symbolInfo.name,
        exchange: symbolInfo.exchange,
        resolution: resolution,
        from,
        to,
      });
      if (data.length === 0) {
        onHistoryCallback([], { noData: true });
        return;
      }
      let bars: {
        time: number;
        low: number;
        high: number;
        open: number;
        close: number;
        volume: number;
      }[] = [];
      data.forEach((bar) => {
        const tmp_time = bar['日期'] / 1000;
        if (tmp_time >= from && tmp_time < to) {
          bars = [
            ...bars,
            {
              time: bar['日期'],
              low: bar['最低'],
              high: bar['最高'],
              open: bar['开盘'],
              close: bar['收盘'],
              volume: bar['成交量'],
            },
          ];
        }
      });
      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.ticker, {
          ...bars[bars.length - 1],
        });
      }
      console.log(`[getBars]: returned ${bars.length} bar(s)`);
      onHistoryCallback(bars, { noData: false });
    } catch (error) {
      console.log('[getBars]: Get error', error);
      onErrorCallback(error);
    }
  },
  subscribeBars: (
    symbolInfo: any,
    resolution: string,
    onRealtimeCallback: (bar: any) => void,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void,
  ) => {
    console.log('[subscribeBars]: Method call with subscriberUID:', subscriberUID);
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.full_name),
    );
  },

  unsubscribeBars: (subscriberUID: string) => {
    console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
    unsubscribeFromStream(subscriberUID);
  },
  getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    console.log('getMarks');

    onDataCallback([
      {
        id: 1,
        time: endDate,
        color: 'red',
        text: ['This is the mark pop-up text.'],
        label: 'M',
        labelFontColor: 'blue',
        minSize: 25,
      },
      {
        id: 2,
        time: endDate + 5260000, // 2 months
        color: 'red',
        text: ['Second marker'],
        label: 'S',
        labelFontColor: 'green',
        minSize: 25,
      },
    ]);
  },
  getTimescaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    // optional
    console.log('getTimescaleMarks');

    let marks = [];

    if (symbolInfo.name === 'AAPL') {
      marks = [
        {
          id: 1,
          time: startDate,
          color: 'red',
          label: 'Aa',
          minSize: 30,
          tooltip: ['Lorem', 'Ipsum', 'Dolor', 'Sit'],
        },
        {
          id: 2,
          time: startDate + 5260000, // 2 months
          color: 'blue',
          label: 'B',
          minSize: 30,
          tooltip: ['Amet', 'Consectetur', 'Adipiscing', 'Elit'],
        },
      ];
    } else {
      marks = [
        {
          id: 'String id',
          time: endDate,
          color: 'red',
          label: 'T',
          tooltip: ['Nulla'],
        },
      ];
    }
    onDataCallback(marks);
  },
  getServerTime: (callback: ServerTimeCallback) => {},
};
