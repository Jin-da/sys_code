<template>
  <div>
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;min-width:1000px;margin-top:70px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap;" :disabled="loading">
        <el-form-item label="消耗日期" class="noselect" style="margin-right: 30px">
          <el-date-picker :picker-options="pickerOptions" value-format="timestamp" style="width:250px" v-model="searchParams.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="账户名称"  class="noselect" style="margin-right:30px">
          <el-input v-model="searchParams.account_name" placeholder="搜索账户" clearable style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item class="noselect">
          <el-button icon="el-icon-search" @click="research(1)" plain style="height: 30px; position: relative;">搜索</el-button>
          <el-button class="info_btn iconfont icon-shenbao" @click="expend_self_dialog_dialogVisible_open" type="info" style="font-size:12px;height: 30px; position: relative;right:-10px;margin-left:10px;" > 自主申报</el-button>
          <el-button class="info_btn iconfont icon-piliangbianji" :disabled='multipleSelectionFlag_delete' @click="expend_dialog_multiple_dialogVisible = true" type="info" style="font-size:12px;height: 30px; position: relative;right:-10px;margin-left:20px;" > 批量设置</el-button>
          <el-button class="info_btn iconfont icon-xiangmushenbao" @click="before_refreshLandingPage_all()" :disabled='multipleSelectionFlag_delete' type="info" style="font-size:12px;height: 30px; position: relative;right:-10px;margin-left:20px;" > 批量申报</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格 -->
    <el-table
      highlight-current-row
      :height="tableHeight"
      :key="key"
      stripe
      v-loading="loading"
      element-loading-background="rgba(255,255,255,0.5)"
      ref="multipleTable"
      :data="ShowTableData"
      tooltip-effect="dark"
      style="width:calc(100%-60px);line-height:30px;margin:5px 0px;min-width:1000px;margin-bottom:25px"
      :row-style="{height: '80px'}"
      border
      @selection-change="handleSelectionChange_delete">
      <el-table-column type="selection" width="55" fixed="left" :selectable="selectable"></el-table-column>
      <el-table-column prop="expend_date" label="消耗日期" width="120px">
      </el-table-column>
      <el-table-column prop="account_name" label="账户名称" width="400px">
      </el-table-column>
      <el-table-column prop="ad_id" label="广告账号ID" width="200px">
      </el-table-column>
      <el-table-column prop="project" label="项目" width="200px">
        <template slot="header">
          <div><span style="color:red">*&nbsp;</span>项目</div>
        </template>
        <template slot-scope="scope">
          <el-select :disabled="scope.row['expend_date'].split('-')[2] === new Date().toLocaleDateString().split('/')[2]" v-model="scope.row.project" filterable placeholder="请选择项目" clearable>
                <el-option v-for="item in [{value: 'COD/AK/日本/黑五',label: 'COD/AK/日本/黑五'}, {value: 'COD/AK/台湾/黑五',label: 'COD/AK/台湾/黑五'}, {value: 'COD/AK/香港/黑五',label: 'COD/AK/香港/黑五'}, {value: 'COD/AK/马来/黑五',label: 'COD/AK/马来/黑五'}, {value: 'COD/AK/新加坡/黑五',label: 'COD/AK/新加坡/黑五'}, {value: 'COD/AK/菲律宾/黑五',label: 'COD/AK/菲律宾/黑五'}, {value: 'COD/AK/泰国/黑五',label: 'COD/AK/泰国/黑五'}]" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column prop="currency" label="币种" width="60px">
        <template slot="header">
          <div><span style="color:red">*&nbsp;</span>币种</div>
        </template>
      </el-table-column>
      <el-table-column prop="expend_money" label="消耗金额" width="100px">
        <template slot="header">
          <div><span style="color:red">*&nbsp;</span>消耗金额</div>
        </template>
        <template slot-scope="scope">
          
          <el-input :disabled="scope.row['expend_date'].split('-')[2] === new Date().toLocaleDateString().split('/')[2]" placeholder="金额" v-model="scope.row.expend_money" clearable></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="200px">
        <template slot-scope="scope">
          <el-input :disabled="scope.row['expend_date'].split('-')[2] === new Date().toLocaleDateString().split('/')[2]" placeholder="备注" v-model="scope.row.remark" clearable></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="user_remark" label="凭证" min-width="160px">
        <template slot="header">
          <div style="display:inline"><span style="color:red">*&nbsp;</span>凭证</div>
          <el-tooltip :visible-arrow="false" class="item" effect="dark" content="单点复制按钮定位元素后再使用Ctrl+V粘贴截图" placement="top">
            <el-button
                type="text" icon="el-icon-info"
                size="small"
                style="color:#909399;font-size:15px;display:inline-block;padding:0px!important"
            ></el-button>
          </el-tooltip>
        </template>
          <template slot-scope="scope">
                <div class="upload_div" :class="{'disabled_div':scope.row['expend_date'].split('-')[2] === new Date().toLocaleDateString().split('/')[2]}">
                  <el-upload
                  :disabled="scope.row['expend_date'].split('-')[2] === new Date().toLocaleDateString().split('/')[2]"
                drag
                :on-change="(file, fileList) => {uploadFile_row(file, fileList, scope.row)}"
                style="marginleft:50px"
                required
                class="avatar-uploader"
                action=''
                :show-file-list="false"
                :auto-upload="false"
                >
                <img v-if="scope.row.url" :src="scope.row.url" class="avatar">
                <i v-else class="el-icon-upload2 avatar-uploader-icon"></i>
              </el-upload>
                </div>
              <div :class="{'disabled':scope.row['expend_date'].split('-')[2] === new Date().toLocaleDateString().split('/')[2]}" style="position:absolute;top: 17px;left: 113px;height: 45px;width: 35px;background-color:rgba(0,0,0,.5);border-top-right-radius:5px;border-bottom-right-radius:5px;border-radius: 5px;">
                <el-button :class="{'disabled':scope.row['expend_date'].split('-')[2] === new Date().toLocaleDateString().split('/')[2]}" @click="copyImg(scope.row)" :disabled="scope.row['expend_date'].split('-')[2] === new Date().toLocaleDateString().split('/')[2]" style="padding:0;position:absolute;left:0px;top:0px;bottom:0px;color:white;width:35px" type="text" class="el-icon-document-copy"></el-button>
              </div>
              <div v-if="scope.row.url != null && scope.row.url != ''" style="cursor:pointer;position:absolute;top: 17px;left: 10px;height: 45px;width: 35px;background-color:rgba(0,0,0,.5);border-top-left-radius:5px;border-bottom-left-radius:5px;border-radius: 5px;">
                <el-button @click="showImg(scope.row)" :disabled="scope.row['expend_date'].split('-')[2] === new Date().toLocaleDateString().split('/')[2]" style="padding:0;position:absolute;left:0px;top:0px;bottom:0px;color:white;width:35px" type="text" class="el-icon-search"></el-button>
              </div>
          </template>
      </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-tooltip content="编辑申报信息" placement="top" :visible-arrow="false">
            <el-button :class="{'disabled_btn':scope.row['expend_date'].split('-')[2] === new Date().toLocaleDateString().split('/')[2]}" :disabled="scope.row['expend_date'].split('-')[2] === new Date().toLocaleDateString().split('/')[2]" @click="expend_dialog_edit(scope.row)" icon="el-icon-edit" style="font-size:13px;color:grey;padding:0" type="text"></el-button>
          </el-tooltip>
          <el-tooltip content="单项申报" placement="top" :visible-arrow="false">
            <el-button :class="{'disabled_btn':scope.row['expend_date'].split('-')[2] === new Date().toLocaleDateString().split('/')[2]}" :disabled="scope.row['expend_date'].split('-')[2] === new Date().toLocaleDateString().split('/')[2]" @click="declare(scope.row)" style="font-size:13px;color:grey;padding:0;border:none;background-color:rgba(0,0,0,0)" icon="el-icon-upload2"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block" style="position: relative; right: 0px; margin-bottom: 25px" v-if="!loading">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="fetchPageData"
            :current-page.sync="currentPage"
            :page-sizes="[15,50, 100, 200]"
            :page-size="pageSize"
            layout="total,sizes, prev, pager, next"
            :total="totalNum">
        </el-pagination>
    </div>

  <el-dialog width="1600px" :visible.sync="showImg_dialogVisible">
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>

    <!-- 编辑申报信息表单 -->
    <el-dialog :close-on-click-modal="false" title="编辑申报信息" :visible.sync="expend_dialog_dialogVisible" width="400px">
      <el-form :rules="rules" ref="expend_dialog" :model="expend_dialog" label-width="80px" label-position="right" v-loading="expend_dialog_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目" class="noselect" style="margin-right: 50px" prop="project">
              <el-select v-model="expend_dialog.project" filterable placeholder="请选择项目" clearable>
                <el-option v-for="item in [{value: 'COD/AK/日本/黑五',label: 'COD/AK/日本/黑五'}, {value: 'COD/AK/台湾/黑五',label: 'COD/AK/台湾/黑五'}, {value: 'COD/AK/香港/黑五',label: 'COD/AK/香港/黑五'}, {value: 'COD/AK/马来/黑五',label: 'COD/AK/马来/黑五'}, {value: 'COD/AK/新加坡/黑五',label: 'COD/AK/新加坡/黑五'}, {value: 'COD/AK/菲律宾/黑五',label: 'COD/AK/菲律宾/黑五'}, {value: 'COD/AK/泰国/黑五',label: 'COD/AK/泰国/黑五'}]" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="金额" class="noselect" style="margin-right: 50px" prop="expend_money">
              <el-input placeholder="请输入金额" v-model="expend_dialog.expend_money" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" class="noselect" style="margin-right: 50px">
              <el-input placeholder="请输入备注" v-model="expend_dialog.remark" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
          <el-form-item size="small" label="凭证" class="noselect" prop="url">
            <template slot-scope="scope">
            <div class="upload_div_edit">
              <el-upload
                required
                drag
                  class="avatar-uploader"
                  action=''
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="uploadFile">
                  <img v-if="expend_dialog.url" :src="expend_dialog.url" class="avatar">
                  <i v-else class="el-icon-upload2 avatar-uploader-icon"></i>
              </el-upload>
              <div @click="copyImg_edit(scope.row)" style="border-radius: 5px;cursor:pointer;position:absolute;top: 0px;left: 197px;height: 75px;width: 35px;background-color:rgba(0,0,0,.5);border-top-right-radius:5px;border-bottom-right-radius:5px;">
                <el-button style="padding:0;position:absolute;left:10px;top:0px;bottom:0px;color:white" type="text" class="el-icon-document-copy"></el-button>
              </div>
              <div v-if="expend_dialog.url != null && expend_dialog.url != ''" style="border-radius: 5px;position:absolute;top: 0px;left:0px;height: 75px;width: 35px;background-color:rgba(0,0,0,.5);border-top-left-radius:5px;border-bottom-left-radius:5px;">
                  <el-button @click="showImg_edit(expend_dialog.url)" style="padding:0;position:absolute;left:10px;top:0px;bottom:0px;color:white" type="text" class="el-icon-search"></el-button>
              </div>
            </div>
            </template>
          </el-form-item>
        <el-button size="small" type="primary" @click="submitForm('expend_dialog')" class="formSubmitBtn" style="margin-left: 135px" >申 报</el-button>
        <el-button size="small" type="primary" @click="expend_dialog_confirm()" class="formSubmitBtn">暂 存</el-button>
      </el-form>
    </el-dialog>

    <!-- 批量设置表单 -->
    <el-dialog :close-on-click-modal="false" title="批量设置" :visible.sync="expend_dialog_multiple_dialogVisible" width="400px">
      <el-form :rules="rules" ref="expend_dialog_multiple" :model="expend_dialog_multiple" label-width="80px" label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目" class="noselect" style="margin-right: 40px">
              <el-select v-model="expend_dialog_multiple.project" filterable placeholder="请选择项目" clearable>
                <el-option v-for="item in [{value: 'COD/AK/日本/黑五',label: 'COD/AK/日本/黑五'}, {value: 'COD/AK/台湾/黑五',label: 'COD/AK/台湾/黑五'}, {value: 'COD/AK/香港/黑五',label: 'COD/AK/香港/黑五'}, {value: 'COD/AK/马来/黑五',label: 'COD/AK/马来/黑五'}, {value: 'COD/AK/新加坡/黑五',label: 'COD/AK/新加坡/黑五'}, {value: 'COD/AK/菲律宾/黑五',label: 'COD/AK/菲律宾/黑五'}, {value: 'COD/AK/泰国/黑五',label: 'COD/AK/泰国/黑五'}]" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="金额" class="noselect" style="margin-right: 40px">
              <el-input placeholder="请输入金额" v-model="expend_dialog_multiple.expend_money" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" class="noselect" style="margin-right: 40px">
              <el-input placeholder="请输入备注" v-model="expend_dialog_multiple.remark" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="small" type="primary" @click="expend_dialog_multiple_confirm()" class="formSubmitBtn" style="margin-left: 220px">暂 存</el-button>
      </el-form>
    </el-dialog>

    <!--自主申报申报信息表单 -->
    <el-dialog :close-on-click-modal="false" title="自主申报" :visible.sync="expend_self_dialog_dialogVisible" width="420px">
      <el-form :rules="rules" ref="expend_self_dialog" :model="expend_self_dialog" label-width="100px" label-position="right" v-loading="expend_self_dialog_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="消耗日期" class="noselect" style="margin-right: 60px;" prop="expend_date">
              <el-date-picker
                style="width:230px"
                v-model="expend_self_dialog.expend_date"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="账户名称" class="noselect" style="margin-right: 50px" prop="account_name">
              <el-input placeholder="请输入账户名称" v-model="expend_self_dialog.account_name" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="广告账号ID" class="noselect" style="margin-right: 50px" prop="ad_id">
              <el-input placeholder="请输入广告账号ID" v-model="expend_self_dialog.ad_id" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目" class="noselect" style="margin-right: 50px" prop="project">
              <el-select v-model="expend_self_dialog.project" filterable placeholder="请选择项目" clearable>
                <el-option v-for="item in [{value: 'COD/AK/日本/黑五',label: 'COD/AK/日本/黑五'}, {value: 'COD/AK/台湾/黑五',label: 'COD/AK/台湾/黑五'}, {value: 'COD/AK/香港/黑五',label: 'COD/AK/香港/黑五'}, {value: 'COD/AK/马来/黑五',label: 'COD/AK/马来/黑五'}, {value: 'COD/AK/新加坡/黑五',label: 'COD/AK/新加坡/黑五'}, {value: 'COD/AK/菲律宾/黑五',label: 'COD/AK/菲律宾/黑五'}, {value: 'COD/AK/泰国/黑五',label: 'COD/AK/泰国/黑五'}]" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="币种" class="noselect" style="margin-right: 50px" prop="currency">
              <el-select v-model="expend_self_dialog.currency" filterable placeholder="请选择币种" clearable>
                <el-option v-for="item in [{value: 'USD',label: '美元(USD)'}, {value: 'TWD',label: '新台币(TWD)'}, {value: 'HKD',label: '港币(HKD)'}, {value: 'MYR',label: '马来西亚币(MYR)'}]" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
          <el-col :span="24">
            <el-form-item label="金额" class="noselect" style="margin-right: 50px" prop="expend_money">
              <el-input placeholder="请输入金额" v-model="expend_self_dialog.expend_money" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" class="noselect" style="margin-right: 50px">
              <el-input placeholder="请输入备注" v-model="expend_self_dialog.remark" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
          <el-form-item size="small" label="凭证" class="noselect" prop="url">
            <template slot-scope="scope">
              <div class="upload_div_edit">
                <el-upload
                required
                drag
                    class="avatar-uploader"
                    action=''
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="uploadFile_self">
                    <img v-if="expend_self_dialog.url" :src="expend_self_dialog.url" class="avatar">
                    <i v-else class="el-icon-upload2 avatar-uploader-icon"></i>
                </el-upload>
                <div @click="copyImg_self(scope.row)" style="border-radius: 5px;cursor:pointer;position:absolute;top: 0px;left: 197px;height: 75px;width: 35px;background-color:rgba(0,0,0,.5);border-top-right-radius:5px;border-bottom-right-radius:5px;">
                  <el-button style="padding:0;position:absolute;left:10px;top:0px;bottom:0px;color:white" type="text" class="el-icon-document-copy"></el-button>
                </div>
                <div @click="showImg_edit(expend_self_dialog.url)" v-if="expend_self_dialog.url != null && expend_self_dialog.url != ''" style="border-radius: 5px;cursor:pointer;position:absolute;top: 0px;left:0px;height: 75px;width: 35px;background-color:rgba(0,0,0,.5);border-top-left-radius:5px;border-bottom-left-radius:5px;">
                    <el-button style="padding:0;position:absolute;left:10px;top:0px;bottom:0px;color:white;" type="text" class="el-icon-search"></el-button>
                </div>
              </div>
            </template>
          </el-form-item>
        <el-button size="small" type="primary" @click="submitForm('expend_self_dialog')" class="formSubmitBtn" style="margin-left: 220px" >申 报</el-button>
        <!-- <el-button size="small" type="primary" @click="submitForm('expend_self_dialog')" class="formSubmitBtn">暂 存</el-button> -->
      </el-form>
    </el-dialog>

    <!-- 批量申报 -->
    <el-dialog :show-close="this.showRes != 0" title="批量申报" :visible.sync="landingPageAllRefresh_dialogVisible" width="400px" :close-on-click-modal="false">
      <div v-if="this.showRes === 1" style="width: 100%;height: 30px;line-height: 30px;background-color: #dff0d8;border-radius: 3px;color: #20A53A;margin-bottom:10px;position:relative;top:-20px;">全部项目执行成功</div>
      <div v-if="this.showRes === 0" style="width: 100%;height: 30px;line-height: 30px;background-color: #F1F1F1;border-radius: 3px;color: #909399;margin-bottom:10px;position:relative;top:-20px;">执行中</div>
      <div v-if="this.showRes === 2" style="width: 100%;height: 30px;line-height: 30px;background-color: #fdf6ec;border-radius: 3px;color: #E6A23C;margin-bottom:10px;position:relative;top:-20px;">存在执行失败项目</div>
      <el-table :max-height="300" :key="refreshKey" :data="landingPageAllRefresh_showTableData" style="position: relative;top:-20px;">
        <el-table-column property="ad_id" label="广告账号ID"></el-table-column>
        <el-table-column label="执行状态">
          <template slot-scope="scope">
            <p v-if="scope.row.refreshStatus == 0" class="el-icon-loading" style="color:grey;" type="text"></p>
            <p v-if="scope.row.refreshStatus == 1" class="el-icon-circle-check" style="color:#67C23A;" type="text"><span style="margin-left:10px;font-size:12px;top:-1px;position:relative">申报成功</span></p>
            <p v-if="scope.row.refreshStatus == 2" class="el-icon-circle-close" style="color:rgb(245, 108, 108);" type="text"><span style="margin-left:10px;font-size:12px;top:-1px;position:relative">申报失败</span></p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
</div>
</template>

<script>
  import utils from '../utils'
  var reg2 = new RegExp(/^[a-zA-Z0-9]{1,21}$/)
  var validatePass2 = (rule, value, callback) => {
    if (value === '' || value === null) {
      callback(new Error('货币必选'))
    } else if (value != '' && value != null) {
      reg2.test(value) ? callback() : callback(new Error('请检查输入的内容格式'))
    }
  };
  var reg3 = new RegExp(/^[0-9.]{1,10}$/)
  var validatePass3 = (rule, value, callback) => {
    if (value === '' || value === null) {
        callback(new Error('消耗金额必填'))
    } else if (value != '' && value != null) {
        reg3.test(value) ? callback() : callback(new Error('请检查输入的内容格式'))
    }
  };
  export default {
    data() {
      return {
        standBy_copy:null,
        standBy_copy_self:null,
        standBy_copy_edit:null,
        pickerOptions: {
          disabledDate(v) {
            return v.getTime() >= new Date().getTime();
          }
        },
        showImg_dialogVisible:false,
        dialogImageUrl:null,
        // 批量申报
        landingPageAllRefresh_dialogVisible:false,
        landingPageAllRefresh_showTableData:[],
        showRes:0,
        refreshKey:0,
        // 编辑申报
        expend_dialog_dialogVisible:false,
        expend_dialog_loading:false,
        expend_dialog: {
              id:null,
              project:null,
              expend_money:null,
              remark:null,
              url:null,
              img:null
        },
        expend_self_dialog_dialogVisible:false,
        expend_self_dialog_loading:false,
        expend_self_dialog: {
          user:null,
          zh_name:null,
          expend_date: this.lastDate,
          currency:'USD',
          id:null,
          project:null,
          expend_money:null,
          remark:null,
          url:null,
          img:null,
        },
        expend_dialog_multiple_dialogVisible:false,
        expend_dialog_multiple: {
          project:null,
          expend_money:null,
          remark:null
        },
        standBy_e:null,
        multipleSelectionFlag_delete:true,
        multipleSelection_delete:[],
        tableHeight:620,
        key:0,
        // 加载界面显示与否
        loading: false,
        // 展示数据
        ShowTableData: [],
        // 原始数据
        tableData: null,
        // 搜索输入框记录
        searchParams: {
          project:null,
          account_name:null,
          date:null,
        },
        //校验规则
        rules: {
          currency:[
            { validator: validatePass2, required: true,trigger: 'change' }
          ],
          exchange_rate:[
            { required: true, message: '汇率必填', trigger: 'change' }
          ],
          account_name:[
            { required: true, message: '账户名称必填', trigger: 'change' }
          ],
          ad_id:[
            { required: true, message: '广告账号ID必填', trigger: 'change' }
          ],
          expend_date:[
            { required: true, message: '汇率必填', trigger: 'change' }
          ],
          url: [
            { required: true, message: '凭证未上传',trigger: 'change'}
          ],
          expend_money:[
            { validator: validatePass3, required: true,trigger: 'change' }
          ],
          project:[
            { required: true, message: '项目必选', trigger: 'change' }
          ],
        },
        uid:null,
        zh_name:null,
        // 分页
        totalNum: 0,
        currentPage: 1,
        useSearchData: false,
        pageSize:50,
        searchPageChange:false,
        standBy_search:null,
        clientHeight: 0,
      }
    },

    created() {
      this.getUid()
      this.fetch()
    },

    methods: {
      sendMsg() {
      this.$EventBus.$emit("aMsg");
    },
      useCopy(event) {
        if (this.standBy_copy != null) {
          this.onPasteUpload(event)
        } else if (this.standBy_copy_self != null) {
          this.onPasteUpload_self(event)
        } else if (this.standBy_copy_edit != null) {
          this.onPasteUpload_edit(event)
        }
      },
      copyImg(e) {
        this.$message.info('定位元素')
        this.standBy_copy = e
      },
      copyImg_self(e) {
        this.$message.info('定位元素')
        this.standBy_copy_self = this.expend_self_dialog
      },
      copyImg_edit(e) {
        this.$message.info('定位元素')
        this.standBy_copy_edit = this.expend_dialog
      },
      onPasteUpload(event) {
        if (this.standBy_copy != null) {
          let items = event.clipboardData && event.clipboardData.items;
          let file = null
          if (items && items.length) {
            for (var i = 0; i < items.length; i++) {
              if (items[i].type.indexOf('image') !== -1) {
                file = items[i].getAsFile()
              }
            }
          }
          if (!file) {
              return;
          }
          this.$set(this.standBy_copy, 'url', URL.createObjectURL(file))
          this.$set(this.standBy_copy, 'img', file)
          this.standBy_copy = null
          this.$message.success('已粘贴')
        }
      },
      onPasteUpload_self(event) {
        if (this.standBy_copy_self != null) {
          let items = event.clipboardData && event.clipboardData.items;
          let file = null
          if (items && items.length) {
            for (var i = 0; i < items.length; i++) {
              if (items[i].type.indexOf('image') !== -1) {
                file = items[i].getAsFile()
              }
            }
          }
          if (!file) {
              return;
          }
          this.expend_self_dialog["url"] = URL.createObjectURL(file)
          this.expend_self_dialog["img"] = file
          this.standBy_copy_self = null
          this.$message.success('已粘贴')
        }
      },
      onPasteUpload_edit(event) {
        if (this.standBy_copy_edit != null) {
          let items = event.clipboardData && event.clipboardData.items;
          let file = null
          if (items && items.length) {
            for (var i = 0; i < items.length; i++) {
              if (items[i].type.indexOf('image') !== -1) {
                file = items[i].getAsFile()
              }
            }
          }
          if (!file) {
              return;
          }
          this.expend_dialog["url"] = URL.createObjectURL(file)
          this.expend_dialog["img"] = file
          this.standBy_copy_edit = null
          this.$message.success('已粘贴')
        }
      },
      expend_self_dialog_dialogVisible_open() {
        this.expend_self_dialog["expend_date"] = new Date(new Date().toLocaleDateString()).getTime()-24*60*60*1000
        this.expend_self_dialog_dialogVisible = true
      },
      selectable(row,index) {
          var row_date = row["expend_date"].split('-')[2]
          var now_date =  new Date().toLocaleDateString().split('/')[2]
          return now_date != row_date
      },
      showImg(e) {
        this.showImg_dialogVisible = true
        this.dialogImageUrl = e["url"]
      },
      showImg_edit(e) {
        this.showImg_dialogVisible = true
        this.dialogImageUrl = e
      },
      before_refreshLandingPage_all() {
        var check = null
        this.multipleSelection_delete.forEach(e=> {
          if (e["project"] === null || e["project"] === "" || e["expend_money"] === null || e["expend_money"] === "" || e["url"] === undefined || e["img"] === undefined|| e["url"] === null || e["img"] === null) {
            check = 1
          }
        })
        if (check === 1) {
          this.$message.warning('请检查选中项目的申报内容')
        } else {
          this.refreshLandingPage_all()
        }
      },
      refreshLandingPage_all() {// 批量提交
        var resArr = []
        this.showRes = 0
        this.landingPageAllRefresh_showTableData = this.multipleSelection_delete
        this.landingPageAllRefresh_showTableData.forEach(e => {
          this.$set(e, 'refreshStatus', 0)
        })
        this.landingPageAllRefresh_dialogVisible = true
        this.landingPageAllRefresh_showTableData.forEach(async e=> {
          if (e["project"] === null || e["project"] === "" || e["expend_money"] === null || e["expend_money"] === "" || e["url"] === undefined || e["img"] === undefined|| e["url"] === null || e["img"] === null) {
            resArr.push(2)
            this.$set(e, 'refreshStatus', 2)
          } else {
            let formData = new FormData()
            formData.append('id',e["id"])
            formData.append('project',e["project"])
            formData.append('remark',e["remark"])
            formData.append('expend_money',e["expend_money"])
            formData.append('image',e["img"])
            try {
              await this.$http.post("/index.php/index/account/submitApply/",formData).then((res) => {
                if (res.data["code"] === 200) {
                  resArr.push(1)
                  this.$set(e, 'refreshStatus', 1)
                } else {
                  resArr.push(2)
                  this.$set(e, 'refreshStatus', 2)
                }
              })
            } catch (error) {
              resArr.push(2)
              this.$set(e, 'refreshStatus', 2)
            }
          }
          if (resArr.length === this.multipleSelection_delete.length) {
            var a = Math.ceil((this.totalNum - this.multipleSelection_delete.length)/this.pageSize)
            if (this.currentPage <= a) {
              this.fetchPageData(this.currentPage)
            } else {
              this.currentPage = this.currentPage - 1
              this.fetchPageData(this.currentPage)
            }
            if (resArr.indexOf(2) != -1) {
              this.showRes = 2
            } else {
              this.showRes = 1
            }
          }
        })
      },
      handleUpdateClick_refresh() {// 回流
        this.refreshKey += 1 
      },
      uploadFile(file) {
        this.expend_dialog["url"] = URL.createObjectURL(file.raw)
        this.expend_dialog["img"] = file.raw
      },
      uploadFile_row(file,fileList,e) {
        // e["url"] = URL.createObjectURL(file.raw)
        // e["img"] = file.raw
        this.$set(e, 'url', URL.createObjectURL(file.raw))
        this.$set(e, 'img', file.raw)
        // this.handleUpdateClick()
      },
      uploadFile_self(file) {
        this.expend_self_dialog["url"] = URL.createObjectURL(file.raw)
        this.expend_self_dialog["img"] = file.raw
      },
      async declare(e) {
        if (e["project"] === null || e["project"] === "" || e["expend_money"] === null || e["expend_money"] === "" || e["url"] === undefined || e["img"] === undefined|| e["url"] === null || e["img"] === null) {
          this.$message.warning('请检查申报内容')
        } else {
          this.loading = true
          let formData = new FormData()
          formData.append('id',e["id"])
          formData.append('project',e["project"])
          formData.append('remark',e["remark"])
          formData.append('expend_money',e["expend_money"])
          formData.append('image',e["img"])
          await this.$http.post('/index.php/index/account/submitApply/',formData).then((res) => {
            this.loading = false
            if (res.data["code"] === 200) {
              this.$message.success(`${res.data["data"]}`)
              var a = Math.ceil((this.totalNum - 1)/this.pageSize)
              if (this.currentPage <= a) {
                this.fetchPageData(this.currentPage)
              } else {
                this.currentPage = this.currentPage - 1
                this.fetchPageData(this.currentPage)
              }
            } else {
              this.$message.error(`${res.data["data"]}`)
            }
          })
        }
      },
      async expend_dialog_submit() {
        this.expend_dialog_loading = true
        let formData = new FormData()
        formData.append('id',this.expend_dialog["id"])
        formData.append('project',this.expend_dialog["project"])
        formData.append('remark',this.expend_dialog["remark"])
        formData.append('expend_money',this.expend_dialog["expend_money"])
        formData.append('image',this.expend_dialog["img"])
        await this.$http.post('/index.php/index/account/submitApply/',formData).then((res) => {
          this.expend_dialog_loading = false
          if (res.data["code"] === 200) {
            this.$message.success(`${res.data["data"]}`)
            this.expend_dialog_dialogVisible = false
            this.fetchPageData(this.currentPage)
            this.sendMsg()
          } else {
            this.$message.error(`${res.data["data"]}`)
          }
        })
      },
      async expend_self_dialog_submit() {
        this.expend_self_dialog_loading = true
        let formData = new FormData()
        formData.append('project',this.expend_self_dialog["project"])
        formData.append('remark',this.expend_self_dialog["remark"])
        formData.append('expend_money',this.expend_self_dialog["expend_money"])
        formData.append('image',this.expend_self_dialog["img"])
        formData.append('user',localStorage.getItem("uid"))
        formData.append('zh_name',localStorage.getItem("zh_name"))
        formData.append('currency',this.expend_self_dialog["currency"])
        formData.append('account_name',this.expend_self_dialog["account_name"])
        formData.append('ad_id',this.expend_self_dialog["ad_id"])
        formData.append('expend_date',this.expend_self_dialog["expend_date"]/1000)
        await this.$http.post('/index.php/index/account/selfApply/',formData).then((res) => {
          this.expend_self_dialog_loading= false
          if (res.data["code"] === 200) {
            this.expend_self_dialog_dialogVisible = false
            this.$message.success(`${res.data["data"]}`)
            this.sendMsg()
          } else {
            this.$message.error(`${res.data["aata"]}`)
          }
        })
      },
      expend_dialog_multiple_confirm() {
        this.multipleSelection_delete.forEach(e => {
          e["project"] = this.expend_dialog_multiple["project"]
          e["expend_money"] = this.expend_dialog_multiple["expend_money"]
          e["remark"] = this.expend_dialog_multiple["remark"]
        })
        this.expend_dialog_multiple_dialogVisible = false
      },
      expend_dialog_edit(e) {
        this.expend_dialog["id"] = e["id"]
        this.expend_dialog["project"] = e["project"]
        this.expend_dialog["remark"] = e["remark"]
        this.expend_dialog["expend_money"] = e["expend_money"]
        this.expend_dialog["url"] = e["url"]
        this.expend_dialog["img"] = e["img"]
        this.standBy_e = e
        this.expend_dialog_dialogVisible = true
      },
      expend_dialog_confirm() {
        this.$message.success('已暂存')
        this.standBy_e["project"] = this.expend_dialog["project"]
        this.standBy_e["remark"] = this.expend_dialog["remark"]
        this.standBy_e["expend_money"] = this.expend_dialog["expend_money"]
        this.standBy_e["url"] = this.expend_dialog["url"]
        this.standBy_e["img"] = this.expend_dialog["img"]
        this.expend_dialog_dialogVisible = false
      },
      // -----------------------------------------------------------
      async handleSizeChange(val) {// 页大小
        if (this.searchPageChange === false && this.useSearchData === false) {
          this.loading = true;
          let formData = new FormData()
          formData.append("page",1)
          formData.append("num",val)
          formData.append("user",this.uid)
          formData.append("apply",1)
          await this.$http.post("/index.php/index/account/searchAuditList/",formData).then((res) => {
          res.data["data"].forEach(e=> {
            e["expend_date"] = utils.getLocalTime(parseInt(e["expend_date"]));
            e["apply_date"] = utils.getLocalTime(parseInt(e["apply_date"]));
            e["url"]
          })
          this.tableData = res.data["data"];
          this.totalNum = res.data["sum"]
          this.ShowTableData = this.tableData;
          this.currentPage = 1
          this.pageSize = val
          this.tableHeight = utils.setClientHight(this,255,56,80)
          this.handleUpdateClick()
          this.loading = false;
          });
        } else {
          this.pageSize = val
          this.fetchPageData(1)
          }
      },
      async fetchPageData(val) {// 点击页码/改变页大小
        if (this.searchPageChange === false && this.useSearchData === false) {
        this.loading = true;
        let formData = new FormData()
        formData.append("page",val)
        formData.append("num",this.pageSize)
        formData.append("user",this.uid)
        formData.append("apply",1)
        await this.$http.post("/index.php/index/account/searchAuditList/",formData).then((res) => {
          res.data["data"].forEach(e=> {
            e["expend_date"] = utils.getLocalTime(parseInt(e["expend_date"]));
            e["apply_date"] = utils.getLocalTime(parseInt(e["apply_date"]));
            e["url"]
          })
          this.tableData = res.data["data"];
          this.totalNum = res.data["sum"]
          this.ShowTableData = this.tableData;
          this.tableHeight = utils.setClientHight(this,255,56,80)
          this.handleUpdateClick()
          this.loading = false;
        });
        } else {
        this.search(val)
        }
      },
      async fetch() {// 数据获取
        this.ShowTableData = []
        this.loading = true
        let formData = new FormData()
        formData.append("page",1)
        formData.append("num",this.pageSize)
        formData.append("user",this.uid)
        await this.$http.post("/index.php/index/account/expendApplyList/",formData).then((res) => {
        res.data["data"].forEach(e=> {
          e["expend_date"] = utils.getLocalTime(parseInt(e["expend_date"]));
          
        })
        this.useSearchData = false
        this.searchPageChange = false
        this.tableData = res.data["data"];
        this.totalNum = res.data["sum"]
        this.ShowTableData = this.tableData;
        this.tableHeight = utils.setClientHight(this,255,56,80)
        this.loading = false;
        });
      },
      handleSelectionChange_delete(val) {//有选中项目时触发
        this.multipleSelection_delete = val;
        this.multipleSelectionFlag_delete = false;
        if (this.multipleSelection_delete.length == 0) {
          // 如不进行判断则勾选完毕后批量删除按钮还是会在
          this.multipleSelectionFlag_delete = true;
        }
      },
      getUid() { // 获取用户uid
        this.uid = localStorage.getItem("uid")
        this.zh_name = localStorage.getItem("zh_name")
      },
      // -----------------------------------------------------------
      //表单提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'new_form') {
            this.new_form_submit()
            } else if (formName === 'expend_dialog') {
              this.expend_dialog_submit()
            } else if (formName === 'expend_self_dialog') {
              this.expend_self_dialog_submit()
            }
            else {
            this.account_back_submit()
            }
          } else {
            return false;
          }
        });
      },
      //--------------------------------------------------------------
      research(val) {
        this.searchPageChange = false
        this.useSearchData = false
        this.search(val)
      },
      //搜索提交
      async search(val) {
        this.loading = true
        for (const key in this.searchParams) {//去除无效属性
          if (this.searchParams[key] === null || this.searchParams[key] === '') {
          delete this.searchParams[key]
          }
        }
        delete this.searchParams['page']
        delete this.searchParams['num']
        if (Object.keys(this.searchParams).length === 0 && this.searchPageChange === false && this.useSearchData === false) {
        this.fetch()
        }
        // 普通搜索
        if (Object.keys(this.searchParams).length != 0 && this.searchPageChange === false && this.useSearchData === false) {
        this.searchParams["page"] = val
        this.searchParams["num"] = this.pageSize
        this.searchParams["user"] = this.uid
        this.searchParams["apply"] = 1
        let formData = new FormData()
        for (const key in this.searchParams) {
          formData.append(`${key}`,this.searchParams[key])
        }
        formData.delete('date')
        if (this.searchParams["date"] != undefined) {
          var arr1 = []
          this.searchParams["date"].forEach(e=> {
            arr1.push(e/1000)
          })
          formData.append('date',arr1)
        }
        // formData.append('page',val)
        // formData.append('num',this.pageSize)
        // formData.append('user',this.uid)
        // formData.append('audit',1)
          await this.$http.post('/index.php/index/account/searchAuditList/',formData).then((res) => {
            res.data["data"].forEach(e=> {
              e["allot_time"] = utils.getLocalTime(parseInt(e["allot_time"]));
            })
            this.standBy_search = utils.deepClone(this.searchParams)//缓存搜索项
            this.searchPageChange = true
            this.useSearchData = true
            this.totalNum = res.data["sum"]
            this.currentPage = val
            this.tableData = res.data["data"]
            this.ShowTableData = []
            this.tableData.forEach((e) => {
              if (this.tableData.indexOf(e) <= this.pageSize - 1) {
              this.ShowTableData.push(e);
              }
              e["expend_date"] = utils.getLocalTime(parseInt(e["expend_date"]));
              e["apply_date"] = utils.getLocalTime(parseInt(e["apply_date"]));
              e["url"]
            });
            this.currentPage = 1
            this.tableHeight = utils.setClientHight(this,255,56,80)
            this.loading = false
          })
        }
        // 搜索后换页/页大小
        else if(this.searchPageChange === true && this.useSearchData === true){
          this.standBy_search["page"] = val
          this.standBy_search["num"] = this.pageSize
          this.standBy_search["user"] = this.uid
          this.standBy_search["apply"] = 1
          let formData = new FormData()
          for (const key in this.standBy_search) {
            formData.append(`${key}`,this.standBy_search[key])
          }
          formData.delete('date')
          if (this.searchParams["date"] != undefined) {
            var arr2 = []
            this.searchParams["date"].forEach(e=> {
              arr2.push(e/1000)
            })
            formData.append('date',arr2)
          }
          await this.$http.post('/index.php/index/account/searchAuditList/',formData).then((res) => {
            this.searchPageChange = true
            this.useSearchData = true
            this.totalNum = res.data["sum"]
            this.currentPage = val
            this.tableData = res.data["data"]
            this.ShowTableData = []
            this.tableData.forEach((e) => {
              if (this.tableData.indexOf(e) <= this.pageSize - 1) {
              this.ShowTableData.push(e);
              }
              e["expend_date"] = utils.getLocalTime(parseInt(e["expend_date"]));
              e["apply_date"] = utils.getLocalTime(parseInt(e["apply_date"]));
              e["url"]
            });
            this.tableHeight = utils.setClientHight(this,255,56,80)
            this.loading = false
          })
        }
        this.handleUpdateClick()
      },
      handleUpdateClick() {// 回流
        this.key += 1 
      },
    },
    computed: {
      clientHeight_watch () {
        return this.$store.state.clientHeight || Number(document.documentElement.clientHeight)
      }
    },
    watch: {
      clientHeight_watch (val) {
        var _this = this;
        _this.tableHeight = utils.setClientHight(_this,255,56,80)
      }
    },
    mounted() {
      document.addEventListener('paste', this.useCopy)
    }
  }
</script>

<style scoped>
  .image-slot{
    line-height: 58px!important;
  }
  .is-active {
    background-color: white!important;
  }
  .el-main {
    line-height: 20px!important;
  }
  .el-button--primary {
    color: rgb(41, 42, 45) !important;
    background-color: #fff !important;
    border-color: rgb(41, 42, 45) !important;
  }
  .el-button--primary:hover {
    color: white !important;
    background-color: rgb(77, 77, 77) !important;
    border-color: rgb(77, 77, 77) !important;
  }
  .el-select {
    display: block!important;
  }
  .info_btn {
    background-color: #353639!important;
    color: white!important;
    border-color: #353639!important;
  }
  .info_btn:hover {
    background-color: #4D4D4D!important;
    border-color: #4D4D4D!important;
  }
  .el-button--info.is-disabled:hover{
    color: #C0C4CC!important;
  }
  .el-button--info.is-disabled {
    border-color: #C0C4CC!important;
    color:#C0C4CC!important;
    background-color: white!important;
  }
  .el-button--primary.is-disabled {
    border-color: #DCDFE6!important;
    color:#C0C4CC!important;
    background-color: white!important;
  }
  .el-button--primary.is-disabled:hover {
    color: #C0C4CC!important;
  }
  .el-button--danger {
    background-color:white!important;
    color: #F56C6C!important;
  }
  .el-button--danger:hover {
    background-color:#F56C6C!important;
    color: white!important;
  }
  .el-button--danger.is-disabled {
    /* border-color: #C0C4CC!important; */
    border-color: #DCDFE6!important;
    color:#C0C4CC!important;
    background-color: white!important;
  }
  #delAccount:hover {
      color: rgb(245, 108, 108);
      background-color: rgb(254, 240, 240);
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 136px;
    height: 45px;
    font-size: 15px;
    line-height: 45px;
    text-align: center;
  }
  .avatar-uploader {
    width: 136px;
    height: 45px;
    margin-left: 25px;
  }
  .upload_div >>> .el-upload-dragger {
    width: 136px;
    height: 43px;
  }
  .upload_div_edit >>> .el-upload-dragger ,.upload_div_edit >>> .avatar-uploader {
    width: 230px;
    height: 73px;
  }
  .upload_div_edit >>> .avatar {
    width: 230px;
    height: 73px;
  }
  .upload_div_edit >>> .el-upload-dragger:hover ,.upload_div >>> .el-upload-dragger:hover{
    border-color: rgba(0, 0, 0, 0)!important;
  }
  .upload_div_edit >>> .el-upload-dragger ,.upload_div >>> .el-upload-dragger{
    border-color: rgba(0, 0, 0, 0)!important;
  }
  .upload_div_edit >>>  .avatar-uploader-icon {
    position: relative;
    top: 15px;
  }
  .disabled {
    background-color: rgba(0, 0, 0, 0)!important;
    color: #C0C4CC!important;
    /* border-right: 1px solid #E4E7ED;
    border-bottom: 1px solid #E4E7ED;
    border-top: 1px solid #E4E7ED; */
  }
  .disabled_div {
    cursor:not-allowed!important;
  }
  .disabled_div >>> .el-upload-dragger {
    background-color: #F5F7FA!important;
    color: red!important;
    cursor:not-allowed!important;
  }
  .disabled_div >>> .el-upload {
    border: 1px solid #E4E7ED!important;
    color: red!important;
    cursor:not-allowed!important;
  }
  .disabled_div >>> .avatar-uploader-icon {
    color: #C0C4CC!important
  }
  .disabled_btn {
    color: #C0C4CC!important
  }
</style>
