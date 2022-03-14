<!-- 文档管理外框架 @2021-10-09-->
<template>
  <div class="am-index">
    <div class="left">
      <MiniServiceNavi class="left-nav"></MiniServiceNavi>
      <div class="list-wrap">
        <div class="rsgl" v-if="$pms('S:FILE')">{{$t('txt.TXT_1403')}}<i class="el-icon-s-home" @click="goToIndex"></i></div>
        <!--文件管理-->
        <ul ref="tree">
          <li v-for="(item,i) in navList" :key="i" v-if="item.show" class="item" @click="classify(item,i)" :class="flag===i?'select':''">{{item.label}}</li>
          <li class="item" v-if="$svc('M:FILE_HSZ')" @click="classify('-1',-1)" :class="flag===-1?'select':''">{{$t('txt.TXT_0922')}}</li><!--  回收站 -->
        </ul>
      </div>
    </div>
    <div class="container">
      <router-view ref="child"></router-view>
    </div>
  </div>
</template>

<script>
import MiniServiceNavi from "@/components/MiniServiceNavi";
import { folderMenus } from '@/api/ele-modules/archives-management/methods'
import $store from "@/store";
export default {
  name: "FILEIndex",
  components: { MiniServiceNavi },
  data() {
    return {
      flag: '',
      num: 0,
      component: () => import('./FilePage'),
      navList: []
    }
  },
  methods: {
    goToIndex() {
      this.$router.push({ name: 'FILEFirstPage' });
      $('.list-wrap >ul li.item').removeClass('select');
    },
    classify(v, m) {
      $('.list-wrap >ul li.item').removeClass('select');
      this.$store.state.eleTemplate.folderType = 0;
      this.flag = m;
      if (this.num == 0) {
        this.num++
        if (v !== '-1') {
          this.$router.push({ path: '/FILEIndex/FilePage', query: { queryId: JSON.stringify(v), flag: this.flag } });
          this.$nextTick(() => {
            this.$refs.child.searchValue = '';
            this.$nextTick(function () {
              this.$refs.child.childMethod(v);
            })
          });
        } else {
          this.$router.push({ path: '/FILEIndex/RecycleBin', query: { flag: this.flag } });
        }
      } else if (v !== '-1') {
        this.$router.push({ path: '/FILEIndex/FilePage', query: { queryId: JSON.stringify(v), flag: this.flag } });
        this.$nextTick(() => {
          this.$refs.child.searchValue = '';
          this.$nextTick(function () {
            this.$refs.child.childMethod(v);// 调用子页面方法
          })
        });
      } else if (v === '-1') {
        this.$router.push({ path: '/FILEIndex/RecycleBin', query: { flag: this.flag } });
        this.$nextTick(() => {
          this.$nextTick(function () {
            this.$refs.child.childMethod(v);// 调用子页面方法
          })
        });
      }
    },
    styleInit() {
      $('.main-content').css('margin', '0').css('overflow', 'unset');
    },
    /****/
    setDefaultHightLight() {
      let flag = this.$route.query.flag;
      switch (flag) {
        case '0':
          $('.list-wrap >ul li.item').eq(0).addClass('select').siblings().removeClass('select');
          break;
        case '1':
          $('.list-wrap >ul li.item').eq(1).addClass('select').siblings().removeClass('select');
          break;
        case '2':
          $('.list-wrap >ul li.item').eq(2).addClass('select').siblings().removeClass('select');
          break;
        case '3':
          $('.list-wrap >ul li.item').eq(3).addClass('select').siblings().removeClass('select');
          break;
        case '-1':
          $('.list-wrap >ul li.item').eq(4).addClass('select').siblings().removeClass('select');
          break;
        default:
          $('.list-wrap >ul li.item').removeClass('select');
          break;
      }
    },
    filterMenuTree() {
      let filterAttr = (nodes) => {
        $.each(nodes, function () {
          const index = nodes.findIndex(item => item.show !== true);
          if (index > -1) {
            nodes.splice(index, 1);
          }
        });
      };
      filterAttr(this.navList);
    },
  },
  mounted() {
    folderMenus().then(n => {
      let arr = [];
      JSON.parse(n.data).forEach(m => {
        if (m.name === 'Folder_002') {
          m.label = this.$t('txt.TXT_0920')
          m.show = this.$svc('M:FILE_GSL')
        } else if (m.name === 'Folder_003') {
          m.label = this.$t('txt.TXT_0921')
          m.show = this.$svc('M:FILE_HYL')
        } else if (m.name === 'Folder_001') {
          m.label = this.$t('txt.TXT_0919');
          m.show = this.$svc('M:FILE_PXL')
        } else if (m.name === 'Folder_004') {
          m.label = this.$t('txt.TXT_0940');
        }
        arr.push(m);
      });
      this.navList = arr;
      this.$nextTick(() => {
        this.setDefaultHightLight();
      });
    });
    this.$nextTick(() => {
      this.styleInit();
      this.filterMenuTree();
    });
  },
}
</script>
<style scoped lang="scss">
.am-index {
  .left {
    display: inline-block;
    width: 240px;
    min-height: calc(100vh - 50px);
    text-align: left;
    background: white;
    .left-nav {
      display: inline-block;
      width: 50px;
      height: calc(100vh - 50px);
      background: rgb(51, 51, 51);
    }
    .list-wrap {
      display: inline-block;
      vertical-align: top;
      width: calc(100% - 50px);
    }
    .rsgl {
      background: rgb(217, 236, 255);
      position: relative; /*padding-left: 24px;*/
      text-align: left;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      font-weight: bold;
      color: black;
      padding-left: 24px;
    }
    .el-icon-s-home {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: #999;
      &:hover {
        cursor: pointer;
      }
    }
    .item {
      text-align: left;
      padding-left: 24px;
      height: 40px;
      line-height: 40px;
      font-weight: 400;
      color: #333;
    }
    .item:hover {
      background: rgb(217, 236, 255);
    }
  }
  .container {
    display: inline-block;
    width: calc(100% - 240px);
    vertical-align: top;
    background: #f8f8f8;
  }
  .select {
    color: #409eff !important;
  }
}
</style>
