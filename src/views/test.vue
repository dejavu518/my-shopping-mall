<template>
  <div>
    <div style="margin-bottom:20px" v-show="selectedList.length>0">
      <span style="color:#5696ff;font-weight:bold">已选表单：</span>
      <ul id="dropArea">
        <li v-for="(item,index) in selectedList" :key="index">
          {{item.name}}
          <!-- <span style="margin-left:5px;color:red;font-size:18px" @click="removeSelected(item)">×</span> -->
        </li>
      </ul>
    </div>
    <ul style="height:420px;overflow:scroll">
      <span style="color:#5696ff;font-weight:bold">未选表单：</span>
      <li v-for="(item,index) in formList" :key="index" @click="formListClick(item)">
        {{item.name}}
      </li>
    </ul>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
export default {
  data() {
    return {
      selectName: '哈哈哈',
      siteNo: '',
      id: '',
      visitValue: '',
      visitColumns: [],//访视列表
      showPickerVisit: false,
      showPickerLay: false,
      newVisitNo: '',//新访视编号
      visitName: '',
      formList: [
        { name: '哈哈哈哈' },
        { name: '嘻嘻嘻嘻' },
        { name: '呵呵呵呵' },
        { name: '嘿嘿嘿嘿' },
      ],
      activeNames: [],
      subjectGuid: '',
      sourceVisit: '',//原访视
      // newVisitName: ''
      selectedList: [],//已选择的表单
      sortable: null,
      oldList: [],
      newList: [],
      sortData: []
    }
  },
  methods: {
    /**点击表单选中事件**/
    formListClick(v) {
      console.log(v, '555')
      this.formList.forEach((item, index) => {
        if (item.name === v.name) {
          this.formList.splice(index, 1)
        }
      })
      this.selectedList.push(v)
      this.rowDrop()
    },
    /**拖动排序**/
    rowDrop() {
      this.sortData = [...this.selectedList]
      const el = document.getElementById('dropArea')
      console.log(el, '8888')
      //创建拖拽对象
      this.sortable = Sortable.create(el, {
        // sort: this.isEditOrder, //是否可进行拖拽排序
        // animation: 150,
        //拖拽完成，移除拖拽之前的位置上的元素，在拖拽之后的位置上添加拖拽元素
        // onEnd: ({ newIndex, oldIndex }) => {
        //   console.log(newIndex, oldIndex, 99999);

        //   const val = this.sortData[oldIndex]
        //   this.sortData.splice(oldIndex, 1)
        //   this.sortData.splice(newIndex, 0, val)
        // },
        onChange: function (evt) {
          console.log(evt)
        }
      })
    },
  }
}
</script>

<style scoped>
</style>