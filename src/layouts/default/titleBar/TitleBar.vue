<template>
  <div data-tauri-drag-region :class="getSiderClass">
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
