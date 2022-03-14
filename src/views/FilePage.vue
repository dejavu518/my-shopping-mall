<!--文件列表页面 @2021-11-11-->
<template>
  <div class="file-page">
    <!----------------------创建文件夹弹框----------------------------->
    <el-dialog :title="$t('txt.TXT_0928')" :visible.sync="newFileDaga.dialogVisible" :close-on-click-modal="false" width="478px" v-dialogDrag>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="width: 400px">
        <el-form-item :label="$t('txt.TXT_0929')" prop="name">
          <!-- 文件夹名称 -->
          <el-input v-model="ruleForm.name" maxlength="100" @input="folderInput"></el-input>
        </el-form-item>
        <el-form-item :label="$t('txt.TXT_0931')" prop="resource">
          <!-- 访问控制 -->
          <el-radio-group v-model="ruleForm.resource" @change="radioChange">
            <el-radio :label="1" class="radio-item">{{$t('txt.TXT_0933')}}</el-radio><!-- 所有人可见 -->
            <el-radio :label="2" class="radio-item">{{$t('txt.TXT_0938')}}</el-radio><!-- 仅自己可见 -->
            <el-radio :label="3" style="width: 140px;">{{$t('txt.TXT_0934')}}</el-radio><!-- 部门可见 -->
            <el-select v-model="newFileDaga.undertake" :disabled="ruleForm.resource!==3" :placeholder="$t('msg.MSG_0038')" style="margin-bottom: 8px;display: inline-block;width:44%!important">
              <!--请选择-->
              <el-option :value="newFileDaga.undertakeTree" style="height: auto !important;background-color: #fff;padding: 0">
                <el-tree :data="newFileDaga.treeData_undertake" show-checkbox ref="tree_undertake" node-key="id" :default-checked-keys="newFileDaga.checked_undertake" default-expand-all @check-change="CheckChangeUndertake">
                </el-tree>
              </el-option>
            </el-select>
            <el-radio :label="4" style="width: 140px;">{{$t('txt.TXT_0939')}}</el-radio><!-- 指定人可见 -->
            <el-select v-model="newFileDaga.trainer" :disabled="ruleForm.resource!==4" :placeholder="$t('txt.TXT_0226')" style="display: inline-block;width:44%!important">
              <!--请选择-->
              <el-option :value="newFileDaga.trainerTree" style="height: auto !important;background-color: #fff;padding: 0">
                <el-tree :data="newFileDaga.memberData" show-checkbox ref="tree_objects" node-key="id" :default-checked-keys="newFileDaga.checked_trainer" default-expand-all @check-change="CheckChangeTrainer" :render-content="renderContent" :render-after-expand=false>
                </el-tree>
              </el-option>
            </el-select>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="newFileDaga.dialogVisible = false">{{$t('btn.BTN_014')}}</el-button><!-- 取 消 -->
        <el-button type="primary" @click="saveFile">{{$t('btn.BTN_013')}}</el-button><!--  确 定-->
      </span>
    </el-dialog>
    <!-- 面包屑 -->
    <!-- <div class="nav">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="cursor:pointer">
        <el-breadcrumb-item @click.native="navClick(title.id)">{{title.label}}</el-breadcrumb-item>
        <el-breadcrumb-item v-for="item in breadData" :key="item.id">{{item.title}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->

    <div class="nav">
      <span @click="navClick(title.id)" class="first-nav">{{title.label}}</span>
      <span v-if="isRoot==false">
        <span> > </span>
        <span @click="navClick1(title1.id)" class="first-nav">{{title1.label}}</span>
        <span v-if="title2.label!==''"> > </span>
        <span>{{title2.label}}</span>
      </span>

    </div>
    <!-- <div class="nav">
      <span class="version">
        <span v-for="(item,i) in breadData" :key="i" style="cursor: pointer" @click="goBack(item.folderGuid,i)"> {{item.folderName}}
          <span v-show="breadData.length - 1 !==i "> > </span>
        </span>
      </span>
    </div> -->
    <div class="all">
      <!------------------------ -左侧树 -------------------------------->
      <div class="left">
        <div id="areaTree" style="height: calc(100vh - 118px)">
          <span>{{title.label}}</span>
          <!-- -----------------------12-20----------------------- -->
          <!-- <div class="tree-box">
            <div class="zTreeDemoBackground left">
              <ul id="treeDemo" class="ztree"></ul>
            </div>
          </div> -->
          <!-- 修改 -->
          <div style="margin-top:10px" class="zTreeDemoBackground left">
            <el-tree :data="treeData" :props="defaultProps" accordion @node-click="handleNodeClick" :load="loadNode" lazy node-key="id" highlight-current>
              <div class="custom-tree-node" slot-scope="{node}">
                <div>
                  <img src="../../../public/ele_js/images/icon/file_c.png" alt="" class="node-img">
                  <span :title="node.data.label" class="node-label">{{node.data.label}}</span>
                </div>
              </div>
            </el-tree>
          </div>

          <!-- --------------------------end---------------------------- -->
        </div>
      </div>
      <div class="right">
        <!------------------------ 右侧按钮 -------------------------->
        <div class="function-btn">
          <div class="function-btn-left">
            <el-button icon="el-icon-back" v-show="isRoot==false" id="back" @click="goBack(title1.pid)">{{$t('txt.TXT_0935')}}</el-button><!-- 返回上一级 -->
            <el-button @click="newFile()" type="primary">{{$t('txt.TXT_0928')}}</el-button><!-- 创建文件夹 -->
            <div class="upload-wrap">
              <el-upload :action="$crmPreviewUrl" :data="{ token: 'testtoken', meta: 'true',aid:'DMCTEST_a3eff63c-b97a-4609-8c1c-149f1c0c4b1c' }" :on-change="onChange" :on-success="handleAvatarSuccess" v-show="isRoot==false" class="input-container">
                <el-button id="upload" suffix-icon="el-icon-upload">
                  {{$t('txt.TXT_0276')}}
                </el-button>
                <!-- 上传资料 -->
              </el-upload>
            </div>
          </div>
          <div class="function-btn-right">
            <div class="input-wrap">
              <div>
                <el-input :placeholder="$t('txt.TXT_0996')" v-model="searchValue" class="input-with-select">
                  <el-button slot="append" icon="el-icon-search" @click="handSearch(searchValue)" style="background-color: #409EFF;color: white">{{$t('btn.BTN_071')}}</el-button>
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
        <!------------------------ 右侧内容 -------------------------->
        <div class="container" v-loading="addFolder.loading" :element-loading-text="addFolder.loadingText" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" @click="hideMenu">
          <ul class="ul" v-show="showIcon">
            <li class="li" v-for="(item,i) in folderList" :key="i" @dblclick="handleDbclick(item, i)" @contextmenu.prevent="handleRightClick($event,item)" :class="{active:i===getIndex}">
              <!-- 文件 -->
              <div v-if="item.documentPath">
                <div class="img">
                  <img :src="item | formatterImgSrc" alt="">
                </div>
                <p class="img-name" :title="item.folderName?item.folderName:item.documentName">{{item.documentName ||item.folderName}}</p>
              </div>
              <!-- 文件夹 -->
              <div v-else>
                <div class="img">
                  <img :src="item | formatterImgSrc" alt="">
                </div>
                <p class="img-name" :title="item.folderName?item.folderName:item.documentName">{{item.documentName ||item.folderName}}</p>
              </div>
            </li>
          </ul>
          <ul class="menuList" v-if="!$route.query.power">
            <li @click="handPreview(rightClickData)" v-if="rightClickData.documentPath">{{$t('btn.BTN_029')}}</li>
            <!-- 预览 -->
            <li @click="updateFolderName(rightClickData)" v-if="rightClickData.documentPath">{{$t('btn.BTN_037')}}</li>
            <!-- 下载 -->
            <li @click="handleDbclick(rightClickData)" v-if="!rightClickData.documentPath">{{$t('btn.BTN_036')}}</li>
            <!-- 打开 -->
            <li @click="handleScut(rightClickData)">{{$t('btn.BTN_101')}}</li>
            <!-- 剪切 -->
            <li @click="deleteItem(rightClickData)">{{$t('btn.BTN_009')}}</li>
            <!-- 删除 -->
            <li @click="viewAttr(rightClickData)">{{$t('txt.TXT_0028')}}</li>
            <!-- 属性 -->
          </ul>
          <div class="table-wrap" v-show="!showIcon">
            <el-table class="crm-table" :data="list" :max-height="autoHeight - 66 - 15 - 45 - 40  + 'px'" border>
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
                    <span v-else-if="scope.row.ext == 'xls'||scope.row.ext=='xlsx'">
                      <img src="../../../public/ele_js/images/icon/xls.png" alt="">
                    </span>
                    <span v-else-if="scope.row.ext == 'docx'">
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
                      <el-button size="mini" @click="handPreview(scope.row)" v-if="scope.row.documentPath">{{$t('btn.BTN_029')}}</el-button>
                      <!--预览-->
                      <el-button size="mini" @click="updateFolderName(scope.row)" v-if="scope.row.documentPath">{{$t('btn.BTN_037')}}</el-button>
                      <!--下载-->
                      <el-button size="mini" @click="handleDbclick(scope.row, scope.$index)" v-else>{{$t('btn.BTN_036')}}</el-button>
                      <!--打开-->
                      <el-button size="mini" @click="handleScut(scope.row)">{{$t('btn.BTN_101')}}</el-button>
                      <!-- 剪切 -->
                      <el-button size="mini" @click="deleteItem(scope.row)">{{$t('btn.BTN_009')}}</el-button>
                      <!--删除-->
                      <el-button size="mini" @click="viewAttr(scope.row)">{{$t('txt.TXT_0028')}}</el-button>
                      <!--属性-->
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
        <FolderAttr ref="FolderAttr"></FolderAttr>
      </div>
    </div>
  </div>
</template>
<script>
import Attribute from './Attribute'
import FolderAttr from './FolderAttr'
import elePreview from "@/components/PreviewLoad";
export default {
  name: "FilePage",
  components: { elePreview, Attribute, FolderAttr, },
  data() {
    return {
      searchValue: '',
      parentID: '',
      // ----------------------12-20--------------------------------------
      // zTree的配置
      // setting: {
      //   view: {
      //     showIcon: true,
      //     addDiyDom: this.addDiyDom
      //   },
      //   check: {
      //     enable: false,
      //     nocheckInherit: false,
      //     chkboxType: { "Y": "p", "N": "s" }
      //   },
      //   data: {
      //     key: {
      //       isParent: "parent",
      //       children: "children",
      //       name: "name",
      //       title: "",
      //       url: "url",
      //       icon: "icon"
      //     },
      //     simpleData: {
      //       enable: true,
      //       idKey: "id",
      //       pIdKey: "pid",
      //       rootPId: null
      //     },
      //     keep: {
      //       parent: false,
      //       leaf: false
      //     }
      //   },
      //   callback: {
      //     beforeClick: this.beforeClick,
      //     onClick: this.zTreeOnClick,
      //     onCheck: this.zTreeOnCheck,//定义节点复选框选中或取消选中事件的回调函数
      //     beforeExpand: this.beforeExpand,
      //     beforeCollapse: this.beforeCollapse
      //   }
      // },
      // zNodes: [],
      // zTree: {},
      // ---------------------------------------------------------------------
      input2: '',
      AttrPreviewParam: '', //属性参数
      showAttribute: false,
      FolderAttrParam: '', //文档属性参数
      showFolderAttr: false,  //打开文档属性
      //导航文字
      title: {
        label: '',
        id: ''
      },
      title1: {
        label: '',
        pid: '',
        id: ''
      },
      title2: {
        label: '',
        pid: '',
        id: ''
      },
      levelNum: 0, //用于计算树目录层级
      isRoot: true, //是否为根目录
      previewParam: '',//预览参数
      previewShow: '',//预览显示
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      newFileDaga: {
        dialogVisible: false,
        undertake: '',//部门
        undertakeTree: [],//部门tree选中
        treeData_undertake: [],//tree部门
        expanded_undertake: [],//tree部门默认展开
        checked_undertake: [],//tree部门默认选中
        memberData: [],
        trainer: [],
        trainerTree: [],
        expanded_trainer: [],//tree参会人员默认展开
        checked_trainer: [],
      },
      ruleForm: {
        name: null,
        resource: 0,
        folderGuid: '',
        folderLevel: 0,
        folderType: 0
      },
      rules: {
        /*name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],*/
      },
      folderList: [],
      list: [],
      //新增文件夹
      addFolder: {
        name: '',
        id: '',
        diaName: '',
        loading: false, //加载遮罩
        loadingText: '', //加载提示信息
      },
      showIcon: true,
      autoHeight: '',
      rightClickData: {}, //每次右键点击的数据
      id: '',
      //上传文件
      uploadFile: {
        documentName: '',
        documentPath: '',
        folderGuid: '',
        documentCategory: 230
      },
      parentGuid: '',
      getIndex: '',
      // breadData: [{
      //   folderName: JSON.parse(this.$route.query.queryInfo).label,
      //   folderGuid: JSON.parse(this.$route.query.queryInfo).folderGuid
      // }], //面包屑导航
      breadData: [],
      pid: ''
    }
  },
  updated() {
    this.ruleForm.folderType = this.$store.state.eleTemplate.folderType;
  },
  mounted() {
    this.autoHeight = `${document.documentElement.clientHeight} ` - 50;//获取浏览器可视区域高度
    this.resize()
    this.$store.state.eleTemplate.folderType = 0;
    if (this.$route.query.queryInfo) {
      this.childMethod(JSON.parse(this.$route.query.queryInfo));
    } else {
      let info = JSON.parse(sessionStorage.getItem('queryInfo'))
      this.childMethod(info)
    }
    this.$nextTick(() => {
      this.zTree = $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
    })
  },
  filters: {
    /**格式化**/
    formatterImgSrc(v) {
      if (v.folderName) {
        return require('../../../public/ele_js/images/folder.png')
      } else if (v.documentPath) {
        let type = v.ext
        if (type === 'pdf') {
          return require('../../../public/ele_js/images/pdf.png')
        } else if (type === 'xls' || type === 'xlsx') {
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
        } else {
          return require('../../../public/ele_js/images/other.png')
        }
      }
    }
  },
  methods: {
    /**左侧树 懒加载数据**/
    loadNode(node, resolve) {
      let treeData = [];
      if (node.data.id || node.id) {
        let parentId = node.data.id || node.id;
        this.$api.doc.subFoldersDict(parentId).then(res => {
          treeData = this.$utils.JSONSwapArr(res.data, ["id", "name"], ["id", "label"]);;
          resolve(treeData);
        });
      }
    },
    /**点击左侧树数据**/
    handleNodeClick(data, node) {
      this.title2.label = ''
      this.isRoot = false
      if (node.level == 1) {
        this.title1.label = data.label
        this.title1.id = data.id
      } else if (node.level == 2) {
        this.title2.label = data.label
        this.title2.id = data.id
      }
      // this.breadData = []
      // let nodeData = node
      // console.log(nodeData, '888999')
      // if (nodeData.parent !== null) {
      //   this.breadData.unshift({ 'title': nodeData.data.label, 'id': nodeData.data.id })
      //   nodeData = nodeData.parent
      // }
      this.getFileChild(data.id)
    },
    /**自定义人员树样式**/
    renderContent: function (h, { node, data, store }) {
      let addElement = arguments[0];
      if (data.type === 'dept' || data.type == 'position') {
        return addElement('span', [
          addElement('i', { class: "" }),
          addElement('span', "    "),
          addElement('span', arguments[1].node.label)
        ]);
      } else {
        return addElement('span', [
          addElement('i', { class: "el-icon-user-solid" }),
          addElement('span', "    "),
          addElement('span', arguments[1].node.label)
        ]);
      }
    },
    /**自定义文件树样式**/
    // renderContent1: function (h, { node, data, store }) {
    //   let addElement = arguments[0];
    //   if (data.parent == false) {
    //     return addElement('span', [
    //       addElement('i', { class: "" }),
    //       addElement('span', "    "),
    //       addElement('span', arguments[1].node.label)
    //     ]);
    //   } else {
    //     return addElement('span', [
    //       addElement('i', { class: "el-icon-plus" }),
    //       addElement('span', "    "),
    //       addElement('span', arguments[1].node.label)
    //     ]);
    //   }
    // },
    /**点击面包屑回到主页**/
    navClick(id) {
      this.title1.label = ''
      this.isRoot = true
      this.getSubFolders(id)
      this.getFileChild(id)
    },
    navClick1(id) {
      this.title2.label = ''
      this.getSubFolders(id)
      this.getFileChild(id)
    },
    /**返回上一级**/
    goBack(id) {
      this.title1.label == ''
      this.isRoot = true
      this.getFileChild(id)
    },
    /**文件夹双击事件**/
    handleDbclick(item, index) {
      console.log(item, '8888')
      if (index) {
        this.$refs[`popover-${index}`].doClose();
      }
      if (!item.documentPath) {
        // this.addFolder.id = item.folderGuid;
        this.id = item.folderGuid;
        this.ruleForm.folderLevel = item.folderLevel
        this.isRoot = false
        this.getFileChild(item.folderGuid)

        this.title1.label = item.folderName
        this.title1.pid = item.parentGuid
      } else {
        this.handPreview(item)
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
      if (item.folderGuid) {
        this.addFolder.id = item.folderGuid;
      }
    },
    /**点击其他区域隐藏右键菜单**/
    hideMenu() {
      let menuList = document.querySelector('.menuList')
      menuList.style.display = 'none'
    },
    /**预览**/
    handPreview(item) {
      sessionStorage.setItem('queryInfo', this.$route.query.queryInfo)
      item.path = this.$route.path
      item.Id = this.$route.query.queryInfo.folderGuid
      item.Name = this.$route.query.queryInfo.folderName
      item.FileName = item.documentName
      let folderName = this.$route.query.queryInfo.folderName
      if (folderName == 'Folder_002') {
        folderName = '会议类'
      } else if (folderName == 'Folder_003') {
        folderName = '培训类'
      } else if (folderName == 'Folder_001') {
        folderName = '公司类'
      }
      item.title = folderName + this.$t('txt.TXT_0477')
      let info = JSON.stringify(item)
      this.$router.push({ path: '/PreviewFileHtml', query: { uuid: this.$Base64.encode(item.uuid), info: this.$Base64.encode(info) } });
    },
    /**删除文件或文件夹**/
    deleteItem(row) {
      $('.el-popover').hide()
      if (row) {
        this.addFolder.id = row.documentGuid || row.folderGuid;
      } else {
        this.addFolder.id = this.rightClickData.folderGuid || this.rightClickData.documentGuid;
      }
      this.$confirm(i18n.t('msg.MSG_0035'), i18n.t('txt.TXT_0289'), { type: 'warning' }).then(() => {
        if (this.rightClickData.folderName) {  //删除文件夹
          this.$api.doc.deleteFolder(this.addFolder.id).then(res => {
            if (res.success) {
              this.$message({ message: i18n.t(res.message) || i18n.t('msg.MSG_0022'), type: 'success' })//删除成功
              this.getFileChild(this.id);
            } else {
              this.$message({ message: i18n.t(res.message) || i18n.t('msg.MSG_0125'), type: 'error' })//删除失败
            }
          });
        } else {
          this.$api.doc.deleteDocument(this.addFolder.id).then(res => { //删除文件
            if (res.success) {
              this.$message({ message: i18n.t(res.message) || i18n.t('msg.MSG_0022'), type: 'success' })//删除成功
              this.getFileChild(this.id);
            } else {
              this.$message({ message: i18n.t(res.message) || i18n.t('msg.MSG_0125'), type: 'error' })//删除失败
            }
          })
        }
      })
    },
    /**查看属性**/
    viewAttr(row) {
      if (row.folderName) {
        this.$refs.FolderAttr.id = row.folderGuid
        this.$refs.FolderAttr.title = '属性'
        this.$refs.FolderAttr.dialogVisible = true
        this.$refs.FolderAttr.getFolderAttr(row.folderGuid)
        this.$refs.FolderAttr.getFolderLog(row.folderGuid)
        this.$refs.FolderAttr.getAuthorize(row.folderGuid)
      } else if (row.documentName) {
        this.$refs.Attribute.dialogVisible = true
        this.$refs.Attribute.id = row.documentGuid
        this.$refs.Attribute.loadView(row.uuid)
        this.$refs.Attribute.getDocumentInfo(row.documentGuid)
        sessionStorage.setItem('uuid', row.uuid)
      }
    },
    /**文件夹名称输入限制**/
    folderInput(val) {
      this.ruleForm.name = val.replace(/[\\ \/ \: \* \? \" \< \> \| \']/g, '')
    },
    // addDiyDom(treeId, treeNode) {//名称过长
    //   let spaceWidth = 5;
    //   let switchObj = $("#" + treeNode.tId + "_switch"),
    //     icoObj = $("#" + treeNode.tId + "_ico");
    //   switchObj.remove();
    //   icoObj.parent().before(switchObj);
    //   let spantxt = $("#" + treeNode.tId + "_span").html();
    //   if (spantxt.length > 12) {
    //     spantxt = spantxt.substring(0, 12) + "...";
    //     $("#" + treeNode.tId + "_span").html(spantxt);
    //   }
    // },
    //展开单一路径节点
    // singlePath(treeNode) {
    //   var cLevel = treeNode.level;
    //   var cId = treeNode.id;
    //   var expandedNodes = this.zTree.getNodesByParam("open", true, treeNode.getParentNode());
    //   for (var i = expandedNodes.length - 1; i >= 0; i--) {
    //     var node = expandedNodes[i];
    //     var level = node.level;
    //     var id = node.id;
    //     if (cId !== id && level === cLevel) {/*若为同一级别的不同节点，则折叠，否则不折叠*/
    //       this.zTree.expandNode(node, false);
    //     }
    //   }
    // },
    //右侧点击时左侧对应节点高亮显示
    // locateNode(folder_guid, index) {
    //   this.getIndex = index
    //   let node = this.zTree.getNodeByParam("id", folder_guid, null);
    //   if (node) {
    //     this.zTree.cancelSelectedNode();//取消选中所有节点
    //     this.zTree.selectNode(node, true);//指定选中ID的节点
    //     if (!node.open) {
    //       this.zTree.expandNode(node, true, false, false, true);//指定选中ID节点展开
    //     }
    //   }
    // },
    // zTreeOnClick: function (event, treeId, treeNode) {//ztree点击事件
    //   this.addDiyDom(treeId, treeNode);
    // },
    // zTreeOnCheck: function (event, treeId, treeNode) {
    //   var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
    //     checkCount = zTree.getCheckedNodes(true).length, //选中
    //     nocheckCount = zTree.getCheckedNodes(false).length, //未选中
    //     changeCount = zTree.getChangeCheckedNodes().length;//获取输入框勾选状态被改变的节点集合（与原始数据 checkedOld 对比）
    //   var checkedNames = [], checkedIds = [];
    //   for (var i = 0; i <= zTree.getCheckedNodes(true).length - 1; i++) {
    //     checkedIds.push(zTree.getCheckedNodes(true)[i].id);
    //     checkedNames.push(zTree.getCheckedNodes(true)[i].name);
    //   }
    // },
    /**点击前**/
    // beforeClick: function (treeId, treeNode) {
    //   console.log(treeNode, '点击前')
    //   $('.curSelectedNode').removeClass('curSelectedNode');
    //   $('#' + treeNode.tId + '_span').addClass('curSelectedNode');
    //   this.isRoot = true;
    //   this.ruleForm.folderGuid = treeNode.id;
    //   this.ruleForm.folderLevel = treeNode.level;
    //   // this.$store.state.eleTemplate.folderType = treeNode.type;
    //   this.ruleForm.folderType = treeNode.type;
    //   // this.title1 = treeNode.path ? treeNode.path : treeNode.name;
    //   this.title1 = treeNode.name
    //   this.parentID = treeNode.pid
    //   // //设置导航名称
    //   // $store.state.eleTemplate.File_Title = treeNode.path?treeNode.path:treeNode.name;
    //   this.getFileChild(treeNode.id)
    //   var zTree = $.fn.zTree.getZTreeObj("treeDemo");
    //   // zTree.checkNode(treeNode, !treeNode.checked, null, true);
    //   zTree.checkNode(treeNode, !treeNode.checked, true, true); //第二个参数!treeNode.checked和"",省略此参数效果等同，则根据对此节点的勾选状态进行 toggle 切换，第三个参数设置为true时候进行父子节点的勾选联动操作 ，第四个参数true 表示执行此方法时触发 beforeCheck & onCheck 事件回调函数；false 表示执行此方法时不触发事件回调函数
    //   return false;
    // },
    /**节点展开前**/
    // beforeExpand: function (treeId, treeNode) {
    //   // console.log(treeNode, '展开前')
    //   let that = this;
    //   this.$api.doc.subFoldersDict(treeNode.id).then(res => {
    //     if (res.success) {
    //       this.zTree.removeChildNodes(treeNode)
    //       if (res.data.length > 0) {
    //         this.zTree.addNodes(treeNode, res.data, true)
    //       } else {
    //         treeNode.parent = false
    //         this.zTree.updateNode(treeNode)
    //       }
    //       that.singlePath(treeNode)
    //     } else {
    //       this.$message({ message: res.message, type: 'error' })
    //     }
    //   })
    // },
    /**折叠前**/
    // beforeCollapse: function (treeId, treeNode) {
    //   this.childMethod(this.$route.query.queryInfo);
    // },
    //关闭预览
    closePreview(bool) {
      if (bool) {
        this.previewShow = false;
      }
    },
    /**关闭文件属性窗口**/
    closeAttr(bool) {
      if (bool) {
        this.$refs.Attribute.dialogVisible = false
        this.getFileChild(this.ruleForm.folderGuid)
      }
    },
    /**创建文件夹**/
    newFile() {
      this.ruleForm.name = null;
      this.ruleForm.resource = 0;
      this.newFileDaga.dialogVisible = true;
      //获取部门
      this.$api.archives.getDept().then(res => {
        if (res.success) {
          this.newFileDaga.treeData_undertake = this.$utils.JSONSwapArr(res.data, ["deptGuid", "deptName"], ["id", "label"]);
        }
      });
      this.getStaffers()
    },
    /**获取人员**/
    getStaffers(c) {
      this.$api.com.getOrgStafferDict().then(res => {
        if (res.success) {
          this.newFileDaga.memberData = res.data
          // if (c) {
          //   if (c.trainer.length > 0) {
          //     this.setMemberChecked(c.trainer, 'checked_trainer', 'trainer', 'tree_conferee');
          //   }
          // }
        }
      })

    },
    /**保存文件夹**/
    saveFile() {
      let subData = {
        parentGuid: this.ruleForm.folderGuid,
        folderName: this.ruleForm.name,
        folderLevel: this.ruleForm.folderLevel,
        folderType: this.ruleForm.folderType,
        folderPrivilege: this.ruleForm.resource,
      };
      if (!this.ruleForm.name) {
        this.$message(this.$t('txt.TXT_0996'));//请输入文件名
        return;
      }
      this.$api.doc.createFolder(subData).then(res => {
        if (res.success) {
          this.$message({ message: res.message, type: 'success' })
          this.getFileChild(this.ruleForm.folderGuid)
          this.newFileDaga.dialogVisible = false
        } else {
          this.$message({ message: res.message, type: 'error' })
        }
      })
    },
    /**点击菜单调用的方法**/
    childMethod(m) {
      this.ruleForm.folderGuid = m.folderGuid;
      // this.ruleForm.folderLevel = 0;
      this.ruleForm.folderLevel = m.folderLevel
      this.ruleForm.folderType = m.folderType || 0;
      // if (m.folderName === 'Folder_002') { m.name = this.$t('txt.TXT_0920') }///会议类
      // else if (m.folderName === 'Folder_003') { m.name = this.$t('txt.TXT_0921') }//培训类
      // else if (m.folderName === 'Folder_001') { m.name = this.$t('txt.TXT_0919') }//公司类
      // else if (m.folderName === 'Folder_004') { m.name = this.$t('txt.TXT_0940') }//试题来源类
      // let obj = {
      //   folderName: m.label,
      //   folderGuid: m.folderGuid
      // }
      // this.breadData = [obj]
      this.title.label = m.label;
      this.title.id = m.folderGuid
      this.isRoot = true;

      //获取左侧树形数据和右侧文件夹及文件数据
      let id = m.folderGuid
      // this.$api.doc.subFoldersDict(id).then(res => {
      //   // this.zNodes = eval(res.data)
      //   // this.zTree = $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
      //   this.treeData = this.$utils.JSONSwapArr(res.data, ["id", "name"], ["id", "label"]);
      // })
      this.getSubFolders(id)
      this.getFileChild(id)

    },
    getSubFolders(id) {
      this.$api.doc.subFoldersDict(id).then(res => {
        // this.zNodes = eval(res.data)
        // this.zTree = $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
        this.treeData = this.$utils.JSONSwapArr(res.data, ["id", "name"], ["id", "label"]);
      })
    },
    /**获取树勾选节点**/
    // getTreeCheckedData(data) {
    //   let arr = [];
    //   for (let i = 0; i < data.length; i++) {
    //     if (data[i].type === 'Staffer') {
    //       arr.push({
    //         staffer_guid: data[i].staffer_guid,
    //       });
    //     } else if (data[i].type === 'Dept') {
    //       arr.push({
    //         dept_guid: data[i].dept_guid,
    //       });
    //     }
    //   }
    //   return arr;
    // },
    /**tree默认展开**/
    // defaultExpanded(data, expanded) {
    //   let cout = 0;
    //   for (let i = 0; i < data.length; i++) {
    //     if (data[i].open === true) {
    //       this.$set(this[expanded], cout, data[i].id);
    //       ++cout;
    //     }
    //   }
    // },
    /**tree默认选中**/
    // defaultChecked(data, checked, selected) {
    //   let cout = 0;
    //   for (let i = 0; i < data.length; i++) {
    //     if (data[i].checked === true) {
    //       this.$set(this[checked], cout, data[i].id);
    //       if (data[i].type === 'Staffer') {
    //         this.trainForm[selected] = this.trainForm[selected] + '[' + data[i].name + ']';
    //       }
    //       ++cout;
    //     }
    //   }
    // },
    /**获取上传文件名**/
    onChange(file, fileList) {
      this.uploadFile.documentName = file.name;
    },
    /**上传文件**/
    handleAvatarSuccess(response, file, fileList) {
      console.log(response, '结果')
      if (response.data.code == "1") {
        this.uploadFile.documentPath = response.data.srcUrl;
        this.uploadFile.uuid = response.data.uuid;
        this.uploadFile.md5 = response.data.md5;
        this.uploadFile.ext = response.data.ext;
        this.uploadFile.name = response.data.name;
        this.uploadFile.rid = response.data.rid;
        this.uploadFile.folderGuid = this.id;
        if (this.uploadFile.uuid != '') {
          this.$api.doc.addDocument(this.uploadFile).then(res => {
            if (res.success) {
              this.addFolder.loading = false;
              this.$message({ message: i18n.t(res.message) || i18n.t('msg.MSG_0147'), type: 'success' });//上传成功
              this.getFileChild(this.id)
            } else {
              this.$message({ message: i18n.t(res.message) || i18n.t('msg.MSG_0148'), type: 'error' });//上传失败
              this.addFolder.loading = false;
            }
          })
        } else {
          this.$message({ message: i18n.t('msg.MSG_0311'), type: 'error' })
        }
      }
    },
    /**部门tree勾选**/
    CheckChangeUndertake(data, checked, indeterminate) {
      this.setTreeChecked(data, checked, 'undertake');
    },
    //radio值变化时触发
    radioChange(v) {
      if (v !== 3) {
        this.newFileDaga.undertake = '';
        this.newFileDaga.checked_undertake = [];
      }
      if (v !== 4) {
        this.newFileDaga.trainer = '';
        this.newFileDaga.checked_trainer = []
      }
    },
    /**人员tree勾选**/
    CheckChangeTrainer(data, checked, indeterminate) {
      this.setTreeChecked(data, checked, 'trainer');
      // this.treeSelectUnite(data, checked);
    },
    /**tree勾选显示再输入框中**/
    setTreeChecked(data, checked, val) {
      if (checked === true && this.newFileDaga[val].indexOf(data.label) === -1 && val === 'trainer' && data.type == 'staffer') {//选中赋值
        this.newFileDaga[val] = this.newFileDaga[val] + '[' + data.label + ']';
      } else if (checked === false && this.newFileDaga[val].indexOf(data.label) !== -1 && val === 'trainer' && data.type == 'staffer') {//删除选中
        this.newFileDaga[val] = this.newFileDaga[val].replace('[' + data.label + ']', "");
      }
      else if (checked === true && this.newFileDaga[val].indexOf(data.label) === -1 && val === 'undertake') {//选中赋值
        this.newFileDaga[val] = this.newFileDaga[val] + '[' + data.label + ']';
      } else if (checked === false && this.newFileDaga[val].indexOf(data.label) !== -1 && val === 'undertake') {//删除选中
        this.newFileDaga[val] = this.newFileDaga[val].replace('[' + data.label + ']', "");
      }
    },
    /**查询子级文件夹及文件信息**/
    getFileChild(id, data) {
      this.$api.doc.fileChild(id, data).then(res => {
        if (res.success) {
          let arr1 = res.data.folderList;
          let arr2 = res.data.documentList;
          this.folderList = arr1.concat(arr2);
          this.list = arr1.concat(arr2);
          // this.refreshNode(id)
          this.id = id;
          this.getIndex = ''
        }
      });
    },
    /**查询子级文件夹及文件（字典型）**/
    getFileChildDict(GUID) {
      this.$api.doc.fileChildDict(GUID).then(res => {
        if (res.success) {
          // let arr1 = res.data.folderList;
          // let arr2 = res.data.documentList;
          // this.folderList = arr1.concat(arr2);
          // this.list = arr1.concat(arr2);
          // this.refreshNode(GUID)
          // this.id = GUID;
          // this.getIndex = ''
        }
      });
    },
    // refreshNode(folder_guid) {
    //   let node = this.zTree.getNodeByParam("id", folder_guid, null);
    //   if (node !== null) {
    //     if (!node.isParent) {
    //       node.isParent = true;
    //       this.zTree.updateNode(node);
    //     }
    //     if (node.open)
    //       this.zTree.expandNode(node, false);
    //     this.zTree.expandNode(node, true, false, false, true);
    //   } else {
    //     if (this.$route.query.queryInfo) {
    //       let m = this.$route.query.queryInfo
    //       this.$api.doc.subFoldersDict(m.folderGuid).then(res => {
    //         this.zNodes = eval(res.data);
    //         this.zTree = $.fn.zTree.init($("#treeDemo"), this.setting, this.zNodes);
    //       });
    //     }
    //   }
    // },
    /**点击搜索数据**/
    handSearch(v) {
      console.log(v, '哈哈哈')
      if (v == '') {
        this.$message({ message: i18n.t('txt.TXT_0996') });
        return
      }
      // searchcontent(this.ruleForm.folderGuid, v).then(res => {
      //   if (res.code == '0') {
      //     $('.right_data_list').html(res.data.icon)
      //     $('#list').html(res.data.list)
      //   } else {
      //     this.$message({ message: res.msg })
      //   }
      // })
    },
    /**自适应高度**/
    resize() {
      let that = this;
      $(window).resize(() => {
        this.autoHeight = `${document.documentElement.clientHeight}` - 50;
        if (that.$refs.page) {
          that.$refs.page.style.minHeight = this.autoHeight - 100 + 'px';
        }
      })
    },
  },
  watch: {
    // "$store.state.eleTemplate.File_Title": {
    //   deep: true,
    //   handler: function (newValue, oldValue) {
    //     this.title1 = newValue;
    //   }
    // },
    // "$store.state.eleTemplate.dblClick_Guid": {//双击进入文件夹获取GUID
    //   deep: true,
    //   immediate: true,
    //   handler: function (newValue, oldValue) {
    //     if (oldValue === undefined) {
    //       this.$store.state.eleTemplate.dblClick_Guid = '';
    //     }

    //     this.ruleForm.folderGuid = newValue;
    //   }
    // },
    // "$store.state.eleTemplate.dblClick_Status": {
    //   deep: true,
    //   handler: function (newValue, oldValue) {
    //     this.isRoot = !!newValue;
    //   }
    // },
    // "$store.state.eleTemplate.folderType": {
    //   deep: true,
    //   handler: function (newValue, oldValue) {
    //     this.ruleForm.folderType = newValue;
    //   }
    // },
    // "$store.state.eleTemplate.ParentID": {
    //   deep: true,
    //   handler: function (newValue, oldValue) {
    //     if (this.isRoot === false) {
    //       this.parentID = newValue;
    //     }
    //     if (newValue === this.parentID) {
    //       this.isRoot = false;
    //       this.$store.state.eleTemplate.dblClick_Status = false;
    //     } else {
    //       this.isRoot = true;
    //       this.$store.state.eleTemplate.dblClick_Status = true;
    //     }
    //   }
    // },
    // "parentID": {
    //   deep: true,
    //   handler: function (newValue, oldValue) {
    //     if (this.isRoot === false) {
    //       this.parentID = newValue;
    //     }
    //   }
    // },
    // "$store.state.eleTemplate.folderGuid": {
    //   deep: true,
    //   immediate: true,
    //   handler: function (newValue, oldValue) {
    //     if (oldValue === undefined) {
    //       this.$store.state.eleTemplate.folderGuid = null;
    //     }
    //     if (newValue !== null && typeof this.zTree.getNodeByParam === 'function') {
    //       this.locateNode(newValue);
    //     }
    //   }
    // },
    // },
    // "id": {
    //   deep: true,
    //   immediate: true,
    //   handler: function (newValue, oldValue) {
    //     if (oldValue === undefined) {
    //       this.id = null;
    //     }
    //     if (newValue !== null && typeof this.zTree.getNodeByParam === 'function') {
    //       this.locateNode(newValue);
    //     }
    //     console.log(newValue, '新的ID')
    //   }
    // },
    // "$store.state.eleTemplate.previewFolderAttribute": {
    //   deep: true,
    //   handler: function (newValue, oldValue) {
    //     if (newValue !== null) {
    //       this.showFolderAttr = true;
    //       this.FolderAttrParam = {
    //         id: newValue.id,
    //       };
    //     }
    //   }
    // },
    // "$store.state.eleTemplate.previewAttribute": {
    //   deep: true,
    //   handler: function (newValue, oldValue) {
    //     console.log(newValue, '文件预览的参数')
    //     if (newValue !== null) {
    //       const source = 1;
    //       const ver = '';
    //       const rid = '';
    //       this.$api.eleMethods.filePreview(newValue.id, source, ver, rid).then((res) => {
    //         if (res.code === 0) {
    //           this.AttrPreviewParam = {
    //             id: newValue.id,
    //             type: res.type,
    //             source: 1,
    //             ver: '',
    //             rid: '',
    //             filename: newValue.name
    //           };
    //           this.showAttribute = true;
    //           this.$store.state.eleTemplate.previewAttribute = null;
    //         } else {
    //           this.$message(res.msg)
    //         }
    //       });
    //     }
    //   }
    // },
    // "$store.state.eleTemplate.previewFiles": {
    //   deep: true,
    //   handler: function (newValue, oldValue) {
    //     if (newValue !== null) {
    //       const source = 1;
    //       const ver = '';
    //       const rid = '';
    //       this.$api.eleMethods.filePreview(newValue.id, source, ver, rid).then((res) => {
    //         if (res.code === 0) {
    //           this.previewParam = {
    //             id: newValue.id,
    //             type: res.type,
    //             source: 1,
    //             ver: '',
    //             rid: '',
    //             filename: newValue.name
    //           };
    //           this.previewShow = true;
    //           this.$store.state.eleTemplate.previewFiles = null;
    //         } else {
    //           this.$message(res.msg)
    //         }
    //       });
    //     }
    //   }
    // }
  },
  // destroyed() {
  //   $('#list').hide();
  // }
}
</script>

<style scoped lang="scss">
@import "../../../public/ele_js/css/table.css";
@import "../../../public/ele_js/css/explorer.css";
.nav {
  height: 40px;
  padding-left: 16px;
  line-height: 40px;
  background: white;
  color: #333;
  .first-nav:hover {
    color: #5696ff;
    cursor: pointer;
  }
}
.file-page {
  .right_data_list {
    height: calc(100vh - 180px);
  }

  .all {
    margin: 16px 16px 0 16px;
    .left {
      flex: 1;
      height: calc(100vh - 116px);
      width: 240px;
      border-right: 1px solid #ddd;
      background: white;
      /*margin: 0 8px;*/
      display: inline-block;
    }

    .right {
      flex: 8;
      width: calc(100vw - 512px);
      height: calc(100vh - 116px);
      vertical-align: top;
      display: inline-block;
      background-color: #fff;

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
      .active {
        background: rgb(244, 252, 250);
        border: 1px solid #d3f2ec;
        border-radius: 5%;
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
      //----------------------10-25修改-----------------------------------------
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
      // -------------------------- end --------------------------------------
    }
  }

  .upload-wrap {
    position: relative;
    display: inline-block;
    margin-left: 8px;

    .upload_input {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      opacity: 0;

      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
<style lang="scss">
.curSelectedNode {
  background: #d3f2ec;
}

.file-page {
  .radio-item {
    display: block;
    margin: 8px 0;
  }
}
</style>
<style lang="scss">
.file-page {
  #areaTree {
    border: none;
    padding: 8px 16px;
    padding-right: 0;
    border-radius: 4px;
    overflow: hidden;
    width: 239px;
  }
  #areaTree {
    .zTreeDemoBackground {
      border-right: 0;
      width: 100%;
      height: calc(100vh - 143px);
      overflow-y: auto;
      padding-right: 16px;
      .node-label {
        display: inline-block;
        width: 140px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .node-img {
        vertical-align: top;
        margin-right: 8px;
      }
    }
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
  .input-container {
    position: relative;
    overflow: hidden;
    height: 30px;
    line-height: 30px;
  }
  // ---------------------10-22修改-------------------------------
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
      padding-left: 30px;
    }
    .img {
      width: 72px;
      height: 72px;
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
      margin-right: 20px;
    }
  }
}
</style>
<style lang="scss">
.el-icon-search {
  color: white !important;
}
.file-page {
  .el-radio {
    margin-right: 0px;
  }
  .el-radio__label {
    font-size: 12px;
  }
  .el-select > .el-input {
    display: inline-block;
  }
}
</style>
