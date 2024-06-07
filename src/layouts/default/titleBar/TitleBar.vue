<template>
  <div data-tauri-drag-region :class="getSiderClass">
    <Button @click="open_min"> <Icon icon="ant-design:file-add-outlined" />-</Button>
    <Button @click="open_max"> <Icon icon="ant-design:file-add-outlined" />+ </Button>
    <Button @click="close"> <Icon icon="ant-design:file-add-outlined" />*</Button>
  </div>
</template>

<script lang="ts" setup>
  import { Button } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
  import { getCurrent } from '@tauri-apps/api/window';

  import { computed, CSSProperties, h, ref, unref } from 'vue';
  import { useDesign } from '@/hooks/web/useDesign';
  const { prefixCls } = useDesign('title-bar');
  const getSiderClass = computed(() => {
    return [prefixCls];
  });
  const close = async () => {
    const window_i = await getCurrent();
    window_i.close();
  };

  const open_max = async () => {
    const window_i = await getCurrent();
    window_i.maximize();
  };

  const open_min = async () => {
    const window_i = await getCurrent();
    window_i.minimize();
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
