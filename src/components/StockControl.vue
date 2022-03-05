<template>
  <div >
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;min-width:1045px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap;width:100%;justify-content: space-between" :disabled="loading">
        <el-form-item class="noselect">
          <el-input v-model="searchParams.accurateSearch" placeholder="搜索域名" clearable style="width: 200px;margin-right:10px"></el-input>
          <el-button icon="el-icon-search" @click="search" plain style="height: 30px; position: relative; margin-top: 32px" >搜索</el-button>
          <!-- 数量显示 -->
          <div style="width:100%;height:25px;margin-bottom:8px;text-align:left;min-width:330px;display:inline;margin-left:20px">
            <div style="display:inline-block;margin-right:20px"><p style="display:inline-block;font-weight: bolder;color:#909399;">域名总数：</p>{{this.statistics.sum}}</div>
            <div style="display:inline-block;margin-right:20px"><p style="display:inline-block;font-weight: bolder;color:#909399;">使用总数：</p>{{this.statistics.use_in}}</div>
            <div style="display:inline-block;margin-right:20px"><p style="display:inline-block;font-weight: bolder;color:#909399;">未使用总数：</p>{{this.statistics.use_not}}</div>
          </div>
        </el-form-item>
        <el-form-item class="noselect">
          <el-button style="height: 30px; position: relative;right: -10px; margin-top: 32px;margin-left:25px;" icon="el-icon-download" @click="output_form_dialogVisible = true" class="getDomain"  type="info">域名导出</el-button>
          <el-button style="height: 30px; position: relative;right: -10px; margin-top: 32px;margin-left:25px;" icon="el-icon-upload2" @click="import_form_dialogVisible = true" class="getDomain"  type="info">域名导入</el-button>
          <!-- <el-button style="height: 30px; position: relative;right: -10px; margin-top: 32px;margin-left:25px;" icon="el-icon-plus" @click="import_server_dialogVisible = true" class="getDomain"  type="info">新增服务器</el-button> -->
          <el-button class="getDomain iconfont icon-host" style="height: 30px; position: relative;right: -10px; margin-top: 32px;margin-left:25px;font-size:12px" @click="show_server()" type="info"> 服务器列表</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!--服务器列表  -->
    <el-dialog title="服务器列表" :close-on-click-modal="false" :visible.sync="show_server_dialogVisible" width="800px" label-width="80px">
      <div style="position:relative;width:100%;height:25px;margin-left:23px">
        <el-button class="info_btn" size="small" :disabled="show_server_loading" style="position:absolute;left:7px"  @click="import_server_dialogVisible = true" type="info">添加服务器</el-button>
      </div>
      <el-table highlight-current-row v-loading="show_server_loading" element-loading-background="rgba(255,255,255,0.5)" :data="ShowTableData_server" tooltip-effect="dark" style="width: calc(100% - 60px); line-height: 30px; margin:30px;margin-top: 25px" border>
        <!-- <el-table-column prop="id" label="序号">
        </el-table-column> -->
        <el-table-column prop="server_name" label="server_name" width="150px">
        </el-table-column>
        <el-table-column prop="team" label="team" width="100px">
        </el-table-column>
        <el-table-column prop="path" label="path" width="200px">
        </el-table-column>
        <el-table-column prop="ip" label="ip" width="150px">
        </el-table-column>
        <el-table-column prop="ad" label="ad" width="250px">
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 库存显示 -->
    <div style="width:100%;display:flex;flex-wrap:wrap;min-width:1045px">
      <div style="display:inline-block;line-height:33px;color:#909399;font-weight:bolder;">各类总数：&nbsp;&nbsp;</div>
      <el-tag style="margin-right:20px;margin-bottom:15px" v-for="(item,key,index) in domainStock" :key="index" type="info"><p style="display:inline-block;font-weight:bolder">{{key}}</p>:{{item}}</el-tag>
    </div>

    <!-- 表格 -->
    <el-table
      highlight-current-row
      :max-height="tableHeight"
      :key="key"
      v-loading="loading"
      element-loading-background="rgba(255,255,255,0.5)"
      ref="multipleTable"
      :cell-style="{padding:'10px 0!important'}"
      :data="ShowTableData"
      :header-cell-style="cellStyle2"
      tooltip-effect="dark"
      style="width:calc(100%-60px);line-height:30px;margin:5px 0 25px 0;min-width:1045px;">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column prop="" label="详情" width="50px">
        <template slot-scope="scope">
          <el-button
          v-if="scope.row['subDomain'].length != 0"
            type="text" icon="el-icon-arrow-right"
            size="small"
            @click="tableOpen(scope.row)"
            style="padding:0 0 0 9px;color:#909399;"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="domain_name" label="域名" width="230px"></el-table-column>
      <el-table-column prop="zh_name" label="用户" width="190px">
        <template slot-scope="scope">
          <div v-if="scope.row['user'] != null">{{scope.row["zh_name"]}}({{scope.row["user"]}})</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="是否在使用" width="190px">
        <template slot-scope="scope">
          <span v-if="scope.row.use_in === '0'">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column label="是否删除" width="190px">
        <template slot-scope="scope">
          <span v-if="scope.row.delete === '0'">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column  label="是否出售" width="190px">
        <template slot-scope="scope">
          <span v-if="scope.row.sell === '0'">否</span>
          <span v-else>是</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time_change" label="购买时间" width="210px"></el-table-column>
      <el-table-column prop="expiring_time_change" label="到期时间" width="210px"></el-table-column>
      <!-- <el-table-column fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-dropdown placement="bottom" trigger="click">
            <span style="cursor: pointer;" class="el-dropdown-link">
              <i style="color: grey!important" class="el-icon-more"></i>
            </span>
            <el-dropdown-menu :visible-arrow="false" class="noselect" slot="dropdown">
              <el-dropdown-item :disabled="scope.row.use_in === '1' ? true:false" type="text" size="small" @click.native="domainDistribution(scope.row)">域名分配</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-tooltip content="域名分配" placement="top" :visible-arrow="false">
            <el-button  @click="domainDistribution(scope.row)" icon="el-icon-sort-up" style="font-size:13px;color:grey;padding:0" type="text"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block" style="position: relative; right: 0px;min-width:1025px;" v-if="!loading">
      <el-pagination :page-size="20" background @current-change="fetchPageData()" :current-page.sync="currentPage" layout="total,prev, pager, next" :total="totalNum" :disabled="loading">
      </el-pagination>
    </div>

    <!-- 详情抽屉 -->
    <el-drawer class="noselect" title="详情" :visible.sync="table" direction="rtl" size="600px">
      <el-form ref="makeOver_form" label-width="100px" label-position="left" style="padding-left:70px;min-height:500px" v-loading="loadingDetail">
        <el-form-item size="small" label="子域名: " class="noselect">
          <p style="text-align:left;text-decoration:underline;cursor: pointer;" v-for="item in detail_subDomain" :key="item" :label="item" :value="item"  v-clipboard:copy="item" v-clipboard:success="onCopy" v-clipboard:error="onError">{{item}}</p>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 域名分配 -->
    <el-dialog title="域名分配" :visible.sync="domainDistribution_dialogVisible" width="400px" :close-on-click-modal="false">
      <el-form label-width="100px" label-position="right" v-loading="distribution_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择用户" class="noselect" style="margin-right: 40px">
              <el-select v-model="domainDistribution_dialog.uid" filterable placeholder="选择">
                <!-- <el-option   v-for="item in userList" :key="item.uid" :value="item.uid" :label="item.zh_name"> -->
                <el-option   v-for="(item,key,index) in userList" :key="index" :value="item.uid" :label="item.zh_name">
                  <span style="float: left">{{ item.zh_name}}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.uid }}</span> 
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button @click="domainDistribution_submit" size="small" type="primary" class="formSubmitBtn" style="margin-right:-220px">确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 导入域名表单 -->
    <el-dialog :close-on-click-modal="false" title="导入域名" :visible.sync="import_form_dialogVisible" width="450px" @close='closeDialog_import'>
      <el-form :rules="rules" ref="import_form" :model="import_form" label-width="100px" label-position="right" v-loading="import_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="组别"  prop="team">
              <el-select v-model="import_form.team" placeholder="选择组别" clearable style="margin-right: 40px">
                <el-option v-for="(item,index) in group_list_import" :key="index" :label="item['team']" :value="item['id']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="价格" class="noselect" style="margin-right: 40px" prop="domain_price">
              <el-input placeholder="输入价格" v-model="import_form.domain_price" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="有效期" class="noselect" style="margin-right: 40px" prop="domain_expire">
              <el-input placeholder="输入有效期" v-model="import_form.domain_expire" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="域名" class="noselect" style="margin-right: 40px" prop="domain_arr">
              <el-input type="textarea" placeholder="输入域名" v-model="import_form.domain_arr" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button @click="submitForm('import_form')" size="small" type="primary" class="formSubmitBtn" style="margin-right: -270px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 新增服务器表单 -->
    <el-dialog :close-on-click-modal="false" title="新增服务器" :visible.sync="import_server_dialogVisible" width="450px" @close='closeDialog_server'>
      <el-form :rules="rules" ref="import_server" :model="import_server" label-width="120px" label-position="right" v-loading="server_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="server_name" class="noselect" style="margin-right: 40px" prop="server_name">
              <el-input placeholder="输入server_name" v-model="import_server.server_name" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="bt_key" class="noselect" style="margin-right: 40px" prop="bt_key">
              <el-input placeholder="输入bt_key" v-model="import_server.bt_key" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="panel_url" class="noselect" style="margin-right: 40px" prop="panel_url">
              <el-input placeholder="输入panel_url" v-model="import_server.panel_url" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="ip" class="noselect" style="margin-right: 40px" prop="ip">
              <el-input placeholder="输入ip" v-model="import_server.ip" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="cf_config_id"  prop="cf_config_id">
              <el-select v-model="import_server.cf_config_id" placeholder="选择组别" clearable style="margin-right: 40px">
                <el-option v-for="(item,index) in group_list_import" :key="index" :label="item['team']" :value="item['id']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col v-if="import_server.cf_config_id != 1" :span="24">
            <el-form-item label="path" class="noselect" style="margin-right: 40px" prop="path">
              <el-input placeholder="输入path" v-model="import_server.path" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="import_server.cf_config_id === 1" :span="24">
            <el-form-item label="ad" class="noselect" style="margin-right: 40px" prop="ad">
              <el-input placeholder="输入ad" v-model="import_server.ad" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button @click="submitForm('import_server')" size="small" type="primary" class="formSubmitBtn" style="margin-right: -270px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 导出域名表单 -->
    <el-dialog :close-on-click-modal="false" title="导出域名" :visible.sync="output_form_dialogVisible" width="450px" @close='closeDialog_output'>
      <el-form :rules="rules" ref="output_form" :model="output_form" label-width="100px" label-position="right" v-loading="output_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="分组" class="noselect" style="margin-right: 40px" prop="group">
              <el-select v-model="output_form.group" placeholder="选择导出组别" clearable style="width:270px">
                <el-option v-for="(item,index) in group_list" :key="index" :label="item['label']" :value="item['value']">
                  <span style="float: left">{{ item['label'] }}</span>
                  <span style="float: right;color: #8492a6; font-size: 13px">{{item['value'] }}</span>
                  <span style="float: right;color: #8492a6; font-size: 13px">{{item['parent'] }}&nbsp;&nbsp;</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="月份" class="noselect" style="margin-right: 40px" prop="date">
              <el-date-picker
                :picker-options="pickerOptions"
                value-format="timestamp"
                style="width:270px"
                v-model="output_form.date"
                type="month"
                placeholder="选择导出月份">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button @click="submitForm('output_form')" size="small" type="primary" class="formSubmitBtn" style="margin-right: -270px" >确 定</el-button>
      </el-form>
    </el-dialog>
  </div>
  
</template>

<script>
import crypto from '../crypto.js'
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
      show_server_dialogVisible:false,
      show_server_loading:false,
      ShowTableData_server:[],
      //校验规则
      rules: {
        server_name:[
          { required: true, message: 'server_name必填', trigger: 'blur' }
        ],
        bt_key:[
          { required: true, message: 'bt_key必填', trigger: 'blur' }
        ],
        panel_url:[
          { required: true, message: 'panel_url必填', trigger: 'blur' }
        ],
        ip:[
          { required: true, message: 'ip必填', trigger: 'blur' }
        ],
        cf_config_id:[
          { required: true, message: 'cf_config_id必选', trigger: 'change' }
        ],
        path:[
          { required: true, message: 'path必填', trigger: 'blur' }
        ],
        group: [
          { required: true, message: '请选择组别', trigger: 'change' }
        ],
        date: [
          { required: true, message: '请选择组别', trigger: 'change' }
        ],
        team: [
          { required: true, message: '请选择团队', trigger: 'change' }
        ],
        domain_price:[
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        domain_expire:[
          { required: true, message: '请输入有效期', trigger: 'blur' }
        ],
        domain_arr:[
          { required: true, message: '请输入域名', trigger: 'blur' }
        ],
        ad:[
          { required: true, message: '请输入ad', trigger: 'blur' }
        ]
      },
      import_form_dialogVisible:false,
      import_server_dialogVisible:false,
      import_loading:false,
      import_form:{
        domain_price: null,
        domain_expire: null,
        domain_arr: null,
        team:null
      },
      server_loading:false,
      import_server:{
        server_name:'',
        bt_key:'',
        panel_url:'',
        ip:'',
        cf_config_id:'',
        path:'',
        ad:''
      },
      output_form_dialogVisible:false,
      output_loading:false,
      output_form:{
        group:null,
        date:null,
      },
      tableHeight:530,
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
      userList:null,
      group_list:[],
      group_list_import:[],
      standBy_group:[]
      // [{'label':'减肥组','value':'1,5'},{'label':'丰胸组','value':'1,6'},{'label':'已购买域名','value':'已购买域名'}]
    };
  },

  created() {
    this.fetchGroupData()
    this.fetch();
    this.fetchGroupData_import()
  },

  methods: {
    async show_server() {
      this.show_server_loading = true
      this.show_server_dialogVisible = true
      await this.$http.get('index.php/index//domain/showBt').then((res) => {
        this.show_server_loading = false
        this.ShowTableData_server = res.data["data"]
      })
    },
    async fetchGroupData_import() {
      await this.$http.get('index.php/index//domain/teamList').then((res)=> {
        this.group_list_import = res.data["data"]
      })
    },
    async fetchGroupData() { //获取分组信息
      this.group_list = JSON.parse(crypto.cryptoDecrypt_string(localStorage.getItem("role_list")))
      this.traversal_findGroup_options(this.group_list,'推广部','COD1',"COD2","COD3")
    },
    traversal_findGroup_options(obj,targetA,targetB,targetC,targetD){//获取分组信息
      obj.forEach(e=> {
        if(e["group"] == targetA || e["group"] == targetB || e["group"] == targetC || e["group"] == targetD){
          this.standBy_group.push(e)
        }
      })
      this.traversal_findGroup_options_detail()
    },
    traversal_findGroup_options_detail() {
      this.group_list = []
      this.standBy_group.forEach(e=> {
        if (e["children"]) {
          e["children"].forEach(i=> {
            this.group_list.push({"label":`${i['group']}`,"value":`${e['id']},${i['id']}`,"parent":`${e["group"]}`})
          })
        } else {
          this.group_list.push({"label":`${e['group']}`,"value":`${e['id']}`,"parent":"无父级"})
        }
      })
      this.group_list.push({"label":"已购买域名","value":"已购买域名","parent":""})
    },
    closeDialog_import() {
      this.$nextTick(() => {
        this.$refs['import_form'].clearValidate()
      })
    },
    closeDialog_server() {
      this.$nextTick(() => {
        this.$refs['import_server'].clearValidate()
      })
      for (const key in this.import_server) {
        this.import_server[key] = null
      }
    },
    closeDialog_output() {// 关闭dialog时清空验证
      this.$nextTick(() => {
        this.$refs['output_form'].clearValidate()
      })
    },
    //表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'output_form') {
            this.onSubmit_output()
          } else if (formName === 'import_server') {
            this.onSubmit_server()
          } else {
            this.onSubmit_import()
          }
        } else {
          return false;
        }
      });
    },
    async onSubmit_server() {
      this.server_loading = true
      let formData = new FormData()
      formData.append('data',JSON.stringify(this.import_server))
      await this.$http.post('/index.php/index/domain/addServer/',formData).then((res) => {
        this.server_loading = false
        if (res.data["code"] === 200) {
          this.$message.success(`${res.data["data"]}`)
          this.import_server_dialogVisible = false
          this.show_server_dialogVisible = false
        } else {
          this.$message.error(`${res.data["data"]}`)
        }
      })
    },
    async onSubmit_output() {
      this.output_loading = true
      let formData = new FormData()
      var link
      var tHeader
      var filterVal
      var filename
      var date = new Date(this.output_form["date"])
      var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1)
      if (this.output_form["group"] === '已购买域名') {
        link = '/index.php/index/domain/exportBuy/'
        formData.append('date',this.output_form["date"])
        tHeader = ['姓名','用户ID','组别','域名','购买时间','状态']
        filterVal = ['zh_name','user','group','domain_name','create_time','delete']
      } else {
        link = '/index.php/index/domain/exportDomian/'
        formData.append('date',this.output_form["date"])
        formData.append('group',this.output_form["group"])
        tHeader = ['姓名','用户ID','组别','域名','申请时间','状态']
        filterVal = ['zh_name','user','group','domain_name','apply_time','delete']
      }
      await this.$http.post(link,formData).then((res) => {
        if (res.data["data"].length === 0) {
          this.$message.warning('无数据，不予导出')
        } else {
            if (this.output_form["group"] === '已购买域名') {
              filename = `已购买域名-${date.getFullYear()}-${M}`
            } else {
              filename = `${res.data["data"][0]["group"]}-${date.getFullYear()}-${M}`
            }
            var data = this.formatJson(filterVal, res.data["data"])
            export_json_to_excel({
              header: tHeader,
              data,
              filename
            })
        }
        this.output_loading = false
      })
    },
    async onSubmit_import() {
        this.import_loading = true
        let formData = new FormData()
        formData.append('domain_arr',this.import_form["domain_arr"])
        formData.append('domain_expire',this.import_form["domain_expire"])
        formData.append('domain_price',this.import_form["domain_price"])
        formData.append('team',this.import_form["team"])
        await this.$http.post('/index.php/index/cfapi/zoneArr/',formData).then((res) => {
          this.import_loading = false
          this.import_form_dialogVisible = false
          this.fetch();
          var arr = []
          for (const key in res.data) {
            arr.push(res.data[key])
          }
          this.dataList = arr
          this.exportExcel()
        })
    },
    //  -----------------------------------------------------------
    // 导出数据为表格
    exportExcel() {
      var tHeader = ['id', 'user', 'domain_name','use_in','zone_id','create_time','price','expiring_time','apply_time','delete','delete_time','sell','https_site','fb_check','remark']
      var filterVal = ['id', 'user','domain_name','use_in','zone_id','create_time','price','expiring_time','apply_time','delete','delete_time','sell','https_site','fb_check','remark']
      var time = this.getCurentTime()
      var filename = `COD2-${time}`
      var data = this.formatJson(filterVal, this.dataList)
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
            clock += hh + "时";
            var mm = now.getMinutes();
            if (mm < 10) {
              clock += '0';
            }
            clock += mm + "分";
            var ss = now.getSeconds();
            if (ss < 10) {
              clock += '0';
            }
            clock += ss + "秒";
        }
        if (isTime == false) {
          clock += day;
        }
        return clock;
    },
      // -----------------------------------------------------------
    async fetchPageData() {// 点击页码
      this.loading = true;
      if (this.useSearchData === false) {
        let formData = new FormData();
        formData.append("page", this.currentPage);
        formData.append("user",1000)
        await this.$http.post("/index.php/index/domain/domainStock/",formData).then((res) => {
          res.data["domain"].forEach(e=> {
            e["create_time_change"] = this.getLocalTime(parseInt(e["create_time"]));
            e["apply_time_change"] = this.getLocalTime(parseInt(e["apply_time"]));
            e["expiring_time_change"] = this.getLocalTime(parseInt(e["expiring_time"]));
          })
          this.ShowTableData = res.data["domain"]
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
        this.tableHeight = utils.setClientHight(this,330,57,44)
    },
    async search() {// 搜索
      this.loading = true;
      this.useSearchData = true;
      this.currentPage = 1;
      let formData = new FormData();
      formData.append("domain",this.searchParams.accurateSearch)
      formData.append("user",1000)
      if (this.searchParams.accurateSearch === null || this.searchParams.accurateSearch === '') {
        this.useSearchData = false;
        this.fetch()
      } else {
          await this.$http.post("/index.php/index/domain/domainSearch/",formData).then((res) => {
          this.tableData = res.data["subDomain"]
          this.totalNum = res.data["subDomain"].length
          res.data["subDomain"].forEach(e=> {
            e["create_time_change"] = this.getLocalTime(parseInt(e["create_time"]));
            e["apply_time_change"] = this.getLocalTime(parseInt(e["apply_time"]));
            e["expiring_time_change"] = this.getLocalTime(parseInt(e["expiring_time"]));
          })
          this.ShowTableData =[]
          if (res.data["subDomain"].length <=20) {
            for (let i = 0; i < res.data["subDomain"].length; i++) {
              this.ShowTableData.push(res.data["subDomain"][i])
            }
          } else {
              for (let i = 0; i < 20; i++) {
                this.ShowTableData.push(res.data["subDomain"][i])
              }
          }
          this.loading = false;
        });
      }
      this.tableHeight = utils.setClientHight(this,330,57,44)
    },
    onCopy() {// 复制成功
      this.$message.success('复制成功')
    },
    onError() {// 复制失败
      this.$message.error('复制失败')
    },
    async tableOpen(e) {// 详情
      this.table = true;
      // this.loadingDetail = true
      this.detail_subDomain = []
      // let formData = new FormData();
      // formData.append("domain", e.domain_name);
      // formData.append("user", 1000);
      // await this.$http.post("/index.php/index/domain/subDomain/",formData)
      // .then((res) => {
        // this.detail_subDomain = res.data["subDomain"]
        e["subDomain"].forEach(e=> {
          this.detail_subDomain.push(`${`${e["top"]}`+ '.' +e["domain"]}`)
        })
      //   this.loadingDetail = false
      // });
    },
    async fetch() {// 数据获取
      this.loading = true
      let formData = new FormData()
      formData.append("user",1000)
      await this.$http.post("/index.php/index/domain/domainStock/",formData).then((res) => {
        this.userList = res.data["user"]
        //  for(var i=0;i<res.data["user"].length;i++) {
        //     this.userList[i] = res.data["user"][i];
        //   }
        this.domainStock = res.data["domain_count"]
        this.statistics = res.data["count"]
        this.totalNum = this.statistics["sum"]
        res.data["domain"].forEach(e=> {
          e["create_time_change"] = this.getLocalTime(parseInt(e["create_time"]));
          e["apply_time_change"] = this.getLocalTime(parseInt(e["apply_time"]));
          e["expiring_time_change"] = this.getLocalTime(parseInt(e["expiring_time"]));
        })
        this.ShowTableData = res.data["domain"]
        this.loading = false;
      });
      this.tableHeight = utils.setClientHight(this,330,57,44)
    },
    getLocalTime(nS) {// 时间戳转换
      let time = new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ').replace(/\//g, '-');
      // 找出出现空格的位置
      let space_position = time.indexOf(' ');
      // 截取并返回数据
      return time.slice(0,space_position);
    },
    domainDistribution(row) {// 域名分配表单
      this.domainDistribution_dialogVisible = true
      this.domainDistribution_dialog.domain_name = row.domain_name
    },
    async domainDistribution_submit() {// 域名分配表单提交
      this.distribution_loading = true
      let formData = new FormData() 
      formData.append("domain",this.domainDistribution_dialog.domain_name)
      formData.append("user",this.domainDistribution_dialog.uid)
      await this.$http.post('/index.php/index/domain/domainAllot/',formData).then((res) => {
        if (res.data["code"] === 200) {
          this.$message({
            type: "success",
            message: `${res.data["data"]}`,
          });
          this.fetchPageData()
        } else {
            this.$message({
              type: "error",
              message: `${res.data["data"]}`,
            });
        }
        this.domainDistribution_dialogVisible = false
        this.distribution_loading = false
      })
    },
    cellStyle2({row, column, rowIndex, columnIndex}){
      if (rowIndex === 0) {
        return 'border-top:1px solid #EBEEF5;'
      }
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
      _this.tableHeight = utils.setClientHight(_this,330,57,44)
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
  .getDomain {
    background-color: #353639!important;
    color: white!important;
  }
  .getDomain:hover {
    background-color: #4D4D4D!important;
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
  .el-button--info.is-disabled:hover{
    border-color: #C0C4CC!important;
    color: #C0C4CC!important;
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
</style>
