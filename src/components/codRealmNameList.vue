<template>
  <div>
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;min-width:855px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap;width:100%;justify-content: space-between" :disabled="loading">
        <el-form-item class="noselect">
          <el-input v-model="searchParams.accurateSearch" placeholder="搜索域名" clearable style="width: 200px;margin-right:10px"></el-input>
          <el-button icon="el-icon-search" @click="search" plain style="height: 30px; position: relative; margin-top: 32px" >搜索</el-button>
        </el-form-item>
        <el-form-item class="noselect">
          <!-- <el-button @click="resume" class="getDomain" type="info" style="height: 30px; position: relative; margin-top: 32px;margin-left:25px;">域名恢复</el-button> -->
          <el-button icon="el-icon-plus" class="getDomain" @click="getDomain_dialogVisible = true" type="info" style="height: 30px; position: relative;right:-10px; margin-top: 32px;margin-left:25px;" >申请域名</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 库存显示 -->
    <div style="width:100%;display:flex;flex-wrap:wrap;min-width:888px">
      <div style="display:inline-block;line-height:33px;color:#909399;font-weight:bolder;">库存：&nbsp;&nbsp;</div>
      <div style="display:inline-block;line-height:33px;;color:#909399;font-weight:bolder;" v-if="this.domainStock === null || this.domainStock.length === 0">无&nbsp;&nbsp;</div>
      <el-tag style="margin-right:20px;margin-bottom:15px" v-for="(item,key,index) in domainStock" :key="index" type="info"><p style="display:inline-block;font-weight:bolder">{{key}}</p>:{{item}}</el-tag>
    </div>

    <!-- 表格 -->
    <el-table
      highlight-current-row
      lazy
      :max-height="tableHeight"
      :load="load"
      row-key="domain_name"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      :key="key"
      :header-cell-style="cellStyle2"
      v-loading="loading"
      element-loading-background="rgba(255,255,255,0.5)"
      ref="multipleTable"
      :data="ShowTableData"
      tooltip-effect="dark"
      style="width:calc(100%-60px);line-height:30px;margin:5px 0 25px 0;min-width:855px">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column width="50" fixed="left"></el-table-column>
            <!-- @selection-change="handleSelectionChange_delete" -->
      <el-table-column prop="create_time_change" label="申请时间" width="120px"></el-table-column>
      <el-table-column prop="domain_name" label="域名" width="180px">
        <template slot-scope="scope">
          <div style="text-decoration:underline" v-clipboard:copy="scope.row['domain_name']" v-clipboard:success="onCopy" v-clipboard:error="onError">{{scope.row["domain_name"]}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="create_time_change" label="预估过期时间" width="120px"></el-table-column>
      <el-table-column prop="price" label="价格" width="110px"></el-table-column>
      <el-table-column prop="suffix" label="后缀" width="110px"></el-table-column>
      <!-- <el-table-column prop="show_bt_id" label="用于" width="150px"></el-table-column> -->
      <el-table-column prop="show_bt_id" label="用于" width="200px">
        <template slot="header">
          <div style="display:inline-block;margin-right:5px">用于</div>
            <el-tooltip :visible-arrow="false" class="item" effect="dark" content="一级和二级域名可解析到任意服务器，互不影响" placement="top">
          <el-button
              type="text" icon="el-icon-info"
              size="small"
              style="color:#909399;font-size:15px;display:inline-block;padding:0px!important"
          ></el-button><!--scope.row表示当前行的数据-->
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="110px">
        <template slot-scope="scope">
          <span v-if="scope.row.hasOwnProperty('sell') && scope.row['delete'] === '0'">正常</span>
          <span v-if="scope.row['delete'] === 1">已删除</span>
          <span v-if="scope.row['delete'] === 0">正常</span>
        </template>
      </el-table-column>
      <el-table-column prop="expiring_time_change" label="网域验证" width="110px">
        <template slot-scope="scope">
          <p id="lock" v-if="scope.row.fb_check === 1" class="el-icon-circle-check" style="color:#67C23A;display:inline-block;font-size:15px;top:15px" type="text"></p>
          <p id="lock" v-else class="el-icon-minus" style="display:inline-block;font-size:15px;top:15px;color:#909399;" type="text"></p>
        </template>
      </el-table-column>
      <el-table-column label="强制HTTPS" width="110px">
        <template slot-scope="scope">
          <p id="lock" v-if="scope.row.https_site === 'on'" class="el-icon-circle-check" style="color:#67C23A;display:inline-block;font-size:15px;top:15px" type="text"></p>
          <p id="lock" v-else class="el-icon-minus" style="display:inline-block;font-size:15px;top:15px;color:#909399;" type="text"></p>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="expiring_time_change" label="屏蔽" width="110px">
        <template slot-scope="scope">
          <p id="lock" v-if="scope.row.fb_check === 1" class="el-icon-circle-check" style="color:#67C23A;display:inline-block;font-size:15px;top:15px" type="text"></p>
          <p id="lock" v-else class="el-icon-minus" style="display:inline-block;font-size:15px;top:15px;color:#909399;" type="text"></p>
        </template>
      </el-table-column> -->
      <el-table-column prop="remark" label="备注" min-width="240px"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <!-- <p id="lock" v-if="scope.row.https_site != 'off'" class="el-icon-circle-check" style="margin-right:10px;color:#67C23A;display:inline-block;font-size:15px" type="text"></p> -->
          <el-dropdown placement="bottom" trigger="click">
            <span style="cursor: pointer;" class="el-dropdown-link">
              <i style="color: grey!important" class="el-icon-more"></i>
            </span>
            <el-dropdown-menu :visible-arrow="false" class="noselect" slot="dropdown">
              <el-dropdown-item v-if="scope.row.hasOwnProperty('price')" @click.native="mainDomainServer(scope.row)" :disabled="scope.row['show_bt_id'] != undefined && scope.row['sell'] === '0'">解析一级域名</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.hasOwnProperty('price')" @click.native="newSubDomain(scope.row)" :disabled="scope.row['sell'] === '0'?false:true">添加二级域名</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.hasOwnProperty('price') && scope.row.fb_check === 0" @click.native="domainAuthentication(scope.row)" :disabled="scope.row['sell'] === '0'?false:true">网域验证</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.hasOwnProperty('price') && scope.row.fb_check != 0" disabled>网域已验证</el-dropdown-item>
              <!-- <el-dropdown-item @click.native="domainAuthentication(scope.row)">网域验证</el-dropdown-item> -->
              <!-- <el-dropdown-item @click.native="handleDetails(scope.$index, scope.row)">开启HTTPS</el-dropdown-item> -->
              <!-- <el-dropdown-item v-if="scope.row.https_site === 'flexible'" type="text" size="small" @click.native="https(scope.row)" :disabled="scope.row['sell'] === '0'?false:true">关闭HTTPS</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.https_site === 'off'" type="text" size="small" @click.native="https(scope.row)" :disabled="scope.row['sell'] === '0'?false:true">开启HTTPS</el-dropdown-item> -->
              <el-dropdown-item type="text" size="small" @click.native="https(scope.row)" :disabled="scope.row['https_site'] === 'on'?true:false">强制HTTPS</el-dropdown-item>
              <el-dropdown-item  @click.native="user_remark_dialog(scope.row)" v-if="scope.row.hasOwnProperty('price')" :disabled="scope.row['sell'] === '0'?false:true">编辑备注</el-dropdown-item>
              <template>
                <el-dropdown-item v-if="scope.row.hasOwnProperty('price')" id="del" @click.native="remove(scope.row)">删除域名</el-dropdown-item>
                <el-dropdown-item v-else id="del" @click.native="removeSubDomain(scope.row)">删除二级域名</el-dropdown-item>
              </template>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="block" style="position: relative; right: 0px;min-width:855px" v-if="!loading">
      <el-pagination :page-size="30" background @current-change="fetchPageData()" :current-page.sync="currentPage" layout="total,prev, pager, next" :total="totalNum" :disabled="loading">
      </el-pagination>
    </div>

    <!-- 域名恢复 -->
    <el-dialog title="恢复域名" :visible.sync="resume_dialog" width="500px" :close-on-click-modal="false">
        <el-table :data="resume_list" v-loading="resume_dialog_loading">
          <el-table-column property="domain_name" label="域名"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="resume_submit(scope.row)">恢复</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-dialog>

    <!-- 申请域名 -->
    <el-dialog title="域名申请" :visible.sync="getDomain_dialogVisible" width="400px" :close-on-click-modal="false">
      <el-form :model="domainStock" label-width="100px" label-position="right" v-loading="getDomain_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item v-if="this.userTeam === 'admin'" label="目标团队" class="noselect" style="margin-right: 40px">
              <el-select v-model="getDomainDialog.team" filterable placeholder="选择">
                <el-option v-for="(item,key,index) in group_list_import" :key="index" :value="item['id']" :label="item['team']">
                    <span style="float: left">{{item['team']}}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择域名" class="noselect" style="margin-right: 40px">
              <el-select v-model="getDomainDialog.domain" filterable placeholder="选择">
                <el-option @click.native="changeNumLimit(key)" v-for="(item,key,index) in domainStock" :key="index" :value="key" :label="key">
                    <span style="float: left">{{ key}}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="申请数量" class="noselect" style="margin-right: 40px">
              <el-input-number style="width:220px;" v-model="getDomainDialog.num" :min="1" :max="getDomainDialog_numLimit"></el-input-number>
            </el-form-item>
            <el-form-item label="" class="noselect" style="margin-right: 40px">
              <div style="text-align:left">今日剩余可申请数量: {{this.todayLimit}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button :disabled="getDomainDialogSubmitBtn" @click="getDomainDialogSubmit" size="small" type="primary" class="formSubmitBtn" style="margin-right:-220px">确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 新增二级域名 -->
    <el-dialog title="新增子域名" :visible.sync="newSubmitDomain_dialogVisible" width="450px" :close-on-click-modal="false" @close='closeDialog'>
      <el-form :rules="rules" ref="newSubmitDomain_value" :model="newSubmitDomain_value" label-width="100px" label-position="right" v-loading="newSubDomain_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择服务器" class="noselect" style="margin-right: 40px" prop="server">
              <el-select style="width:200px" v-model="newSubmitDomain_value.server" filterable placeholder="选择">
                <el-option v-for="(item,key,index) in this.server" :key="index" :value="item['id']" :label="item['server_name']">
                    <span style="float: left">{{item['server_name']}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="二级域名" class="noselect" style="margin-right: 40px;position:relative" prop="subDomain">
              <el-input style="width:200px;position:absolute;left:0" placeholder="请输入二级域名" v-model="newSubmitDomain_value.subDomain" clearable></el-input>
              <div style="display:inline-block;position:absolute;left:210px;width:120px;text-align:left">.{{newSubmitDomain_value.showDomain}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="small" type="primary" @click="submitForm('newSubmitDomain_value')" class="formSubmitBtn" style="margin-right: -270px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 一级域名服务器 -->
    <el-dialog title="选择一级域名服务器" :visible.sync="mainDomainServer_dialogVisible" width="400px" :close-on-click-modal="false" @close='closeDialog_mainDomainServer'>
      <el-form :rules="rules" ref="mainDomainServer_value" :model="mainDomainServer_value" label-width="100px" label-position="right" v-loading="mainDomainServer_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择服务器" class="noselect" style="margin-right: 40px" prop="server">
              <el-select style="width:200px" v-model="mainDomainServer_value.server" filterable placeholder="选择">
                <el-option v-for="(item,key,index) in this.server" :key="index" :value="item['id']" :label="item['server_name']">
                    <span style="float: left">{{item['server_name']}}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="small" type="primary" @click="submitForm('mainDomainServer_value')" class="formSubmitBtn" style="margin-right:-180px">确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 网域验证 -->
    <el-dialog title="网域验证" :visible.sync="domainAuthentication_dialogVisible" width="450px" :close-on-click-modal="false">
      <el-form label-width="100px" label-position="right" v-loading="domainAuthentication_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="网域验证" class="noselect" style="margin-right: 40px;" prop="subDomain">
              <el-input style="margin-right:40px" placeholder="请输入txt" v-model="domainAuthentication_value.txt" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="small" type="primary" @click="domainAuthentication_submit" class="formSubmitBtn" style="margin-right: -270px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 备注表单 -->
    <el-dialog :close-on-click-modal="false" title="编辑个人备注" :visible.sync="remark_form_dialogVisible" width="450px" @close='closeDialog_remark_form'>
      <el-form :rules="rules" ref="remark_form" :model="remark_form" label-width="110px" label-position="right" v-loading="remark_form_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" class="noselect" style="margin-right: 40px" prop="remark"> 
              <el-input clearable v-model="remark_form.remark" placeholder="请输入个人备注">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="small" type="primary" @click="submitForm('remark_form')" class="formSubmitBtn" style="margin-right: -270px" >确 定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import crypto from '../crypto.js'
import utils from '../utils'
var reg = new RegExp(/^[a-z0-9]{1,5}$/)
var validatePass = (rule, value, callback) => {
  if (value === null || value === '') {
    callback(new Error('二级域名必填'));
  }
  if (!reg.test(value)) {
    callback(new Error('输入五位内字母数字'));
  }  else {
    callback();
  }
};
export default {
  data() {
    return {
      getDomain_loading:false,
      rules: {
        subDomain: [
          { validator: validatePass,required: true, trigger: 'change' }
        ],
        server:[
          { required: true, message: '服务器必选', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ]
      },
      // 
      mainDomainServer_loading:false,
      mainDomainServer_dialogVisible:false,
      mainDomainServer_value: {
        subDomain:'@',
        server:null,
        showDomain:null,
      },
      // 
      newSubDomain_loading:false,
      newSubmitDomain_dialogVisible:false,
      newSubmitDomain_value: {
        subDomain:null,
        showDomain:null,
        server:null
      },
      standBY_e:null,
      domainAuthentication_loading:false,
      domainAuthentication_dialogVisible:false,
      domainAuthentication_value: {
        txt:null,
        domain:null
      },
      uid:null,
      key: 0,
      //multipleSelectionFlag_delete: true, // 删除按钮出现与否
      multipleSelection_delete: "", // 批量选中项
      // 加载界面显示与否
      loading: true,
      loadDetail:false,
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
      detail_subDomain_del:[],
      // 恢复域名
      resume_dialog_loading:false,
      resume_dialog: false,
      resume_list:[],
      //域名库存
      domainStock:null,
      // 域名申请表单
      getDomain_dialogVisible:false,
      getDomainDialog_numLimit: 1,
      getDomainDialogSubmitBtn:true,
      getDomainDialog: {
        num:null,
        domain:null,
        team:null
      },
      todayLimit:null,
      showGroup:[],
      group_list_import:null,
      userTeam:null,
      tableHeight:620,
      server:[],
      // 备注
      remark_form_loading:false,
      remark_form_dialogVisible:false,
      remark_form: {
        remark:null,
        id:null
      },
      standBY_e_remark:null,
      standBY_e_newSubDomain:null,
      standBY_e_mainDomain:null
    };
  },

  created() {
    this.getUid()
    this.fetchGroupData_import().then(()=>{
      this.fetchDomainStock()
      this.fetch();
    })
    
  },

  methods: {
    // 一级域名服务器
    mainDomainServer(e) {
      this.standBY_e_mainDomain = e
      this.mainDomainServer_dialogVisible = true
      this.mainDomainServer_value.showDomain = e.domain_name
    },
    // 编辑备注
    user_remark_dialog(e) {
      this.standBY_e_remark = e
      this.remark_form_dialogVisible = true
      this.remark_form["remark"] = e["remark"]
      this.remark_form["id"] = e["id"]
    },
    closeDialog_remark_form() {
      this.$nextTick(() => {
        this.$refs['remark_form'].clearValidate()
      })
      this.remark_form['remark'] = null
    },
    closeDialog_mainDomainServer() {
      this.$nextTick(() => {
        this.$refs['mainDomainServer_value'].clearValidate()
      })
      this.mainDomainServer_value['server'] = null
    },
    async domainAuthentication_submit() {// 网域验证提交
      this.domainAuthentication_loading = true
      let formData = new FormData()
      formData.append("txt",this.domainAuthentication_value.txt)
      formData.append("domain",this.domainAuthentication_value.domain)
      await this.$http.post("https://admin.vgdg67.cn//index.php/index/cfapi/fbCheck/",formData).then((res) => {
        this.domainAuthentication_loading = false
        if (res.data["code"] === 200) {
          this.standBY_e["fb_check"] = 1
          this.$message.success(`${res.data["data"]}`)
        } else {
          this.$message.error(`${res.data["data"]}`)
        }
        this.domainAuthentication_dialogVisible = false
      })
    },
    async https(e) { // 开启/关闭HTTPS
      this.loading = true
      let formData = new FormData()
      // formData.append("value",'full')
      formData.append("domain",e.domain_name)
      formData.append("team_id",e.team_id)
      // if(e.https_site === 'full') {
      //   formData.append("value",'off')
        await this.$http.post('/index.php/index/cfapi/sitehttps/',formData).then((res) => {
          if (res.data["code"] === 200) {
            e.https_site = 'on'
            this.$message.success(`${res.data["data"]}`)
          } else {
            this.$message.error(`${res.data["data"]}`)
          }
          this.loading = false
        })
      // } else {
      //   formData.append("value",'full')
      //   await this.$http.post('https://test.icethem02.xyz/index.php/index/cfapi/sitehttps/',formData).then((res) => {
      //     if (res.data["code"] === 200) {
      //       e.https_site = 'full'
      //       this.$message.success(`${res.data["data"]}`)
      //     } else {
      //       this.$message.error(`${res.data["data"]}`)
      //     }
      //     this.loading = false
      //   })
      // }
    },
    domainAuthentication(e) {// 网域验证
      this.domainAuthentication_value.domain = e.domain_name
      this.domainAuthentication_dialogVisible = true
      this.standBY_e = e
    },
    newSubDomain(e) {// 添加二级域名
      this.standBY_e_newSubDomain = e
      this.newSubmitDomain_value.showDomain = e.domain_name
      this.newSubmitDomain_dialogVisible = true
      this.newSubmitDomain_value.subDomain = this.generateMixed(5)
    },
    generateMixed(n) {
      var str = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
      var res = "";
      for(var i = 0; i < n ; i ++) {
        var id = Math.ceil(Math.random()*35);
        res += str[id];
      }
      return res;
    },
    closeDialog() {
      this.$nextTick(() => {
          this.$refs['newSubmitDomain_value'].clearValidate()
      })
      this.newSubmitDomain_value.subDomain = null
    },
    submitForm(formName) {// 表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'newSubmitDomain_value') {
            this.newSubDomain_submit()
          }  else if (formName === 'remark_form') {
              this.remark_submit()
            } else if (formName === 'mainDomainServer_value') {
              this.mainDomainServer_submit()
            }
          // else {
          //   this.edit_form_sumbitForm_check()
          // }
        } else {
          return false;
        }
      });
    },
    async remark_submit() {
      this.remark_form_loading = true
      let formData = new FormData()
      formData.append('user',this.uid)
      formData.append("id",this.remark_form["id"])
      formData.append("remark",this.remark_form["remark"])
      await this.$http.post('/index.php/index/domain/editRemark/',formData).then((res) => {
        this.remark_form_loading = false
        if (res.data["code"] === 200) {
          this.standBY_e_remark["remark"] = this.remark_form["remark"]
          this.remark_form_dialogVisible = false
          this.$message.success(`${res.data["data"]}`)
          this.fetchPageData(this.currentPage)
        } else {
          this.$message.error(`${res.data["data"]}`)
        }
      })
    },
    async newSubDomain_submit() {
      this.newSubDomain_loading = true
      let formData  = new FormData()
      var ip = null
      formData.append("domain",`${this.newSubmitDomain_value["showDomain"]}`)
      formData.append("top",`${this.newSubmitDomain_value["subDomain"]}`)
      formData.append("user",this.uid)
      formData.append("team",this.userTeam)
      formData.append("server",`${this.newSubmitDomain_value["server"]}`)
      this.server.forEach(e=> {
        if (e["id"] == this.newSubmitDomain_value["server"]) {
          ip = e["ip"]
        }
      })
      formData.append("ip",ip)
      await this.$http.post('/index.php/index/cfapi/createRecord/',formData).then((res) => {
        if (res.data["code"] === 200) {
          var showServer = null
          this.server.forEach(item=> {
            if (this.newSubmitDomain_value["server"] === item["id"]) {
              showServer = item["server_name"]
            }
          })
          this.standBY_e_newSubDomain["hasChildren"] = true
          this.standBY_e_newSubDomain["subDomain"].push({"show_bt_id":showServer,"bt_id": `${this.newSubmitDomain_value["server"]}`,"delete": 0,"top": `${this.newSubmitDomain_value["subDomain"]}`,"zone_name": `${this.newSubmitDomain_value["showDomain"]}`,"domain_name":`${this.newSubmitDomain_value["subDomain"]}.${this.newSubmitDomain_value["showDomain"]}`})
          this.handleUpdateClick()
          this.$message.success(`${res.data["data"]}`)
        } else {
          this.$message.error('解析失败')
        }
        this.newSubmitDomain_dialogVisible = false
        this.newSubDomain_loading = false
      })
    },
    handleUpdateClick() {// 回流
      this.key += 1 
    },
    async mainDomainServer_submit() {
      this.mainDomainServer_loading = true
      let formData  = new FormData()
      var ip = null
      var showDomainServer = null
      formData.append("domain",`${this.mainDomainServer_value["showDomain"]}`)
      formData.append("top",`${this.mainDomainServer_value["subDomain"]}`)
      formData.append("user",this.uid)
      formData.append("team",this.userTeam)
      formData.append("server",`${this.mainDomainServer_value["server"]}`)
      this.server.forEach(e=> {
        if (e["id"] == this.mainDomainServer_value["server"]) {
          ip = e["ip"]
          showDomainServer = e["server_name"]
        }
      })
      formData.append("ip",ip)
      await this.$http.post('/index.php/index/cfapi/createRecord/',formData).then((res) => {
        if (res.data["code"] === 200) {
          this.standBY_e_mainDomain["show_bt_id"] = showDomainServer
          this.handleUpdateClick()
          this.$message.success(`${res.data["data"]}`)
        } else {
          this.$message.error('解析失败')
        }
        this.mainDomainServer_dialogVisible = false
        this.mainDomainServer_loading = false
      })
    },
    handleDetails(index, row) {// 获取详情
      // console.log(index, row);
    },
    getUid() {
      this.uid = localStorage.getItem("uid")
    },
    async fetchPageData() {// 点击页码
      this.ShowTableData = this.tableData.slice((this.currentPage-1)*30,this.currentPage*30)
        this.ShowTableData.forEach(e=> {
          if (e["subDomain"].length != 0) {
            e["hasChildren"] = true
            e["subDomain"].forEach(i=> {
              i["domain_name"] = i["top"] + '.' + i["zone_name"]
            })
          } else {
            e["hasChildren"] = false
          }
        })
        this.tableHeight = this.setClientHight1(this,290,57,44)
    },
    async search() {// 搜索
      this.loading = true;
      this.useSearchData = true;
      this.currentPage = 1;
      let formData = new FormData();
      var submitSearchParams = {
        user: this.uid,
        domain: '',
      };
      submitSearchParams.domain = this.searchParams.accurateSearch;
        for (let key in submitSearchParams) {
          formData.append(`${key}`, submitSearchParams[key]);
        }
        await this.$http.post("/index.php/index/domain/domainSearch/",formData)
          .then((res) => {
            this.tableData = res.data["subDomain"]
            this.totalNum = res.data["subDomain"].length
            res.data["subDomain"].forEach(e=> {
            if (e["domain_name"].indexOf('.com.cn') != -1) {
              e["suffix"] = '.com.cn'
            } else {
              var arr = e["domain_name"].split('')
              e["suffix"] = arr.splice(arr.indexOf('.')).join('')
            }
            e["create_time_change"] = utils.getLocalTime(
              parseInt(e["apply_time"])
            ); 
            if (e["subDomain"].length != 0) {
              e["subDomain"].forEach(i=> {
                this.server.forEach(item=> {
                  if (i["bt_id"] === item["id"]) {
                    i["show_bt_id"] = item["server_name"]
                  }
                })
                if (i["top"] === '@') {
                  e["show_bt_id"] = i["show_bt_id"]
                }
              })
              e["subDomain"] = e["subDomain"].filter(item => {
                return item["top"] != '@'
              })
            }
          })
          this.ShowTableData =[]
          if (res.data["subDomain"].length <=30) {
            for (let i = 0; i < res.data["subDomain"].length; i++) {
            this.ShowTableData.push(res.data["subDomain"][i])
          }
          } else {
            for (let i = 0; i < 30; i++) {
            this.ShowTableData.push(res.data["subDomain"][i])
          }
          }
        this.ShowTableData.forEach(e=> {
          if (e["subDomain"].length != 0) {
            e["hasChildren"] = true
            e["subDomain"].forEach(i=> {
              i["domain_name"] = i["top"] + '.' + i["zone_name"]
            })
          } else {
            e["hasChildren"] = false
          }
        })
        //数据完成展示后取消加载页面
        this.loading = false;
          });
      this.tableHeight = this.setClientHight1(this,290,57,44)
    },
    onCopy(e) {// 复制
      this.$message({
        message: "复制成功！",
        type: "success",
      });
    },
    onError(e) {// 复制失败
      this.$message({
        message: "复制失败！",
        type: "error",
      });
    },
    handleSelectionChange_delete(val) {// 批量选中
      // console.log(val);
      this.multipleSelection_delete = val;
      this.multipleSelectionFlag_delete = false;
      if (this.multipleSelection_delete.length == 0) {
        // 如不进行判断则勾选完毕后批量删除按钮还是会在
        this.multipleSelectionFlag_delete = true;
      }
    },
    multiDelete() {// 点击批量删除时触发
      let checkArr = this.multipleSelection_delete; //multipleSelection存储了勾选到的数据
      let params = []; //传给后端的删除项id
      let showDeleteItems = [];
      checkArr.forEach(function (item) {
        params.push(item._id); // 添加所有需要删除数据的id到一个数组，post提交过去
        showDeleteItems.push(item.realname);
      });
      // 弹窗提示
      this.$confirm(`是否删除员工: ${showDeleteItems}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.$message({
            type: "success",
            message: "删除成功(等待接口)",
          });
          // await this.$http.delete(`rest/ads/${row._id}`);
          // this.$message({
          //   type: "success",
          //   message: "删除成功!",
          // });
          // this.fetch();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
      // 有接口时解开
      // let self = this;
      // 有接口时解开
      //  $http即是axios，可以在main.js里面设置 Vue.prototype.$http = axios;
      // this.$http.post('/fashion/multiDelete', params).then(function (res) {
      //   if (res.data.status == '1') {
      //     self.$message({
      //       message: '删除成功',
      //       type: 'success'
      //     });
      //   }
      //   self.getFashionList(1, 1, 5);
      // })
    },
    async load(tree, treeNode, resolve) {
      // let formData = new FormData();
      // formData.append("domain", tree.domain_name);
      // formData.append("user", this.uid);
      // await this.$http.post("/index.php/index/domain/subDomain/",formData)
      // .then((res) => {
      //   res.data["subDomain"].forEach(e=> {
      //     e["domain_name"] = e["top"] + '.' + e["zone_name"]
      //   })
        resolve(tree["subDomain"])
      // });
      // console.log(this.ShowTableData);
        this.tableHeight = this.setClientHight1(this,290,57,44)
      },
    setClientHight1(_this,outSideHieght,th,td) {//(指向,理想状态下表格(不包括外边距)外的高度,表头高度,行高)16为横向滚动条高度
      _this.clientHeight = document.documentElement.clientHeight;
      // console.log(document.documentElement.clientHeight);
      // if (document.documentElement.clientWidth <= 1483) {
      //   _this.childMethod();
      // }
      var tbheight = _this.clientHeight - outSideHieght
      var line_num = Math.round((tbheight-th)/td)
      // console.log(line_num);
          return line_num*td + th +8
      
    },
    async fetch() {// 数据获取
      this.loading = true
      let formData = new FormData();
      formData.append("user", this.uid);
      formData.append("team", this.userTeam);
      await this.$http.post("/index.php/index/domain/domainList/",formData).then((res) => {
        this.server = res.data["server"]
        this.todayLimit = Number(res.data["residue"]["site_today_limit"]) - res.data["residue"]["domain_today_limit"]
        this.ShowTableData = []
        if (res.data["domain_top"] instanceof Array) {
          // 获取数据
          res.data["domain_top"].forEach(e=> {
            e["create_time_change"] = utils.getLocalTime(
              parseInt(e["apply_time"])
            ); // 时间戳转换
            if (e["domain_name"].indexOf('.com.cn') != -1) {
              e["suffix"] = '.com.cn'
            } else {
              var arr = e["domain_name"].split('')
              e["suffix"] = arr.splice(arr.indexOf('.')).join('')
            }
            if (e["subDomain"].length != 0) {
              e["subDomain"].forEach(i=> {
                
                this.server.forEach(item=> {
                  if (i["bt_id"] === item["id"]) {
                    i["show_bt_id"] = item["server_name"]
                  }
                })
                if (i["top"] === '@') {
                  e["show_bt_id"] = i["show_bt_id"]
                }
              })
              e["subDomain"] = e["subDomain"].filter(item => {
                return item["top"] != '@'
              })
            }
          })
          this.totalNum = res.data["domain_top"].length
          this.tableData = res.data["domain_top"];
          if (res.data["domain_top"].length <=30) {
            for (let i = 0; i < res.data["domain_top"].length; i++) {
              this.ShowTableData.push(res.data["domain_top"][i])
            }
          } else {
            for (let i = 0; i < 30; i++) {
              this.ShowTableData.push(res.data["domain_top"][i])
            }
          }
        } else {
          //
        }
        this.ShowTableData.forEach(e=> {
          if (e["subDomain"].length != 0) {
            e["hasChildren"] = true
            e["subDomain"].forEach(i=> {
              i["domain_name"] = i["top"] + '.' + i["zone_name"]
            })
            // e["subDomain"] = e["subDomain"].filter(i=> {
            //   return i["delete"] != 1
            // })
            e["subDomain"].reverse()
          } else {
            e["hasChildren"] = false
          }
        })
        //数据完成展示后取消加载页面
        this.loading = false;
      });
      // console.log(this.ShowTableData);
      this.tableHeight = this.setClientHight1(this,290,57,44)
    },
    async remove(row) {// 移除单项
      var currentPage_standBy = this.currentPage
      this.$confirm(`是否删除 ${row.domain_name}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true
          let formData = new FormData();
          formData.append("user", this.uid);
          formData.append("domain_name", row.domain_name)
          await this.$http.post("/index.php/index/domain/domainDelete/",formData).then((res) => {
            if (res.data["code"] === 200) {
              this.fetch().then(()=> {
                this.currentPage = currentPage_standBy
                this.fetchPageData()
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              })
            } else {
              this.$message({
                type: "error",
                message: `${res.data["msg"]}`,
              });
            }
          })
          this.loading = false
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async removeSubDomain(row) {
      var currentPage_standBy = this.currentPage
      this.$confirm(`是否删除 ${row.top}.${row.zone_name}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.loading = true
          let formData = new FormData();
          formData.append("user", this.uid);
          formData.append("id", row.id)
          await this.$http.post("/index.php/index/domain/subDomainDelete/",formData).then((res) => {
            if (res.data["code"] === 200) {
              this.fetch().then(()=> {
                this.currentPage = currentPage_standBy
                this.fetchPageData()
                this.handleUpdateClick()
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              })
            } else {
              this.$message({
                type: "error",
                message: `${res.data["msg"]}`,
              });
            }
          })
          this.loading = false
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    async resume() {// 域名恢复列表
    this.resume_dialog_loading = true
    this.resume_dialog = true
      let formData = new FormData();
      formData.append("user", this.uid);
      await this.$http.post('/index.php/index/domain/domainRegainList/',formData).then((res) => {
        this.resume_list = res.data
        this.resume_dialog_loading = false
      })
    },
    async resume_submit(e) {// 域名恢复提交
      this.loading = true
      let formData = new FormData();
      formData.append("user", this.uid);
      formData.append("domain_name", e.domain_name);
      await this.$http.post('/index.php/index/domain/domainRegain/',formData).then((res) => {
        if (res.data["code"] === 200) {
          this.resume()
          this.fetch().then(()=> {
            this.$message({
              type: "success",
              message: "域名已恢复",
            });
          })
        } else {
            this.$message({
              type: "error",
              message: "操作失败",
            });
        }
      })
    },
    async fetchDomainStock() {// 获取域名库存
      this.loading = true
      crypto.cryptoDecrypt_string(localStorage.getItem("group_id")).split(',').forEach(e=> {
        this.traversal_findGroup(JSON.parse(crypto.cryptoDecrypt_string(localStorage.getItem("role_list"))),e)
        // console.log(this.showGroup[this.showGroup.length-1]);
      })
      if (this.showGroup[0] === '推广部') {
          this.group_list_import.forEach(e=> {
            if (e["team"] === '推广部') {
              this.userTeam = e["id"]
            }
          })
      } else {
        this.group_list_import.forEach(e=> {
          if (e["team"] === this.showGroup[this.showGroup.length-1]) {
            this.userTeam = e["id"]
          } 
        })
      }
      if (this.userTeam === null) {
        this.userTeam = 'admin'
      }
      let formData = new FormData()
      formData.append('team',this.userTeam)
      await this.$http.post('/index.php/index/domain/domainResidue/',formData).then((res) => {
        this.domainStock = res.data["domain_count"]
        this.loading = false
      })
    },
    async fetchGroupData_import() {
      await this.$http.get('index.php/index//domain/teamList').then((res)=> {
        this.group_list_import = res.data["data"]
      })
    },
    traversal_findGroup(obj,targetId){//获取分组信息
      var t = targetId
      obj.forEach(e=> {
        if(e["id"] == targetId){
          this.showGroup.push(e["group"])
        }
        var _this = this
        for (var a in e) {
          if (a== "children") {
            _this.traversal_findGroup(e[a],t)
          }
        }
      })
    },
    changeNumLimit(key) {// 计数器数量限制
      this.getDomainDialogSubmitBtn = false
      this.getDomainDialog.num = 1
      if (this.domainStock[`${key}`] < 5) {
        this.getDomainDialog_numLimit = this.domainStock[`${key}`]
      } else {
        this.getDomainDialog_numLimit = this.todayLimit
      }
    },
    async getDomainDialogSubmit() {// 申请域名表单提交
      this.getDomain_loading = true
      let formData = new FormData();
      formData.append("user", this.uid);
      if (this.userTeam != 'admin') {
        formData.append("team", this.userTeam);
      } else {
        formData.append("team", this.getDomainDialog.team);
      }
      formData.append("num", this.getDomainDialog.num);
      formData.append("domain", this.getDomainDialog.domain);
      await this.$http.post('/index.php/index/domain/applydoma1n/',formData).then((res) => {
        if (res.data["code"] === 200) {
          this.getDomain_dialogVisible = false
          this.fetchDomainStock()
          this.fetch().then(()=> {
            this.$message({
              type: "success",
              message: "申请成功",
            });
          })
          this.currentPage = 1
        } else if(res.data["code"] === 500) {
          this.$message({
            type: "error",
            message: `${res.data["data"]}`,
          });
        } else {
          this.$message({
            type: "error",
            message: "ERROR",
          });
        }
        this.getDomain_loading = false
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
      _this.tableHeight = _this.setClientHight1(_this,290,57,44)
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
  .el-button--info {
    border-color:#353639!important;
  }
  .el-button.is-disabled {
    color: #C0C4CC!important;
  }
  #del:hover {
    color: rgb(245, 108, 108);
    background-color: rgb(254, 240, 240);
  }
  #lock {
    position: absolute;
    left: 30px;
    top: 19px;
  }
</style>
