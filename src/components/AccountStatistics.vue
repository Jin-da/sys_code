<template>
  <div>
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;min-width:915px;margin-top:80px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap" :disabled="loading">
        <el-form-item class="noselect" style="margin-right:30px">
          <div style="color:#606266;margin-right:12px;text-align:left;margin-bottom:5px;">推广</div>
          <el-select style="width:250px" @change="utils_run" multiple filterable v-model="searchParams.account_user" placeholder="筛选" clearable>
            <el-option v-for="(item,index) in chooseUser" :key="index" :label="item['label']" :value="item['value']">
              <span style="float: left">{{ item['label'] }}</span>
              <span style="float: right;color: #8492a6; font-size: 13px;margin-right:20px">{{item['value'] }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div style="color:#606266;margin-right:12px;text-align:left;margin-bottom:5px;">日期</div>
          <el-date-picker
          :picker-options="pickerOptions"
          value-format="timestamp"
            v-model="searchParams.date"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="noselect">
          <el-button :disabled="this.searchParams['date'] === ''||this.searchParams['date'] === null ?true:false" icon="el-icon-search" @click="search" plain style="height: 30px; position: relative; margin-top: 32px">搜索</el-button>
          <el-button icon="el-icon-download" v-if="this.authority['costexport']" @click="price_form_dialogVisible = true" class="info_btn" type="info" style="height: 30px; position: relative;right:-10px;margin-left:10px;">成本导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="loading" :height="tableHeight" :header-cell-style="cellStyle2" :cell-style="cellStyle" :data="ShowTableData" style="width: 100%;margin-top:20px;min-width:840px" stripe>
      <el-table-column label="" align="center" fixed="left" width="250px">
          <el-table-column
            fixed="left"
            prop="full_name"
            label="用户"
            align="center" 
            width="180">
          </el-table-column>
          <el-table-column
            fixed="left"
            prop="sum"
            align="center" 
            label="汇总"
            width="70">
          </el-table-column>
      </el-table-column>
      <el-table-column width="20px"></el-table-column>
      <el-table-column label="大黑号" align="center">
          <el-table-column
            prop="大黑号-25"
            label="限25"
            align="center" 
            width="55">
          </el-table-column>
          <el-table-column
            prop="大黑号-50"
            align="center" 
            label="限50"
            width="55">
          </el-table-column>
          <el-table-column
            prop="大黑号-半限额"
            align="center" 
            label="半限"
            width="55">
          </el-table-column>
          <el-table-column
            prop="大黑号-不限额"
            align="center" 
            label="不限"
            width="55">
          </el-table-column>
          <el-table-column
          align="center" 
            prop="大黑号-其他"
            label="其他"
            width="55">
          </el-table-column>
      </el-table-column>
      <el-table-column width="20px"></el-table-column>
      <el-table-column label="冷黑号" align="center">
          <el-table-column
            prop="冷黑号-25"
            label="限25"
            align="center" 
            width="55">
          </el-table-column>
          <el-table-column
            prop="冷黑号-50"
            align="center" 
            label="限50"
            width="55">
          </el-table-column>
          <el-table-column
            prop="冷黑号-半限额"
            align="center" 
            label="半限"
            width="55">
          </el-table-column>
          <el-table-column
            prop="冷黑号-不限额"
            align="center" 
            label="不限"
            width="55">
          </el-table-column>
          <el-table-column
          align="center" 
            prop="冷黑号-其他"
            label="其他"
            width="55">
          </el-table-column>
      </el-table-column>
      <el-table-column width="20px"></el-table-column>
      <el-table-column label="耐用号" align="center">
          <el-table-column
            prop="耐用号-25"
            label="限25"
            align="center" 
            width="55">
          </el-table-column>
          <el-table-column
            prop="耐用号-50"
            align="center" 
            label="限50"
            width="55">
          </el-table-column>
          <el-table-column
            prop="耐用号-半限额"
            align="center" 
            label="半限"
            width="55">
          </el-table-column>
          <el-table-column
            prop="耐用号-不限额"
            align="center" 
            label="不限"
            width="55">
          </el-table-column>
          <el-table-column
          align="center" 
            prop="耐用号-其他"
            label="其他"
            width="55">
          </el-table-column>
      </el-table-column>
      <el-table-column width="20px"></el-table-column>
      <el-table-column label="专业号" align="center">
          <el-table-column
            prop="专业号-25"
            label="限25"
            align="center" 
            width="55">
          </el-table-column>
          <el-table-column
            prop="专业号-50"
            align="center" 
            label="限50"
            width="55">
          </el-table-column>
          <el-table-column
            prop="专业号-半限额"
            align="center" 
            label="半限"
            width="55">
          </el-table-column>
          <el-table-column
            prop="专业号-不限额"
            align="center" 
            label="不限"
            width="55">
          </el-table-column>
          <el-table-column
          align="center" 
            prop="专业号-其他"
            label="其他"
            width="55">
          </el-table-column>
      </el-table-column>
      <el-table-column width="20px"></el-table-column>
      <el-table-column label="BM号" align="center">
          <el-table-column
            prop="BM号-25"
            label="限25"
            align="center" 
            width="55">
          </el-table-column>
          <el-table-column
            prop="BM号-50"
            align="center" 
            label="限50"
            width="55">
          </el-table-column>
          <el-table-column
            prop="BM号-半限额"
            align="center" 
            label="半限"
            width="55">
          </el-table-column>
          <el-table-column
            prop="BM号-不限额"
            align="center" 
            label="不限"
            width="55">
          </el-table-column>
          <el-table-column
          align="center" 
            prop="BM号-其他"
            label="其他"
            width="55">
          </el-table-column>
      </el-table-column>
      <el-table-column width="20px"></el-table-column>
      <el-table-column label="信用卡" align="center">
          <el-table-column
            prop="信用卡-25"
            label="限25"
            align="center" 
            width="55">
          </el-table-column>
          <el-table-column
            prop="信用卡-50"
            align="center" 
            label="限50"
            width="55">
          </el-table-column>
          <el-table-column
            prop="信用卡-半限额"
            align="center" 
            label="半限"
            width="55">
          </el-table-column>
          <el-table-column
            prop="信用卡-不限额"
            align="center" 
            label="不限"
            width="55">
          </el-table-column>
          <el-table-column
          align="center" 
            prop="信用卡-其他"
            label="其他"
            width="55">
          </el-table-column>
      </el-table-column>
      <el-table-column width="20px"></el-table-column>
      <el-table-column label="泰铢" align="center">
          <el-table-column
            prop="泰铢-25"
            label="限25"
            align="center" 
            width="55">
          </el-table-column>
          <el-table-column
            prop="泰铢-50"
            align="center" 
            label="限50"
            width="55">
          </el-table-column>
          <el-table-column
            prop="泰铢-半限额"
            align="center" 
            label="半限"
            width="55">
          </el-table-column>
          <el-table-column
            prop="泰铢-不限额"
            align="center" 
            label="不限"
            width="55">
          </el-table-column>
          <el-table-column
          align="center" 
            prop="泰铢-其他"
            label="其他"
            width="55">
          </el-table-column>
      </el-table-column>
      <el-table-column width="20px"></el-table-column>
      <el-table-column label="印尼盾" align="center">
          <el-table-column
            prop="印尼盾-25"
            label="限25"
            align="center" 
            width="55">
          </el-table-column>
          <el-table-column
            prop="印尼盾-50"
            align="center" 
            label="限50"
            width="55">
          </el-table-column>
          <el-table-column
            prop="印尼盾-半限额"
            align="center" 
            label="半限"
            width="55">
          </el-table-column>
          <el-table-column
            prop="印尼盾-不限额"
            align="center" 
            label="不限"
            width="55">
          </el-table-column>
          <el-table-column
          align="center" 
            prop="印尼盾-其他"
            label="其他"
            width="55">
          </el-table-column>
      </el-table-column>
      <el-table-column width="20px"></el-table-column>
      <el-table-column label="欧元" align="center">
          <el-table-column
            prop="欧元-25"
            label="限25"
            align="center" 
            width="55">
          </el-table-column>
          <el-table-column
            prop="欧元-50"
            align="center" 
            label="限50"
            width="55">
          </el-table-column>
          <el-table-column
            prop="欧元-半限额"
            align="center" 
            label="半限"
            width="55">
          </el-table-column>
          <el-table-column
            prop="欧元-不限额"
            align="center" 
            label="不限"
            width="55">
          </el-table-column>
          <el-table-column
          align="center" 
            prop="欧元-其他"
            label="其他"
            width="55">
          </el-table-column>
      </el-table-column>
      <el-table-column width="20px"></el-table-column>
      <el-table-column label="邮箱" align="center">
          <el-table-column
            prop="邮箱-25"
            label="限25"
            align="center" 
            width="55">
          </el-table-column>
          <el-table-column
            prop="邮箱-50"
            align="center" 
            label="限50"
            width="55">
          </el-table-column>
          <el-table-column
            prop="邮箱-半限额"
            align="center" 
            label="半限"
            width="55">
          </el-table-column>
          <el-table-column
            prop="邮箱-不限额"
            align="center" 
            label="不限"
            width="55">
          </el-table-column>
          <el-table-column
          align="center" 
            prop="邮箱-其他"
            label="其他"
            width="55">
          </el-table-column>
      </el-table-column>
      <el-table-column width="20px"></el-table-column>
      <el-table-column label="信用卡泰铢" align="center">
          <el-table-column
            prop="信用卡泰铢-25"
            label="限25"
            align="center" 
            width="55">
          </el-table-column>
          <el-table-column
            prop="信用卡泰铢-50"
            align="center" 
            label="限50"
            width="55">
          </el-table-column>
          <el-table-column
            prop="信用卡泰铢-半限额"
            align="center" 
            label="半限"
            width="55">
          </el-table-column>
          <el-table-column
            prop="信用卡泰铢-不限额"
            align="center" 
            label="不限"
            width="55">
          </el-table-column>
          <el-table-column
          align="center" 
            prop="信用卡泰铢-其他"
            label="其他"
            width="55">
          </el-table-column>
      </el-table-column>
      <el-table-column width="20px"></el-table-column>
      <el-table-column label="信用卡欧元" align="center">
          <el-table-column
            prop="信用卡欧元-25"
            label="限25"
            align="center" 
            width="55">
          </el-table-column>
          <el-table-column
            prop="信用卡欧元-50"
            align="center" 
            label="限50"
            width="55">
          </el-table-column>
          <el-table-column
            prop="信用卡欧元-半限额"
            align="center" 
            label="半限"
            width="55">
          </el-table-column>
          <el-table-column
            prop="信用卡欧元-不限额"
            align="center" 
            label="不限"
            width="55">
          </el-table-column>
          <el-table-column
          align="center" 
            prop="信用卡欧元-其他"
            label="其他"
            width="55">
          </el-table-column>
      </el-table-column>
    </el-table>

    <!--导出表单  -->
    <el-dialog @close='closeDialog_price_form' :close-on-click-modal="false" :visible.sync="price_form_dialogVisible" width="600px" label-width="80px">
      <el-form :rules="rules" ref="outPut_form" :model="outPut_form" label-width="100px" label-position="right" v-loading="outPut_form_loading">
        <el-form-item label="日期" style="margin-right:240px" prop="date">
          <el-date-picker
            value-format="timestamp"
            v-model="outPut_form.date"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left:-330px" size="small" type="primary" @click="submitForm('outPut_form')" >确 定</el-button>
          <el-button size="small" type="primary" @click="priceItem_dialogVisible = true" >新 增</el-button>
        </el-form-item>
      </el-form>
      <el-table element-loading-spinner="el-icon-loading" element-loading-background="rgba(255,255,255,0.5)" :data="ShowTableData_price" tooltip-effect="dark" style="width: calc(100% - 60px); line-height: 30px; margin:30px;margin-top: 25px" border>
        <!-- <el-table-column prop="id" label="序号">
        </el-table-column> -->
        <el-table-column prop="account_type" label="类型">
        </el-table-column>
        <el-table-column prop="limit" label="限额">
        </el-table-column>
        <el-table-column prop="price" label="费用(RMB)">
        </el-table-column>
        <el-table-column label="操作" align="center" width="130px">
          <template slot-scope="scope">
            <el-dropdown placement="bottom" trigger="click">
              <span style="cursor: pointer;" class="el-dropdown-link">
                <i style="color: grey!important" class="el-icon-more"></i>
              </span>
              <el-dropdown-menu :visible-arrow="false" class="noselect" slot="dropdown">
                <el-dropdown-item :disabled="outPut_form_loading" type="text" size="small" @click.native="edit_del_priceItem_dialog(scope.row)">编辑项目</el-dropdown-item>
                <el-dropdown-item :disabled="outPut_form_loading" id="delAd" type="text" size="small" @click.native="del_priceItem(scope.row)">删除项目</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 新建表单 -->
    <el-dialog @close='closeDialog_priceItem' title="新增项目" :visible.sync="priceItem_dialogVisible" width="400px" :close-on-click-modal="false">
      <el-form :rules="rules" ref="priceItemDialog" :model="priceItemDialog" label-width="100px" label-position="right" v-loading="priceItem_loading">
        <el-form-item label="项目类型" class="noselect" style="margin-right:40px" prop="account_type">
          <el-input v-model="priceItemDialog.account_type" placeholder="请输入项目类型" style="width:220px">
          </el-input>
        </el-form-item>
        <el-form-item label="选择限额" class="noselect" style="margin-right: 40px" prop="limit">
          <el-select v-model="priceItemDialog.limit" filterable placeholder="选择">
            <el-option
              v-for="item in [{label:'限额25',value:'25'},{label:'限额50',value:'50'},{label:'半限额',value:'半限额'},{label:'不限额',value:'不限额'},{label:'其他',value:'其他'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="费用(RMB)" class="noselect" style="margin-right:40px" prop="price">
          <el-input v-model="priceItemDialog.price" placeholder="请输入价格" style="width:220px">
          </el-input>
        </el-form-item>
        <el-button @click="submitForm('priceItemDialog')" size="small" type="primary" class="formSubmitBtn" style="margin-right:-220px">确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 编辑表单 -->
    <el-dialog @close='closeDialog_priceItem_edit' title="编辑项目" :visible.sync="priceItem_edit_dialogVisible" width="400px" :close-on-click-modal="false">
      <el-form :rules="rules" ref="priceItemDialog_edit" :model="priceItemDialog_edit" label-width="100px" label-position="right" v-loading="priceItem_loading_edit">
        <el-form-item label="费用(RMB)" class="noselect" style="margin-right:40px" prop="price">
          <el-input v-model="priceItemDialog_edit.price" placeholder="请输入价格" style="width:220px">
            </el-input>
        </el-form-item>
        <el-button @click="submitForm('priceItemDialog_edit')" size="small" type="primary" class="formSubmitBtn" style="margin-right:-220px">确 定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { export_json_to_excel } from '../Export2Excel.js'
import utils from '../utils'
import crypto from '../crypto.js'
  export default {
    data() {
      return {
        pickerOptions: {
          disabledDate(v) {
            return v.getTime() >= new Date().getTime();
          }
        },
        resData:[],
        // 编辑
        priceItem_edit_dialogVisible:false,
        priceItem_loading_edit:false,
        priceItemDialog_edit:{
          price:null,
          id:null
        },
        // 新增
        priceItem_dialogVisible:false,
        priceItem_loading:false,
        priceItemDialog: {
          limit:null,
          price:null,
          account_type:null
        },
        outPut_form_loading:false,
        outPut_form:{
          date:null
        },
        ShowTableData_price: [],
        price_form_dialogVisible:false,
        searchParams: {
          account_user:null,
          date:null
        },
        tableHeight:620,
        chooseUser:[],
        loading:false,
        tableData:[],
        ShowTableData:[],
        rules: {
          limit: [
            { required: true, message: '限额必选', trigger: 'change' }
          ],
          price: [
            { required: true, message: '价格必填', trigger: 'blur' }
          ],
          account_type: [
            { required: true, message: '类型必填', trigger: 'blur' }
          ],
          date: [
            { required: true, message: '日期必选', trigger: 'blur' }
          ]
        },
        // authority
        authority:{}
      }
    },
    methods: {
      closeDialog_price_form() {
        this.$nextTick(() => {
          this.$refs['outPut_form'].clearValidate()
        })
      },
      closeDialog_priceItem() {
        this.$nextTick(() => {
          this.$refs['priceItemDialog'].clearValidate()
        })
      },
      closeDialog_priceItem_edit() {
        this.$nextTick(() => {
          this.$refs['priceItemDialog_edit'].clearValidate()
        })
      },
      async outPut_form_submit() {
        var date = utils.getLocalTime(this.outPut_form["date"]/1000);
        this.outPut_form_loading = true
        let formData = new FormData()
        formData.append('date',this.outPut_form["date"])
        await this.$http.post('/index.php/index/account/costExport/',formData).then((res) => {
          this.outPut_form_loading = false
          if (res.data["code"] === 200) {
            for (const k in res.data["data"]) {//遍历人员
              var zh_name = res.data["data"][k]["zh_name"]
              delete res.data["data"][k]["zh_name"]
              for (const a in res.data["data"][k]) {//遍历类型
              var obj = {"date":date,"sum":0}
                for (const b in res.data["data"][k][a]) {//遍历细则
                  obj["zh_name"] = zh_name
                  obj[`${a}_${b}`] = `${res.data["data"][k][a][b]}`
                  if (`${a}_${b}`.indexOf('price') != -1) {
                    obj["sum"] = obj["sum"] + Number(obj[`${a}_${b}`])
                  }
                }
                this.resData.push(obj)
              }
            }
            var sum_colmun = {}
            this.resData.forEach(e=> {
              for (const k in e) {
                if (Object.prototype.hasOwnProperty.call(sum_colmun, k)) {
                  sum_colmun[k] = sum_colmun[k] + Number(e[k])
                } else {
                  sum_colmun[k] = Number(e[k])
                }
              }
            })
            sum_colmun["date"] = '合计'
            sum_colmun["zh_name"] = ''
            this.resData.push(sum_colmun)
            this.exportExcel()
            this.price_form_dialogVisible = false
          } else {
            this.$message.error('操作失败')
          }
        })
      },
      async priceItemDialog_submit() {
        this.priceItem_loading = true
        let formData = new FormData()
        formData.append('account_type',this.priceItemDialog["account_type"])
        formData.append('limit',this.priceItemDialog["limit"])
        formData.append('price',this.priceItemDialog["price"])
        await this.$http.post('/index.php/index/account/costAdd/',formData).then((res) => {
          this.priceItem_loading = false
          if (res.data["code"] === 200) {
            this.$message.success(`${res.data["data"]}`)
            this.priceItem_dialogVisible = false
            this.fetchPrice()
          } else {
            this.$message.error(`${res.data["data"]}`)
          }
        })
      },
      async priceItemDialog_edit_submit() {
        this.priceItem_loading_edit = true
        let formData = new FormData()
        formData.append('price',this.priceItemDialog_edit["price"])
        formData.append('id',this.priceItemDialog_edit["id"])
        await this.$http.post('/index.php/index/account/costEdit/',formData).then((res) => {
          this.priceItem_loading_edit = false
          if (res.data["code"] === 200) {
            this.$message.success(`${res.data["data"]}`)
            this.priceItem_edit_dialogVisible = false
            this.fetchPrice()
          } else {
            this.$message.error(`${res.data["data"]}`)
          }
        })
      },
      submitForm(formName) {//表单提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'priceItemDialog') {
              this.priceItemDialog_submit()
            } else if (formName === 'priceItemDialog_edit') {
              this.priceItemDialog_edit_submit()
            } else if (formName === 'outPut_form') {
              this.outPut_form_submit()
            }
          } else {
            return false;
          }
        });
      },
      del_priceItem(e) {
        this.$confirm(`是否删除 ${e["account_type"]}`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          this.outPut_form_loading = true
          let formData = new FormData()
          formData.append("id",e.id)
          await this.$http.post("/index.php/index/account/costDelete/",formData).then((res) => {
            if (res.data["code"] === 200) {
              this.$message.success(`${res.data["data"]}`)
              this.fetchPrice();
            } else {
              this.outPut_form_loading = false
              this.$message.error(`${res.data["data"]}`)
            }
          })
        }).catch((err)=> {
          //
        })
      },
      edit_del_priceItem_dialog(e) {
        this.priceItemDialog_edit["price"] = e["price"]
        this.priceItemDialog_edit["id"] = e["id"]
        this.priceItem_edit_dialogVisible = true
      },
      search() {
        this.fetch()
      },
      async fetch() {
        this.loading = true
        let formData = new FormData()
        formData.append('date',this.searchParams["date"])
        await this.$http.post('/index.php/index/account/countAccount/',formData).then((res) => {
          var arr = []
          for (const k in res.data["data"]) {
            res.data["data"][k]["uid"] = k
            arr.push(res.data["data"][k])
            res.data["data"][k]["full_name"] = `${res.data["data"][k]["zh_name"]}(${res.data["data"][k]["uid"]})`
          }
          arr.forEach(e => {
            e["sum"] = 0
            for (const k in e) {
              if (['full_name','uid','zh_name'].indexOf(k) === -1) {
                for (const a in e[k]) {
                  e[`${k}-${a}`] = e[k][a]
                  e["sum"] = e["sum"] + e[`${k}-${a}`]
                }
              }
            }
          })
          this.chooseUser = []
          arr.forEach(e=> {
            this.chooseUser.push({"label":`${e["zh_name"]}`,"value":`${e["uid"]}`})
          })
          this.tableData = arr
          this.ShowTableData = this.tableData
          this.multiplexFilter()
          // this.getSum()
        })
        this.tableHeight = utils.setClientHight(this,298,97,44)
        this.loading = false
      },
      cellStyle({row, column, rowIndex, columnIndex}){
        var arr = [2,8,14,20,26,32,38,44,50,56,62,68]
        if(arr.indexOf(columnIndex) != -1){  
          return 'background:white;border-bottom:none'
        }
        // if (rowIndex === 0) {
        //   return 'border-top:1px solid #EBEEF5'
        // }
        // if (rowIndex === this.ShowTableData.length - 1 && columnIndex === 0) {
        //   return 'background:#F5F7FA;color:#909399;font-size:14px;font-weight:bolder;'
        //   // border-top:1px solid #EBEEF5;fixd:bottom
        // }
        // if (rowIndex === this.ShowTableData.length - 1 && columnIndex != 0) {
        //   return 'font-weight:normal;color:#606266;background:#F5F7FA;'
        //   // border-top:1px solid #EBEEF5
        // }
      } ,
      cellStyle2({row, column, rowIndex, columnIndex}){
        if (rowIndex === 0) {
          return 'background:white;border-bottom:none;'
        }
      },
      utils_run() {
        this.multiplexFilter()
      },
      multiplexFilter() {
        this.ShowTableData = this.tableData
        this.tableHeight = utils.setClientHight(this,298,97,44)
        var _this = this
        if (this.searchParams["account_user"].length === 0) {
          return this.tableData
        } else {
          _this.ShowTableData = _this.ShowTableData.filter(item => {
            return _this.searchParams["account_user"].indexOf(item["uid"]) != -1 || item["full_name"] === '汇总'
          })
        }
        // this.ShowTableData.pop()
        // this.getSum()
        this.tableHeight = utils.setClientHight(this,298,97,44)
      },
      getSum() {
        var all_sum = 0
        this.ShowTableData.forEach(e=> {
          all_sum = all_sum + e["sum"]
        })
        this.ShowTableData.push(
          {"full_name":"汇总","sum":all_sum}
        )
      },
      setTime() {
        this.searchParams["date"] = new Date(new Date().toLocaleDateString()).getTime()
      },
      async fetchPrice() {
        this.outPut_form_loading = true
        await this.$http.get('/index.php/index/account/costList/').then((res) => {
          this.outPut_form_loading = false
          this.ShowTableData_price = res.data["data"]
        })
      },
      //  -----------------------------------------------------------
      // 导出数据为表格
      async exportExcel() {
        this.loading = true
        var tHeader = ['申领日期','推广员','普通域名','.com域名','TOP域名','50限额信用卡户/充值户','25限额信用卡户/充值户','半限额信用卡户/充值户','不限额信用卡户/充值户','专业号','账单号','解封号','操作号','粉丝主页','BM','BC户','价格','普通域名','.com域名','TOP域名','50限额信用卡户/充值户','25限额信用卡户/充值户','半限额信用卡户/充值户','不限额信用卡户/充值户','专业号','账单号','解封号','操作号','粉丝主页','BM','BC户','合计']
        var filterVal = ['date','zh_name','普通域名_其他','.com域名_其他','TOP域名_其他','信用卡_50','信用卡_25','信用卡_半限额','信用卡_不限额','专业号_其他','账单号_其他','解封号_其他','操作号_其他','粉丝主页_其他','BM_其他','BC户_其他','价格','普通域名_price_其他','.com域名_price_其他','TOP域名_price_其他','信用卡_price_50','信用卡_price_25','信用卡_price_半限额','信用卡_price_不限额','专业号_price_其他','账单号_price_其他','解封号_price_其他','操作号_price_其他','粉丝主页_price_其他','BM_price_其他','BC户_price_其他','sum']
        var time = this.getCurentTime()
        var filename = `${time}`
        var data = this.formatJson(filterVal, this.resData)
        export_json_to_excel({
          header: tHeader,
          data,
          filename
        })
        this.loading = false
        this.resData = []
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
      getAuthority() {
        crypto.cryptoDecrypt_string(localStorage.getItem('authority')).split(',').forEach(e=> {
          this.authority[e] = true
        })
      }
    },
    created() {
      this.getAuthority()
      this.setTime()
      this.fetch()
      this.fetchPrice()
    },
    computed: {
      clientHeight_watch () {
        return this.$store.state.clientHeight || Number(document.documentElement.clientHeight)
      }
    },
    watch: {
      clientHeight_watch (val) {
        var _this = this;
        _this.tableHeight = utils.setClientHight(_this,298,97,44)
      }
    },
  }
</script>

<style scoped>
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
  .el-button--primary.is-disabled {
    border-color: #DCDFE6!important;
    color:#C0C4CC!important;
    background-color: white!important;
  }

  .el-button--primary.is-disabled:hover {
    color: #C0C4CC!important;
  }
  #delAd:hover {
    color: rgb(245, 108, 108);
    background-color: rgb(254, 240, 240);
  }
</style> 