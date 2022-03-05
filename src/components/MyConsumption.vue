<template>
  <div>
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;min-width:1600px;margin-top:70px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap;" :disabled="loading">
        <el-form-item label="消耗日期" class="noselect" style="margin-right: 30px">
          <el-date-picker :picker-options="pickerOptions" value-format="timestamp" style="width:250px" v-model="searchParams.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="账户名称"  class="noselect" style="margin-right:30px">
          <el-input v-model="searchParams.account_name" placeholder="搜索账户名称" clearable style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item label="项目" class="noselect" style="margin-right: 30px" prop="project">
          <el-select v-model="searchParams.project" filterable placeholder="请选择项目" clearable>
            <el-option v-for="item in [{value: 'COD/AK/日本/黑五',label: 'COD/AK/日本/黑五'}, {value: 'COD/AK/台湾/黑五',label: 'COD/AK/台湾/黑五'}, {value: 'COD/AK/香港/黑五',label: 'COD/AK/香港/黑五'}, {value: 'COD/AK/马来/黑五',label: 'COD/AK/马来/黑五'}, {value: 'COD/AK/新加坡/黑五',label: 'COD/AK/新加坡/黑五'}, {value: 'COD/AK/菲律宾/黑五',label: 'COD/AK/菲律宾/黑五'}, {value: 'COD/AK/泰国/黑五',label: 'COD/AK/泰国/黑五'}]" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="noselect">
          <el-button icon="el-icon-search" @click="research(1)" plain style="height: 30px; position: relative;">搜索</el-button>
          <el-button type="text" icon="el-icon-refresh-left" @click="fetch()" style="padding: 0;padding-left: 15px;color:#909399;font-size:15px"></el-button>
        </el-form-item>
        <el-form-item>
            <div style="font-weight: bolder;color:#909399;">USD：{{this.totalMoney}}</div>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog width="1600px" :visible.sync="showImg_dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>

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
      :row-style="{height: '50px'}"
      border
      @selection-change="handleSelectionChange_delete">
      <el-table-column prop="apply_date" label="申报时间" width="150px">
        <template slot-scope="scope">
          <div v-if="scope.row['apply_date'] != null && scope.row['apply_date'] != ''">{{scope.row["apply_date"]}}</div>
          <div v-else>/</div>
        </template>
      </el-table-column>
      <el-table-column prop="expend_date" label="消耗日期" width="100px">
      </el-table-column>
      <el-table-column prop="account_name" label="账户名称" min-width="350px">
        <template slot-scope="scope">
          <div>{{scope.row["account_name"]}}</div>
          <div v-if="scope.row['total'] != null && scope.row['total'] != '' && scope.row['total'] != undefined"><span style="color:#f56c6c;margin-right:20px;font-size: 12px;font-weight: bolder;">已停用</span></div>
        </template>
      </el-table-column>
      <el-table-column prop="ad_id" label="广告账号ID" width="200px">
      </el-table-column>
      <el-table-column prop="project" label="项目" width="180px">
        <template slot-scope="scope">
          <div v-if="scope.row['project'] != null && scope.row['project'] != ''">{{scope.row["project"]}}</div>
          <div v-else>/</div>
        </template>
      </el-table-column>
      <el-table-column prop="currency" label="币种" width="60px">
      </el-table-column>
      <el-table-column  label="消耗金额" width="100px">
        <template slot-scope="scope">
          <div><span style="color:#f56c6c;margin-right:10px;font-size: 12px;font-weight: bolder;">{{scope.row["currency"]}}</span>{{scope.row["expend_money"]}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="sum_expend_money" label="累计申报" width="90px">
        <template slot-scope="scope">
          <div v-if="scope.row['total'] != null && scope.row['total'] != '' && scope.row['total'] != undefined" style="color:#f56c6c;">
            {{scope.row["sum_expend_money"]}}
          </div>
          <div v-else>{{scope.row["sum_expend_money"]}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="200px">
        <template slot-scope="scope">
            <div v-if="scope.row['remark'] != null && scope.row['remark'] != '' && scope.row['remark'] != 'undefined' && scope.row['remark'] != 'null'">{{scope.row["remark"]}}</div>
            <div v-else>/</div>
        </template>
      </el-table-column>
      <el-table-column prop="user_remark" label="凭证" width="100px">
        <template slot-scope="scope">
          <el-image
          v-if="scope.row['voucher']"
          style="width: 50px; height: 50px"
          :src="`https://test.icethem02.xyz/${scope.row['voucher']}`" 
          :preview-src-list="[`https://test.icethem02.xyz/${scope.row['voucher']}`]">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div v-else class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" align="center" width="130px">
        <template slot-scope="scope">
          <el-dropdown placement="bottom" trigger="click">
            <span style="cursor: pointer;" class="el-dropdown-link">
            <i style="color: grey!important" class="el-icon-more"></i>
            </span>
            <el-dropdown-menu :visible-arrow="false" class="noselect" slot="dropdown">
              <el-dropdown-item @click.native="expend_dialog_edit(scope.row)">编辑申报信息</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-tooltip content="编辑申报信息" placement="top" :visible-arrow="false">
            <el-button  @click="expend_dialog_edit(scope.row)" icon="el-icon-edit" style="font-size:13px;color:grey;padding:0" type="text"></el-button>
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
              <div @click="copyImg_edit(scope.row)" style="cursor:pointer;position:absolute;top: 0px;left: 197px;height: 75px;width: 35px;background-color:rgba(0,0,0,.5);border-top-right-radius:5px;border-bottom-right-radius:5px;">
                <el-button style="padding:0;position:absolute;left:10px;top:0px;bottom:0px;color:white" type="text" class="el-icon-document-copy"></el-button>
              </div>
              <div @click="showImg_edit(expend_dialog.url)" v-if="expend_dialog.url != null && expend_dialog.url != ''" style="cursor:pointer;position:absolute;top: 0px;left:0px;height: 75px;width: 35px;background-color:rgba(0,0,0,.5);border-top-left-radius:5px;border-bottom-left-radius:5px;">
                  <el-button  style="padding:0;position:absolute;left:10px;top:0px;bottom:0px;color:white" type="text" class="el-icon-search"></el-button>
              </div>
            </div>
            </template>
          </el-form-item>
        <el-button size="small" type="primary" @click="submitForm('expend_dialog')" class="formSubmitBtn" style="margin-left: 205px" >修 改</el-button>
      </el-form>
    </el-dialog>
</div>
</template>

<script>
  import utils from '../utils'
  var reg2 = new RegExp(/^[a-zA-Z0-9]{1,21}$/)
  var validatePass2 = (rule, value, callback) => {
    if (value === '' || value === null) {
      callback(new Error('货币必填'))
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
        showImg_dialogVisible:false,
        dialogImageUrl:null,
        pickerOptions: {
          disabledDate(v) {
            return v.getTime() >= new Date().getTime();
          }
        },
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
                { validator: validatePass2, required: true,trigger: 'blur' }
              ],
              exchange_rate:[
                { required: true, message: '汇率必填', trigger: 'blur' }
              ],
              url: [
                { required: true, message: '凭证未上传',trigger: 'blur'}
              ],
              expend_money:[
                { validator: validatePass3, required: true,trigger: 'change' }
              ],
              project:[
                { required: true, message: '项目必选', trigger: 'blur' }
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
        totalMoney:0,
      }
    },
    created() {
      this.getUid()
      this.fetch()
    },
    methods: {
      copyImg_edit(e) {
        this.$message.info('定位元素')
        this.standBy_copy_edit = this.expend_dialog
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
        }
      },
      async uploadFile(file) {//自定义添加的功能中的图片上传
        this.expend_dialog["url"] = URL.createObjectURL(file.raw)
        this.expend_dialog["img"] = file.raw
      },
      async expend_dialog_submit() {
        this.expend_dialog_loading = true
        let formData = new FormData()
        formData.append('id',this.expend_dialog["id"])
        formData.append('project',this.expend_dialog["project"])
        formData.append('remark',this.expend_dialog["remark"])
        formData.append('expend_money',this.expend_dialog["expend_money"])
        if (this.expend_dialog["img"] === undefined) {
          //
        } else {
          formData.append('image',this.expend_dialog["img"])
        }
        await this.$http.post('/index.php/index/account/editApply/',formData).then((res) => {
          this.expend_dialog_loading = false
          if (res.data["code"] === 200) {
            this.$message.success(`${res.data["data"]}`)
            this.expend_dialog_dialogVisible = false
            this.fetchPageData(this.currentPage)
          } else {
            this.$message.error(`${res.data["data"]}`)
          }
        })
      },
      expend_dialog_edit(e) {
        this.expend_dialog["id"] = e["id"]
        this.expend_dialog["project"] = e["project"]
        this.expend_dialog["remark"] = e["remark"]
        this.expend_dialog["expend_money"] = e["expend_money"]
        this.expend_dialog["url"] = `https://test.icethem02.xyz/${e["voucher"]}`
        this.expend_dialog["img"] = e["img"]
        this.standBy_e = e
        this.expend_dialog_dialogVisible = true
      },
      // -----------------------------------------------------------
      async handleSizeChange(val) {// 页大小
        if (this.searchPageChange === false && this.useSearchData === false) {
          this.loading = true;
          let formData = new FormData()
          formData.append("page",1)
          formData.append("num",val)
          formData.append("user",this.uid)
          formData.append("audit",1)
          await this.$http.post("/index.php/index/account/searchAuditList/",formData).then((res) => {
            this.totalMoney = res.data["money"]
          res.data["data"].forEach(e=> {
            e["expend_date"] = utils.getLocalTime(parseInt(e["expend_date"]));
            e["apply_date"] = this.getTimeData(parseInt(e["apply_date"]));
            e["url"]
          })
          this.tableData = res.data["data"];
          this.totalNum = res.data["sum"]
          this.ShowTableData = this.tableData;
          this.currentPage = 1
          this.pageSize = val
          this.tableHeight = utils.setClientHight(this,255,56,78)
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
        formData.append("audit",1)
        await this.$http.post("/index.php/index/account/searchAuditList/",formData).then((res) => {
          this.totalMoney = res.data["money"]
          res.data["data"].forEach(e=> {
            e["expend_date"] = utils.getLocalTime(parseInt(e["expend_date"]));
            e["apply_date"] = this.getTimeData(parseInt(e["apply_date"]));
            e["url"]
          })
          this.tableData = res.data["data"];
          this.totalNum = res.data["sum"]
          this.ShowTableData = this.tableData;
          this.tableHeight = utils.setClientHight(this,255,56,78)
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
        await this.$http.post("/index.php/index/account/userAuditList/",formData).then((res) => {
          this.totalMoney = res.data["money"]
        res.data["data"].forEach(e=> {
          e["expend_date"] = utils.getLocalTime(parseInt(e["expend_date"]));
          e["apply_date"] = this.getTimeData(parseInt(e["apply_date"]));
          e["url"]
        })
        this.useSearchData = false
        this.searchPageChange = false
        this.tableData = res.data["data"];
        this.totalNum = res.data["sum"]
        this.ShowTableData = this.tableData;
        this.tableHeight = utils.setClientHight(this,255,56,78)
        this.loading = false;
        });
      },
      getTimeData (timeStamp){
        var date = new Date();
        date.setTime(timeStamp * 1000);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        var second = date.getSeconds();
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
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
            if (formName === 'expend_dialog') {
              this.expend_dialog_submit()
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
        this.searchParams["audit"] = 1
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
        await this.$http.post('/index.php/index/account/searchAuditList/',formData).then((res) => {
          this.totalMoney = res.data["money"]
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
            e["apply_date"] = this.getTimeData(parseInt(e["apply_date"]));
            e["url"]
          });
          this.currentPage = 1
          this.tableHeight = utils.setClientHight(this,255,56,78)
          this.loading = false
        })
        }
        // 搜索后换页/页大小
        else if(this.searchPageChange === true && this.useSearchData === true){
          this.standBy_search["page"] = val
          this.standBy_search["num"] = this.pageSize
          this.standBy_search["user"] = this.uid
          this.standBy_search["audit"] = 1
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
            this.totalMoney = res.data["money"]
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
              e["apply_date"] = this.getTimeData(parseInt(e["apply_date"]));
              e["url"]
            });
            this.tableHeight = utils.setClientHight(this,255,56,78)
            this.loading = false
          })
        }
        this.handleUpdateClick()
      },
      handleUpdateClick() {// 回流
        this.key += 1 
      },
      showImg_edit(e) {
        this.showImg_dialogVisible = true
        this.dialogImageUrl = e
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
        _this.tableHeight = utils.setClientHight(_this,255,56,78)
      }
    },
    mounted() {
      document.addEventListener('paste', this.onPasteUpload_edit)
      this.$EventBus.$on("aMsg", (msg) => {
      try {
        this.search(1)
      } catch (error) {
        //
      }
    });
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
    border-color: #DCDFE6!important;
    color:#C0C4CC!important;
    background-color: white!important;
  }
  #delAccount:hover {
    color: rgb(245, 108, 108);
    background-color: rgb(254, 240, 240);
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
</style>
