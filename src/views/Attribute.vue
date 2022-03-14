<!--查看文件属性 @tangx-->
<template>
  <div class="attribute">
    <el-dialog :title="title" v-dialogDrag :visible.sync="dialogVisible" width="100%">
      <div class="container">
        <div class="left">
          <div class="iframe-wrap">
            <iframe :src="src" class="iframe"></iframe>
          </div>
        </div>
        <div class="right">
          <el-tabs v-model="activeName" @tab-click="handleClick" class="tab">
            <el-tab-pane :label="$t('txt.TXT_0028')" name="first" class="first">
              <!--  属性  -->
              <table class="li-wrap" style="border-spacing:0 10px;">
                <tr>
                  <td class="fisrt-td">{{$t('txt.TXT_0471')}}：</td> <!-- 文件名称   -->
                  <td>{{propertyData.fileName}}</td>
                </tr>
                <tr>
                  <td class="fisrt-td">{{$t('txt.TXT_0476')}}：</td><!--  文件类型  -->
                  <td>{{propertyData.File_Extension}}</td>
                </tr>
                <tr>
                  <td class="fisrt-td">{{$t('txt.TXT_0990')}}：</td><!--  文件大小  -->
                  <td>{{propertyData.File_Size}}</td>
                </tr>
                <tr>
                  <td class="fisrt-td">{{$t('txt.TXT_0991')}}：</td><!-- 文件夹位置   -->
                  <td>{{propertyData.Document_Path}}</td>
                </tr>
                <tr>
                  <td class="fisrt-td">{{$t('txt.TXT_0102')}}：</td><!--  创建者  -->
                  <!--                <td>{{CreateBy()}}</td>-->
                  <td>{{propertyData.Create_By}}</td>
                </tr>
                <tr>
                  <td class="fisrt-td">{{$t('txt.TXT_0103')}}：</td><!-- 创建时间   -->
                  <td>{{propertyData.Create_Date}}</td>
                </tr>
                <tr>
                  <td class="fisrt-td">{{$t('txt.TXT_0992')}}：</td><!-- 最后更新者   -->
                  <td>{{propertyData.Update_By}}</td>
                </tr>
                <tr>
                  <td class="fisrt-td">{{$t('txt.TXT_0993')}}：</td><!--  最后更新时间  -->
                  <td>{{propertyData.Update_Date}}</td>
                </tr>
              </table>
            </el-tab-pane>
            <el-tab-pane :label="$t('txt.TXT_0029')" name="second">
              <!-- 日志   -->
              <el-table :data="LogData" border :header-cell-style="headerStyle" :cell-style="cellStyle" style="width: 90%;margin: 8px auto">
                <el-table-column prop="Operation_Type" :label="$t('txt.TXT_0994')">
                  <!-- 操作类型   -->
                </el-table-column>
                <el-table-column prop="Operation_User" :label="$t('txt.TXT_0074')">
                  <!--  操作人  -->
                </el-table-column>
                <el-table-column prop="Operation_Date" :label="$t('txt.TXT_0072')">
                  <!--  操作时间  -->
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane :label="$t('txt.TXT_0030')" name="third">
              <!--  版本  -->
              <el-table :data="versionData" border :header-cell-style="headerStyle" :cell-style="cellStyle" style="width: 90%;margin: 8px auto">
                <el-table-column prop="Revision_No" :label="$t('txt.TXT_0030')">
                  <!--  版本  -->
                </el-table-column>
                <el-table-column prop="Create_By_Name" :label="$t('txt.TXT_0217')">
                  <!--  更新人  -->
                  <template slot-scope="scope">
                    {{scope.row.Create_By_Name/*CreateByformatter(scope.row.Create_By)*/}}
                  </template>
                </el-table-column>
                <el-table-column prop="Create_Date" :label="$t('txt.TXT_0216')">
                  <!--  更新时间  -->
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane :label="$t('txt.TXT_0995')" name="forth">
              <!--  更新版本  -->
              <div class="upload-wrap">
                <div class="input-container required" style="display: flex">
                  <span style="transform: translateY(3px)">{{$t('txt.TXT_0477')}}：</span><!--  文件  -->
                  <div>
                    <el-input id="upload" suffix-icon="el-icon-upload" :placeholder="uploadPlaceholder"></el-input>
                    <!--请选择文件 上传文件 -->
                    <input class="upload_input" id="file1" type="file" name="file" multiple="" @click="uploadFile"></input>
                  </div>
                </div>
              </div>
              <div>
                <p style="padding:8px" class="required">{{$t('txt.TXT_0035')}}：</p><!-- 备注   -->
                <el-input type="textarea" maxlength="512" v-model="remark"></el-input>
                <div style="text-align: center;margin-top: 8px">
                  <el-button type="primary" @click="updateDucument">{{$t('btn.BTN_013')}}</el-button><!-- 确定   -->
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { staffername } from '@/api/ele-modules/methods'
import { filelog, documentproperty, fileversion, checkin } from '@/api/ele-modules/archives-management/methods'
import requestUrl from "@/http/server-conf";
export default {
  name: "Attribute",
  props: ['param'],
  data() {
    return {
      dialogVisible: false,
      title: '',
      src: '',
      activeName: 'first',
      uploadPlaceholder: this.$t('txt.TXT_0227'),//请选择文件
      propertyData: {},
      LogData: [],
      versionData: [],
      remark: '',
      uploadData: {},
      file_guid: '',
      id: '',
    }
  },
  filters: {
    cjzFilter(v) {
      console.log(v);
      // return staffername(v).then(n=>{return n})
    }
  },
  watch: {
    param: function (newValue, oldValue) {
      this.id = newValue.id;
      filelog(newValue.id).then(n => {
        this.LogData = n.data;
      });
      documentproperty(newValue.id).then(n => {
        this.propertyData = n.data;
        /*if(this.propertyData.Create_By){
          this.propertyData.Create_By = this.CreateByformatter(this.propertyData.Create_By);
        }
        if(this.propertyData.Update_By){
          this.propertyData.Update_By = this.CreateByformatter(this.propertyData.Update_By);
        }*/

        /*this.propertyData.Create_By=staffername(this.propertyData.Create_By).then(j=>{return j});
        this.propertyData.Update_By=staffername(this.propertyData.Update_By).then(j=>{return j});*/
        this.remark = '';
        this.uploadPlaceholder = n.data.File_Name;
        // console.log(n.data)
      });
      fileversion(newValue.id).then(n => {
        this.versionData = n.data;
      });
      this.src = '/ele_js/UploadHtml/' + this.param.type + '.html?id=' + this.param.id + '&source=' + this.param.source + '&ver=' + this.param.ver + '&rid=' + this.param.rid
      $('.left iframe')[0].onload = this.iframeLoaded;
    }
  },
  /*computed:{
    src:function () {
      return '/ele_js/UploadHtml/'+this.param.type+'.html?id='+this.param.id+'&source='+this.param.source+'&ver='+this.param.ver+'&rid='+this.param.rid
    }
  },*/
  methods: {
    /**查看文件属性**/
    getDocumentAttr(id) {
      this.$api.doc.documentInf(id).then(res => {
        if (res.success) {
          console.log(res, '文件属性')
          this.propertyData = res.data
        }
      })
    },
    iframeLoaded() {
      $('.left iframe').contents().find('html').css('overflow-y', 'hidden');
    },
    /**
     * @return {string}
     */
    CreateByformatter(guid) {
      let a = '';
      $.ajax({
        url: `${requestUrl.elBaseUrl}/Common/staffername/${guid}`,
        type: 'GET',
        async: false,
        success: (d) => {
          {
            if (d.status === 200) {
              a = d.data;
            }
          }
        }
      });
      return a;
    },
    CreateBy() {
      staffername(this.propertyData.Create_By).then(n => { return n })
    },
    closeAttr() {
      this.$emit('closeAttr', true);
    },
    //上传
    uploadFile() {
      this.$fileUpload.Explorer.InitUpld("#file1", this.$UploadUrl, "", false, (res) => {
        this.uploadData = {
          document_guid: this.propertyData.Document_GUID,
          remark: this.remark,
          file_name: res.name,
          file_extension: res.ext,
          file_path: res.srcUrl,
          file_size: res.size,
          file_uuid: res.uuid,
        };
        this.uploadPlaceholder = res.name;
      });

    },
    updateDucument() {
      // this.src='';
      this.uploadData.remark = this.remark;
      if (!this.uploadData.file_name) {
        this.$message(this.$t('msg.MSG_0100'));//上传文件
        return;
      } else if (!this.uploadData.remark) {
        this.$message(this.$t('msg.MSG_0103'));//请填写备注
        return;
      }
      checkin(this.uploadData).then(n => {
        this.$message(n.msg);
        if (n.code === 0) {
          documentproperty(this.id).then(m => {
            const source = 1;
            const ver = '';
            const rid = '';
            this.$api.eleMethods.filePreview(this.id, source, ver, rid).then((res) => {
              if (res.code === 0) {
                this.closeAttr();
                this.src = '/ele_js/UploadHtml/' + res.type + '.html?id=' + this.id + '&source=' + source + '&ver=' + ver + '&rid=' + rid;
              } else {
                this.$message(res.msg)
              }
            });
          });

        }
      })
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    //表头居中
    headerStyle() {
      return 'text-align:center'
    },
    //表格单元格居中
    cellStyle() {
      return 'text-align:center'
    },
    init(newValue) {
      this.id = newValue.id;
      filelog(newValue.id).then(n => {
        this.LogData = n.data;
      });
      documentproperty(newValue.id).then(n => {
        this.propertyData = n.data;
        this.remark = '';
        this.uploadPlaceholder = n.data.File_Name;

      });
      fileversion(newValue.id).then(n => {
        this.versionData = n.data;
      });
      this.src = '/ele_js/UploadHtml/' + this.param.type + '.html?id=' + this.param.id + '&source=' + this.param.source + '&ver=' + this.param.ver + '&rid=' + this.param.rid
      $('.left iframe')[0].onload = this.iframeLoaded;
    }
  },
  mounted() {
    let newValue = this.param;
    // this.init(newValue);
  }
}
</script>

<style scoped lang="scss">
.attribute {
  .el-dialog__wrapper {
    position: absolute;
    top: 0;
    left: 0;
    height: 100vh;
  }
  .container {
    display: flex;
    justify-content: space-between;
  }
  .left {
    flex: 2;
  }

  .right {
    border-bottom: 1px dashed #ccc;
    flex: 1;
    .first {
      border-bottom: 1px dashed #ccc;
    }
    .li-wrap {
      tr {
        margin: 8px 0;
      }
      margin-left: 5%;
      .fisrt-td {
        text-align: right;
      }
    }
  }

  .iframe-wrap {
    height: calc(100vh - 50px);
    width: 100%;
    iframe {
      /*height: calc(100vh - 50px);*/
      width: 100%;
      height: 100%;
    }
  }
  .list {
    padding: 0 16px;
    .list-item {
      margin: 8px 0;
      padding-bottom: 8px;
      border-bottom: 1px dashed #b4bbc5;
    }
    /* .version{
        font-size: 12px;
        margin-bottom: 4px;
      }
      .date{
        font-size: 11px;
        color: rgb(153, 153, 153);
        font-family: 'Arial Normal', 'Arial';
        font-weight: 400;
        font-style: normal;
      }*/
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
.attribute {
  .tab {
    padding: 0 16px;
  }
}
</style>
