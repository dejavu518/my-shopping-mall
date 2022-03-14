<template>
  <div class="c-customer-line" :style="{height:autoHeight - 40 - 32 +'px'}">
    <div v-if="showList">
      <div class="c-table">
        <div>
          <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane :label="$t('txt.TXT_1988')" name="first" :style="{height:autoHeight - 40 - 32 - 50 +'px'}">
              <!--意向客户-->
              <keep-alive>
                <potential ref="potential" v-if="activeName == 'first'"></potential>
              </keep-alive>
              <!-- <keep-alive include="intention">
                <router-view></router-view>
              </keep-alive> -->
            </el-tab-pane>
            <el-tab-pane :label="$t('txt.TXT_1987')" name="second" :style="{height:autoHeight - 40 - 32 - 50 +'px'}">
              <!--正式客户-->
              <keep-alive>
                <formal ref="formal" v-if="activeName == 'second'"></formal>
              </keep-alive>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <div v-if="!showList" class="c-init">
      <flow-Box ref="flowBox"></flow-Box>
      <div class="c-init-btn">
        <el-button type="primary" @click="handNewCustomer(tabType)">{{this.$t('btn.BTN_128')}}</el-button><!-- 新增客户-->
      </div>
    </div>
  </div>
</template>

<script>
import flowBox from "./flowBox";
import potential from "./intention";
import formal from "./formalList";

export default {
  name: "clientList",
  components: { 'flow-Box': flowBox, potential, formal },
  data() {
    return {
      activeName: 'first',
      tabType: '',
      showList: true,
      page: {
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        params: {
          clientOrientat: 1,
        }
      },
      autoHeight: "",
      defaultSelect: [
        { index: 0, value: '' },
        { index: 1, value: '' }
      ],
    }
  },
  created() {
    this.autoHeight = `${document.documentElement.clientHeight}` - 50;
    this.resize();
    if (this.$route.query.level == '1' || this.$route.query.type == 'formal') {
      this.activeName = 'second'
    } else {
      this.activeName = 'first'
    }
    this.$nextTick(function () {
      this.getOrgType();
      this.getGrade();
    })
  },
  methods: {
    /**切换查询数据**/
    handleClick(tab, event) {
      this.getOrgType();
      this.getGrade();
      if (tab.name == 'first') {
        this.tabType = 'intention'
        this.page.params.clientOrientat = 1;
        this.$nextTick(function () {
          this.$refs.potential.loadClientList(this.page.pageIndex, this.page.pageSize, this.page.params);
          this.$refs.potential.$refs.crmQuery.value = ['', '']
        })
      } else if (tab.name == 'second') {
        this.tabType = 'formal'
        this.page.params.clientOrientat = 2;
        this.$nextTick(function () {
          this.$refs.formal.loadClientList(this.page.pageIndex, this.page.pageSize, this.page.params);
          this.$refs.formal.$refs.crmQuery.value = ['', '']
        })
      }
    },
    /**获取公司类型**/
    getOrgType() {
      let type = 'KHLX'
      this.$api.system.queryTypeProduct(type).then(res => {
        if (res.success) {
          let arr = [
            {
              value: '',
              label: i18n.t('txt.TXT_1339')//所有类型
            }
          ]
          res.data.forEach(item => {
            let obj = {
              value: item.dictValue,
              label: item.dictName
            };
            arr.push(obj)
          })
          if (this.activeName == 'first') {
            this.$refs.potential.selectData[0].options = arr
          } else {
            this.$refs.formal.selectData[0].options = arr
          }
        }
      })
    },
    /**获取客户等级**/
    getGrade() {
      this.$api.bsc.queryClientGrade().then(res => {
        if (res.success) {
          let arr = [
            {
              value: '',
              label: i18n.t('txt.TXT_1343')//全部
            }
          ]
          res.data.forEach(item => {
            let obj = {
              value: item,
              label: item
            };
            arr.push(obj)
          })
          if (this.activeName == 'second') {
            this.$refs.formal.selectData[1].options = arr
          }
        }
      })
    },
    /**新增客户**/
    handNewCustomer(type) {
      let tabType;
      if (type == 'intention') {
        tabType = 'intention'
      } else {
        tabType = 'formal'
      }
      this.$router.push({ path: '/BECDefault/CustomerMageIndex/NewCustomer', query: { tabType: tabType } })
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

<style lang="scss">
.c-customer-line {
  position: relative;
  padding: 8px;
  height: 100%;
  .el-tabs {
    height: 30px;
    .el-tabs__content {
      margin: 5px 0 !important;
    }
    .el-tabs__item {
      height: 30px;
      line-height: 30px;
      border: 1px solid #ddd;
      border-left: none !important;
    }
    .el-tabs__item:first-child {
      border-left: 1px solid #ddd !important;
    }
  }
  .c-init {
    width: 70%;
    position: absolute;
    top: 15%;
    left: 15%;
    .c-init-title {
      text-align: center;
    }
    .c-init-flow {
      width: 50%;
      margin: 30px auto;
    }
    .c-init-btn {
      text-align: center;
    }
  }
  .c-table {
    .el-table td,
    .el-table th {
      text-align: center !important;
    }
  }
  .el-popover .el-button {
    margin-left: 0 !important;
  }
}
</style>
<style scoped lang="scss">
.el-popover .el-button {
  margin-left: 0 !important;
  border: none !important;
}
</style>
