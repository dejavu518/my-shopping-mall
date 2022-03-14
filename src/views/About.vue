<template>
  <div>
    <el-table :data="tableData" highlight-current-row style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55px">
      </el-table-column>
      <el-table-column type="index" width="55px" label="序号">
      </el-table-column>
      <el-table-column prop="singer" label="歌手" width="100px">
      </el-table-column>
      <el-table-column prop="work" label="代表作" width="100px">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="scope.$index===0" @click="moveUp(scope.$index,scope.row)"><i class="el-icon-arrow-up"></i></el-button>
          <el-button size="mini" :disabled="scope.$index===(tableData.length-1)" @click="moveDown(scope.$index,scope.row)"><i class="el-icon-arrow-down"></i></el-button>
          <!-- <el-button type="info" size="mini" round v-if="scope.$index===0">默认</el-button> -->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {

  data() {
    return {
      tableData: [{
        index: '1',
        singer: '张学友',
        work: '遥远的她',
        status: true,
      }, {
        index: '2',
        singer: '李宗盛',
        work: '给自己的歌',
        status: true,
      }, {
        index: '3',
        singer: '陈慧娴',
        work: '千千阙歌',
        status: true,
      },
      {
        index: '4',
        singer: '王菲',
        work: '暗涌',
        status: true,
      }],
      multipleSelection: []
    }
  },
  methods: {
    //选择复选框数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //上移
    moveUp(index, row) {
      var that = this;
      console.log('上移', index, row);
      console.log(that.tableData[index]);
      if (index > 0) {
        let upDate = that.tableData[index - 1];
        that.tableData.splice(index - 1, 1);
        that.tableData.splice(index, 0, upDate);
      } else {
        alert('已经是第一条，不可上移');
      }
    },

    //下移
    moveDown(index, row) {
      var that = this;
      console.log('下移', index, row);
      if ((index + 1) === that.tableData.length) {
        alert('已经是最后一条，不可下移');
      } else {
        console.log(index);
        let downDate = that.tableData[index + 1];
        that.tableData.splice(index + 1, 1);
        that.tableData.splice(index, 0, downDate);
      }
    }
  }
}
</script>