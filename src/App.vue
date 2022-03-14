
<template>
  <div :style="{color:'red'}">
    <cpn :aaa="bbb" @click="ccc"></cpn>
  </div>
</template>

<script>
import Cpn from "@/views/Cpn";
export default {
  components: { Cpn },
  data() {
    return {
      selected: [],
      bbb: '哈哈哈'
    }
  },
  methods: {
    ccc(m) {
      this.bbb = m
    }
  }
}
</script>
<style>
</style>
