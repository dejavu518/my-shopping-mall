<!--回收站 @2021-10-26-->
<template>
  <div class="recycle-bin">
    <!--  文件还原回收-->
    <el-dialog :title="$t('txt.TXT_0923')" :visible.sync="recycleBin.dialogVisible" :close-on-click-modal="false" width="30%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="$t('txt.TXT_0924')" prop="name">
          <!--新建文件名称 -->
          <el-input v-model="ruleForm.newName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('txt.TXT_0925')" prop="name">
          <!--目标文件名称 -->
          <el-input v-model="ruleForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('txt.TXT_0926')" prop="region">
          <!--选择目标文件夹 -->
          <el-popover trigger="click" v-model="visible">
            <div id="areaTree">
              <div class="tree-box">
                <div class="zTreeDemoBackground left">
                  <ul id="treeDemo" class="ztree"></ul>
                </div>
              </div>
            </div>
            <el-input slot="reference" :placeholder="$t('msg.MSG_0038')" v-model="ruleForm.select"></el-input>
          </el-popover>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="recycleBin.dialogVisible = false">{{$t('btn.BTN_014')}}</el-button>
        <!--取 消 -->
        <el-button type="primary" @click="confirmRestore">{{$t('btn.BTN_013')}}</el-button>
        <!--确 定 -->
      </span>
    </el-dialog>
    <div class="top" style="font-weight: bold">{{$t('txt.TXT_0927')}}</div><!-- 文件回收站-->
    <div class="right">
      <div class="function-btn">
        <div class="function-btn-right">
          <div class="input-wrap">
            <div>
              <el-input :placeholder="$t('txt.TXT_0996')" v-model="searchValue" class="input-with-select" style="width: 260px!important;">
                <el-button slot="append" icon="el-icon-search" @click="handSearch" style="background-color: #409EFF;color: white;width: 48px;"></el-button>
              </el-input>
              <!-- 搜索 -->
            </div>
          </div>
          <div class="icon">
            <i class="el-icon-menu icon-item" @click="showIcon=!showIcon" :class="showIcon?'iconActive':''"></i>
            <i class="el-icon-s-fold icon-item" @click="showIcon=!showIcon" :class="showIcon?'':'iconActive'"></i>
          </div>
          <!-- 切换列表/图标 -->
        </div>
      </div>
      <!-------------------------- 内容 --------------------------------->
      <div class="container" style="height: calc(100vh - 172px);overflow-y: auto;" @click="hideMenu">
        <ul class="ul" v-show="showIcon">
          <li class="li" v-for="(item,i) in folderList" :key="i" @dblclick="handleDbclick(item, i)" @contextmenu.prevent="handleRightClick($event,item)">
            <div v-if="item.documentPath" @click="handPreview(item)">
              <div class="img">
                <img :src="item | formatterImgSrc" alt="">
              </div>
              <p class="img-name" :title="item.folderName?item.folderName:item.documentName">{{item.documentName ||item.folderName}}</p>
            </div>
            <div v-else>
              <div class="img">
                <img :src="item | formatterImgSrc" alt="">
              </div>
              <p class="img-name" :title="item.folderName?item.folderName:item.documentName">{{item.documentName ||item.folderName}}</p>
            </div>
          </li>
        </ul>
        <ul class="menuList" v-if="!$route.query.power">
          <li @click="handPreview(rightClickData)" v-if="notNode==true">{{$t('btn.BTN_029')}}</li>
          <!-- 预览 -->
          <li @click="updateFolderName(rightClickData)" v-if="notNode==true&&rightClickData.documentPath">{{$t('btn.BTN_037')}}</li>
          <!-- 下载 -->
          <li @click="handleDbclick(rightClickData)" v-if="notNode==true&&rightClickData.folderPath">{{$t('btn.BTN_036')}}</li>
          <!-- 打开 -->
          <li @click="handleScut(rightClickData)" v-if="notNode==true">{{$t('btn.BTN_101')}}</li>
          <!-- 剪切 -->
          <li @click="deleteItem(rightClickData)">{{$t('btn.BTN_009')}}</li>
          <!-- 删除 -->
          <li @click="viewAttr(rightClickData)" v-if="notNode==true">{{$t('txt.TXT_0028')}}</li>
          <!-- 属性 -->
          <li @click="recover(rightClickData)" v-if="notNode==false">{{$t('恢复')}}</li>
          <!-- 恢复 -->
        </ul>
        <div class="table-wrap" v-show="!showIcon">
          <el-table class="crm-table" :data="list" border>
            <el-table-column prop="documentName || folderName" :label="$t('txt.TXT_1301')" show-overflow-tooltip width="150px">
              <!--文件类型-->
              <template slot-scope="scope">
                <span v-if="scope.row.folderName">
                  <img src="../../../public/ele_js/images/icon/file_c.png" alt="">
                </span>
                <span v-else>
                  <span v-if="scope.row.ext == 'type'">
                    <img src="../../../public/ele_js/images/icon/pdf.png" alt="">
                  </span>
                  <span v-else-if="scope.row.ext == 'xls'">
                    <img src="../../../public/ele_js/images/icon/xls.png" alt="">
                  </span>
                  <span v-else-if="scope.row.ext == 'xlsx'">
                    <img src="../../../public/ele_js/images/icon/xls.png" alt="">
                  </span>
                  <span v-else-if="scope.row.ext == 'docx'||scope.row.ext=='doc'">
                    <img src="../../../public/ele_js/images/icon/doc.png" alt="">
                  </span>
                  <span v-else-if="scope.row.ext == 'txt'">
                    <img src="../../../public/ele_js/images/icon/txt.png" alt="">
                  </span>
                  <span v-else-if="scope.row.ext == 'png'">
                    <img src="../../../public/ele_js/images/icon/pic.png" alt="">
                  </span>
                  <span v-else-if="scope.row.ext == 'jpg'">
                    <img src="../../../public/ele_js/images/icon/pic.png" alt="">
                  </span>
                  <span v-else-if="scope.row.ext == 'gif'">
                    <img src="../../../public/ele_js/images/icon/gif.png" alt="">
                  </span>
                  <span v-else-if="scope.row.ext == 'mp4'">
                    <img src="../../../public/ele_js/images/icon/vdo.png" alt="">
                  </span>
                  <span v-else-if="scope.row.ext == 'pdf'">
                    <img src="../../../public/ele_js/images/icon/pdf.png" alt="">
                  </span>
                  <span v-else>
                    <img src="../../../public/ele_js/images/icon/pic.png" alt="">
                  </span>
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="documentName || folderName" :label="$t('txt.TXT_0471')" show-overflow-tooltip>
              <!--文件名称-->
              <template slot-scope="scope">
                <span v-if="scope.row.documentName" style="color: #409EFF;cursor:pointer;">
                  {{scope.row.documentName}}
                </span>
                <span v-if="scope.row.folderName">{{scope.row.folderName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="updateDate ||createDate" :label="$t('txt.TXT_0245')" show-overflow-tooltip>
              <!--更新日期-->
              <template slot-scope="scope">
                <span v-if="scope.row.updateDate">{{$moment(new Date(scope.row.updateDate)).format("YYYY-MM-DD")}}</span>
                <span v-else>{{$moment(new Date(scope.row.createDate)).format("YYYY-MM-DD")}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="updater || creater" :label="$t('txt.TXT_0217')" show-overflow-tooltip>
              <!--更新人-->
              <template slot-scope="scope">
                <span v-if="scope.row.updater">{{scope.row.updater}}</span>
                <span v-else>{{scope.row.creater}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('txt.TXT_0008')" fixed="right" width="100" v-if="!$route.query.power">
              <!--操作-->
              <template slot-scope="scope">
                <el-popover :ref="`popover-${scope.$index}`" placement="bottom" style="font-size: 14px;cursor: pointer;font-weight: 400" trigger="click">
                  <template>
                    <el-button size="mini" @click="handPreview(scope.row)" v-if="notNode==true&&scope.row.documentPath">{{$t('btn.BTN_029')}}</el-button>
                    <!--预览-->
                    <el-button size="mini" @click="updateFolderName(scope.row)" v-if="notNode==true&&scope.row.documentPath">{{$t('btn.BTN_037')}}</el-button>
                    <!--下载-->
                    <el-button size="mini" @click="handleDbclick(scope.row, scope.$index)" v-if="notNode==true&&scope.row.folderPath">{{$t('btn.BTN_036')}}</el-button>
                    <!--打开-->
                    <el-button size="mini" @click="handleScut(scope.row)" v-if="notNode==true">{{$t('btn.BTN_101')}}</el-button>
                    <!--剪切-->
                    <el-button size="mini" @click="deleteItem(scope.row)">{{$t('btn.BTN_009')}}</el-button>
                    <!-- 删除 -->
                    <el-button @click="viewAttr(scope.row)" v-if="notNode==true">{{$t('txt.TXT_0028')}}</el-button>
                    <!-- 属性 -->
                    <el-button @click="recover(scope.row)" v-if="notNode==false">{{$t('恢复')}}</el-button>
                    <!-- 恢复 -->
                    <i class="el-icon-more more" slot="reference"></i>
                  </template>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <elePreview v-if="previewShow" :Param="previewParam" @closePreview="closePreview" style="z-index: 9999999"></elePreview>
      <Attribute ref="Attribute" @closeAttr="closeAttr" :param="AttrPreviewParam"></Attribute>
    </div>
  </div>
</template>

<script>
import Attribute from './Attribute'
import elePreview from "@/components/PreviewLoad";
export default {
  name: "RecycleBin",
  components: { elePreview, Attribute, },
  data() {
    return {
      tabMaxHeight: `${document.documentElement.clientHeight}` - 190,
      visible: false,
      setting: {
        check: {
          enable: false,
          nocheckInherit: false,
          chkboxType: { "Y": "p", "N": "s" }
        },
        data: {
          simpleData: {
            enable: true
          }
        },
        callback: {
          beforeClick: this.beforeClick,
          onClick: this.zTreeOnClick,
          onCheck: this.zTreeOnCheck,
          beforeExpand: this.beforeExpand,
        },
      },
      // zNodes:[],
      zNodes: [],
      recycleBin: {
        dialogVisible: false,
      },
      ruleForm: {
        name: '',
        newName: '',
        select: '',
      },
      subData: {
        type: '',
        id: '',
        new_name: '',
        target_folder: ''
      },
      rules: {},
      zTree: {},
      list: [],
      showIcon: true,
      folderList: [],
      searchValue: '',
      id: '',
      notNode: false,
      rightClickData: {},
      AttrPreviewParam: '', //属性参数
      previewShow: '',
      previewParam: '',
    }
  },
  created() {
    // this.recyclebinList()
  },
  filters: {
    /**格式化**/
    formatterImgSrc(v) {
      if (v.folderName) {
        return require('../../../public/ele_js/images/folder.png')
      } else if (v.documentName) {
        let name = v.documentName.split('.')
        let type = v.ext || name[name.length - 1];
        if (type === 'pdf') {
          return require('../../../public/ele_js/images/pdf.png')
        } else if (type === 'xls' || type === 'lsx' || type === 'xlsx') {
          return require('../../../public/ele_js/images/xls.png')
        } else if (type === 'doc' || type === 'docx') {
          return require('../../../public/ele_js/images/word.png')
        } else if (type === 'txt') {
          return require('../../../public/ele_js/images/txt.png')
        } else if (type === 'png') {
          return require('../../../public/ele_js/images/pic.png')
        } else if (type === 'gif') {
          return require('../../../public/ele_js/images/pic.png')
        } else if (type === 'jpg') {
          return require('../../../public/ele_js/images/pic.png')
        } else if (type === 'img') {
          return require('../../../public/ele_js/images/pic.png')
        } else if (type === 'mp4') {
          return require('../../../public/ele_js/images/vdo.png')
        } else if (type === 'ppt' || type == 'pptx') {
          return require('../../../public/ele_js/images/ppt.png')
        } else {
          return require('../../../public/ele_js/images/other.png')
        }
      }
    }
  },
  methods: {
    handSearch(v) {
    },
    /**预览**/
    handPreview(item) {
      // console.log(item, 999)
      // let type = item.documentName.split('.')
      // this.previewParam = {
      //     id: item.uuid,
      //     type: item.ext || type[type.documentName - 1],
      //     source: '0',
      //     ver: '',
      //     rid: '',
      //     filename: item.documentName
      // };
      // this.previewShow = true;
    },
    /**关闭预览**/
    closePreview(bool) {
      if (bool) {
        this.previewShow = false;
      }
    },
    /**查询子级文件夹及文件信息**/
    getFileChild(GUID) {
      this.$api.doc.fileChild(GUID).then(res => {
        if (res.success) {
          let arr1 = res.data.folderList;
          let arr2 = res.data.documentList;
          this.folderList = arr1.concat(arr2);
          this.list = arr1.concat(arr2);
          // this.page.total = this.list.length;
          this.id = GUID;
        }
      });
    },
    /**文件夹双击事件**/
    handleDbclick(item, index) {
      if (index) {
        this.$refs[`popover-${index}`].doClose();
      }
      this.notNode = true
      if (item.documentPath) { //存在代表双击对象为文件而非文件夹
        this.handSeeView(item)
      } else {
        // this.addFolder.id = item.folderGuid;
        this.id = item.folderGuid;
        this.ruleForm.folder_level = item.folderLevel
        this.notRoot = true
        this.getFileChild(item.folderGuid)
      }
    },
    /**右键事件**/
    handleRightClick(event, item) {
      this.rightClickData = item;
      let e = event || window.event;
      let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
      let scrollY = document.documentElement.scrollTop || document.body.scrollTop;
      let x = e.pageX || e.clientX + scrollX;
      let y = e.pageY || e.clientY + scrollY;
      let menuList = document.querySelector('.menuList');
      menuList.style.display = 'block';
      menuList.style.left = x + 'px';
      menuList.style.top = y + 'px';
      // if (item.folderGuid) {
      //   this.addFolder.id = item.folderGuid;
      // }
    },
    /**点击其他区域隐藏右键菜单**/
    hideMenu() {
      let menuList = document.querySelector('.menuList')
      menuList.style.display = 'none'
    },
    /**预览**/
    handSeeView(item) {
      if (item.uuid) {
        axios.get("/api:" + 400 + "/view/" + item.uuid)
          .then(response => {
            if (response.status === 200) {
              this.previewParam = {
                id: '2eaa9e09-6a82-4a81-9555-579a4f3ce6b2',
                type: response.type,
                source: 1,
                ver: '',
                rid: '',
                filename: item.name
              };
              this.previewShow = true;
              this.$store.state.eleTemplate.previewFiles = null;
            }
          })
      }
    },
    /**恢复**/
    recover(item) {
      // 恢复文件夹
      if (item.folderName) {
        this.$confirm(this.$t('您确定要恢复该文件夹吗？'), this.$t('txt.TXT_0289'), {
          confirmButtonText: this.$t('btn.BTN_013'),//确定
          cancelButtonText: this.$t('btn.BTN_014'),//取消
          type: 'warning'
        }).then(() => {
          this.$api.doc.folderRecover(item.folderGuid).then(res => {
            if (res.success) {
              this.$message({ message: res.message, type: 'success' })
              this.getRecyclebinList()
            } else {
              this.$message({ message: res.message, type: 'error' })
            }
          })
        })
      } else if (item.documentName) {
        this.$confirm(this.$t('您确定要恢复该文件吗？'), this.$t('txt.TXT_0289'), {
          confirmButtonText: this.$t('btn.BTN_013'),//确定
          cancelButtonText: this.$t('btn.BTN_014'),//取消
          type: 'warning'
        }).then(() => {
          this.$api.doc.documentRecover(item.documentGuid).then(res => {
            if (res.success) {
              this.$message({ message: res.message, type: 'success' })
              this.getRecyclebinList()
            } else {
              this.$message({ message: res.message, type: 'error' })
            }
          })
        })
      }
    },
    /**删除文件或文件夹**/
    deleteItem(row) {
      this.$confirm(i18n.t('msg.MSG_0035'), i18n.t('txt.TXT_0289'), { type: 'warning' }).then(() => {
        if (row.folderName) {  //删除文件夹
          this.$api.doc.psyDelFolder(row.folderGuid).then(res => {
            if (res.success) {
              this.$message({ message: i18n.t(res.message) || i18n.t('msg.MSG_0022'), type: 'success' })//删除成功
              this.getRecyclebinList()
            } else {
              this.$message({ message: i18n.t(res.message) || i18n.t('msg.MSG_0125'), type: 'error' })//删除失败
            }
          });
        } else {
          this.$api.doc.psyDelDocument(row.documentGuid).then(res => { //删除文件
            if (res.success) {
              this.$message({ message: i18n.t(res.message) || i18n.t('msg.MSG_0022'), type: 'success' })//删除成功
              this.getRecyclebinList()
            } else {
              this.$message({ message: i18n.t(res.message) || i18n.t('msg.MSG_0125'), type: 'error' })//删除失败
            }
          })
        }
      })
    },
    /**关闭文件属性窗口**/
    closeAttr(bool) {
      if (bool) {
        this.$refs.Attribute.dialogVisible = false
        this.getFileChild(this.ruleForm.folderGUID)
      }
    },
    zTreeOnClick: function (event, treeId, treeNode) {
      console.log(treeNode.tId + ", " + treeNode.name);
    },
    zTreeOnCheck: function (event, treeId, treeNode) {
      // console.log(treeNode.tId + ", " + treeNode.name + "," + treeNode.checked);
      var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
        checkCount = zTree.getCheckedNodes(true).length,//选中
        nocheckCount = zTree.getCheckedNodes(false).length,//未选中
        changeCount = zTree.getChangeCheckedNodes().length;//获取输入框勾选状态被改变的节点集合（与原始数据 checkedOld 对比）
      var checkedNames = [], checkedIds = [];
      for (var i = 0; i <= zTree.getCheckedNodes(true).length - 1; i++) {
        checkedIds.push(zTree.getCheckedNodes(true)[i].id);
        checkedNames.push(zTree.getCheckedNodes(true)[i].name);
      }
    },
    beforeClick: function (treeId, treeNode) {
      this.ruleForm.select = treeNode.name;
      this.subData.target_folder = treeNode.id;
    },
    beforeExpand: function (treeId, treeNode) {
      let that = this;
      // $.ajax({
      //   url: `${requestUrl.elBaseUrl}/file/restoresubfolders/${treeNode.id}`,
      //   type: 'GET',
      //   dataType: "json",
      //   // data: { folder_guid: treeNode.id },
      //   async: false,
      //   success: (d) => {
      //     {
      //       if (d.code === 0) {
      //         d.data = JSON.parse(d.data);
      //         this.zTree.removeChildNodes(treeNode);
      //         if (d.data.length > 0)
      //           this.zTree.addNodes(treeNode, d.data, true);
      //         else {
      //           treeNode.isParent = false;
      //           this.zTree.updateNode(treeNode);
      //         }
      //         that.singlePath(treeNode);
      //       }
      //       else {
      //         console.log(d)
      //       }
      //     }
      //   }
      // });
    },
    /**查询回收站文件及其文档列表**/
    getRecyclebinList() {
      this.$api.doc.recyclebinList().then(res => {
        if (res.success) {
          this.notNode = false
          let arr1 = res.data.folderList;
          let arr2 = res.data.documentList;
          this.folderList = arr1.concat(arr2);
          this.list = arr1.concat(arr2);
        }
      })
    },

    //确认恢复文件
    confirmRestore() {
      this.subData.new_name = this.ruleForm.newName;
      if (this.subData.new_name === '') {
        this.$message(this.$t('msg.MSG_0105'));//请填写新建文档名称
        return;
      } else if (this.subData.target_folder === '') {
        this.$message(this.$t('msg.MSG_0106'));//请选择目标文件
        return;
      }
    },
    childMethod(v) {//刷新回收站
      if (v === '-1') {
        this.getRecyclebinList()
      }
    }
  },
  watch: {
    "$store.state.eleTemplate.recycleBin": {
      deep: true,
      handler: function (newValue, oldValue) {
        if (newValue !== null) {
          // restore(newValue.type, newValue.id).then(n => {
          //   this.subData.id = newValue.id;
          //   this.subData.type = newValue.type;
          //   if (n.code === 0) {
          //     this.ruleForm.name = n.name;
          //     this.ruleForm.select = '';
          //     this.recycleBin.dialogVisible = true;
          //     this.recycleBin.dialogVisible = true;
          //     restoresubfolders('%20').then(n => {
          //       this.zNodes = eval('(' + n.data + ')');
          //       this.zTree = $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
          //     });
          //   } else {
          //     this.$message(n.msg)
          //   }
          // });
        }
      }
    }
  },
  mounted() {
    // this.importExploer('%20');
    this.getRecyclebinList()
    this.$store.state.eleTemplate.recycleBin_Status = true;
    this.$nextTick(() => {
      this.zTree = $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
    })
  },
  destroyed() {
    this.$store.state.eleTemplate.recycleBin_Status = false;
  }
}
</script>

<style scoped lang="scss">
@import "../../../public/ele_js/css/table.css";
@import "../../../public/ele_js/css/explorer.css";
.recycle-bin {
  .search_txt {
    background-color: #fff;
    margin-right: -3px;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    height: 30px;
    line-height: 24px;
    outline: none;
    padding: 0 15px;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    /*width: 72%;*/
    width: 135px;
  }
  .top {
    height: 40px;
    line-height: 40px;
    padding-left: 16px;
    background: white;
    color: #333;
  }
  .right {
    flex: 8;
    width: calc(100vw - 272px);
    // height: calc(100vh - 116px);
    /*width: 100%;*/
    vertical-align: top;
    display: inline-block;
    background-color: #fff;
    margin: 16px 16px 0 16px;
    .function-btn {
      position: relative;
      height: 50px;
      line-height: 50px;
      /*margin: 8px 0;*/
      padding-left: 8px;
      background: white;
      border-bottom: 1px solid #ddd;
      display: flex;
      flex: 1;
      width: 100%;
      justify-content: space-between;
      .icon {
        font-size: 24px;
      }
      .icon-item {
        border: 1px solid #ddd;
        padding: 2px;
        cursor: pointer;
        margin-right: 8px;
      }
      .iconActive {
        color: #409eff;
      }
    }

    .function-btn-left,
    .function-btn-right {
      flex: 1;
      display: inline-flex;
      align-items: center;
    }
    .function-btn-right {
      justify-content: flex-end;
    }

    .container {
      height: calc(100vh - 180px);
      overflow-y: auto;
    }

    .change-icon {
      /*position: absolute;*/
      /*right: 4%;*/
      /*top: 0;*/
      display: inline-flex;
      align-items: center;
      height: 100%;
      float: right;
      margin-right: 32px;
      font-size: 32px;

      &:hover {
        cursor: pointer;
      }
    }

    .input-wrap {
      /*position: absolute;*/
      /*right: 4%;*/
      /*top: 0;*/
      /*width: 20%;*/
      margin-right: 16px;
    }

    .search_txt {
      background-color: #fff;
      margin-right: -3px;
      background-image: none;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      color: #606266;
      height: 30px;
      line-height: 24px;
      outline: none;
      padding: 0 15px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      /*width: 80%;*/
      width: 135px;
    }

    .el-icon-search {
      margin: 8px;
      font-size: 18px;
      transform: translateY(2px);

      &:hover {
        cursor: pointer;
      }
    }
    .menuList {
      position: fixed;
      display: none;
      z-index: 2;
      border: 1px solid #ccc;
      border-radius: 2px;
      background: white;
      li {
        padding: 4px 8px;
        &:hover {
          background: #ddd;
        }
      }
    }
    .ul {
      padding: 16px;
      .li {
        display: inline-block;
        // margin: 2%;
        // max-width: 120px;
        // ----------
        margin: 0px 5px;
        width: 130px;
        height: 140px;
        padding-left: 35px;
      }
      .img {
        // width: 55px;
        // height: 55px;
        //---------------
        width: 72px;
        height: 72px;
        // margin: 8px auto;
        margin-top: 25px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .img-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
    }
    // -------------------------- end --------------------------------------
  }
}
</style>
<style lang="scss" scoped>
.el-popper .el-select-dropdown__item {
  font-size: 12px !important;
  height: 243px !important;
  line-height: 28px !important;
  overflow: auto !important;
}
</style>
<style lang="scss">
/*@import '../../plugins/ztree/css/zTreeStyle.css';*/
#areaTree {
  margin-bottom: 2px;
  border-radius: 4px;
  overflow: hidden;
}
.box-title {
  border-radius: 3px 3px 0 0;
  background-color: #f5f5f5;
}
.box-title a {
  color: #2fa4e7;
  text-decoration: none;
  font-size: 14px;
  display: block;
  padding: 8px 15px;
  cursor: pointer;
}
.box-title .fa {
  float: right;
  line-height: 20px;
}
</style>
<style>
.el-icon-search {
  color: #ffffff !important;
}
</style>
