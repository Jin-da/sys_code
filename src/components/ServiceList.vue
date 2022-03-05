<template>
  <div >
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;min-width:1025px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap;width:100%;justify-content: space-between" :disabled="loading">
        <el-form-item class="noselect">
          <el-input v-model="searchParams.accurateSearch" placeholder="搜索客服名称" clearable style="width: 200px;margin-right:10px"></el-input>
          <el-button icon="el-icon-search" type="info" @click="search" plain style="height: 30px; position: relative; margin-top: 32px" >搜索</el-button>
        </el-form-item>
        <el-form-item class="noselect">
          <el-button icon="el-icon-upload2" v-if="this.authority['createservice']" class="info_btn" @click="import_form_dialogVisible = true" type="info" style="height: 30px; position: relative; margin-top: 32px">Excel 导入</el-button>
          <el-button class="info_btn iconfont icon-chuangjianren" v-if="this.authority['createservice']" @click="new_service_dialogVisible = true" type="info" style="font-size:12px;height: 30px; position: relative; margin-top: 32px"> 创建客服</el-button>
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
      style="width:calc(100%-60px);line-height:30px;margin:10px 0 25px 0;min-width:1025px;"
      border>
      <el-table-column prop="project" label="项目" width="100px"></el-table-column>
      <el-table-column prop="type" label="类型" width="100px"></el-table-column>
      <el-table-column prop="customer_service" label="客服名称" width="250px"></el-table-column>
      <el-table-column label="WeChat" min-width="150px">
        <template slot-scope="scope">
          <span v-if="scope.row.wechat != null">{{scope.row.wechat}}</span>
          <span v-else>/</span>
        </template>
      </el-table-column>
      <el-table-column label="Line" min-width="150px">
        <template slot-scope="scope">
          <span v-if="scope.row.line != null">{{scope.row.line}}</span>
          <span v-else>/</span>
        </template>
      </el-table-column>
      <el-table-column prop="line_link" label="Line-Link" min-width="300px"></el-table-column>
      <!-- <el-table-column  v-if="this.authority['editservice']" fixed="right" label="操作" align="center" width="130px">
        <template slot-scope="scope">
          <el-dropdown placement="bottom" trigger="click">
            <span style="cursor: pointer;" class="el-dropdown-link">
              <i style="color: grey!important" class="el-icon-more"></i>
            </span>
            <el-dropdown-menu :visible-arrow="false" class="noselect" slot="dropdown">
              <el-dropdown-item @click.native="edit_service(scope.row)">编辑客服</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
      <el-table-column v-if="this.authority['editservice']" fixed="right" label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-tooltip content="编辑客服" placement="top" :visible-arrow="false">
            <el-button @click="edit_service(scope.row)" icon="el-icon-edit" style="font-size:13px;color:grey;padding:0" type="text"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block" style="position: relative; right: 0px;min-width:1025px;margin-bottom:20px" v-if="!loading">
      <el-pagination :page-size="20" background @current-change="fetchPageData()" :current-page.sync="currentPage" layout="total,prev, pager, next" :total="totalNum" :disabled="loading">
      </el-pagination>
    </div>

    <!-- 创建客服表单 -->
    <el-dialog title="创建客服" :visible.sync="new_service_dialogVisible" width="400px" :close-on-click-modal="false" @close='closeDialog_new'>
      <el-form :rules="rules" ref="new_service_dialog_params" :model="new_service_dialog_params" label-width="100px" label-position="right" v-loading="new_loading">
        <el-form-item label="项目" class="noselect" style="margin-right: 40px" prop="project">
          <el-select v-model="new_service_dialog_params.project" placeholder="请选择">
            <el-option
              v-for="item in [{label:'减肥',value:'jf'},{label:'丰胸',value:'fx'},{label:'白发',value:'bf'},{label:'痔疮',value:'zc'},{label:'男性',value:'zy'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" class="noselect" style="margin-right: 40px" prop="type">
          <el-select v-model="new_service_dialog_params.type" placeholder="请选择">
            <el-option
              v-for="item in [{label:'双号',value:'vl'},{label:'单微',value:'v'},{label:'单Line',value:'l'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客服名称" class="noselect" style="margin-right:40px" prop="customer_service">
          <el-input v-model="new_service_dialog_params.customer_service" placeholder="请输入客服名称" style="width:220px">
          </el-input>
        </el-form-item>
        <el-form-item label="WeChat" class="noselect" style="margin-right:40px">
          <el-input v-model="new_service_dialog_params.wechat" placeholder="请输入微信号" style="width:220px">
          </el-input>
        </el-form-item>
        <el-form-item label="Line" class="noselect" style="margin-right:40px">
          <el-input v-model="new_service_dialog_params.line" placeholder="请输入Line号" style="width:220px">
          </el-input>
        </el-form-item>
        <el-form-item label="Line-Link" class="noselect" style="margin-right:40px" prop="line_link">
          <el-input v-model="new_service_dialog_params.line_link" placeholder="请输入Line-Link" style="width:220px">
            </el-input>
        </el-form-item>
        <el-button @click="submitForm('new_service_dialog_params')" size="small" type="primary" class="formSubmitBtn" style="margin-right: -220px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 编辑客服表单 -->
    <el-dialog title="编辑客服" :visible.sync="edit_service_dialogVisible" width="400px" :close-on-click-modal="false" @close='closeDialog_edit'>
      <el-form :rules="rules" ref="edit_service_dialog_params" :model="edit_service_dialog_params" label-width="100px" label-position="right" v-loading="edit_loading">
        <el-form-item label="项目" class="noselect" style="margin-right: 40px" prop="project">
          <el-select v-model="edit_service_dialog_params.project" placeholder="请选择">
            <el-option
              v-for="item in [{label:'减肥',value:'jf'},{label:'丰胸',value:'fx'},{label:'白发',value:'bf'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" class="noselect" style="margin-right: 40px" prop="type">
          <el-select v-model="edit_service_dialog_params.type" placeholder="请选择">
            <el-option
              v-for="item in [{label:'双号',value:'vl'},{label:'单微',value:'v'},{label:'单Line',value:'l'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客服名称" class="noselect" style="margin-right:40px" prop="customer_service">
          <el-input v-model="edit_service_dialog_params.customer_service" placeholder="请输入客服名称" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="WeChat" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.wechat" placeholder="请输入微信号" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="Line" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.line" placeholder="请输入Line号" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="Line-Link" class="noselect" style="margin-right:40px" prop="line_link">
          <el-input v-model="edit_service_dialog_params.line_link" placeholder="请输入Line-Link" style="width:220px">
            </el-input>
        </el-form-item>
        <el-button @click="submitForm('edit_service_dialog_params')" size="small" type="primary" class="formSubmitBtn" style="margin-right: -220px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- excel导入 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="import_form_dialogVisible" width="800px" >
      <el-upload
        v-loading="loading_import"
        drag
        style="margin-bottom: 25px;"
        :limit=limitNum
        :auto-upload="false" 
        accept=".xlsx"
        action="#"
        :before-upload="beforeUploadFile"
        :on-change="handleUpload"
        :on-remove="handleRemove"
        :file-list="fileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em style="color: #409EFF;">点击上传</em></div>
        <div class="el-upload__tip" slot="tip">所需字段：地區 / line@鏈接 / ID / 项目</div>
      </el-upload>
      <el-button :disabled="loading_import || this.ShowTableData_excel.length === 0" size="small" type="primary" @click="excelImport">立即上传</el-button>
          <!-- 表格 -->
    <el-table
      stripe
      :data="ShowTableData_excel"
      tooltip-effect="dark"
      style="width:700px;line-height:30px;margin:25px 30px;"
      :row-style="{height: '50px'}"
      border>
      <el-table-column prop="project" label="项目" width="50px">
      </el-table-column>
      <el-table-column prop="type" label="类型" width="50px">
      </el-table-column>
      <el-table-column prop="customer_service" label="客服名称" width="100px">
      </el-table-column>
      <el-table-column prop="wechat" label="WeChat" width="100px">
      </el-table-column>
      <el-table-column prop="line" label="Line" width="100px">
      </el-table-column>
      <el-table-column prop="line_link" label="line_link">
      </el-table-column>
    </el-table>

    </el-dialog>
  </div>
</template>

<script>
import { readExcel } from "../importExcel";
import crypto from '../crypto.js'
import utils from '../utils'
export default {
  data() {
    return {
      // excel
      loading_import:false,
      fileList: [],
      limitNum: 1,
      import_form_dialogVisible: false,
      ShowTableData_excel:[],
      // authority
      authority:{},
      //校验规则
      rules: {
        // 申请账号校验规则
        wechat: [
          { required: true, message: '微信号必填', trigger: 'blur' }
        ],
        customer_service: [
          { required: true, message: '客服名称必填', trigger: 'blur' }
        ],
        line: [
          { required: true, message: 'Line号必填', trigger: 'blur' }
        ],
        line_link: [
          { required: true, message: 'Line-Link必填', trigger: 'blur' }
        ],
        project: [
          { required: true, message: '项目必选', trigger: 'change' }
        ],
        type: [
          { required: true, message: '类型必选', trigger: 'change' }
        ],
      },
      distribution_loading:false,
      key: 0,
      //multipleSelectionFlag_delete: true, // 删除按钮出现与否
      multipleSelection_delete: "", // 批量选中项
      // 加载界面显示与否
      loading: true,
      loadingDetail:false,
      // 过滤后数据
      ShowTableData: [],
      // 原始数据
      tableData: [],
      //搜索记录
      searchParams: {
        accurateSearch: '',
      },
      // 详情抽屉
      table: false,
      // 分页
      totalNum: 10,
      currentPage: 1,
      useSearchData: false,
      //详情
      detail_subDomain: [],
      //域名库存
      domainStock:null,
      // 统计
      statistics: {},
      // 域名分配表单
      domainDistribution_dialogVisible:false,
      domainDistribution_dialog: {
        uid: null,
        domain_name:null,
      },
      new_service_dialogVisible:false,
      new_loading:false,
      new_service_dialog_params:{
        project:null,
        type:null,
        customer_service:null,
        wechat:null,
        line:null,
        line_link:'https://',
      },
      edit_service_dialogVisible:false,
      edit_loading:false,
      edit_service_dialog_params:{},
      tableHeight:620
    };
  },

  created() {
    this.fetch();
    this.fetchTotal()
    this.getAuthority()
  },

  methods: {
    // excel导入
    excelImport() {
      var resArr = []
      this.loading_import = true
      this.ShowTableData_excel.forEach(async e=> {
        let formData = new FormData()
        var data = JSON.stringify(e)
        formData.append('data',data)
        await this.$http.post('/index.php/index/Services/addServices/',formData).then((res) => {
          resArr.push(res.data["code"])
          if (resArr.length === this.ShowTableData_excel.length) {
            this.loading_import = false
            this.import_form_dialogVisible = false
            if (resArr.indexOf(500) === -1) {
              this.$message.success('Excel导入成功')
            } else {
              this.$message.warning('存在操作失败项目')
            }
            this.fileList = [];
            this.ShowTableData_excel = []
            this.fetch()
          }
        })
      })
    },

    handleUpload(file, fileList) {
      var excelJson = readExcel(file);
      setTimeout(() => {
        // console.log(excelJson[0]["sheet"]);
        excelJson[0]["sheet"].forEach(e => {
          var obj = {}
          obj["line_link"] = e["line@鏈接"]
          obj["project"] = e["项目"]
          if (obj["project"] === 'FX') {
            obj["project"] = 'fx'
          } else if (obj["project"] === 'JF') {
            obj["project"] = 'jf'
          } else if (obj["project"] === 'BF') {
            obj["project"] = 'bf'
          }
          if (e["地區"] === '单号-line' || e["地區"] === 'line') {
            obj["line"] = e["ID"]
            obj["wechat"] = null
            obj["type"] = 'l'
            obj["customer_service"] = `赖_${e["ID"]}`
          } else if (e["地區"] === '单号-微信' || e["地區"] === '微信') {
            obj["wechat"] = e["ID"]
            obj["line"] = null
            obj["type"] = 'v'
            obj["customer_service"] = `微_${e["ID"]}`
          } else if(e["地區"] === '双号-line和微信') {
            obj["wechat"] = e["ID"]
            obj["line"] = e["ID"]
            obj["type"] = 'vl'
            obj["customer_service"] = `双_${e["ID"]}`
          }
          this.ShowTableData_excel.push(obj)
        })
      },100);
      // console.log(this.ShowTableData_excel);
    },
    beforeUploadFile(file) {// 上传文件之前的钩子
      let extension = file.name.substring(file.name.lastIndexOf('.')+1);
      let size = file.size / 1024 / 1024;
      if(extension !== 'xlsx') {
        this.$message.warning('只能上传后缀是.xlsx的文件');
      }
    },
    // 移除excel表
    handleRemove(file, fileList) {
      this.fileList = [];
      this.ShowTableData_excel = []
    },
    // 
    getAuthority() {
      crypto.cryptoDecrypt_string(localStorage.getItem('authority')).split(',').forEach(e=> {
        this.authority[e] = true
      })
    },
    submitForm(formName) {//表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'new_service_dialog_params') {
            this.new_user_dialog_submit()
          } else {
            this.edit_user_dialog_submit()
          }
        } else {
          return false;
        }
      });
    },
    async fetchPageData() {// 点击页码
      this.loading = true;
      if (this.useSearchData === false) {
        let formData = new FormData();
        formData.append("num", this.currentPage);
        await this.$http.post("/index.php/index/Services/servicesList/",formData).then((res) => {
          this.tableData = res.data["data"];
          this.ShowTableData = this.tableData;
          this.loading = false;
        });
      } else {
          this.ShowTableData = [];
          this.tableData.forEach((e) => {
            if (
              this.tableData.indexOf(e) <= (this.currentPage - 1) * 20 + 19 &&
              this.tableData.indexOf(e) >= (this.currentPage - 1) * 20
            ) {
              this.ShowTableData.push(e);
            }
          });
          this.loading = false;
        }
      this.tableHeight = utils.setClientHight(this,250,56,44)
    },
    async search() {// 搜索
      this.loading = true;
      this.useSearchData = true;
      this.currentPage = 1;
      let formData = new FormData();
      formData.append("str",this.searchParams.accurateSearch)
      if (this.searchParams.accurateSearch === null || this.searchParams.accurateSearch === '') {
        this.useSearchData = false;
        this.fetch()
        this.fetchTotal()
      } else {
          await this.$http.post("/index.php/index/Services/search/",formData).then((res) => {
          this.tableData = res.data["data"]
          this.totalNum = res.data["data"].length
          this.ShowTableData =[]
          if (res.data["data"].length <=20) {
            for (let i = 0; i < res.data["data"].length; i++) {
              this.ShowTableData.push(res.data["data"][i])
            }
          } else {
              for (let i = 0; i < 20; i++) {
                this.ShowTableData.push(res.data["data"][i])
              }
          }
          this.loading = false;
        });
      }
      this.tableHeight = utils.setClientHight(this,250,56,44)
    },
    onCopy() {// 复制成功
      this.$message.success('复制成功')
    },
    onError() {// 复制失败
      this.$message.error('复制失败')
    },
    async fetch() {// 数据获取
      this.loading = true
      let formData = new FormData()
      formData.append("num",1)
      await this.$http.post("/index.php/index/Services/servicesList/",formData).then((res) => {
        this.tableData = res.data["data"];
        this.ShowTableData = this.tableData;
        this.tableHeight = utils.setClientHight(this,250,56,44)
        this.loading = false;
      });
    },
    async fetchTotal() {//总数获取
      await this.$http.get('/index.php/index/Services/servicesSum/').then((res) => {
        this.totalNum = res.data;
      })
    },
    closeDialog_new() {// 关闭dialog时清空验证
      this.$nextTick(() => {
          this.$refs['new_service_dialog_params'].clearValidate()
      })
    },
    closeDialog_edit() {
      this.$nextTick(() => {
        this.$refs['edit_service_dialog_params'].clearValidate()
      })
    },
    async new_user_dialog_submit() {// 新建提交
      if (this.new_service_dialog_params["line"] === '') {
        this.new_service_dialog_params["line"] = null
      }
      if (this.new_service_dialog_params["wechat"] === '') {
        this.new_service_dialog_params["wechat"] = null
      }
      this.new_loading = true
      let formData = new FormData()
      var data = JSON.stringify(this.new_service_dialog_params)
      formData.append('data',data)
      await this.$http.post('/index.php/index/Services/addServices/',formData).then((res) => {
        this.new_loading = false
        if (res.data["code"] === 200) {
          this.new_service_dialogVisible = false
          this.fetch()
          this.$message.success(`${res.data["data"]}`)
        } else {
          this.$message.error(`${res.data["data"]}`)
        }
      })
    },
    edit_service(e) {// 编辑
      this.edit_service_dialog_params = utils.deepClone(e)
      this.edit_service_dialogVisible = true
    },
    async edit_user_dialog_submit() { // 编辑提交
      if (this.edit_service_dialog_params["line"] === '') {
        this.edit_service_dialog_params["line"] = null
      }
      if (this.edit_service_dialog_params["wechat"] === '') {
        this.edit_service_dialog_params["wechat"] = null
      }
      this.edit_loading = true
      let formData = new FormData()
      var data = JSON.stringify(this.edit_service_dialog_params)
      formData.append('data',data)
      await this.$http.post('/index.php/index/Services/editServices/',formData).then((res) => {
        this.edit_loading = false
        if (res.data["code"] === 200) {
          this.edit_service_dialogVisible = false
          this.fetch()
          this.$message.success(`${res.data["data"]}`)
        } else {
          this.$message.error(`${res.data["data"]}`)
        }
      })
    }
  },
  computed: {
    clientHeight_watch () {
      return this.$store.state.clientHeight || Number(document.documentElement.clientHeight)
    }
  },
  watch: {
    clientHeight_watch (val) {
      var _this = this;
      _this.tableHeight = utils.setClientHight(_this,250,56,44)
    }
  },
};
</script>

<style scoped>
  .el-tag.el-tag--info {
    background-color: white!important;
  }
  .iftop {
    color: #409EFF;
  }
  .iftop_not {
    color: grey;
  }
  .el-dropdown-menu__item {
    text-align: center;
  }
  .is-active {
    background-color: white !important;
  }
  .el-select-dropdown__item.selected {
    /* color: rgb(65, 181, 132) !important; */
    font-weight: 700;
  }
  .el-main {
    line-height: 20px !important;
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
    display: block !important;
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
    border-color: #C0C4CC!important;
    color:#C0C4CC!important;
    background-color: white!important;
  }
  .el-button--info.is-disabled {
    border-color: #C0C4CC!important;
    color:#C0C4CC!important;
    background-color: white!important;
  }

  .el-button--primary.is-disabled:hover {
    color: #C0C4CC!important;
  }
</style>
