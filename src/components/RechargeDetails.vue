<template>
    <div>
        <!-- 搜索框 -->
        <div style="display: flex;position:relative;min-width:1460px;margin-top:70px">
            <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap;" :disabled="loading">
                <el-form-item label="充值日期" class="noselect" style="margin-right: 30px">
                    <el-date-picker :picker-options="pickerOptions" value-format="timestamp" style="width:250px" v-model="searchParams.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="推广" class="noselect" style="margin-right: 30px;" prop="new_user">
                    <el-select clearable style="width:190px" v-model="searchParams.user" placeholder="筛选" filterable>
                        <el-option v-for="(item,index) in userList" :key="index" :label="item['zh_name']" :value="item['uid']">
                            <span style="float: left">{{ item['zh_name'] }}</span>
                            <span style="float: right;color: #8492a6; font-size: 13px">{{item['uid'] }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="卡号" class="noselect" style="margin-right:30px">
                    <el-input v-model="searchParams.card_id" placeholder="搜索卡号" clearable style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="账户名称" class="noselect" style="margin-right:30px">
                    <el-input v-model="searchParams.account_name" placeholder="搜索账户名称" clearable style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="广告账号ID" class="noselect" style="margin-right:30px">
                    <el-input v-model="searchParams.ad_id" placeholder="搜索广告账号ID" clearable style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item class="noselect">
                    <el-button icon="el-icon-search" @click="research(1)" plain style="height: 30px; position: relative;">搜索</el-button>
                </el-form-item>
                <el-form-item class="noselect">
                    <el-button :disabled="this.standBy_search === null" class="info_btn" icon="el-icon-download" @click="exportExcel" type="info" style="height: 30px; position: relative;right:-10px;" >导出</el-button>
                    <el-button type="text" icon="el-icon-refresh-left" @click="fetch()" style="padding: 0;padding-left: 15px;color:#909399;font-size:15px"></el-button>
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
        style="width:calc(100%-60px);line-height:30px;margin:5px 0px;min-width:1430px;margin-bottom:25px"
        :row-style="{height: '50px'}"
        border
        @selection-change="handleSelectionChange_delete">
        <el-table-column prop="id" label="系统ID" width="100px">
        </el-table-column>
        <el-table-column prop="zh_name" label="推广" width="250px">
            <template slot-scope="scope">
                <div>{{scope.row.zh_name}}({{scope.row.user}})</div>
            </template>
        </el-table-column>
        <el-table-column prop="card_id" label="卡号" width="250px">
        </el-table-column>
        <el-table-column prop="ad_id" label="广告账号ID" width="300px">
        </el-table-column>
        <el-table-column prop="account_name" label="账号名称" width="300px">
        </el-table-column>
        <el-table-column prop="num" label="金额" width="100px">
        </el-table-column>
        <el-table-column prop="date" label="充值时间" min-width="200px">
        </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block" style="position: relative; right: 0px; margin-bottom: 25px;" v-if="!loading">
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

    <!-- 新建表单 -->
    <el-dialog @close='closeDialog_exchangerate' title="新增货币" :visible.sync="new_exchangerate_dialogVisible" width="400px" :close-on-click-modal="false">
        <el-form :rules="rules" ref="exchangerateDialog_new" :model="exchangerateDialog_new" label-width="100px" label-position="right" v-loading="new_exchangerate_loading">
            <el-form-item label="货币全称" class="noselect" style="margin-right:40px" prop="currency_zh">
                <el-input v-model="exchangerateDialog_new.currency_zh" placeholder="请输入货币" style="width:220px">
                </el-input>
            </el-form-item>
            <el-form-item label="货币缩写" class="noselect" style="margin-right:40px" prop="currency">
                <el-input v-model="exchangerateDialog_new.currency" placeholder="请输入货币" style="width:220px">
                </el-input>
            </el-form-item>
            <el-form-item label="汇率" class="noselect" style="margin-right:40px" prop="exchange_rate">
                <el-input v-model="exchangerateDialog_new.exchange_rate" placeholder="请输入汇率" style="width:220px">
                </el-input>
            </el-form-item>
            <el-button @click="submitForm('exchangerateDialog_new')" size="small" type="primary" class="formSubmitBtn" style="margin-right:-220px">确 定</el-button>
        </el-form>
    </el-dialog>

    <!-- 编辑表单 -->
    <el-dialog @close='closeDialog_exchangerate_edit' title="编辑货币" :visible.sync="edit_exchangerate_dialogVisible" width="400px" :close-on-click-modal="false">
        <el-form :rules="rules" ref="exchangerateDialog_edit" :model="exchangerateDialog_edit" label-width="100px" label-position="right" v-loading="exchangerate_loading_edit">
            <el-form-item label="汇率" class="noselect" style="margin-right:40px" prop="exchange_rate">
            <el-input v-model="exchangerateDialog_edit.exchange_rate" placeholder="请输入汇率" style="width:220px">
                </el-input>
            </el-form-item>
            <el-button @click="submitForm('exchangerateDialog_edit')" size="small" type="primary" class="formSubmitBtn" style="margin-right:-220px">确 定</el-button>
        </el-form>
    </el-dialog>
</div>
</template>

<script>
import crypto from '../crypto.js'
import utils from '../utils'
var reg2 = new RegExp(/^[0-9.]{1,10}$/)
var validatePass2 = (rule, value, callback) => {
    if (value === '' || value === null) {
        callback(new Error('汇率必填'))
    } else if (value != '' && value != null) {
        reg2.test(value) ? callback() : callback(new Error('请检查输入的内容格式'))
    }
};
import { export_json_to_excel } from '../Export2Excel.js'
    export default {
        data() {
        return {
            pickerOptions: {
                disabledDate(v) {
                    return v.getTime() >= new Date().getTime();
                }
            },
            userList:[],
            // 汇率
            ShowTableData_exchangerate:[],
            exchangerate_form_dialogVisible:false,
            exchangerate_loading:false,
            new_exchangerate_dialogVisible:false,
            edit_exchangerate_dialogVisible:false,
            new_exchangerate_loading:false,
            // 编辑汇率
            exchangerate_loading_edit:false,
            exchangerateDialog_edit:{
                exchange_rate:null,
                id:null
            },
            // 新建汇率
            exchangerateDialog_new: {
                exchange_rate:null,
                currency:null,
                currency_zh:null
            },
            // 
            apply_limit:[],
            new_form_btn:false,
            maxNum:5,
            chooseOptions: {
            type:[],
            limit:[],
            batch:[]
            },
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
            // 导出表单
            export_form_dialogVisible: false,
            export_form: {
            selected: null
            },
            // 详情抽屉
            detail_account:null,
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
            detail_apply_reason:null,
            detail_refuse_reason:null,
            table: false,
            innerDrawer: false,
            innerDrawer_ua: false,
            tbloading:false,
            // 加载界面显示与否
            loading: true,
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
                account:null,
                date:null,
                user:null,
                card_id:null,
                ad_id:null,
            },
            //校验规则
            rules: {
                currency_zh:[
                    { required: true, message: '全称必填', trigger: 'blur' }
                ],
                currency:[
                    { required: true, message: '缩写必填', trigger: 'blur' }
                ],
                exchange_rate:[
                    { validator: validatePass2, required: true,trigger: 'blur' }
                ]
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
            this.fetchUser()
            this.getUid()
            this.fetch()
        },

        methods: {
            async fetchUser() {
                await this.$http.get('/index.php/index/account/userList/').then((res)=> {
                    this.userList = res.data["data"]
                })
            },
            // 汇率设置
            edit_exchangerate_dialog(e) {
                this.edit_exchangerate_dialogVisible = true
                this.exchangerateDialog_edit["id"] = e["id"]
                this.exchangerateDialog_edit["exchange_rate"] = e["num"]
            },
            closeDialog_exchangerate() {
                this.$nextTick(() => {
                    this.$refs['exchangerateDialog_new'].clearValidate()
                })
                this.exchangerateDialog_new["exchange_rate"] = null
                this.exchangerateDialog_new["currency"] = null
                this.exchangerateDialog_new["currency_zh"] = null
            },
            closeDialog_exchangerate_edit() {
                this.$nextTick(() => {
                    this.$refs['exchangerateDialog_edit'].clearValidate()
                })
            },
            async exchangerateDialog_new_submit() {
                this.new_exchangerate_loading = true
                let formData = new FormData()
                formData.append('num',this.exchangerateDialog_new["exchange_rate"])
                formData.append('currency',this.exchangerateDialog_new["currency"])
                formData.append('currency_zh',this.exchangerateDialog_new["currency_zh"])
                await this.$http.post('/index.php/index/account/addRate/',formData).then((res) => {
                    this.new_exchangerate_loading = false
                    if (res.data["code"] === 200) {
                        this.$message.success(`${res.data["data"]}`)
                        this.new_exchangerate_dialogVisible = false
                        this.fetch_exchangerate()
                    } else {
                        this.$message.error(`${res.data["data"]}`)
                    }
                })
            },
            async exchangerateDialog_edit_submit() {
                this.exchangerate_loading_edit = true
                let formData = new FormData()
                formData.append('num',this.exchangerateDialog_edit["exchange_rate"])
                formData.append('id',this.exchangerateDialog_edit["id"])
                await this.$http.post('/index.php/index/account/editRete/',formData).then((res) => {
                    this.exchangerate_loading_edit = false
                    if (res.data["code"] === 200) {
                        this.$message.success(`${res.data["data"]}`)
                        this.edit_exchangerate_dialogVisible = false
                        this.fetch_exchangerate()
                    } else {
                        this.$message.error(`${res.data["data"]}`)
                    }
                })
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
            exportExcel() {
                for (const key in this.searchParams) {//去除无效属性
                    if (this.searchParams[key] === null || this.searchParams[key] === '') {
                        delete this.searchParams[key]
                    }
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
                    delete standBy_downLoad["project"]
                    delete standBy_downLoad["page"]
                    delete standBy_downLoad["num"]
                    let formData = new FormData()
                        for (const key in standBy_downLoad) {
                            formData.append(`${key}`,standBy_downLoad[key])
                        }
                        await this.$http.post('/index.php/index/account/searchPay/',formData).then((res)=> {
                            arr = res.data["data"]
                        })
                    var tHeader = ['推广','信用卡号','广告账号ID','账号名称','金额','充值时间']
                    var filterVal = ['zh_name','card_id','ad_id','account_name','num','date']
                    var time = this.getCurentTime()
                    var filename = `${time}`
                    arr.forEach(e=> {
                        e["date"] = utils.getLocalTime(parseInt(e["date"]));
                    })
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
            // 分页
            async handleSizeChange(val) {// 页大小
                if (this.searchPageChange === false && this.useSearchData === false) {
                    this.loading = true;
                    let formData = new FormData()
                    formData.append("page",1)
                    formData.append("num",val)
                    await this.$http.post("/index.php/index/account/payRecord/",formData).then((res) => {
                        res.data["data"].forEach(e=> {
                            e["date"] = utils.getLocalTime(parseInt(e["date"]));
                        })
                        this.tableData = res.data["data"]
                        this.totalNum = res.data["sum"]
                        this.ShowTableData = this.tableData;
                        this.currentPage = 1
                        this.pageSize = val
                        this.tableHeight = utils.setClientHight(this,255,56,50)
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
                await this.$http.post("/index.php/index/account/payRecord/",formData).then((res) => {
                    res.data["data"].forEach(e=> {
                        e["date"] = utils.getLocalTime(parseInt(e["date"]));
                    })
                    this.tableData = res.data["data"]
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
                await this.$http.post("/index.php/index/account/payRecord/",formData).then((res) => {
                res.data["data"].forEach(e=> {
                    e["date"] = utils.getLocalTime(parseInt(e["date"]));
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
            handleSelectionChange_delete(val) {//有选中项目时触发
                if (val.length === 0) {
                this.showBadge = false
                } else {
                this.showBadge = true
                this.badge_num = val.length
                }
                this.excelData = val
                this.multipleSelection_delete = val;
                if (val != '') {
                this.showIf = false
                } else {
                this.showIf = true
                }
                this.output_arr = utils.deepClone(val)
            },
            getUid() { // 获取用户uid
                this.uid = localStorage.getItem("uid")
                this.zh_name = localStorage.getItem("zh_name")
            },
            //表单提交
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (formName === 'exchangerateDialog_new') {
                            this.exchangerateDialog_new_submit()
                        } else if (formName === 'exchangerateDialog_edit') {
                            this.exchangerateDialog_edit_submit()
                        }
                        else {
                        this.account_back_submit()
                        }
                    } else {
                        return false;
                    }
                });
            },
            // 搜索
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
                for (const key in this.searchParams) {
                    formData.append(`${key}`,this.searchParams[key])
                }
                formData.delete('date')
                if (this.searchParams["date"] != undefined) {
                var arr2 = []
                this.searchParams["date"].forEach(e=> {
                    arr2.push(e/1000)
                })
                formData.append('date',arr2)
                }
                await this.$http.post('/index.php/index/account/searchPay/',formData).then((res) => {
                    this.totalMoney = res.data["money"]
                    res.data["data"].forEach(e=> {
                        e["date"] = utils.getLocalTime(parseInt(e["date"]));
                    })
                    this.standBy_search = utils.deepClone(this.searchParams)//缓存搜索项
                    this.searchPageChange = true
                    this.useSearchData = true
                    this.totalNum = res.data["sum"]
                    this.currentPage = val
                    this.tableData = res.data["data"]
                    this.ShowTableData = this.tableData
                    this.currentPage = 1
                    this.tableHeight = utils.setClientHight(this,255,56,50)
                    this.loading = false
                })
                }
                // 搜索后换页/页大小
                else if(this.searchPageChange === true && this.useSearchData === true){
                this.standBy_search["page"] = val
                this.standBy_search["num"] = this.pageSize
                let formData = new FormData()
                for (const key in this.standBy_search) {
                formData.append(`${key}`,this.standBy_search[key])
                }
                formData.delete('date')
                if (this.searchParams["date"] != undefined) {
                var arr3 = []
                this.searchParams["date"].forEach(e=> {
                    arr3.push(e/1000)
                })
                formData.append('date',arr3)
                }
                await this.$http.post('/index.php/index/account/searchPay/',formData).then((res) => {
                    this.searchPageChange = true
                    this.useSearchData = true
                    this.totalNum = res.data["sum"]
                    this.currentPage = val
                    this.tableData = res.data["data"]
                    this.ShowTableData = this.tableData
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
    #delAd:hover {
        color: rgb(245, 108, 108);
        background-color: rgb(254, 240, 240);
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
    .image-slot{
        line-height: 58px!important;
    }

</style>
