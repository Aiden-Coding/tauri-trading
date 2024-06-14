<template>
  <div
    data-tauri-drag-region
    :class="getSiderClass"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
    @mousedown="mousedown"
    @mouseup="mouseup"
  >
    <Button> <Icon icon="ant-design:file-add-outlined" />ss </Button>
    <Button> <Icon icon="ant-design:file-add-outlined" />ss </Button>
    <Button> <Icon icon="ant-design:file-add-outlined" />ss </Button>
  </div>
</template>

<script lang="ts" setup>
  import { Button } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';

  import { computed, CSSProperties, h, ref, unref } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  const { prefixCls } = useDesign('title-bar');
  const getSiderClass = computed(() => {
    return [prefixCls];
  });
  // 鼠标进入判断，只有鼠标进入到范围内，才能进行鼠标按压拖拽
  const enterFlag = ref(false);
  // 鼠标按压判断，只有鼠标进入范围内，并且按压状态，此时释放鼠标才会关闭窗口移动
  const mousedownFlag = ref(false);
  let timer: NodeJS.Timeout | null;

  /**鼠标按压 */
  const mousedown = () => {
    if (enterFlag) {
      (window as any).ipcRenderer.send("window-move-open", true);
      mousedownFlag.value = true;
    }
  };

  /**鼠标释放 */
  const mouseup = () => {
    if (enterFlag && mousedownFlag) {

      (window as any).ipcRenderer.send("window-move-open", false);
      mousedownFlag.value = false;
    }
  };

  /**鼠标移入 */
  const mouseenter = () => {
    enterFlag.value = true;
  };

  /**鼠标移出 */
  const mouseleave = () => {
    enterFlag.value = false;
    // 避免卡顿的情况下，鼠标滑出移动范围，但窗口仍跟随鼠标移动
    if (timer !== null) {
      timer = setTimeout(() => {
        mousedownFlag.value = false;

      (window as any).ipcRenderer.send("window-move-open", false);
        timer = null;
      }, 1000);
    }
  };
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-title-bar';

  .@{prefix-cls} {
    height: 30px;
    background-color: @sider-dark-bg-color;
    user-select: none;
    display: flex;
    justify-content: flex-end;
    top: 0;
    left: 0;
    right: 0;

    & > button {
      background-color: @sider-dark-bg-color;
      padding: 0;
      border-radius: 0;
      border: 0;
    }
  }
</style>
