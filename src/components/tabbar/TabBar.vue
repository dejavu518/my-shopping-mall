<template>
  <div id="tab-bar">
    <div class="tab-bar-item">首页</div>
    <div class="tab-bar-item">分类</div>
    <div class="tab-bar-item">购物车</div>
    <div class="tab-bar-item">我的</div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
#tab-bar {
  display: flex;
  position: fixed;
  background-color: #f6f6f6;
  left: 0;
  right: 0;
  bottom: 0;
  box-shadow: 0px -1px 1px rgba(100, 100, 100, 0.1);
}
.tab-bar-item {
  flex: 1;
  text-align: center;
  height: 49px;
}
</style>