<template>
  <ConfigProvider :locale="getAntdLocale" :theme="themeConfig">
    <AppProvider>
      <TitleBar />

      <Button @click="halo">start</Button>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { Button } from 'ant-design-vue';
  import TitleBar from '@/layouts/default/titleBar/TitleBar.vue';
  import { AppProvider } from '@/components/Application';
  import { useTitle } from '@/hooks/web/useTitle';
  import { useLocale } from '@/locales/useLocale';
  import { ConfigProvider } from 'ant-design-vue';
  import { useDarkModeTheme } from '@/hooks/setting/useDarkModeTheme';
  import 'dayjs/locale/zh-cn';
  import { computed, onMounted } from 'vue';
  // support Multi-language
  const { getAntdLocale } = useLocale();

  const { isDark, darkTheme } = useDarkModeTheme();

  const halo = () => {
    console.log(window.ipcRenderer);
    console.log('helo');
    // 我们请求主进程向我们发送一个通道
    // 以便我们可以用它与 Worker 进程建立通信
    window.ipcRenderer.send('request-worker-channel');

    // window.ipcRenderer.once('provide-worker-channel', (event) => {
    //   console.log('received result:', event);
    //   // 一旦收到回复, 我们可以这样做...
    //   const [port] = event.ports;

    //   console.log('port:', port);
    //   // ... 注册一个接收结果处理器 ...
    //   port.onmessage = (event) => {
    //     console.log('received result:', event.data);
    //   };
    //   // ... 并开始发送消息给 work!
    //   port.postMessage(21);
    // });
  };
  const themeConfig = computed(() =>
    Object.assign(
      {
        token: {
          colorPrimary: '#0960bd',
          colorSuccess: '#55D187',
          colorWarning: '#EFBD47',
          colorError: '#ED6F6F',
          colorInfo: '#0960bd',
        },
      },
      isDark.value ? darkTheme : {},
    ),
  );
  // Listening to page changes and dynamically changing site titles
  useTitle();
  onMounted(async () => {});
</script>
