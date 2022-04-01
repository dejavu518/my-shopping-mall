<template>
  <!-- #####主页##### -->
  <div id="home" class="wrapper">
    <!-- ————————Nav—————————— -->
    <nav-bar class="home-nav">
      <div slot="center">购物街</div>
    </nav-bar>
    <!-- ————————TabControl—————————— -->
    <tab-control :titles="titles" @tabClick="tabClick" class="tab-control" ref="tabControl1" v-show="isTabFixed" />
    <!-- ————————内容滚动区域—————————— -->
    <scroll />
  </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import Scroll from '@/components/common/scroll/Scroll'
export default {
  name: 'Home',
  components: { NavBar, TabControl, Scroll },
  data() {
    return {
      titles: ['流行', '新款', '精选'],
      isTabFixed: false
    }
  },
  methods: {
    /**
     * 事件监听相关的方法
     */
    tabClick(index) {
      alert(index)
    }
  }

}
</script>

<style scoped>
.tab-control {
  position: relative;
  z-index: 9;
}
</style>