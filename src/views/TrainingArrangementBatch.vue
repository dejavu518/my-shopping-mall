<!--新增培训 @wch-->
<template>
  <div class="TrainingArrange">
    <div class="info">
      <!--批量安排{count}个培训, 修改后将覆盖原有数据, 请谨慎操作!-->
      <div class="tip">{{this.$t('msg.MSG_0230', {count: this.count})}}</div>
      <el-form :model="trainForm" :rules="rules" ref="trainForm" label-width="80px" style="width: 900px;margin-top: 16px;">
        <el-form-item :label="$t('txt.TXT_0404')" class="ipt_item" required prop="principal">
          <!--负责人-->
          <el-select v-model="trainForm.principal" :placeholder="$t('msg.MSG_0038')">
            <!--请选择-->
            <el-option :value="trainForm.principalTree" style="height: auto !important;background-color: #fff;padding: 0">
              <el-tree :data="treeData_principal" show-checkbox ref="tree_principal" node-key="id" :default-checked-keys="checked_principal" :default-expanded-keys="expanded_principal" @check-change="CheckChangePrincipal">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('txt.TXT_0552')" class="ipt_item_right" required prop="undertake">
          <!--承办部门-->
          <el-select v-model="trainForm.undertake" :placeholder="$t('msg.MSG_0038')">
            <!--请选择-->
            <el-option :value="trainForm.undertakeTree" style="height: auto !important;background-color: #fff;padding: 0">
              <el-tree :data="treeData_undertake" show-checkbox ref="tree_undertake" node-key="id" :default-checked-keys="checked_undertake" :default-expanded-keys="expanded_undertake" @check-change="CheckChangeUndertake">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('txt.TXT_0553')" class="ipt_item">
          <!--协助部门-->
          <el-select v-model="trainForm.help" :placeholder="$t('msg.MSG_0038')">
            <!--请选择-->
            <el-option :value="trainForm.helpTree" style="height: auto !important;background-color: #fff;padding: 0">
              <el-tree :data="treeData_help" show-checkbox ref="tree_help" node-key="id" :default-checked-keys="checked_help" :default-expanded-keys="expanded_help" @check-change="CheckChangeHelp">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('txt.TXT_0407')" class="ipt_item_right" required prop="objects">
          <!--培训对象-->
          <el-select v-model="trainForm.objects" :placeholder="$t('msg.MSG_0038')">
            <!--请选择-->
            <el-option :value="trainForm.objectsTree" style="height: auto !important;background-color: #fff;padding: 0">
              <el-tree :data="treeData_objects" show-checkbox ref="tree_objects" node-key="id" :default-checked-keys="checked_objects" :default-expanded-keys="expanded_objects" @check-change="CheckChangeObjects">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('txt.TXT_0556')" class="ipt_item" required prop="train_method">
          <!--培训形式-->
          <el-select v-model="trainForm.train_method" @change="trainmethodChange" :placeholder="$t('msg.MSG_0038')">
            <!--请选择-->
            <el-option :label="$t('txt.TXT_0557')" value="0"></el-option>
            <!--面授-->
            <el-option :label="$t('txt.TXT_0421')" value="1"></el-option>
            <!--自学-->
          </el-select>
        </el-form-item>
        <el-form-item v-if="trainForm.trainerShow" :label="$t('txt.TXT_0554')" class="ipt_item_right" required prop="trainer">
          <!--培训者-->
          <el-select v-model="trainForm.trainer" :placeholder="$t('msg.MSG_0038')">
            <!--请选择-->
            <el-option :value="trainForm.trainerTree" style="height: auto !important;background-color: #fff;padding: 0">
              <el-tree :data="treeData_trainer" show-checkbox ref="tree_trainer" node-key="id" :default-checked-keys="checked_trainer" :default-expanded-keys="expanded_trainer" @check-change="CheckChangeTrainer">
              </el-tree>
            </el-option>
          </el-select>
        </el-form-item>
        <!--时间/地点-->
        <el-form-item v-if="trainForm.roomShow" :label="$t('txt.TXT_0555')" class="ipt_item" required prop="room_guid">
          <!--地点-->
          <el-select v-model="trainForm.room_guid" :placeholder="$t('txt.TXT_0226')">
            <!--请选择 -->
            <el-option :label="item.Text" :value="item.Value" v-for="(item,i) in trainForm.roomData" :key="i">
            </el-option>
          </el-select>
          <span class="room-use" @click="roomUse">{{$t('txt.TXT_0908')}}</span>
          <!--会议室使用情况-->
        </el-form-item>
        <br />
        <el-form-item :label="$t('txt.TXT_0422')" class="ipt_item" required prop="start_time">
          <!--开始时间-->
          <el-date-picker v-model="trainForm.start_time" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" :picker-options="startTimeOptions" type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('txt.TXT_0559')" class="ipt_item_right" required prop="end_time">
          <!--结束时间-->
          <el-date-picker v-model="trainForm.end_time" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm" :picker-options="endTimeOptions" type="datetime">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>

    <!--会议室弹窗-->
    <!--<MeetingRoomUse v-if="meetingRoomUse_dialogVisible" @closeMeetingDialog="closeMeetingDialog"
      :meetingRoomUse_dialogVisible="meetingRoomUse_dialogVisible">
    </MeetingRoomUse>-->
  </div>
</template>

<script>
import { elearningJs } from '@/assets/ele-js/pulic'
export default {
  name: "StaffEntry",
  props: ['roomD', 'trainGuids', 'count'],
  components: {
    // MeetingRoomUse
  },
  watch: {
    roomD(newV) {
      if (newV.length > 0) {
        this.trainForm.roomData = newV;
      }
    }
  },
  data() {
    return {
      trainingGuid: '',
      trainingStatus: '',
      meetingRoomUse_dialogVisible: false,//会议室弹窗
      treeData_objects: [],//tree培训对象
      expanded_objects: [],//tree培训对象默认展开
      checked_objects: [],//tree培训对象默认选中
      treeData_principal: [],//tree负责人
      expanded_principal: [],//tree负责人默认展开
      checked_principal: [],//tree负责人默认选中
      treeData_trainer: [],//tree培训者
      expanded_trainer: [],//tree培训者默认展开
      checked_trainer: [],//tree培训者默认选中
      treeData_undertake: [],//tree承办部门
      expanded_undertake: [],//tree承办部门默认展开
      checked_undertake: [],//tree承办部门默认选中
      treeData_help: [],//tree协助部门
      expanded_help: [],//tree承办部门默认展开
      checked_help: [],//tree承办部门默认选中
      treeProps_filelist: {
        label: 'name',
      }, //
      treeData_filelist: [], // tree培训资料
      expanded_filelist: [], //tree培训资料默认展开
      checked_filelist: [], //tree培训资料默认选中
      train_title: this.$t('txt.TXT_0399'),
      trainForm: {
        train_name: '',//培训名称
        train_type: '',//培训类别
        principal: '',//负责人
        principalTree: [],//负责人tree选中
        undertake: '',//承办部门
        undertakeTree: [],//承办部门tree选中
        options_undertake: [],//承办部门选项
        help: '',//协助部门
        helpTree: [],//协助部门tree选中
        options_help: [],//协助部门选项
        trainer: '',//培训者
        trainerShow: true, // 是否显示培训者
        trainerTree: [],//培训者tree选中
        objects: '',//培训对象
        objectsTree: [],//培训对象tree选中
        start_time: this.$moment(new Date()).format("YYYY-MM-DD HH:mm"),//开始时间
        end_time: '',//结束时间
        train_method: '',//培训形式
        train_address: '',//地点
        room_guid: '',//会议室地点
        compereData: [],
        roomData: [],
        roomShow: true,
      },
      rules: {
        train_name: [//培训名称
          { required: true, message: this.$t('msg.MSG_0036')/*不能为空*/ }
        ],
        train_type: [//培训类别
          { required: true, message: this.$t('msg.MSG_0038')/*请选择*/ }
        ],
        principal: [//负责人
          { required: true, message: this.$t('msg.MSG_0038')/*请选择*/ }
        ],
        undertake: [//承办部门
          { required: true, message: this.$t('msg.MSG_0038')/*请选择*/ }
        ],
        trainer: [//培训者
          { required: true, message: this.$t('msg.MSG_0038')/*请选择*/ }
        ],
        objects: [//培训对象
          { required: true, message: this.$t('msg.MSG_0038')/*请选择*/ }
        ],
        train_method: [//培训形式
          { required: true, message: this.$t('msg.MSG_0038')/*请选择*/ }
        ],
        room_guid: [//地点
          { required: true, message: this.$t('msg.MSG_0036')/*不能为空*/ }
        ],
        start_time: [//开始时间
          { required: true, message: this.$t('msg.MSG_0036')/*不能为空*/ }
        ],
        end_time: [//结束时间
          { required: true, message: this.$t('msg.MSG_0036')/*不能为空*/ }
        ],
      },
    }
  },
  computed: {
    startTimeOptions() {
      let _this = this;
      return {
        disabledDate: time => {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      }
    },
    endTimeOptions() {
      let _this = this;
      return {
        disabledDate: time => {
          if (_this.trainForm.start_time) {
            let startTime = _this.trainForm.start_time;
            return time.getTime() < new Date(startTime).getTime() - 24 * 60 * 60 * 1000;
            //return time.getTime() < new Date(startTime).getTime() - 24 * 60 * 60 * 1000 || time.getTime() > new Date(startTime).getTime();
          }
        }
      }
    },
  },
  methods: {
    trainTypeChange(value) { // 培训类别改变
      if (value) {
        this.trainForm.showFileList = true;
        this.getTrainFolderFile()
      }
    },
    trainmethodChange(data) { //培训形式改变-
      if (data === '0') {
        this.trainForm.roomShow = true;
        this.trainForm.trainerShow = true;
      } else if (data === '1') {
        this.trainForm.roomShow = false;
        this.trainForm.trainerShow = false;
      }
    },
    roomUse() { //打开会议室弹窗
      this.$emit('toggleRoom', true);
      this.meetingRoomUse_dialogVisible = true;
    },
    closeMeetingDialog(bool) {//关闭会议室
      if (bool) {
        this.$emit('toggleRoom', false);
        this.meetingRoomUse_dialogVisible = false;//获取地点
        // getmeetingroomlist('%20').then(n => {
        //     this.trainForm.roomData = n.data;
        // });
      }
    },

    getTrainingData() { //获取数据
      let trainingGuid = this.trainingGuid === '' ? '%20' : this.trainingGuid;
      this.$api.eleMethods.getTrainingData(trainingGuid).then(res => {
        let dt = res.data;
        //form加载
        if (this.trainingGuid !== '') {
          this.trainForm.train_name = dt.Train_Name;//培训名称
          this.trainForm.train_type = dt.Train_Type === null ? '' : dt.Train_Type.toString();//培训类别
          this.trainForm.start_time = dt.Start_Time === null ? '' : dt.Start_Time;//开始时间
          this.trainForm.end_time = dt.End_Time === null ? '' : dt.End_Time;//结束时间
          this.trainForm.train_method = dt.Train_Method.toString();//培训形式
          this.trainForm.room_guid = dt.Room_GUID === null ? '' : dt.Room_GUID;//会议室地点
        }
        //获取部门包括选中
        let getDeptChecked = {
          undertake: dt.Train_Undertake_DeptList,
          help: dt.Train_Cooperative_DeptList,
        };
        this.getDepartment(getDeptChecked);
        /*let trainFormFileList = [];
        for (let i in dt.Train_FileList) {
            let item = dt.Train_FileList[i];
            let fileObj = {
                id: item.Document_GUID,
                isExam: item.isExam.toString(),
                name: item.Document_Name
            }
            trainFormFileList.push(fileObj);
        }
        this.$set(this.trainForm, 'fileList', trainFormFileList);*/
        //培训对象
        this.treeData_objects = this.TreeChangeData(eval('(' + dt.TreeObjectHtml + ')'));
        this.defaultExpanded(eval('(' + dt.TreeObjectHtml + ')'), 'expanded_objects');
        this.defaultChecked(eval('(' + dt.TreeObjectHtml + ')'), 'checked_objects', 'objects');
        //负责人
        this.treeData_principal = this.TreeChangeData(eval('(' + dt.TreePrincipaHtml + ')'));
        this.defaultExpanded(eval('(' + dt.TreePrincipaHtml + ')'), 'expanded_principal');
        this.defaultChecked(eval('(' + dt.TreePrincipaHtml + ')'), 'checked_principal', 'principal');
        //培训者
        this.treeData_trainer = this.TreeChangeData(eval('(' + dt.TreeTrainerHtml + ')'));
        this.defaultExpanded(eval('(' + dt.TreeTrainerHtml + ')'), 'expanded_trainer');
        this.defaultChecked(eval('(' + dt.TreeTrainerHtml + ')'), 'checked_trainer', 'trainer');
        //获取地点
        // getmeetingroomlist('%20').then(n => {
        //   this.trainForm.roomData = n.data;
        // });
      });
    },
    setDepartmentChecked(data, checked, selected, ref) {//获取部门选中
      let cout = 0;
      for (let i = 0; i < data.length; i++) {
        this.$set(this[checked], cout, data[i].Dept_GUID);
        ++cout;
      }
      this.$nextTick(() => {
        let checkdata = this.$refs[ref].getCheckedNodes();
        for (let i = 0; i < checkdata.length; i++) {
          this.trainForm[selected] = this.trainForm[selected] + '[' + checkdata[i].label + ']';
        }
      })
    },
    getDepartment(getDeptChecked) {//获取部门
      this.$api.eleMethods.getDepartment().then(res => {
        if (res.code === 0) {
          //承办部门
          this.treeData_undertake = this.TreeChangeData(eval('(' + res.treedepthtml + ')'));
          this.defaultExpanded(eval('(' + res.treedepthtml + ')'), 'expanded_undertake');
          if (getDeptChecked.undertake.length > 0) {
            this.setDepartmentChecked(getDeptChecked.undertake, 'checked_undertake', 'undertake', 'tree_undertake');//设置承办部门选中
          }
          //协助部门
          this.treeData_help = this.TreeChangeData(eval('(' + res.treedepthtml + ')'));
          this.defaultExpanded(eval('(' + res.treedepthtml + ')'), 'expanded_help');
          if (getDeptChecked.help.length > 0) {
            this.setDepartmentChecked(getDeptChecked.help, 'checked_help', 'help', 'tree_help');//设置协助部门选中
          }
        }
      })
    },
    defaultExpanded(data, expanded) {//tree默认展开
      let cout = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].open === true) {
          this.$set(this[expanded], cout, data[i].id);
          ++cout;
        }
      }
    },
    defaultChecked(data, checked, selected) {//tree默认选中
      let cout = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].checked === true) {
          this.$set(this[checked], cout, data[i].id);
          if (data[i].type === 'Staffer') {
            this.trainForm[selected] = this.trainForm[selected] + '[' + data[i].name + ']';
          }
          ++cout;
        }
      }
    },
    TreeChangeData(DATA) {//tree数组转换
      let arr = [];
      //一级数组
      for (let i = 0; i < DATA.length; i++) {
        let count = 0;
        for (let j = 0; j < DATA.length; j++) {
          if (DATA[i].pId === DATA[j].id) {
            count++
          }
        }
        if (count === 0) {
          arr.push({
            id: DATA[i].id,
            label: DATA[i].name,
            type: DATA[i].type,
            dept_guid: DATA[i].dept_guid,
            position_guid: DATA[i].position_guid,
            staffer_guid: DATA[i].staffer_guid,
            children: []
          });
        }
      }
      this.TreeArray(arr, DATA);
      return arr;
    },
    TreeArray(arr, DATA) {//tree数组转换
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < DATA.length; j++) {
          if (arr[i].id === DATA[j].pId) {
            arr[i].children.push({
              id: DATA[j].id,
              label: DATA[j].name,
              type: DATA[j].type,
              dept_guid: DATA[j].dept_guid,
              position_guid: DATA[j].position_guid,
              staffer_guid: DATA[j].staffer_guid,
              children: []
            });
          }
        }
        if (arr[i].children.length > 0) {
          this.TreeArray(arr[i].children, DATA);
        }
      }
    },
    getTreeCheckedData(data, type) {//获取树勾选节点
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        if (type === 'staffer') {
          if (data[i].type === 'Staffer') {
            arr.push({
              dept_guid: data[i].dept_guid,
              position_guid: data[i].position_guid,
              staffer_guid: data[i].staffer_guid,
            });
          }
        } else if (type === 'dept') {
          if (data[i].type === 'Dept') {
            arr.push({
              dept_guid: data[i].dept_guid,
            });
          }
        } else if (type == 'filelist') {
          arr.push({
            file_name: data[i].name,
            file_path: '',
            file_extension: '',
            file_type: '',
            file_size: '',
            file_uuid: '',
            file_guid: '',
            apply_guid: '',
            folder_guid: "",
            document_guid: data[i].id
          });
        }
      }
      return arr;
    },
    setTreeChecked(data, checked, val) {//tree勾选显示再输入框中
      if (data.type === 'Staffer' && checked === true && this.trainForm[val].indexOf(data.label) === -1) {//选中赋值
        this.trainForm[val] = this.trainForm[val] + '[' + data.label + ']';
      } else if (data.type === 'Staffer' && checked === false && this.trainForm[val].indexOf(data.label) !== -1) {//删除选中
        this.trainForm[val] = this.trainForm[val].replace('[' + data.label + ']', "");
      } else if ((val === 'undertake' || val === 'help') && data.type === 'Dept' && checked === true && this.trainForm[val].indexOf(data.label) === -1) {//选中赋值
        this.trainForm[val] = this.trainForm[val] + '[' + data.label + ']';
      } else if ((val === 'undertake' || val === 'help') && data.type === 'Dept' && checked === false && this.trainForm[val].indexOf(data.label) !== -1) {//删除选中
        this.trainForm[val] = this.trainForm[val].replace('[' + data.label + ']', "");
      }
    },
    CheckChangeObjects(data, checked, indeterminate) {//培训对象tree勾选
      this.setTreeChecked(data, checked, 'objects');
    },
    CheckChangePrincipal(data, checked, indeterminate) {//负责人tree勾选
      this.setTreeChecked(data, checked, 'principal');
    },
    CheckChangeTrainer(data, checked, indeterminate) {//培训者tree勾选
      this.setTreeChecked(data, checked, 'trainer');
    },
    CheckChangeUndertake(data, checked, indeterminate) {//承办部门tree勾选
      this.setTreeChecked(data, checked, 'undertake');
    },
    CheckChangeHelp(data, checked, indeterminate) {//协助部门tree勾选
      this.setTreeChecked(data, checked, 'help');
    },
    heigthResize() {
      // $('.info').height($(window).height() - 142);
    },
    getDepartmentData(data) {
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          dept_guid: data[i]
        })
      }
      return arr;
    },
    /**
     * @return {boolean}
     */
    FormValidation() {//额外表单验证
      let bool = false;
      if (new Date(this.trainForm.start_time).getTime() >= new Date(this.trainForm.end_time).getTime()) {
        this.$message({ message: this.$t('msg.MSG_0090')/*培训开始时间不能大于或等于结束时间！*/ });
        bool = true;
      }
      return bool;
    },
    submitForm(formName) {//提交
      let bool = this.FormValidation();
      if (bool) {
        return false;
      }
      // let undertake_arr = this.getDepartmentData(this.trainForm.undertake);
      // let help_arr = this.getDepartmentData(this.trainForm.help);
      let undertake_arr = this.getTreeCheckedData(this.$refs.tree_undertake.getCheckedNodes(), 'dept');
      let help_arr = this.getTreeCheckedData(this.$refs.tree_help.getCheckedNodes(), 'dept');
      let tree_objects = this.getTreeCheckedData(this.$refs.tree_objects.getCheckedNodes(), 'staffer');
      let tree_principal = this.getTreeCheckedData(this.$refs.tree_principal.getCheckedNodes(), 'staffer');
      let tree_trainer = [];
      let fileList = [];
      if (this.$refs.filelist) {
        fileList = this.getTreeCheckedData(this.trainForm.fileList, 'filelist');
      }
      if (this.$refs.tree_trainer) {
        tree_trainer = this.getTreeCheckedData(this.$refs.tree_trainer.getCheckedNodes(), 'staffer');
      }
      //let newfile = this.newFileUpload(this.fileNames);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const Loading = elearningJs.Loading();
          let info = {
            train_method: this.trainForm.train_method,//培训形式
            train_address: '',//地点this.trainForm.train_address
            start_time: this.trainForm.start_time,//开始时间
            end_time: this.trainForm.end_time,//结束时间
            prilist: JSON.stringify(tree_principal),//负责人
            undlist: JSON.stringify(undertake_arr),//承办部门
            codlist: JSON.stringify(help_arr),//协办部门
            objlist: JSON.stringify(tree_objects),//培训对象
            tralist: JSON.stringify(tree_trainer),//培训者
            room_guid: this.trainForm.room_guid,//会议室地点
            exalist: '',// 培训人
            trainGuids: this.trainGuids
          };
          this.$api.eleMethods.batchArrangeTrain(JSON.stringify(info)).then(res => {
            Loading.close();
            this.$message(res.msg);
            if (res.code === 0) {
              this.$emit('closeBatchArrange');
              this.trainingGuid = res.data;
              this.$router.replace({ name: 'TrainingSchedule' });
            }
          })
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    const TrainingInfo = JSON.parse(sessionStorage.getItem('TrainingInfo'));
    if (TrainingInfo !== '' && TrainingInfo !== null) {
      this.trainingGuid = TrainingInfo.Train_GUID;
      this.trainingStatus = TrainingInfo.Train_Status;
      this.train_title = this.$t('txt.TXT_0426')/*编辑培训*/;
    }
    this.heigthResize();
    this.getTrainingData();
    this.$nextTick(() => {
      $('.el-popover').css('min-width', '40px !important');
    })
  }
}
</script>

<style lang="scss">
.TrainingArrange {
  .tip {
    color: #f56c6c;
  }
  .custom-tree-node {
    position: relative;
    width: 100%;
  }
  .oper {
    margin-right: 8px;
  }
  .isExam {
    color: #f56c6c;
  }
  .info {
    background-color: #fff;
    overflow-y: auto;
    > .el-form .h4 {
      position: relative;
      margin: 0 0 10px 8px;
    }
    > .el-form .h4::before {
      content: " ";
      position: absolute;
      height: 14px;
      left: -8px;
      background-color: #e9e9e9;
      border: 1px solid #666666;
    }
    > .el-form .ipt_item {
      display: inline-block;
      width: 400px;
    }
    > .el-form .ipt_item_right {
      display: inline-block;
      width: 400px;
      margin-left: 100px;
    }
    > .submit {
      margin: 25px 0 0 80px;
    }
  }
  .el-date-editor {
    width: 100% !important;
  }
  .ipt_item_child {
    > .el-form-item__content {
      margin-left: 0 !important;
    }
  }
  .el-form-item__label {
    width: 120px !important;
  }
  .el-form-item__content {
    margin-left: 120px !important;
  }
  .questionpaper {
    text-decoration: underline;
    color: #3a8ee6;
  }
  .clearpaper {
    font-size: 16px;
    color: #f56c6c;
    vertical-align: text-bottom;
    margin-left: 8px;
    cursor: pointer;
  }
  .createtype {
    padding: 16px 0;
    > li {
      display: inline-block;
      width: 50%;
      text-align: center;
      > span {
        width: 80px;
        display: inline-block;
        height: 80px;
        background-color: #000;
        text-align: center;
        border-radius: 50%;
        cursor: pointer;
      }
      > p {
        font-size: 11px;
        margin-top: 16px;
      }
    }
  }
  .room-use {
    position: absolute;
    margin-left: 8px;
    width: 100px;
    color: #199ed8;
    &:hover {
      cursor: pointer;
    }
  }
  /*上传样式*/
  .data_box {
    line-height: unset;
    position: relative;
    margin-top: 6px;
  }
  .data_box .left_text {
    display: inline-block;
    vertical-align: middle;
  }
  .data_box .left_text .pTitle {
    color: #333;
  }
  .data_box .left_text .remarkText {
    color: #999;
  }
  .data_box .upload_box {
    display: inline-block;
    width: 140px;
    height: 60px;
    border: 1px dashed #ddd;
    text-align: center;
    padding: 6px 0;
    box-sizing: border-box;
    background: #fafafa;
    vertical-align: middle;
    margin: 0 25px 0 45px;
    cursor: pointer;
  }
  .data_box .upload_box .add_icon {
    width: 20px;
    height: 20px;
    background: #ccc;
    border-radius: 50%;
    text-align: center;
    display: inline-block;
  }
  .data_box .upload_box .add_icon img {
    vertical-align: text-top;
    width: 12px;
  }
  .data_box .upload_box p {
    color: #bbb;
  }
  .data_box .right {
    display: inline-block;
  }
  .data_box .input_box {
    display: inline-block;
    width: 25%;
  }
  .upload_input {
    position: absolute;
    font-size: 0;
    height: 26px;
    width: 80px;
    opacity: 0;
    cursor: pointer;
    top: 0;
    left: 0;
  }
  .upload_name {
    display: inline-block;
    > .upload {
      display: inline-block;
    }
    > span {
      margin-left: 16px;
    }
    > ul {
      display: inline-block;
      > li:first-child {
        margin-left: 16px;
      }
      > li {
        border: 1px dashed #ddd;
        padding: 2px 38px 2px 8px;
        position: relative;
        margin: 0 0 0 16px;
        display: inline-block;
        > i {
          position: absolute;
          right: 2px;
          top: 5px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
