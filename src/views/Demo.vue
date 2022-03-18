<template>
  <div>
    <ul id="ul">
      <li v-for="(item,index) in list" :key="index">{{item.name}}</li>
    </ul>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      list: [
        { id: 1, name: '暗里着迷' },
        { id: 1, name: '不再犹豫' },
        { id: 1, name: '开心的马骝' },
        { id: 1, name: '遥远的她' },
      ],
      sortable: null,
      sortData: []
    }
  },
  methods: {
    rowDrop() {
      this.sortData = [...this.list]
      const el = document.getElementById('ul')
      //创建拖拽对象
      this.sortable = Sortable.create(el, {
        // sort: this.isEditOrder, //是否可进行拖拽排序
        // animation: 150,
        //拖拽完成，移除拖拽之前的位置上的元素，在拖拽之后的位置上添加拖拽元素
        onEnd: ({ newIndex, oldIndex }) => {
          console.log(newIndex, oldIndex, 99999);
          const val = this.sortData[oldIndex]
          this.sortData.splice(oldIndex, 1)
          this.sortData.splice(newIndex, 0, val)
        }
      })
    }
  },
  mounted() {
    this.rowDrop()
  },
}
</script>

<style scoped>
</style>