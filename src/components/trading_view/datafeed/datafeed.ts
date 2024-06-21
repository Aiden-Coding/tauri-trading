/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  DatafeedConfiguration,
  HistoryCallback,
  LibrarySymbolInfo,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  ErrorCallback,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
  SymbolResolveExtension,
  GetMarksCallback,
  TimescaleMark,
  ServerTimeCallback,
} from './charting_library';
import { subscribeOnStream, unsubscribeFromStream } from './streaming.js';

import { stockSearch, getDayWeekYearData } from '@/api/tradingview/tradingview';

const lastBarsCache = new Map<string, any>();

const configurationData: DatafeedConfiguration = {
  supported_resolutions: [
    '1T' as ResolutionString,
    '5T' as ResolutionString,
    '100T' as ResolutionString, //tick
    '1S' as ResolutionString,
    '2S' as ResolutionString,
    '100S' as ResolutionString, //second
    '1' as ResolutionString,
    '2' as ResolutionString,
    '100' as ResolutionString, //minute
    '60' as ResolutionString,
    '120' as ResolutionString,
    '240' as ResolutionString, //hour
    '1D' as ResolutionString,
    '2D' as ResolutionString,
    '100D' as ResolutionString, //day
    '1W' as ResolutionString,
    '2W' as ResolutionString,
    '240W' as ResolutionString, //week
    '1M' as ResolutionString,
    '2M' as ResolutionString,
    '100M' as ResolutionString, //month
    '12M' as ResolutionString,
    '24M' as ResolutionString,
    '48M' as ResolutionString, //year
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
  onReady: (callback: (data: DatafeedConfiguration) => void) => {
    console.log('[onReady]: Method call');
    setTimeout(() => callback(configurationData));
  },

  searchSymbols: async (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback,
  ) => {
    console.log('[searchSymbols]: Method call');
    const symbols = await stockSearch({
      userInput: userInput,
      exchange: exchange,
      symbolType: symbolType,
    });
    onResult(symbols);
  },

  resolveSymbol: async (
    symbolName: string,
    onResolve: ResolveCallback,
    onError: ErrorCallback,
    extension?: SymbolResolveExtension,
  ) => {
    console.log('[resolveSymbol]: Method call', symbolName);
    const symbols = await stockSearch({ ticker: symbolName });
    let symbolItem;
    if (symbols) {
      symbolItem = symbols[0];
    }
    if (!symbolItem) {
      console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
      onError('cannot resolve symbol');
      return;
    }
    // Symbol information object
    const symbolInfo: LibrarySymbolInfo = {
      ticker: symbolItem.full_name,
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
      listed_exchange: symbolItem.exchange,
      format: 'price',
      // data_status: 'treaming',
    };
    console.log('[resolveSymbol]: Symbol resolved', symbolName);
    onResolve(symbolInfo);
  },

  getBars: async (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: ErrorCallback,
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
        onResult([], { noData: true });
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
        const tmp_time = bar['time'] / 1000;
        if (tmp_time >= from && tmp_time < to) {
          bars = [
            ...bars,
            {
              time: bar['time'],
              low: bar['low'],
              high: bar['high'],
              open: bar['open'],
              close: bar['close'],
              volume: bar['volume'],
            },
          ];
        }
      });
      if (firstDataRequest && symbolInfo.ticker) {
        lastBarsCache.set(symbolInfo.ticker, {
          ...bars[bars.length - 1],
        });
      }
      console.log(`[getBars]: returned ${bars.length} bar(s)`);
      onResult(bars, { noData: false });
    } catch (error) {
      console.log('[getBars]: Get error', error);
      onError(error);
    }
  },
  subscribeBars: (
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void,
  ) => {
    console.log('[subscribeBars]: Method call with subscriberUID:', listenerGuid);
    if (symbolInfo.ticker) {
      subscribeOnStream(
        symbolInfo,
        resolution,
        onTick,
        listenerGuid,
        onResetCacheNeededCallback,
        lastBarsCache.get(symbolInfo.ticker),
      );
    }
  },

  unsubscribeBars: (listenerGuid: string) => {
    console.log('[unsubscribeBars]: Method call with subscriberUID:', listenerGuid);
    unsubscribeFromStream(listenerGuid);
  },
  getMarks: async (
    symbolInfo: LibrarySymbolInfo,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<Mark>,
    resolution: ResolutionString,
  ) => {
    console.log('getMarks');
    onDataCallback([
      {
        id: 1,
        time: to,
        color: 'red',
        text: ['This is the mark pop-up text.'],
        label: 'M',
        labelFontColor: 'blue',
        minSize: 25,
      },
      {
        id: 2,
        time: to + 5260000, // 2 months
        color: 'red',
        text: ['Second marker'],
        label: 'S',
        labelFontColor: 'green',
        minSize: 25,
      },
    ]);
  },
  getTimescaleMarks: (
    symbolInfo: LibrarySymbolInfo,
    from: number,
    to: number,
    onDataCallback: GetMarksCallback<TimescaleMark>,
    resolution: ResolutionString,
  ) => {
    // optional
    console.log('getTimescaleMarks');

    let marks: TimescaleMark[] = [];

    if (symbolInfo.name === 'AAPL') {
      marks = [
        {
          id: 1,
          time: from,
          color: 'red',
          label: 'Aa',
          tooltip: ['Lorem', 'Ipsum', 'Dolor', 'Sit'],
        },
        {
          id: 2,
          time: from + 5260000, // 2 months
          color: 'blue',
          label: 'B',
          tooltip: ['Amet', 'Consectetur', 'Adipiscing', 'Elit'],
        },
      ];
    } else {
      marks = [
        {
          id: 'String id',
          time: to,
          color: 'red',
          label: 'T',
          tooltip: ['Nulla'],
        },
      ];
    }
    onDataCallback(marks);
  },
  getServerTime: async (callback: ServerTimeCallback) => {
    callback(232332);
  },
};
