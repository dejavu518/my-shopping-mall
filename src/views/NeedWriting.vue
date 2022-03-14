<template>
  <!-- @fang2021-07-26 -->
  <div class="mhm-need-writing" :style="{height:autoHeight - 40 - 32 +'px'}">
    <div class="query-container">
      <!-- 筛选 -->
      <CrmQuery :select-data="selectData" :search-placeholder="searchPlaceholder" :screen-data="screenData" @filterData="filterData" :defaultSelect="defaultSelect">
        <!-- 导出 -->
        <el-button type="primary" @click="exportExcel">{{this.$t('btn.BTN_028')}}</el-button>
      </CrmQuery>
    </div>
    <div class="c-table">
      <template>
        <el-table class="crm-table" :data="list" border style="width: 100%;" :max-height="autoHeight- 66 - 45 - 40 - 20 -10 +'px'" highlight-current-row>
          <!--序号-->
          <el-table-column type="index" :label="$t('txt.TXT_0063')" width="80"></el-table-column>
          <!-- 应填时间 -->
          <el-table-column prop="shouldTime" :label="$t('应填时间')" show-overflow-tooltip>
            <template slot="header" slot-scope="scope">
              <div @mouseover="onMouseOver('refName'+ scope.$index)">
                <el-tooltip :disabled="isShowTooltip" :content="$t('填表时间')" placement="top">
                  <div class="long_title">
                    <span :ref="'refName'+scope.$index">{{$t('填表时间')}}</span>
                  </div>
                </el-tooltip>
              </div>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.shouldTime">{{$moment(new Date(scope.row.shouldTime)).format("YYYY-MM-DD HH:mm")}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <!-- 模板名称 -->
          <el-table-column prop="templateName" :label="$t('模板名称')" show-overflow-tooltip>
            <template slot="header" slot-scope="scope">
              <div @mouseover="onMouseOver('refName'+ scope.$index)">
                <el-tooltip :disabled="isShowTooltip" :content="$t('模板名称')" placement="top">
                  <div class="long_title">
                    <span :ref="'refName'+scope.$index">{{$t('模板名称')}}</span>
                  </div>
                </el-tooltip>
              </div>
            </template>
            <template slot-scope="scope">
              <span style="color: #409EFF;cursor:pointer;">{{scope.row.templateName}}</span>
            </template>
          </el-table-column>
          <!-- 状态 -->
          <el-table-column prop="status" :label="$t('状态')" show-overflow-tooltip>
            <template slot="header" slot-scope="scope">
              <div @mouseover="onMouseOver('refName'+ scope.$index)">
                <el-tooltip :disabled="isShowTooltip" :content="$t('状态')" placement="top">
                  <div class="long_title">
                    <span :ref="'refName'+scope.$index">{{$t('状态')}}</span>
                  </div>
                </el-tooltip>
              </div>
            </template>
            <template slot-scope="scope">
              <!-- 未读 -->
              <span v-if="scope.row.status == 1">{{$t('已填写')}}</span>
              <!--已读-->
              <span v-else-if="scope.row.status == 2" style="color:#f14236">{{$t('未填写')}}</span>
            </template>
          </el-table-column>
          <!--操作-->
          <el-table-column :label="$t('txt.TXT_0008')" fixed="right" width="100">
            <template slot-scope="scope">
              <el-popover placement="bottom" style="font-size: 14px;cursor: pointer;font-weight: 400" :ref="`popover-${scope.$index}`" trigger="click">
                <!--前往填写-->
                <el-button size="mini" @click="toWrite(scope.$index, scope.row)">{{$t('前往填写')}}</el-button>
                <i class="el-icon-more more" slot="reference"></i>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
    <div class="paging">
      <Paging v-show="page.total > 0" :total="page.total" :page.sync="page.pageIndex" :limit.sync="page.pageSize" @pagination="changePage"></Paging>
    </div>
  </div>
</template>

<script>
import CrmQuery from '@/components/CrmQuery'
import Paging from "@/components/Paging.vue"
export default {
  name: "ProjectList",
  components: { CrmQuery, Paging, },
  data() {
    return {
      // 分页
      page: {
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        params: {}
      },
      defaultSelect: [
        { index: 0, value: '' },
        { index: 1, value: '' },
        { index: 2, value: '' },
      ],
      selectData: [
        {
          placeholder: this.$t('项目类型'), //项目类型
          options: [
            { value: '', label: this.$t('txt.TXT_1444') },
            { value: 1, label: this.$t('txt.TXT_1770') },  //单个项目
            { value: 2, label: this.$t('txt.TXT_1771') },  //多个项目
            { value: 3, label: this.$t('txt.TXT_1772') },  //年项目
            { value: 4, label: this.$t('txt.TXT_1773') },  //按项目分期
            { value: 5, label: this.$t('txt.TXT_1774') },  /*自定义*/
          ]
        },
        {
          placeholder: this.$t('txt.TXT_1442'), //所有客户
          options: [
            { value: '', label: this.$t('txt.TXT_1442') }
          ]
        },
        {
          placeholder: this.$t('txt.TXT_0181'), //所有状态
          options: [
            { value: '', label: this.$t('txt.TXT_0181') },
            { value: '-1', label: this.$t('txt.TXT_0588') },  /*已启动*/
            { value: '1', label: this.$t('txt.TXT_1989') }, //待报价
            { value: '2', label: this.$t('txt.TXT_1990') }, //已报价
            { value: '3', label: this.$t('txt.TXT_1850') }, //签署合同
            { value: '4', label: this.$t('txt.TXT_0840') }, //结束
            { value: '5', label: this.$t('txt.TXT_1991') }, //解除合同
            { value: '6', label: this.$t('txt.TXT_2247') },  /*已启动*/
          ]
        },
      ],
      screenData: ['priceType', 'clientGuid', 'priceStatus'],
      searchPlaceholder: this.$t('搜索时间'),
      list: [
        {
          shouldTime: '2021-07-13T16:38:00',
          status: 1,
          templateName: '工时登记表'
        },
        {
          shouldTime: '2021-07-15T17:08:00',
          status: 2,
          templateName: '工时登记表'
        }, {
          shouldTime: '2021-07-16T16:38:00',
          status: 1,
          templateName: '工时登记表'
        }, {
          shouldTime: '2021-07-22T17:38:00',
          status: 1,
          templateName: '工时登记表'
        }, {
          shouldTime: '2021-07-30T14:38:00',
          status: 2,
          templateName: '工时登记表'
        }],
      autoHeight: "",
      isShowTooltip: false,
      params: {},
    }
  },
  created() {
    this.autoHeight = `${document.documentElement.clientHeight}` - 50;
    this.resize();
    // this.$store.state.projectLoading = true;
  },
  methods: {
    /**分页**/
    changePage(data) {
      this.page.pageIndex = data.pageIndex;
      this.page.pageSize = data.pageSize;
    },
    /**筛选数据**/
    filterData(v) {
      this.page.pageIndex = 1;
      this.page.params = v;
    },
    /**导出**/
    exportExcel() {
      let info = {
        pageNum: this.page.pageIndex,
        pageSize: this.page.pageSize,
        params: this.page.params
      };
      this.$api.bsc.downloadData('project', info)
      alert('导出')
    },
    /**查看详情**/
    toWrite(index, row) {
      this.$refs[`popover-${index}`].doClose();
      alert('前往填写')
    },
    /**设置表头超出显示tip**/
    onMouseOver(refName) {
      let parentWidth = this.$refs[refName].parentNode.offsetWidth;
      let contentWidth = this.$refs[refName].offsetWidth;
      // 判断是否开启tooltip功能
      if (contentWidth > parentWidth) {
        this.isShowTooltip = false;
      } else {
        this.isShowTooltip = true;
      }
    },
    /**浏览器可视高度**/
    resize() {
      let that = this;
      $(window).resize(() => {
        this.autoHeight = `${document.documentElement.clientHeight}` - 50;
        if (that.$refs.page) {
          that.$refs.page.style.minHeight = this.autoHeight - 100 + 'px';
        }
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.mhm-need-writing {
  position: relative;
  padding: 8px 16px;
  height: 100%;
  .c-table {
    .el-table td,
    .el-table th {
      text-align: center !important;
    }
  }
  .el-popover .el-button {
    margin-left: 0 !important;
  }
  // .c-err-form {
  //   .el-form-item__content {
  //     margin-left: 0px !important;
  //   }
  // }
}
</style>
<style scoped lang="scss">
.el-popover .el-button {
  margin-left: 0 !important;
  border: none !important;
}
</style>
