<template>
  <div>
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;min-width:1460px;;margin-top:80px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap;" :disabled="loading">
        <el-form-item class="noselect" style="margin-right: 30px">
          <el-date-picker :picker-options="pickerOptions" value-format="timestamp" style="width:300px" v-model="searchParams.date" type="daterange" range-separator="至" start-placeholder="分配时间-始" end-placeholder="分配时间-末">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right:30px">
          <el-select v-model="searchParams.account_type" placeholder="账号类型" clearable style="width:120px">
            <el-option v-for="(item,index) in chooseType" :key="index" :label="item['label']" :value="item['value']"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right:30px">
          <el-select v-model="searchParams.account_limit" placeholder="账户限额" clearable style="width:120px">
            <el-option v-for="(item,index) in chooseLimit" :key="index" :label="item['label']" :value="item['value']"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right:30px">
          <el-select v-model="searchParams.state" placeholder="状态" clearable style="width:120px">
            <el-option v-for="(item,index) in chooseStatus" :key="index" :label="item['label']" :value="item['value']"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right:30px">
          <el-select v-model="searchParams.account_user" placeholder="推广" clearable style="width:160px">
            <el-option v-for="(item,index) in chooseUser" :key="index" :label="item['label']" :value="item['value']">
              <span style="float: left">{{ item['label'] }}</span>
              <span style="float: right;color: #8492a6; font-size: 13px">{{item['value'] }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right: 30px">
          <el-input v-model="searchParams.account_name" placeholder="搜索账户名称" clearable style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item  class="noselect" style="margin-right:30px">
          <el-input v-model="searchParams.account_id" placeholder="搜索账号" clearable style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item  class="noselect" style="margin-right:30px">
          <el-input v-model="searchParams.ad_id" placeholder="搜索广告账号ID" clearable style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item  class="noselect" style="margin-right:30px">
          <el-input v-model="searchParams.card_id" placeholder="搜索信用卡号" clearable style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right: 30px">
          <el-input v-model="searchParams.pay_id" placeholder="搜索充值卡号" clearable style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item  class="noselect" style="margin-right:30px">
          <el-input v-model="searchParams.bank" placeholder="搜索BM" clearable style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right: 30px">
          <el-input v-model="searchParams.remark" placeholder="搜索备注" clearable style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item class="noselect">
          <el-button icon="el-icon-search" @click="research(1)" plain style="height: 30px; position: relative;">搜索</el-button>
        </el-form-item>
        <el-form-item class="noselect">
          <el-button class="info_btn" icon="el-icon-upload2" @click="import_form_show" type="info" style="height: 30px; position: relative;margin-left:10px;">导入</el-button>
          <el-button :disabled="this.useSearchData === true && this.searchPageChange === true ? false:true" class="info_btn" icon="el-icon-download" @click="exportExcel" type="info" style="height: 30px; position: relative;right:-10px;margin-left:10px;" >导出</el-button>
          <!-- <el-button :disabled="multipleDel" icon="el-icon-delete" @click="delItems" type="danger" style="height: 30px; position: relative;right:-10px;margin-left:10px;" >删除选中项</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table
      highlight-current-row
      :header-cell-style="{paddingTop:'10px',paddingBottom:'10px',}"
      :height="tableHeight"
      :key="key"
      stripe
      v-loading="loading"
      element-loading-background="rgba(255,255,255,0.5)"
      ref="multipleTable"
      :data="ShowTableData"
      tooltip-effect="dark"
      style="width:calc(100%-60px);line-height:30px;margin:15px 0px;min-width:1430px;margin-bottom:25px"
      :row-style="{height: '45px'}"
      border
      @selection-change="handleSelectionChange_delete">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column prop="" label="详情" width="50px" fixed="left">
        <template slot-scope="scope">
          <el-button
            type="text" icon="el-icon-arrow-right"
            size="small"
            @click="tableOpen(scope.row)"
            style="color:#909399;padding:0 0 0 9px!important"
            ></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="系统ID" width="80px">
      </el-table-column>
      <el-table-column prop="account_id" label="账号" width="300px">
      </el-table-column>
      <el-table-column prop="account_type" label="类型" width="100px">
      </el-table-column>
      <el-table-column prop="account_name" label="账户名称" width="320px">
      </el-table-column>
      <el-table-column prop="account_limit" label="限额" width="65px">
      </el-table-column>
      <el-table-column prop="come_batch" label="来号批次" width="120px">
      </el-table-column>
      <el-table-column prop="" label="推广" width="140px">
        <template slot-scope="scope">
          <div v-if="scope.row['account_user']">{{scope.row["zh_name"]}}({{scope.row["account_user"]}})</div>
          <div v-else>无</div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="200px">
      </el-table-column>
      <el-table-column prop="state" label="状态" width="80px">
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" align="center" width="130px">
        <template slot-scope="scope">
          <el-dropdown placement="bottom" trigger="click">
            <span style="cursor: pointer;" class="el-dropdown-link">
              <i style="color: grey!important;padding:0!important" class="el-icon-more"></i>
            </span>
            <el-dropdown-menu :visible-arrow="false" class="noselect" slot="dropdown">
              <el-dropdown-item @click.native="edit_form_open(scope.row)">编辑账号</el-dropdown-item>
              <el-dropdown-item id="delAccount" @click.native="remove(scope.row)">删除账号</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-tooltip content="编辑账号" placement="top" :visible-arrow="false">
            <el-button  @click="edit_form_open(scope.row)" icon="el-icon-edit" style="font-size:13px;color:grey;padding:0;margin-right:10px" type="text"></el-button>
          </el-tooltip>
          <el-tooltip content="删除账号" placement="top" :visible-arrow="false">
            <el-button  @click="remove(scope.row)" icon="el-icon-delete" style="font-size:13px;color:red;padding:0;border:none;background-color:rgba(0,0,0,0)" type="text"></el-button>
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

    <!-- 详情抽屉 -->
    <el-drawer class="noselect" title="详情" :visible.sync="table" direction="rtl" size="600px">
      <el-form ref="makeOver_form"  label-width="100px" label-position="left"  style="padding-left:70px" v-loading="tbloading">
        <el-form-item size="small" label="账号：" class="noselect">
          <p style="text-align:left;text-decoration:underline;cursor: pointer;" v-clipboard:copy="this.detail_account" v-clipboard:success="onCopy" v-clipboard:error="onError">{{this.detail_account}}</p>
        </el-form-item>
        <el-form-item size="small" label="密码：" class="noselect">
          <p style="text-align:left;text-decoration:underline;cursor: pointer;" v-clipboard:copy="this.detail_password" v-clipboard:success="onCopy" v-clipboard:error="onError">{{this.detail_password}}</p>
        </el-form-item>
        <el-form-item size="small" label="cookie：" class="noselect" style="position: relative">
          <!-- <el-button type="text" icon="el-icon-arrow-left" size="small" @click="innerDrawer = true" style="position: absolute;left:0;color:black"></el-button> -->
          <p style="text-align:left;text-decoration:underline;cursor: pointer;display:inline-block;position:absolute;left:0px" @click="innerDrawer = true">展开</p>
          <p style="text-align:left;text-decoration:underline;cursor: pointer;display:inline-block;position:absolute;left:40px" v-clipboard:copy="this.detail_cookie" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</p>
        </el-form-item>
        <el-form-item size="small" label="UA：" class="noselect" style="position: relative">
          <!-- <el-button type="text" icon="el-icon-arrow-left" size="small" @click="innerDrawer = true" style="position: absolute;left:0;color:black"></el-button> -->
          <p style="text-align:left;text-decoration:underline;cursor: pointer;display:inline-block;position:absolute;left:0px" @click="innerDrawer_ua = true">展开</p>
          <p style="text-align:left;text-decoration:underline;cursor: pointer;display:inline-block;position:absolute;left:40px" v-clipboard:copy="this.detail_ua" v-clipboard:success="onCopy" v-clipboard:error="onError">复制</p>
        </el-form-item>
        <el-form-item size="small" label="账号BM：" class="noselect">
          <p style="text-align:left;text-decoration:underline;cursor: pointer;" v-clipboard:copy="this.detail_accountbm" v-clipboard:success="onCopy" v-clipboard:error="onError">{{this.detail_accountbm}}</p>
        </el-form-item>
        <el-form-item size="small" label="账户名称" class="noselect">
          <p style="text-align:left;text-decoration:underline;cursor: pointer;" v-clipboard:copy="this.detail_accountname" v-clipboard:success="onCopy" v-clipboard:error="onError">{{this.detail_accountname}}</p>
        </el-form-item>
        <el-form-item size="small" label="广告账号ID：" class="noselect">
          <p style="text-align:left;text-decoration:underline;cursor: pointer;" v-clipboard:copy="this.detail_adid" v-clipboard:success="onCopy" v-clipboard:error="onError">{{this.detail_adid}}</p>
        </el-form-item>
        <el-form-item size="small" label="信用卡号：" class="noselect">
          <p style="text-align:left;text-decoration:underline;cursor: pointer;" v-clipboard:copy="this.detail_cardNumber" v-clipboard:success="onCopy" v-clipboard:error="onError">{{this.detail_cardNumber}}</p>
        </el-form-item>
        <el-form-item size="small" label="充值卡号：" class="noselect">
          <p style="text-align:left;text-decoration:underline;cursor: pointer;" v-clipboard:copy="this.detail_rechargeCardNumber" v-clipboard:success="onCopy" v-clipboard:error="onError">{{this.detail_rechargeCardNumber}}</p>
        </el-form-item>
        <el-form-item size="small" label="来号日期：" class="noselect">
          <p style="text-align:left">{{this.detail_ComeDate}}</p>
        </el-form-item>
        <el-form-item size="small" label="登陆IP：" class="noselect">
          <p style="text-align:left">{{this.detail_ip}}</p>
        </el-form-item>
        <el-form-item size="small" label="上传时间：" class="noselect">
          <p style="text-align:left">{{this.detail_uploaddate}}</p>
        </el-form-item>
        <el-form-item size="small" label="更新时间：" class="noselect">
          <p style="text-align:left">{{this.detail_updatedate}}</p>
        </el-form-item>
        <el-form-item size="small" label="日志记录：" class="noselect">
          <template>
            <p v-for="(item,index) in this.detail_Logging" :key="index" style="text-align:left;color:red">{{item}}</p>
          </template>
        </el-form-item>
      </el-form>
      <!-- 嵌套抽屉 -->
      <div>
        <el-drawer
          title="cookie"
          :append-to-body="true"
          :visible.sync="innerDrawer"
          class="noselect"
          size="500px">
          <div style="word-wrap:break-word;padding: 0 20px 0 20px;text-decoration:underline;line-height: 20px;cursor: pointer;" v-clipboard:copy="this.detail_cookie" v-clipboard:success="onCopy" v-clipboard:error="onError">{{this.detail_cookie}}</div>
        </el-drawer>
      </div>
      <div>
        <el-drawer
          title="UA"
          :append-to-body="true"
          :visible.sync="innerDrawer_ua"
          class="noselect"
          size="500px">
          <div style="word-wrap:break-word;padding: 0 20px 0 20px;text-decoration:underline;line-height: 20px;cursor: pointer;" v-clipboard:copy="this.detail_ua" v-clipboard:success="onCopy" v-clipboard:error="onError">{{this.detail_ua}}</div>
        </el-drawer>
      </div>
    </el-drawer>

    <!-- 重复项目详情抽屉 -->
    <!-- <el-drawer :wrapperClosable="false" class="noselect" title="以下项目导入失败(重复项)" :visible.sync="repeat_table" direction="rtl" size="600px">
      <el-form ref="makeOver_form" label-width="100px" label-position="left" style="padding-left:70px;min-height:500px">
        <el-form-item size="small" label="广告账号ID: " class="noselect">
          <p style="text-align:left;text-decoration:underline;cursor: pointer;" v-for="item in repeat_table_data" :key="item" :label="item" :value="item" v-clipboard:copy="item" v-clipboard:success="onCopy" v-clipboard:error="onError">{{item}}</p>
        </el-form-item>
      </el-form>
    </el-drawer> -->

    <!-- 重复项目 -->
    <el-dialog title="账号导入" :visible.sync="repeat_table" width="400px" :close-on-click-modal="false">
      <div style="width: 100%;height: 30px;line-height: 30px;background-color: #fdf6ec;border-radius: 3px;color: #E6A23C;margin-bottom:10px;position:relative;top:-20px;">存在重复项目</div>
      <el-table :max-height="300" :data="repeat_table_data" style="position: relative;top:-20px;">
        <el-table-column property="adId" label="广告ID"></el-table-column>
        <el-table-column label="执行状态">
            <p class="el-icon-circle-close" style="color:rgb(245, 108, 108);" type="text"></p>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 编辑表单 -->
    <el-dialog :close-on-click-modal="false" title="编辑" :visible.sync="edit_form_dialogVisible" width="800px">
      <el-form v-loading="edit_form_loading"  :rules="rules" ref="edit_form" :model="edit_form" label-width="100px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item  label="账号类型" class="noselect" style="margin-right:40px" prop="account_type">
              <el-select v-model="edit_form.account_type" placeholder="筛选">
                <el-option v-for="(item,index) in chooseType" :key="index" :label="item['label']" :value="item['value']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="密码" class="noselect" style="margin-right:40px">
              <el-input v-model="edit_form.pass">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  label="登陆地区" class="noselect" style="margin-right:40px">
              <el-input v-model="edit_form.login_ip" placeholder="筛选">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="账户名称" class="noselect" style="margin-right:40px">
              <el-input v-model="edit_form.account_name"  style="position: absolute;left: 0"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  label="限额" class="noselect" style="margin-right:40px">
              <el-select v-model="edit_form.account_limit" placeholder="筛选">
                <el-option v-for="(item,index) in chooseLimit" :key="index" :label="item['label']" :value="item['value']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="广告账号ID" class="noselect" style="margin-right:40px">
              <el-input v-model="edit_form.ad_id"  style="position: absolute;left: 0"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  label="BM" class="noselect" style="margin-right:40px">
              <el-input v-model="edit_form.bank"  style="position: absolute;left: 0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="充值卡号" class="noselect" style="margin-right:40px">
              <el-input v-model="edit_form.pay_id"  style="position: absolute;left: 0"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  label="信用卡号" class="noselect" style="margin-right:40px">
              <el-input v-model="edit_form.card_id"  style="position: absolute;left: 0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="来号日期" class="noselect" style="margin-right:40px">
              <el-input v-model="edit_form.come_date"  style="position: absolute;left: 0"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  label="来号批次" class="noselect" style="margin-right:40px">
              <el-input v-model="edit_form.come_batch"  style="position: absolute;left: 0"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="备注" class="noselect" style="margin-right:40px">
              <el-input v-model="edit_form.remark"  style="position: absolute;left: 0"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  label="状态" class="noselect" style="margin-right:40px" prop="state">
              <el-select v-model="edit_form.state" placeholder="筛选">
                <el-option v-for="(item,index) in chooseStatus" :key="index" :label="item['label']" :value="item['value']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  label="cookie" class="noselect" style="margin-right:40px" prop="cookie">
              <el-input type="textarea" v-model="edit_form.cookie" >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="small" type="primary" @click="submitForm('edit_form')" class="formSubmitBtn" style="margin-right: -620px;">确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 导入表单 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="import_form_dialogVisible" width="500px" >
      <el-upload 
        drag
        v-loading="loading_import"
        style="margin-bottom: 25px;"
        :limit=limitNum
        :auto-upload="false" 
        accept=".xlsx"
        action="#"
        :before-upload="beforeUploadFile"
        :on-change="fileChange"
        :on-exceed="exceedFile"
        :on-remove="handleRemove"
        :file-list="fileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em style="color: #409EFF;">点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xlsx文件</div>
      </el-upload>
      <el-button :disabled="loading_import" size="small" type="primary" @click="uploadFile">立即上传</el-button>
    </el-dialog>
  </div>
</template>

<script>
import utils from '../utils'
import { export_json_to_excel } from '../Export2Excel.js'
  export default {
    data() {
      return {
        pickerOptions: {
          disabledDate(v) {
            return v.getTime() >= new Date().getTime();
          }
        },
        innerDrawer_ua:false,
        multipleDel:true,
        repeat_table:false,
        repeat_table_data:null,
        tableHeight:620,
        loading_import:false,
        key:0,
        import_form_dialogVisible: false,//导入表单显示
        limitNum: 1,  // 上传excell时，同时允许上传的最大数
        fileList: [],   // excel文件列表
        // 导出表单
        export_form: {
          selected: null
        },
        //编辑表单
        edit_form: {},
        // 编辑表单的显示
        edit_form_dialogVisible: false,
        edit_form_loading:false,
        //停用表单的数据
        deactivate_form: {
          deactivate_id : null,
          deactivate_accountname: null,
        },
        // 详情抽屉
        detail_account:null,// 临时数据 懒得造
        detail_password:null,
        detail_cookie:null,
        detail_ua:null,
        detail_accountbm:null,
        detail_accountname:null,
        detail_adid: null,
        detail_cardNumber:null,
        detail_rechargeCardNumber: null,
        detail_ComeDate:null,
        detail_ip:null,
        detail_uploaddate:null,
        detail_updatedate: null,
        detail_Logging:null,
        table: false,
        innerDrawer: false,
        tbloading:false,
        // 加载界面显示与否
        loading: false,
        // 展示数据
        ShowTableData: [],
        ShowTableData_Highquota: null,
        // 原始数据
        tableData: null,
        // 搜索账号类型选项
        chooseType: [],
        chooseLimit: [],
        chooseStatus:[],
        chooseUser:[],
        // 搜索输入框记录
        searchParams: {
          account_id: null,
          account_limit: null,
          account_name: null,
          account_type: null,
          account_user: null,
          ad_id: null,
          bank: null,
          card_id: null,
          pay_id: null,
          remark: null,
          state: null,
          date:null
        },
        //校验规则
        rules: {
          // 申请账号校验规则
          account_type: [
            { required: true, message: '请选择账户类型', trigger: 'change' }
          ],
          state: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          cookie: [
            { required: true, message: '请输入cookie', trigger: 'blur' }
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
      this.fetch()
      this.fetchOption()
      this.getUid()
    },

    methods: {
      import_form_show() {
        this.import_form_dialogVisible = true
        this.fileList = []
      },
      delItems() {
        var data = []
        this.delList.forEach(e => {
          data.push(e["id"])
        });
        let formData = new FormData()
        formData.append('data',JSON.stringify(data))
      },
      //  -----------------------------------------------------------
      // 导出数据为表格
      exportExcel() {
      for (const key in this.searchParams) {//去除无效属性
        if (this.searchParams[key] === null || this.searchParams[key] === '') {
          delete this.searchParams[key]
        }
      }
      if (Object.keys(this.searchParams).length === 0) {
        this.$message.warning('请在筛选后再导出账号')
      } else {
        if (this.totalNum > 20000) {
          this.$message.warning('数据量超过2W,不予导出')
        } else {
          var arr = []
          for (const key in this.searchParams) {
            arr.push(`${key}:${this.searchParams[key]}`)
          }
          this.$confirm(`是否导出符合搜索条件的所有账号`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
          .then(async () => {
            this.loading = true
            var arr = []
            var standBy_downLoad = utils.deepClone(this.standBy_search)
            standBy_downLoad['num'] = 10000
            let formData = new FormData()
            var num = Math.ceil(this.totalNum/10000)
            for (let i = 0; i < num; i++) {
              standBy_downLoad['page'] = i+1
              formData.append('data',JSON.stringify(standBy_downLoad))
              await this.$http.post('/index.php/index/account/exportAccount/',formData).then((res)=> {
                arr = arr.concat(res.data["data"])
              })
            }
          var tHeader = ['账号类型','账号','账户名称','密码','cookie','广告账号ID','账号所在BM','信用卡号','登录ip地区','来号日期','来号批次','备注','状态','分号日期','分配的推广人','添加时间','修改时间','拒绝回收理由','账号限额','回收理由','部门']
          var filterVal = ['account_type','account_id','account_name','pass','cookie','ad_id','bank','card_id','login_ip','come_date','come_batch','remark','state','allot_time','zh_name','create_time','update_time','refuse_reason','account_limit','apply_reason','部门']
          var time = this.getCurentTime()
          var filename = `${time}`
          var data = this.formatJson(filterVal, arr)
          export_json_to_excel({
            header: tHeader,
            data,
            filename
          })
          this.loading = false
          }).catch((err)=> {
            // /
          })
        }
      }
    },
      formatJson(filterVal, delList) {
        return delList.map(v => {
          return filterVal.map(j => {
              return v[j]
            })
          }
        )
      },
      //获取当前时间，格式YYYY-MM-DD
      getNowFormatDate() {
          var date = new Date();
          var seperator1 = "-";
          var year = date.getFullYear();
          var month = date.getMonth() + 1;
          var strDate = date.getDate();
          if (month >= 1 && month <= 9) {
            month = "0" + month;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          var currentdate = year + seperator1 + month + seperator1 + strDate;
          return currentdate;
      },
      getCurentTime(isTime=true) {
        var now = new Date();
        var clock = "";
        var year = now.getFullYear();
        clock += year + "-";
        var month = now.getMonth() + 1;
        if (month < 10) {
          clock += "0";
        }
        clock += month + "-";
        var day = now.getDate();
        if (day < 10) {
          clock += "0";
        }
        if (isTime == true) {
          clock += day + " ";
          var hh = now.getHours();
          if (hh < 10) {
            clock += "0";
          }
          clock += hh + "-";
          var mm = now.getMinutes();
          if (mm < 10) {
              clock += '0';
          }
          clock += mm + "-";
          var ss = now.getSeconds();
          if (ss < 10) {
            clock += '0';
          }
          clock += ss;
        }
        if (isTime == false) {
          clock += day;
        }
        return clock;
    },
      // -----------------------------------------------------------
      async handleSizeChange(val) {// 页大小
      if (this.searchPageChange === false && this.useSearchData === false) {
        this.loading = true;
          let formData = new FormData()
          formData.append("page",1)
          formData.append("num",val)
          await this.$http.post("/index.php/index/account/accountList/",formData).then((res) => {
            res.data["data"].forEach(e=> {
              if (e["log"].indexOf(',') === -1) {
                e["showLog"] = [e["log"]]
              } else {
                e["showLog"] = e["log"].split(',')
              }
            })
            this.tableData = res.data["data"];  
            this.totalNum = res.data["sum"]
            this.ShowTableData = this.tableData;
            this.currentPage = 1
            this.pageSize = val
            this.tableHeight = utils.setClientHight(this,314,52,45)
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
          await this.$http.post("/index.php/index/account/accountList/",formData).then((res) => {
            res.data["data"].forEach(e=> {
              if (e["log"].indexOf(',') === -1) {
                e["showLog"] = [e["log"]]
              } else {
                e["showLog"] = e["log"].split(',')
              }
            })
            this.tableData = res.data["data"];  
            this.totalNum = res.data["sum"]
            this.ShowTableData = this.tableData;
            this.tableHeight = utils.setClientHight(this,314,52,45)
            this.loading = false;
          });
          this.handleUpdateClick()
        } else {
          this.search(val)
        }
      },
      async fetch() {// 数据获取
        this.loading = true
        let formData = new FormData()
        formData.append("page",1)
        formData.append("num",this.pageSize)
        await this.$http.post("/index.php/index/account/accountList/",formData).then((res) => {
          res.data["data"].forEach(e=> {
            if (e["log"].indexOf(',') === -1) {
              e["showLog"] = [e["log"]]
            } else {
              e["showLog"] = e["log"].split(',')
            }
          })
          this.useSearchData = false
          this.searchPageChange = false
          this.tableData = res.data["data"];
          this.totalNum = res.data["sum"]
          this.ShowTableData = this.tableData;
          this.tableHeight = utils.setClientHight(this,314,52,45)
          this.loading = false;
        });
      },
      handleSelectionChange_delete(val) {// 批量选中
        this.multipleDel = false
        this.delList = val
        this.multipleSelection_delete = val;
        if (this.multipleSelection_delete.length == 0) {
          // 如不进行判断则勾选完毕后批量删除按钮还是会在
          this.multipleDel = true
        }
      },
      getUid() { // 获取用户uid
        this.uid = localStorage.getItem("uid")
        this.zh_name = localStorage.getItem("zh_name")
      },
      handleRemove() {
        this.fileList = []
      },
      exceedFile(files, fileList) {// 文件超出个数限制时的钩子
        this.$message.warning(`只能选择 ${this.limitNum} 个文件，当前共选择了 ${fileList.length} 个`);
      },
      fileChange(file, fileList) {// 文件状态改变时的钩子
        this.fileList.push(file.raw) ;
      },
      beforeUploadFile(file) {// 上传文件之前的钩子
        let extension = file.name.substring(file.name.lastIndexOf('.')+1);
        let size = file.size / 1024 / 1024;
        if(extension !== 'xlsx') {
          this.$message.warning('只能上传后缀是.xlsx的文件');
        }
      },
      async uploadFile() {
        if (this.fileList.length === 0){
          this.$message.warning('请上传文件');
        } else {
          this.loading_import = true
          let formData = new FormData();
          formData.append('file',this.fileList[0]);
          formData.append('user',this.uid)
          try {
            await this.$http.post('/index.php/index/account/dataImport/',formData,{ headers: { "Content-Type": "multipart/form-data" } }).then((res) =>{
            this.repeat_table_data = []
            if (res.data["code"] === 200 && res.data["data"].length === 0) {
              this.$message.success('所有数据导入成功')
              this.import_form_dialogVisible = false
              this.fetch()
            } else if (res.data["code"] === 200 && res.data["data"] != []) {
              this.repeat_table = true
              res.data["data"].forEach(e=> {
                this.repeat_table_data.push({"adId":e})
              })
              this.import_form_dialogVisible = false
              this.fetch()
            }
            this.loading_import = false
          })
          } catch (error) {
            this.loading_import = false
            this.$message.error('导入失败，请检查格式及表格数据')
          }
        }
      },
      async edit_form_open(e) {
        this.edit_form_dialogVisible = true
        if (e["cookie"]) {
          this.edit_form = utils.deepClone(e)
        } else {
          this.edit_form_loading = true
          let formData = new FormData()
          formData.append('id',e.id)
          await this.$http.post('/index.php/index/account/cookieAccount/',formData).then((res) => {
            e["cookie"] = res.data["data"]
            this.edit_form = utils.deepClone(e)
            this.edit_form_loading = false
          })
        }

      },
      onCopy(e){
        this.$message({
          message:'复制成功！',
          type:'success'
        })
      },
      
      onError(e){
        this.$message({
          message:'复制失败！',
          type:'error'
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.edit_form_submit()
          } else {
            return false;
          }
        });
      },
      async edit_form_submit() {
        this.edit_form["zh_name"] = this.zh_name
        let formData = new FormData()
        formData.append('data',JSON.stringify(this.edit_form))
        await this.$http.post('/index.php/index/account/saveAccount/',formData).then((res) => {
          if (res.data["code"] === 200) {
            this.fetchPageData(this.currentPage)
            this.edit_form_dialogVisible = false
            this.$message.success(`${res.data["data"]}`)
          } else {
            this.$message.onError(`${res.data["data"]}`)
          }
        })
      },
      async tableOpen(e) {
        this.table = true
        if (e["cookie"]) {
          this.detail_cookie = e["cookie"]
        } else {
            this.tbloading = true
            let formData = new FormData()
            formData.append('id',e.id)
            await this.$http.post('/index.php/index/account/cookieAccount/',formData).then((res) => {
            this.detail_cookie = res.data["data"]
            e["cookie"] = res.data["data"]
            this.tbloading = false
          })
        }
        this.detail_uploaddate = utils.getLocalTime(parseInt(e["create_time"]));
        this.detail_updatedate = utils.getLocalTime(parseInt(e["update_time"]));
        this.detail_ua = e.ua
        this.detail_account = e.account_id
        this.detail_password = e.pass
        this.detail_accountbm = e.bank
        this.detail_accountname = e.account_name,
        this.detail_adid = e.ad_id,
        this.detail_cardNumber = e.card_id,
        this.detail_rechargeCardNumber = e.pay_id,
        this.detail_ComeDate = e.come_date,
        this.detail_ip = e.login_ip,
        this.detail_Logging = e.showLog
      },
      async fetchOption() {
        await this.$http.get('/index.php/index/account/editAccount/').then((res) => {
          res.data["limit"].forEach(e=> {
            this.chooseLimit.push({"label":e,"value":e})
          })
          res.data["type"].forEach(e=> {
            this.chooseType.push({"label":e,"value":e})
          })
          res.data["state"].forEach(e=> {
            this.chooseStatus.push({"label":e,"value":e})
          })
          for (const k in res.data["account_user"]) {
            this.chooseUser.push({"label":`${res.data['account_user'][k]}`,"value":k})
          }
        })
      },
      research(val) {
        this.searchPageChange = false
        this.useSearchData = false
        this.search(val)
      },
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
          let formData = new FormData()
          formData.append('data',JSON.stringify(this.searchParams))
          await this.$http.post('/index.php/index/account/searchAccount/',formData).then((res) => {
            res.data["data"].forEach(e=> {
              if (e["log"].indexOf(',') === -1) {
                e["showLog"] = [e["log"]]
              } else {
                e["showLog"] = e["log"].split(',')
              }
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
            });
            this.currentPage = 1
            this.tableHeight = utils.setClientHight(this,314,52,45)
            this.loading = false
          })
        }
        // 搜索后换页/页大小
        else if(this.searchPageChange === true && this.useSearchData === true){
          this.standBy_search["page"] = val
          this.standBy_search["num"] = this.pageSize
          let formData = new FormData()
          formData.append('data',JSON.stringify(this.standBy_search))
          await this.$http.post('/index.php/index/account/searchAccount/',formData).then((res) => {
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
              if (e["log"].indexOf(',') === -1) {
                e["showLog"] = [e["log"]]
              } else {
                e["showLog"] = e["log"].split(',')
              }
            });
            this.tableHeight = utils.setClientHight(this,314,52,45)
            this.loading = false
          })
        }
        this.handleUpdateClick()
      },
      async remove(e) {// 移除单项
        this.$confirm(`是否删除 ${e.account_id}`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
      .then(async () => {
        this.loading = true
        let formData = new FormData()
        formData.append("delete",e.id)
        await this.$http.post("/index.php/index/account/deleteAccount/",formData).then((res) => {
          if (res.data["code"] === 200) {
            this.fetchPageData(this.currentPage)
            // this.totalNum = this.totalNum - 1
            this.$message.success(`${res.data["data"]}`)
          } else {
            this.$message.error(`${res.data["data"]}`)
          }
        })
      }).catch((err)=> {
        // /
      })
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
        _this.tableHeight = utils.setClientHight(_this,314,52,45)
      }
    },
  }
</script>

<style scoped>
  .is-active {
    background-color: white!important;
  }
  /* .el-select-dropdown__item.selected {
  color: rgb(41, 42, 45) !important;
      font-weight: 700;
  } */
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
  .el-button--primary.is-disabled {
    border-color: #DCDFE6!important;
    color:#C0C4CC!important;
    background-color: white!important;
  }
  .el-button--info.is-disabled {
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
</style>
