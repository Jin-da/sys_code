<template>
  <div>
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;min-width:1185px;margin-top:80px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap;" :disabled="loading">
        <el-form-item class="noselect">
          <el-button class="info_btn" icon="el-icon-download" @click="exportExcel" type="info" style="height: 30px; position: relative;right:-10px;margin-left:10px;" >全部导出</el-button>
          <el-button class="info_btn" :disabled="multipleDel" icon="el-icon-delete" @click="confirmItems" type="info" style="height: 30px; position: relative;right:-10px;margin-left:10px;" >批量确认</el-button>
          <el-button :disabled="multipleDel" icon="el-icon-delete" @click="refuseItems" type="danger" style="height: 30px; position: relative;right:-10px;margin-left:10px;" >批量拒绝</el-button>
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
      style="width:calc(100%-60px);line-height:30px;margin:25px 0px;min-width:800px"
      :row-style="{height: '50px'}"
      border
      @selection-change="handleSelectionChange_delete">
      <el-table-column type="selection" width="55"></el-table-column>
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
      <!-- <el-table-column prop="id" label="系统ID" width="100px">
      </el-table-column> -->
      <el-table-column prop="account_id" label="账号" min-width="500px">
      </el-table-column>
      <el-table-column prop="apply_reason" label="退回理由" min-width="150px">
      </el-table-column>
      <el-table-column prop="" label="推广" width="160px">
        <template slot-scope="scope">
          <div v-if="scope.row['account_user']">{{scope.row["zh_name"]}}({{scope.row["account_user"]}})</div>
          <div v-else>无</div>
        </template>
      </el-table-column>
      <el-table-column prop="account_type" label="类型" width="140px">
      </el-table-column>
      <el-table-column prop="login_ip" label="登陆IP地区" width="120px">
      </el-table-column>
      <!-- <el-table-column prop="account_limit" label="限额" min-width="80px">
      </el-table-column> -->
      <el-table-column prop="come_batch" label="来号批次" width="140px">
      </el-table-column>
      <el-table-column prop="allot_time" label="分配时间" width="140px">
      </el-table-column>
      <!-- <el-table-column prop="remark" label="备注" width="200px">
      </el-table-column>
      <el-table-column prop="state" label="状态" width="100px">
      </el-table-column> -->
      <!-- <el-table-column fixed="right" label="操作" align="center" width="130px">
        <template slot-scope="scope">
          <el-dropdown placement="bottom" trigger="click">
            <span style="cursor: pointer;" class="el-dropdown-link">
              <i style="color: grey!important" class="el-icon-more"></i>
            </span>
            <el-dropdown-menu :visible-arrow="false" class="noselect" slot="dropdown">
              <el-dropdown-item @click.native="confirm(scope.row)">确认回收</el-dropdown-item>
              <el-dropdown-item id="delAccount" @click.native="refuse(scope.row)">拒绝回收</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-tooltip content="确认回收" placement="top" :visible-arrow="false">
            <el-button  @click="confirm(scope.row)" icon="el-icon-check" style="font-size:13px;color:grey;padding:0;margin-right:10px" type="text"></el-button>
          </el-tooltip>
          <el-tooltip content="拒绝回收" placement="top" :visible-arrow="false">
            <el-button  @click="refuse(scope.row)" icon="el-icon-close" style="font-size:13px;color:red;padding:0;border:none;background-color:rgba(0,0,0,0)" type="text"></el-button>
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
          <!-- <el-button type="text" icon="el-icon-arrow-left"
              size="small" @click="innerDrawer = true" style="position: absolute;left:0;color:black"></el-button> -->
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

    <!-- 拒绝表单 -->
    <el-dialog :close-on-click-modal="false" title="拒绝回收" :visible.sync="refuse_dialogVisible" width="450px" @close='closeDialog_refuse'>
      <el-form :rules="rules" ref="refuse_form" :model="refuse_form" label-width="110px" label-position="right" v-loading="refuse_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="拒绝账号" class="noselect" style="margin-right: 40px">
              <div style="text-align: left;">{{this.refuse_form["account"]}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="拒绝理由" class="noselect" style="margin-right: 40px" prop="reason"> 
              <el-input v-model="refuse_form.reason" placeholder="请输入拒绝理由">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="small" type="primary" @click="submitForm('refuse_form')" style="margin-right: -270px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 批量拒绝表单 -->
    <el-dialog :close-on-click-modal="false" title="拒绝回收" :visible.sync="refuse_multiple_dialogVisible" width="450px" @close='closeDialog_refuse_multiple'>
      <el-form :rules="rules" ref="refuse_multiple_form" :model="refuse_multiple_form" label-width="110px" label-position="right" v-loading="refuse_multiple_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="拒绝理由" class="noselect" style="margin-right: 40px" prop="reason"> 
              <el-input v-model="refuse_multiple_form.reason" placeholder="请输入拒绝理由">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="small" type="primary" @click="submitForm('refuse_multiple_form')" style="margin-right: -270px" >确 定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import utils from '../utils'
import { export_json_to_excel } from '../Export2Excel.js'
  export default {
    data() {
      return {
        multipleDel:true,
        tableHeight:620,
        key:0,
        // 批量拒绝表单
        refuse_multiple_dialogVisible:false,
        refuse_multiple_loading:false,
        refuse_multiple_form:{
          reason:null
        },
        // 导出表单
        export_form: {
          selected: null
        },
        // 详情抽屉
        detail_account:null,
        detail_password:null,
        detail_cookie:null,
        detail_accountbm:null,
        detail_ua:null,
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
        innerDrawer_ua:false,
        tbloading:false,
        // 加载界面显示与否
        loading: false,
        // 展示数据
        ShowTableData: [],
        // 原始数据
        tableData: [],
        // 搜索账号类型选项
        chooseType: [],
        chooseLimit: [],
        chooseStatus:[],
        chooseUser:[],
        //校验规则
        rules: {
          reason: [
            { required: true, message: '请输入拒绝理由', trigger: 'blur' }
          ],
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
        // 拒绝
        refuse_dialogVisible:false,
        refuse_loading:false,
        refuse_form:{
          id:null,
          reason:null,
          account:null
        },
        standBy_items:[]
      }
    },

    created() {
      // 执行网络请求
      
      //获取表单选项及表格数据
      this.fetch()
      this.fetchOption()
      this.getUid()
    },

    methods: {
      refuseItems() {
        this.refuse_multiple_dialogVisible = true
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
      async exportExcel() {
        this.loading = true
        var arr = []
        var standBy_downLoad = {}
        standBy_downLoad['num'] = 10000
        standBy_downLoad["state"] = "审批中"
        let formData = new FormData()
        standBy_downLoad['page'] = 1
        formData.append('data',JSON.stringify(standBy_downLoad))
        await this.$http.post('/index.php/index/account/exportAccount/',formData).then((res)=> {
          arr = res.data["data"]
        })
        var tHeader = ['账号类型','账号','密码','cookie','广告账号ID','账号所在BM','信用卡号','登录ip地区','来号日期','来号批次','备注','状态','分号日期','分配的推广人','添加时间','修改时间','拒绝回收理由','账号限额','回收理由','部门']
        var filterVal = ['account_type','account_id','pass','cookie','ad_id','bank','card_id','login_ip','come_date','come_batch','remark','state','allot_time','account_user','create_time','update_time','拒绝回收理由','account_limit','回收理由','部门']
        var time = this.getCurentTime()
        var filename = `${time}`
        var data = this.formatJson(filterVal, arr)
        export_json_to_excel({
          header: tHeader,
          data,
          filename
        })
        this.loading = false
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
        // console.log(clock);
        return clock;
    },
      // -----------------------------------------------------------
      // 页大小
      async handleSizeChange(val) {
              if (this.searchPageChange === false && this.useSearchData === false) {
        this.loading = true;
          let formData = new FormData()
          formData.append("page",1)
          formData.append("num",val)
          await this.$http.post("/index.php/index/account/checkList/",formData).then((res) => {
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
            this.tableHeight = utils.setClientHight(this,314,56,50)
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
          await this.$http.post("/index.php/index/account/checkList/",formData).then((res) => {
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
            this.tableHeight = utils.setClientHight(this,314,56,50)
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
        await this.$http.post("/index.php/index/account/checkList/",formData).then((res) => {
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
          this.tableHeight = utils.setClientHight(this,314,56,50)
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
        this.standBy_items = []
        val.forEach(e=> {
          this.standBy_items.push({"id":`${e["id"]}`,"account_user":`${e["account_user"]}`})
        })
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
              if (formName === 'refuse_multiple_form') {
                this.refuse_multiple_form_submit()
              } else if(formName === 'refuse_form') {
                this.refuse_submit()
              }
          } else {
            return false;
          }
        });
      },
      //--------------------------------------------------------------
      // 详情
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
        this.detail_account = e.account_id
        this.detail_password = e.pass
        this.detail_accountbm = e.bank
        this.detail_ua = e.ua
        this.detail_accountname = e.account_name,
        this.detail_adid = e.ad_id,
        this.detail_cardNumber = e.card_id,
        this.detail_rechargeCardNumber = e.pay_id,
        this.detail_ComeDate = e.come_date,
        this.detail_ip = e.login_ip,
        this.detail_Logging = e.showLog
        
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
          for (const k in res.data["account_user"]) {
            this.chooseUser.push({"label":`${res.data['account_user'][k]}`,"value":k})
          }
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
            this.tableHeight = utils.setClientHight(this,314,56,50)
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
            this.tableHeight = utils.setClientHight(this,314,56,50)
            this.loading = false
          })
        }
        this.handleUpdateClick()
      },
      async confirm(e) {// 确认
        this.$confirm(`是否确认回收账号 ${e.account_id}`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          this.loading = true
          let formData = new FormData()
          formData.append("id",e.id)
          formData.append("user",this.uid)
          await this.$http.post("/index.php/index/account/checkSucceed/",formData).then((res) => {
            if (res.data["code"] === 200) {
              this.$store.commit("send",`checkSucceed:${e["account_user"]}`);
              this.fetchPageData(this.currentPage)
              this.$message.success(`${res.data["data"]}`)
            } else {
              this.$message.error(`${res.data["data"]}`)
            }
          })
        }).catch((err)=> {
          // /
        })
      },
      confirmItems() {
        var resArr = []
        this.$confirm('是否确认批量回收账号', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          this.loading = true
          this.standBy_items.forEach(async e=> {
            let formData = new FormData()
            formData.append("user",this.uid)
            formData.append("id",e["id"])
            await this.$http.post('/index.php/index/account/checkSucceed/',formData).then((res)=> {
              if (res.data["code"] === 200) {
                this.$store.commit("send",`checkSucceed:${e["account_user"]}`);
              }
              resArr.push(res.data["code"])
              if (resArr.length === this.standBy_items.length) {
                if (resArr.indexOf(500) === -1) {
                  this.$message.success('批量操作成功')
                } else {
                  this.$message.warning('存在操作失败项目')
                }
                this.fetch()
              }
            })
          })
        }).catch((err)=> {
          // /
        })
      },
      // 拒绝
      refuse(e) {
        this.refuse_form["account"] = e["account_id"]
        this.refuse_form["id"] = e["id"]
        this.refuse_form["uid"] = e["account_user"]
        this.refuse_dialogVisible = true
      },
      async refuse_submit() {///单项拒绝
        this.refuse_loading = true
        let formData = new FormData()
        formData.append("user",this.uid)
        formData.append("refuse_reason",this.refuse_form["reason"])
        formData.append("id",this.refuse_form["id"])
        await this.$http.post('/index.php/index/account/checkFail/',formData).then((res)=> {
          this.refuse_loading = false
          if (res.data["code"] === 200) {
            this.$store.commit("send",`checkFail:${this.refuse_form["uid"]}`);
            this.$message.success(`${res.data["data"]}`)
            this.refuse_dialogVisible = false
            this.fetchPageData(this.currentPage)
          } else {
            this.$message.error(`${res.data["data"]}`)
          }
        })
      },
      refuse_multiple_form_submit() {
        var resArr = []
        this.refuse_multiple_loading = true
        this.standBy_items.forEach(async e=> {
          let formData = new FormData()
          formData.append("user",this.uid)
          formData.append("refuse_reason",this.refuse_multiple_form["reason"])
          formData.append("id",e["id"])
          await this.$http.post('/index.php/index/account/checkFail/',formData).then((res)=> {
            if (res.data["code"] === 200) {
              this.$store.commit("send",`checkFail:${e["account_user"]}`);
            }
            resArr.push(res.data["code"])
            if (resArr.length === this.standBy_items.length) {
              this.refuse_multiple_loading = false
              this.refuse_multiple_dialogVisible = false
              if (resArr.indexOf(500) === -1) {
                this.$message.success('批量操作成功')
              } else {
                this.$message.warning('存在操作失败项目')
              }
              this.fetch()
            }
          })
        })
      },
      closeDialog_refuse() { 
        this.$nextTick(() => {
          this.$refs['refuse_form'].clearValidate()
        })
        this.refuse_form['reason'] = null
      },
      closeDialog_refuse_multiple() {
        this.$nextTick(() => {
          this.$refs['refuse_multiple_form'].clearValidate()
        })
        this.refuse_multiple_form['reason'] = null
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
        _this.tableHeight = utils.setClientHight(_this,314,56,50)
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
