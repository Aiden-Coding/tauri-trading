<template>
  <div :class="`${prefixCls}`"> 自定义标题栏 </div>
</template>

<script lang="ts" setup>
  import { useDesign } from '@/hooks/web/useDesign';
  const { prefixCls } = useDesign('title-bar');
  import { onMounted } from 'vue';
  onMounted(async () => {
    const platform = await window.ipcRenderer.invoke('app_platform');
    console.log(platform);
    console.log(prefixCls);
    if (platform === 'darwin') {
      document.querySelector('.' + prefixCls)?.classList.add('darwin');
    } else if (platform === 'linux') {
      document.querySelector('.' + prefixCls)?.classList.add('linux');
    }
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-title-bar';

  .@{prefix-cls} {
    display: flex;
    align-items: center;
    /* 避免被收缩 */
    flex-shrink: 0;
    /* 高度与 main.js 中 titleBarOverlay.height 一致  */
    height: 35px;
    width: 100%;
    /* 标题栏始终在最顶层（避免后续被 Modal 之类的覆盖） */
    z-index: 9999;

    background-color: #23272e;
    color: white;
    padding-left: 12px;
    font-size: 14px;
    user-select: none;
    /* 设置该属性表明这是可拖拽区域，用来移动窗口 */
    -webkit-app-region: drag;
  }
  .darwin {
    justify-content: center;
  }
  .linux {
    display: none;
  }
</style>
