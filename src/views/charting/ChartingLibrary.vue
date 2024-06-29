<template>
  <div class="TVChartContainer" ref="chartContainer"></div>
</template>
<script setup>
    import { onMounted, ref, onUnmounted } from 'vue';
    import Datafeed from '@/components/trading_view/datafeed/datafeed';
import { isFirst } from '@/api/tradingview/tradingview';
    
import { useUserStore } from '@/store/modules/user';
import { getUserInfo } from '../../api/sys/user';
  
  const userStore = useUserStore();
    function getLanguageFromURL() {
      const regex = new RegExp('[\\?&]lang=([^&#]*)');
      const results = regex.exec(window.location.search);
      return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    const props = defineProps({
      symbol: {
        default: 'AAPL',
        type: String,
      },
      interval: {
        default: 'D',
        type: String,
      },
      libraryPath: {
        default: '/charting_library/',
        type: String,
      },
      chartsStorageUrl: {
        // default: 'http://localhost:10008/tradingview',
        default: '/basic-api/tradingview',
        type: String,
      },
      chartsStorageApiVersion: {
        default: '1.0',
        type: String,
      },
      clientId: {
        default: 'tradingview.com',
        type: String,
      },
      userId: {
        default: '1',
        type: String,
      },
      fullscreen: {
        default: false,
        type: Boolean,
      },
      autosize: {
        default: true,
        type: Boolean,
      },
      studiesOverrides: {
        type: Object,
      },
    });

    const chartContainer = ref();
    let chartWidget;

    onMounted(async () => {
      const isFirstIn = await isFirst({ clientId: props.clientId });

      const widgetOptions = {
        timezone: 'Asia/Shanghai',
        load_last_chart: true,
        datafeed: Datafeed,
        interval: props.interval,
        container: chartContainer.value,
        library_path: props.libraryPath,

        locale: getLanguageFromURL() || 'zh',
        charts_storage_url: props.chartsStorageUrl,
        charts_storage_api_version: props.chartsStorageApiVersion,
        client_id: props.clientId,
        user_id: userStore.getUserInfo.userId,
        fullscreen: props.fullscreen,
        autosize: props.autosize,
        studies_overrides: props.studiesOverrides,
        // eslint-disable-next-line no-dupe-keys
        disabled_features: [
          'use_localstorage_for_settings',
          'open_account_manager',
          'trading_account_manager',
          'order_panel',
          'order_info',
          'adaptive_logo'
        ],
        // eslint-disable-next-line no-dupe-keys
        enabled_features: [
          'hide_right_toolbar',
          'pre_post_market_sessions',
          'show_symbol_logos',
          'show_exchange_logos',
          'seconds_resolution',
          'tick_resolution',
          'chart_template_storage',
          'secondary_series_extend_time_scale',
          // 'show_percent_option_for_right_margin',
          // 'display_data_mode',
          // 'items_favoriting',
          // 'hide_left_toolbar_by_default',
          'study_templates',
          // 'pre_post_market_sessions',
          'show_object_tree',
          "dom_widget",
        ],
      };
      if (isFirstIn) {
        widgetOptions.symbol = 'SH:600000/RMB';
      }
      chartWidget = new TradingView.widget(widgetOptions);

      chartWidget.onChartReady(() => {
        chartWidget.headerReady().then(() => {
          const button = chartWidget.createButton();

          button.setAttribute('title', 'Click to show a notification popup');
          button.classList.add('apply-common-tooltip');

          button.addEventListener('click', () =>
            chartWidget.showNoticeDialog({
              title: 'Notification',
              body: 'TradingView Charting Library API works correctly',
              callback: () => {
                // eslint-disable-next-line no-console
                console.log('Noticed!');
              },
            }),
          );

          button.innerHTML = 'Check API';

          var button1 = chartWidget.createButton();
          button1.setAttribute('title', 'My custom button tooltip');
          button1.addEventListener('click', function () {
            chartWidget.activeChart().executeActionById('drawingToolbarAction');
          });
          button1.textContent = '绘图';
        });
      });
    });

    onUnmounted(() => {
      if (chartWidget !== null) {
        chartWidget.remove();
        chartWidget = null;
      }
    });
</script>

<style scoped>
  .TVChartContainer {
    height: calc(100vh - 80px);
  }
</style>
