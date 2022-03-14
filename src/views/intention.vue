<template>
  <div style="padding:0px 8px">
    <TabGlobalLoadViewing v-if="$store.state.tabGlobalLoadViewing"></TabGlobalLoadViewing>
    <div>
      <template>
        <div class="query-container">
          <CrmQuery ref="crmQuery" :select-data="selectData" :search-placeholder="searchPlaceholder" :screen-data="screenData" :defaultSelect="defaultSelect" @filterData="filterData">
            <el-button type="primary" @click="exportExcel">{{this.$t('btn.BTN_028')}}</el-button><!-- 导出  -->
            <el-button type="primary" @click="handAdd">{{this.$t('btn.BTN_128')}}</el-button><!-- 新增客户  -->
          </CrmQuery>
        </div>
        <el-table class="crm-table" :data="list" border highlight-current-row style="width: 100%;" :max-height="autoHeight- 66 - 15 - 45 - 40 - 55 +'px'">
          <el-table-column type="index" :label="$t('txt.TXT_0063')" width="100"></el-table-column>
          <!--序号-->
          <el-table-column prop="clientName" :label="$t('txt.TXT_0083')" show-overflow-tooltip></el-table-column>
          <!--公司名称-->
          <el-table-column prop="clientTypeDesc" :label="$t('txt.TXT_1339')" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.clientTypeDesc">{{scope.row.clientTypeDesc}}</span>
              <span v-else></span>
            </template>
          </el-table-column>
          <!--公司类型-->
          <el-table-column prop="clientBusiAddress" :label="$t('txt.TXT_1340')" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{scope.row.clientBusiAddress}}</span>
            </template>
          </el-table-column>
          <!--公司所在地-->
          <el-table-column prop="clientOrientat" :label="$t('客户属性')" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="scope.row.clientOrientat=='1'">{{$t('意向客户')}}</span>
              <span v-if="scope.row.clientOrientat=='2'">{{$t('正式客户')}}</span>
            </template>
          </el-table-column>
          <!-- 客户属性 -->
          <el-table-column prop="clientGrade" :label="$t('txt.TXT_1343')" show-overflow-tooltip></el-table-column>
          <!--客户等级-->
          <el-table-column prop="clientContactName" :label="$t('txt.TXT_0039')" show-overflow-tooltip></el-table-column>
          <!--联系人-->
          <el-table-column prop="clientContactTel" :label="$t('txt.TXT_1344')" show-overflow-tooltip></el-table-column>
          <!--联系方式-->
          <el-table-column prop="clientContactEmail" :label="$t('txt.TXT_0461')" show-overflow-tooltip></el-table-column>
          <!--邮箱-->
          <el-table-column prop="busiRespoPsnName" :label="$t('txt.TXT_1342')" show-overflow-tooltip></el-table-column>
          <!--商务负责人-->
          <!--          <el-table-column prop="clientGrade" :label="$t('txt.TXT_1343')" show-overflow-tooltip></el-table-column> &lt;!&ndash;客户等级&ndash;&gt;-->
          <el-table-column :label="$t('txt.TXT_0008')" fixed="right" width="100">
            <!--操作-->
            <template slot-scope="scope">
              <el-popover :ref="`popover-${scope.$index}`" placement="bottom" style="font-size: 14px;cursor: pointer;font-weight: 400" trigger="click">
                <el-button size="mini" @click="handOperation(1, scope.$index, scope.row)">{{$t('btn.BTN_033')}}</el-button>
                <!--查看-->
                <el-button size="mini" @click="handEdit(scope.$index, scope.row)">{{$t('btn.BTN_008')}}</el-button>
                <!--编辑-->
                <el-button size="mini" @click="handProjectQuotation(scope.$index, scope.row)" v-if="scope.row.clientOrientat=='1'">{{$t('btn.BTN_159')}}</el-button>
                <!--项目报价-->
                <el-button size="mini" @click="handUploadCDA(scope.$index, scope.row)" v-if="scope.row.clientOrientat=='1'">{{$t('txt.TXT_1847')}}</el-button>
                <!--签署CDA-->
                <el-button size="mini" @click="handOperation(2, scope.$index, scope.row)" v-if="scope.row.clientOrientat=='2'">{{$t('btn.BTN_241')}}</el-button>
                <!--等级评定-->
                <el-button size="mini" @click="handOperation(3, scope.$index, scope.row)" v-if="scope.row.clientOrientat=='2'">{{$t('btn.BTN_242')}}</el-button>
                <!--追踪拜访-->
                <el-button size="mini" @click="handJournal(scope.$index, scope.row)">{{$t('btn.BTN_058')}}</el-button>
                <!--日志-->
                <i class="el-icon-more more" slot="reference"></i>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <div class="paging">
          <Paging v-show="page.total" :total="page.total" :page.sync="page.pageIndex" :limit.sync="page.pageSize" @pagination="changePage"></Paging>
        </div>
      </template>
    </div>
    <cdaBox ref="cdaBox"></cdaBox>
    <CommonJournal ref="CommonJournal" :journal-query="journalQuery" :journal-paging="journalPaging" :journal-data="journalData" @JournalFilterData="JournalFilterData" @journalPagination="journalPagination"></CommonJournal>
  </div>
</template>

<script>
import CrmQuery from '@/components/CrmQuery'
import Paging from "@/components/Paging.vue"
import cdaBox from "./cdaBox"
import CommonJournal from "@/components/CommonJournal.vue"
export default {
  name: "intention",
  components: { CrmQuery, Paging, cdaBox, CommonJournal },
  data() {
    return {
      journalData: { list: [] },
      journalPaging: {
        currentPage: 1,
        pageSize: 5,
        layout: 'prev, pager, next,total,jumper',
        total: 0,
      },
      journalQuery: {
        selectData: [
          {
            placeholder: this.$t('txt.TXT_1339'), //公司类型
            options: [
              { value: '', label: this.$t('txt.TXT_1339') }, ////公司类型
            ]
          },
          {
            placeholder: this.$t('tree.TREE011-01'), //客户登记
            options: [
              { value: '', label: this.$t('txt.TXT_0075') }, //全部
              { value: '1', label: this.$t('txt.TXT_1205') }, //默认
              { value: '2', label: this.$t('txt.TXT_1206') }, //私有
            ]
          },
        ],
        screenData: ['productGuid', 'productPrivilege', 'productStatus'],
        searchPlaceholder: this.$t('txt.TXT_1464'),
      },
      //分页
      page: {
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        params: {}
      },

      selectData: [
        {
          placeholder: this.$t('txt.TXT_1339'), //公司类型
          options: [
            { value: '', label: this.$t('txt.TXT_1339') }
          ]
        },
        {
          placeholder: this.$t('客户属性'), //客户属性
          options: [
            { value: '', label: this.$t('客户属性') }, /*全部*/
            { value: '1', label: this.$t('意向客户') },/*意向客户*/
            { value: '2', label: this.$t('正式客户') } /*正式客户*/
          ]
        },
        {
          placeholder: this.$t('txt.TXT_1343'), //客户等级
          options: [
            { value: '', label: this.$t('txt.TXT_1343') } /*全部*/
          ]
        }
      ],
      defaultSelect: [
        { index: 0, value: '' },
        { index: 1, value: '' }
      ],
      screenData: ['clientType', 'clientOrientat', 'clientGrade'],
      searchPlaceholder: this.$t('txt.TXT_1464'),
      list: [],
      autoHeight: "",
      params: {}
    }
  },
  created() {
    this.autoHeight = `${document.documentElement.clientHeight}` - 50;
    this.resize();
    this.$store.state.tabGlobalLoadViewing = true;
    this.loadClientList(this.page.pageIndex, this.page.pageSize, this.page.params);
  },
  methods: {
    /**加载客户数据列表**/
    loadClientList(pageIndex, pageSize, params) {
      let info = {
        pageNum: pageIndex,
        pageSize: pageSize,
        params: params
      };
      this.$api.bsc.ClientList(info).then(res => {
        if (res.success) {
          this.list = res.data.list
          this.page.total = res.data.total
        }
        this.$store.state.tabGlobalLoadViewing = false;
      })
    },
    /**筛选数据**/
    filterData(v) {
      this.page.pageIndex = 1;
      // v.clientOrientat = 1
      this.page.params = v;
      this.loadClientList(this.page.pageIndex, this.page.pageSize, this.page.params);
    },
    /**分页**/
    changePage(data) {
      this.page.pageIndex = data.pageIndex;
      this.page.pageSize = data.pageSize;
      this.loadClientList(this.page.pageIndex, this.page.pageSize, this.page.params);
    },
    /**导出**/
    exportExcel() {
      let info = {
        pageNum: this.page.pageIndex,
        pageSize: this.page.pageSize,
        params: this.page.params
      };
      this.$api.bsc.downloadData('client', info)
    },
    /**新增客户**/
    handAdd() {
      this.$router.push({ name: 'NewCustomer', query: { type: 'intention' } })
    },
    /**编辑客户**/
    handEdit(index, row) {
      this.$refs[`popover-${index}`].doClose();
      this.$router.push({ path: '/BECDefault/Index/NewCustomer', query: { id: row.clientGuid, type: 'intention' } })
    },
    /**查看详情, 等级评定, 追踪拜访**/
    // handOperation(type, index, row) {
    //   this.$refs[`popover-${index}`].doClose()
    //   let menuType;
    //   let tabType;
    //   if (type == 1) {
    //     menuType = 'cda'      //查看
    //     tabType = 'intent'
    //   } else if (type == 2) {
    //     menuType = 'grade' //等级评定
    //   } else if (type == 3) {
    //     menuType = 'see'   //追踪拜访
    //   }
    //   this.$router.push({ name: 'service', query: { id: row.clientGuid, client: 'kh-xq', type: 'intention', menuType: menuType, tabType: tabType } })
    // },
    handOperation(type, index, row) {
      this.$refs[`popover-${index}`].doClose();
      let menuType;
      if (type == 1) {
        menuType = 'cda'      //查看
      }
      this.$router.push({ name: 'service', query: { id: row.clientGuid, client: 'kh-xq', type: 'formal', menuType: menuType } })
      if (type == 2) {
        this.$router.replace({ path: '/GradeEstimation', query: { name: row.clientName, client: 'kh-xq', type: 'formal', menuType: 'grade', id: row.clientGuid, level: '1' } });
      } else if (type == 3) {
        this.$router.replace({ path: '/BECDefault/Index/addVisitForm', query: { name: row.clientName, client: 'kh-xq', type: 'formal', menuType: 'see', id: row.clientGuid } });
      }
    },
    /**签署CDA**/
    handUploadCDA(index, row) {
      this.$refs.cdaBox.showName = false;
      this.$refs.cdaBox.dataForm.clientGuid = row.clientGuid
      this.$refs.cdaBox.title = i18n.t('上传CDA')
      this.$refs.cdaBox.showDialog = true;
      this.$refs.cdaBox.id = false;
      this.$refs.cdaBox.level = false;
      this.$refs.cdaBox.dataForm.clientGuid = row.clientGuid
    },
    /**项目报价**/
    handProjectQuotation(index, row) {
      this.$router.push({ path: '/BECDefault/Index/service', query: { id: row.clientGuid, client: 'kh-lb', menuType: 'price' } })
    },
    /**日志**/
    handJournal(index, row) {
      this.$refs[`popover-${index}`].doClose();
      let temp = {
        pageNum: 1,
        pageSize: 5,
        params: {}
      };
      this.journalId = row.clientGuid;
      this.journalData.title = row.clientName
      this.getJournalData(this.journalId, temp);
      this.$refs.CommonJournal.dialogLifecycle = true;
    },
    /**日志分页**/
    journalPagination(pageParams) {
      let temp = {
        pageNum: pageParams.pageIndex,
        pageSize: pageParams.pageSize,
        params: this.params
      };
      this.getJournalData(this.journalId, temp);
    },
    /**日志筛选**/
    JournalFilterData(v) {
      this.params = v
      let temp = {
        pageNum: 1,
        pageSize: 5,
        params: v
      };
      this.getJournalData(this.journalId, temp);
    },
    /**获取日志数据**/
    getJournalData(documentGuid, temp) {
      this.$api.system.logCycleJournal(documentGuid, temp).then(res => {
        if (res.success) {
          this.journalData.list = res.data.pageInfo.list;
          this.journalPaging.total = res.data.pageInfo.total;
          this.$refs.CommonJournal.queryLog(res.data.type);
        }
      });
    },
    /**签署CDA**/
    handSignTheCDA(index, row) { },
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
  }
}
</script>

<style scoped>
</style>
<style lang="scss">
.el-popper .el-select-dropdown__item {
  max-width: 300px !important;
  overflow: hidden; //超出的文本隐藏
  text-overflow: ellipsis; //溢出用省略号显示
  white-space: nowrap;
}
</style>
