<template>
  <div>
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;min-width:1600px;margin-top:70px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap;" :disabled="loading">
        <el-form-item  class="noselect" style="margin-right:30px">
          <el-input v-model="searchParams.account_id" placeholder="搜索账号" clearable style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item  class="noselect" style="margin-right:30px">
          <el-input v-model="searchParams.card_id" placeholder="搜索信用卡号" clearable style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right: 30px">
          <el-input v-model="searchParams.account_name" placeholder="搜索账户名称" clearable style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item  class="noselect" style="margin-right:30px">
          <el-input v-model="searchParams.ad_id" placeholder="搜索广告账号ID" clearable style="width: 120px;"></el-input>
        </el-form-item>
        <el-form-item class="noselect">
          <el-button icon="el-icon-search" @click="research(1)" plain style="height: 30px; position: relative;">搜索</el-button>
          <el-button type="text" icon="el-icon-refresh-left" @click="fetch()" style="padding: 0;padding-left: 9px;color:#909399;font-size:15px"></el-button>
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
      :row-style="{height: '50px'}"
      border>
      <!-- <el-table-column prop="id" label="ID" width="50px">
      </el-table-column> -->
      <el-table-column prop="account_id" label="账号" width="550px">
      </el-table-column>
      <el-table-column prop="card_id" label="信用卡号" width="180px">
      </el-table-column>
      <!-- <el-table-column prop="account_type" label="类型" width="120px">
      </el-table-column> -->
      <el-table-column prop="account_name" label="账户名称" min-width="350px">
      </el-table-column>
      <el-table-column prop="ad_id" label="广告账号ID" width="200px">
      </el-table-column>
      <el-table-column prop="account_limit" label="限额" width="50px">
      </el-table-column>
      <el-table-column prop="balance" label="今日剩余" width="80px">
      </el-table-column>
      <el-table-column prop="pay_sum" label="历史充值" width="80px">
      </el-table-column>
      <el-table-column prop="state" label="账号状态" width="80px">
      </el-table-column>
            <el-table-column prop="allot_time" label="分配时间" width="90px">
      </el-table-column>
      <!-- <el-table-column prop="state" label="充值状态" width="80px">
      </el-table-column> -->
      <!-- <el-table-column fixed="right" label="操作" align="center" width="130px">
        <template slot-scope="scope">
          <el-dropdown placement="bottom" trigger="click">
            <span style="cursor: pointer;" class="el-dropdown-link">
              <i style="color: grey!important" class="el-icon-more"></i>
            </span>
            <el-dropdown-menu :visible-arrow="false" class="noselect" slot="dropdown">
              <el-dropdown-item :disabled="scope.row['state'] === '不可用' || scope.row['state'] === '审批中'|| scope.row['state'] === '充值中'?true:false" @click.native="recharge(scope.row)">申请充值</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <!-- <el-tooltip content="广告已开启屏蔽" placement="left" :visible-arrow="false">
            <p id="lock" v-if="scope.row.cloak === '1'" class="el-icon-lock" style="margin-right:10px;color:red;display:inline-block;font-size:15px" type="text"></p>
          </el-tooltip> -->
          <el-tooltip content="申请充值" placement="top" :visible-arrow="false">
            <el-button :disabled="scope.row['state'] === '不可用' || scope.row['state'] === '审批中'|| scope.row['state'] === '充值中'?true:false" @click="recharge(scope.row)" icon="el-icon-money" style="font-size:13px;color:grey;padding:0" type="text"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 申请充值 -->
    <el-dialog title="申请充值" :visible.sync="recharge_dialogVisible" width="400px" :close-on-click-modal="false">
      <el-form  ref="recharge_params"  :rules="rules" :model="recharge_params" label-width="100px" label-position="right" v-loading="recharge_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item  label="信用卡号" class="noselect" style="margin-right: 40px">
              <p style="text-align:left">{{this.recharge_show_cardId}}</p>
            </el-form-item>
            <el-form-item  label="今日剩余" class="noselect" style="margin-right: 40px">
              <p style="text-align:left">{{this.recharge_show_balance}}</p>
            </el-form-item>
            <el-form-item label="充值(USD)" class="noselect" style="margin-right: 40px" prop="num">
              <el-input-number style="width:220px;" v-model="recharge_params.num" :min="0" :max="recharge_numLimit"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button @click="submitForm('recharge_params')" :disabled="recharge_loading || this.recharge_params.num === 0" size="small" type="primary" class="formSubmitBtn" style="margin-right:-220px">确 定</el-button>
      </el-form>
    </el-dialog>

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
  </div>
</template>

<script>
  import crypto from '../crypto.js'
import utils from '../utils'
import { export_json_to_excel } from '../Export2Excel.js'
  export default {
    data() {
      return {
        // 充值
        recharge_show_cardId:null,
        recharge_show_balance:null,
        recharge_dialogVisible:false,
        recharge_loading:false,
        recharge_numLimit:50,
        recharge_params: {
          num:1,
          id:null
        },
        standBy_recharge:null,
        ShowTableData_getAccount:[],
        multipleDel:true,
        output_arr:[],
        repeat_table:false,
        repeat_table_data:null,
        tableHeight:620,
        loading_import:false,
        key:0,
        showIf: true,
        //红点
        badge_num : null,
        showBadge: false,
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
        // 搜索输入框记录
        searchParams: {
          account_id: null,
          account_limit: null,
          account_name: null,
          account_type: '信用卡',
          account_user: null,
          ad_id: null,
          bank: null,
          card_id: null,
          pay_id: null,
          remark: null,
          state: null,
          date:null,
        },
        //校验规则
        rules: {
          // 申请账号校验规则
          type: [
            { required: true, message: '请选择账户类型', trigger: 'change' }
          ],
          state: [
            { required: true, message: '请选择状态', trigger: 'change' }
          ],
          cookie: [
            { required: true, message: '请输入cookie', trigger: 'blur' }
          ],
          num: [
            { required: true, message: '请输入申请数量', trigger: 'blur' }
          ],
          new_form_type: [
            { required: true, message: '请选择账户类型', trigger: 'change' }
          ],
          limit: [
            { required: true, message: '请选择限额', trigger: 'change' }
          ],
          batch: [
            { required: true, message: '请选择批次', trigger: 'change' }
          ],
          //申请高额度账号表单校验规则
          new_form_type_highquota: [
            { required: true, message: '请选择账户类型', trigger: 'change' }
          ],
          limit_highquota: [
            { required: true, message: '请输入限额', trigger: 'change' }
          ],
          batch_highquota: [
            { required: true, message: '请输入批次', trigger: 'change' }
          ],
          extension_highquota: [
            { required: true, message: '请选择推广人员', trigger: 'change' }
          ],

          //转让表单校验规则
          makeOver_user_input: [
            { required: true, message: '请输入转让人员', trigger: 'change' }
          ],

          //退回表单校验规则
          back_reason: [
            { required: true, message: '请输入退回理由', trigger: 'blur' }
          ],
          // 转让
          new_user: [
            { required: true, message: '目标用户必选', trigger: 'change' }
          ],
          // 退回
          reason: [
            { required: true, message: '请输入退回理由', trigger: 'change' }
          ],
          // 退回
          remark: [
            { required: true, message: '请输入个人备注', trigger: 'change' }
          ]
        },
        uid:null,
        zh_name:null,
        // 分页
        totalNum: 0,
        currentPage: 1,
        useSearchData: false,
        pageSize:15,
        searchPageChange:false,
        standBy_search:null,
        clientHeight: 0, 
      }
    },

    created() {
      // 执行网络请求
      this.getUid()
      //获取表单选项及表格数据
      this.fetch()
      this.fetchOption()
      this.fetchUser()
    },

    methods: {
      // 充值
      recharge(e) {
        this.standBy_recharge = e
        this.recharge_params.id = e["id"]
        this.recharge_show_cardId = e["card_id"]
        this.recharge_show_balance = e["balance"]
        this.recharge_params["account_limit"] = e["account_limit"]
        this.recharge_params.num = 1
        this.recharge_dialogVisible = true
        this.recharge_numLimit = Number(e["balance"])
      },
      async recharge_submit() {
        this.recharge_loading = true
        let formData = new FormData()
        formData.append('id',this.recharge_params["id"])
        formData.append('user',this.uid)
        formData.append('account_limit',this.recharge_params["account_limit"])
        formData.append('num',this.recharge_params["num"])
        try {
          await this.$http.post('/index.php/index/account/pay/',formData).then((res) => {
            this.recharge_loading = false
            if (res.data["code"] === 200) {
              this.$store.commit("send",'backAccount:admin');
              this.recharge_dialogVisible = false
              this.$message.success(`${res.data["data"]}`)
              if (this.standBy_recharge["account_limit"] != '不限额' && this.standBy_recharge["account_limit"] != '其他') {
                this.standBy_recharge["balance"] = this.standBy_recharge["balance"] - this.recharge_params["num"]
              }
              this.standBy_recharge["state"] = '充值中'
            } else {
              this.$message.error(`${res.data["data"]}`)
            }
          })
        } catch (error) {
          this.recharge_loading = false
          this.$message.error(error)
        }
      },
      // 
      async fetchUser() {
        await this.$http.get('/index.php/index/account/userList/').then((res)=> {
          this.chooseNewUser = res.data["data"]
        })
      },
      num_watch() {
        if (this.new_form["num"] === 0) {
          this.new_form_btn = true
        } else if (this.ShowTableData_getAccount.length != 0 && this.new_form["num"] > 0) {
          this.new_form_btn = false
        }
      },
      multiplexFilter(value, params) {
        if (value === '' || value === null) {
          //
        } else {
          this.ShowTableData_getAccount = this.ShowTableData_getAccount.filter(item => {
            return item[params] === value
          })
        }
      },
      utils_run() {
        this.ShowTableData_getAccount = this.tableData_getAccount
        this.multiplexFilter(this.new_form['type'], 'type')
        this.multiplexFilter(this.new_form['limit'], 'limit')
        this.multiplexFilter(this.new_form['batch'], 'batch')
        if(this.ShowTableData_getAccount.length != 0) {
          this.new_form_btn = false
          var findLimit
          var smallerNum
          if (this.new_form["limit"] === '' || this.new_form["limit"] === null || this.new_form["type"] === null ||this.new_form["type"] === '') {
            //
          } else if(this.new_form["limit"] === '25') {
            findLimit = 'limit_25'
          } else if (this.new_form["limit"] === '50') {
            findLimit = 'limit_50'
          } else if(this.new_form["limit"] === '半限额') {
            findLimit = 'limit_250'
          } else if (this.new_form["limit"] === '不限额') {
            findLimit = 'limit_not'
          } else {
            findLimit = 'limit_other'
          }
          this.apply_limit.forEach(e=> {
            if (e["card_type"] === this.new_form["type"]) {
              smallerNum = e[`${findLimit}`]
              this.showOwnLimit = smallerNum
              if (smallerNum > this.ShowTableData_getAccount[0]["num"]) {
                this.maxNum = Number(this.ShowTableData_getAccount[0]["num"])
              } else {
                this.maxNum = Number(smallerNum)
              }
              if (this.maxNum < 0 || this.maxNum === 0) {
                this.new_form_btn = true
              }
            }
          })
        } else {
          this.new_form_btn = true
          this.maxNum = 1
        }
      },
      async getAccount() {
        this.ShowTableData_getAccount = []
        for (const k in this.chooseOptions) {
          this.chooseOptions[k] = []
        }
        this.new_form_dialogVisible = true
        this.get_account_loading = true
        let formData = new FormData()
        formData.append('user',this.uid)
        formData.append('role',crypto.cryptoDecrypt_string(localStorage.getItem("main_group")))
        await this.$http.post('/index.php/index/account/applyAccount/',formData).then((res) => {
          var arr = []
          this.apply_limit = res.data["apply_limit"]
          res.data["account_type"].forEach(e=> {
            var item = {"label":e,"value":e}
            this.chooseOptions["type"].push(item)
          })
          res.data["account_limit"].forEach(e=> {
            var item = {"label":e,"value":e}
            this.chooseOptions["limit"].push(item)
          })
          res.data["come_batch"].forEach(e=> {
            var item = {"label":e,"value":e}
            this.chooseOptions["batch"].push(item)
          })
          for (const a in res.data["sum"]) {
            for (const b in res.data["sum"][a]) {
              for (const c in res.data["sum"][a][b]) {
                var item = {}
                item = {"type":`${a}`,"limit":`${b}`,"batch":`${c}`,"num":res.data["sum"][a][b][c]}
                arr.push(item)
              }
            }
          }
          this.tableData_getAccount = arr
          this.ShowTableData_getAccount = this.tableData_getAccount
          this.get_account_loading = false
          if (res.data["account_limit"].length == 0 && res.data["account_type"] == 0 && res.data["come_batch"] == 0) {
            this.new_form_btn = true
          }
        })
      },
      //  -----------------------------------------------------------
      // 导出数据为表格
      exportExcel() {
        var tHeader = ['账号','密码','cookie','账号类型','广告账户名称','广告账号ID','登陆IP地区','信用卡号','账户限额','分配时间','备注']
        var filterVal = ['account_id','pass','cookie','account_type','account_name','ad_id','login_ip','card_id','account_limit','allot_time','remark']
        var time = this.getCurentTime()
        var filename = `${time}`
        this.output_arr.forEach(e=> {
          e["allot_time"] = utils.getLocalTime(parseInt(e["allot_time"]));
        })
        var data = this.formatJson(filterVal, this.output_arr)
        export_json_to_excel({
          header: tHeader,
          data,
          filename
        })
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
        var year = now.getFullYear();       // 年
        clock += year + "-";
        var month = now.getMonth() + 1;     // 月
        if (month < 10) {
            clock += "0";
        }
        clock += month + "-";
        var day = now.getDate();            // 日
        if (day < 10) {
            clock += "0";
        }
        if (isTime == true) {
            clock += day + " ";
            var hh = now.getHours();            // 时
            if (hh < 10) {
                clock += "0";
            }

            clock += hh + "-";
            var mm = now.getMinutes();     // 分
            if (mm < 10) {
                clock += '0';
            }
            clock += mm + "-";
            var ss = now.getSeconds();     // 秒
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
        formData.append("user",this.uid)
        await this.$http.post("/index.php/index/account/myCredit/",formData).then((res) => {
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
          this.handleUpdateClick()
          this.tableHeight = utils.setClientHight(this,255,56,50)
          
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
          await this.$http.post("/index.php/index/account/myCredit/",formData).then((res) => {
            res.data["data"].forEach(e=> {
              e["allot_time"] = utils.getLocalTime(parseInt(e["allot_time"]));
              if (e["log"].indexOf(',') === -1) {
                e["showLog"] = [e["log"]]
              } else {
                e["showLog"] = e["log"].split(',')
              }
            })
            this.tableData = res.data["data"];  
            this.totalNum = res.data["sum"]
            this.ShowTableData = this.tableData;
            this.tableHeight = utils.setClientHight(this,255,56,50)
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
        await this.$http.post("/index.php/index/account/myCredit/",formData).then((res) => {
          res.data["data"].forEach(e=> {
            e["allot_time"] = utils.getLocalTime(parseInt(e["allot_time"]));
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
          this.tableHeight = utils.setClientHight(this,255,56,50)
          this.loading = false;
        });
      },
      getUid() { // 获取用户uid
        this.uid = localStorage.getItem("uid")
        this.zh_name = localStorage.getItem("zh_name")
      },
      // -----------------------------------------------------------
      //复制
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
      // -----------------------------------------------------------
      //表单提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'new_form') {
              // this.new_form_submit()
            } else if (formName === 'recharge_params') {
              this.recharge_submit()
            }
          } else {
            return false;
          }
        });
      },
      //--------------------------------------------------------------
      // 搜索选项获取
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
        })
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
          this.searchParams["credit"] = 1
          let formData = new FormData()
          formData.append('data',JSON.stringify(this.searchParams))
          await this.$http.post('/index.php/index/account/searchAccount/',formData).then((res) => {
            res.data["data"].forEach(e=> {
              e["allot_time"] = utils.getLocalTime(parseInt(e["allot_time"]));
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
            this.tableHeight = utils.setClientHight(this,255,56,50)
            this.loading = false
          })
        }
        // 搜索后换页/页大小
        else if(this.searchPageChange === true && this.useSearchData === true){
          this.standBy_search["page"] = val
          this.standBy_search["num"] = this.pageSize
          this.standBy_search["user"] = this.uid
          this.standBy_search["credit"] = 1
          let formData = new FormData()
          formData.append('data',JSON.stringify(this.standBy_search))
          await this.$http.post('/index.php/index/account/searchAccount/',formData).then((res) => {
            this.searchPageChange = true
            this.useSearchData = true
            this.totalNum = res.data["sum"]
            this.currentPage = val
            this.tableData = res.data["data"]
            this.ShowTableData = []
            res.data["data"].forEach(e=> {
            e["allot_time"] = utils.getLocalTime(parseInt(e["allot_time"]));
            if (e["log"].indexOf(',') === -1) {
              e["showLog"] = [e["log"]]
            } else {
              e["showLog"] = e["log"].split(',')
            }
          })
            this.tableData.forEach((e) => {
                if (this.tableData.indexOf(e) <= this.pageSize - 1) {
                  this.ShowTableData.push(e);
                }
            });
            this.tableHeight = utils.setClientHight(this,255,56,50)
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
        _this.tableHeight = utils.setClientHight(_this,255,56,50)
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
</style>
