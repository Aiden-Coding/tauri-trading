<template>
  <div data-tauri-drag-region class="titlebar">
    <Button> <Icon icon="ant-design:file-add-outlined" />ss </Button>
    <Button> <Icon icon="ant-design:file-add-outlined" />ss </Button>
    <Button> <Icon icon="ant-design:file-add-outlined" />ss </Button>
  </div>
</template>

<script lang="ts" setup>
  import { Button } from 'ant-design-vue';
  import Icon from '@/components/Icon/Icon.vue';
</script>
<style lang="less">
  .titlebar {
    height: 30px;
    background-color: @component-background;
    user-select: none;
    display: flex;
    justify-content: flex-end;
    top: 0;
    left: 0;
    right: 0;
  }
</style>
