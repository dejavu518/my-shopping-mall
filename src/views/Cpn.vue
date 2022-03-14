<template>
  <div>
    <h1>{{aaa}}</h1>
    <button @click="handleClick"></button>
  </div>
</template>

<script>
export default {
  props: ['aaa'],
  data() {
    return {
      info: '我是子组件的数据'
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.info)
    }
  }
}

const p1 = new Promise((resolve, reject) => {
  console.log(1)//同步
  resolve()
})
p1.then(() => {
  console.log(2)
  const p2 = new Promise((resolve, reject) => {
    console.log(3)//同步
    resolve()
  })
  p2.then(() => {
    console.log(4)//微任务2
  })
  p2.then(() => { // 相当于return了这个then的执行返回Promise
    console.log(5)//微任务3
  })
})//微任务1
p1.then(() => {
  console.log(6)
})

</script>



<style scoped>
</style>