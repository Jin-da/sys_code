<template>
  <div>
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;margin-bottom: 10px;">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap;width:100%;justify-content: space-between" :disabled="loading">
        <el-form-item class="noselect">
          <el-button icon="el-icon-plus" class="info_btn" @click="new_user_dialogVisible_open" type="info" style="height: 30px; position: relative; margin-top: 32px">创建用户</el-button>
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
      empty-text=" "
      ref="multipleTable"
      :data="ShowTableData"
      tooltip-effect="dark"
      style="width:calc(100%-60px);line-height:30px;margin:0 0 25px 0;min-width:800px"
      :row-style="{height: '50px'}"
      border>
      <el-table-column prop="uid" label="UID"></el-table-column>
      <el-table-column prop="zh_name" label="用户名称"></el-table-column>
      <el-table-column prop="name" label="登陆账号"></el-table-column>
      <el-table-column label="所属角色">
        <template slot-scope="scope">
          <span>{{scope.row.showGroup}}-{{scope.row.role_name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.disable === 1">冻结</span>
          <span v-else>正常</span>
        </template>
      </el-table-column>
      <el-table-column prop="create_time_change" label="创建时间"></el-table-column>
      <!-- <el-table-column label="操作" align="center" width="130px">
        <template slot-scope="scope">
          <p id="lock" v-if="scope.row.disable != 0" class="el-icon-lock" style="margin-right:10px;font-size:13px;color:red;display:inline-block;font-size:15px" type="text"></p>
          <el-dropdown placement="bottom" trigger="click">
            <span style="cursor: pointer;" class="el-dropdown-link">
              <i style="color: grey!important" class="el-icon-more"></i>
            </span>
            <el-dropdown-menu :visible-arrow="false" class="noselect" slot="dropdown">
              <el-dropdown-item type="text" size="small" @click.native="edit_role_dialog(scope.row)">编辑用户</el-dropdown-item>
              <el-dropdown-item v-if="scope.row.disable === 0" id="delUser" type="text" size="small" @click.native="freeze(scope.row)">冻结用户</el-dropdown-item>
              <el-dropdown-item v-else type="text" size="small" @click.native="unfreeze(scope.row)">取消冻结</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <!-- <p id="lock" v-if="scope.row.disable != 0" class="el-icon-lock" style="margin-right:10px;font-size:13px;color:red;display:inline-block;font-size:15px" type="text"></p> -->
          <el-tooltip content="编辑用户" placement="top" :visible-arrow="false">
            <el-button  @click="edit_role_dialog(scope.row)" icon="el-icon-edit" style="font-size:13px;color:grey;padding:0;margin-right:10px" type="text"></el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.disable === 0" content="冻结用户" placement="top" :visible-arrow="false">
            <el-button  @click="freeze(scope.row)" icon="el-icon-lock" style="font-size:13px;color:red;padding:0;border:none;background-color:rgba(0,0,0,0)" type="text"></el-button>
          </el-tooltip>
          <el-tooltip v-else content="取消冻结" placement="top" :visible-arrow="false">
            <el-button  @click="unfreeze(scope.row)" icon="el-icon-unlock" style="font-size:13px;color:#67c23a;padding:0;border:none;background-color:rgba(0,0,0,0)" type="text"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 创建用户表单 -->
    <el-dialog title="创建用户" :visible.sync="new_user_dialogVisible" width="400px" :close-on-click-modal="false" @close='closeDialog_new'>
      <el-form :rules="rules" ref="new_user_dialog_params" :model="new_user_dialog_params" label-width="100px" label-position="right" v-loading="new_loading">
        <el-form-item label="选择角色" class="noselect" style="margin-right: 40px" prop="role">
          <el-select v-model="new_user_dialog_params.role" filterable placeholder="选择角色" clearable>
            <el-option  v-for="(item,key,index) in role_list" :key="index" :value="item['id']" :label="item['showGroup_options_all']">
              <span style="float: left">{{ item["role_name"]}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item["showGroup_options"] }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户名称" class="noselect" style="margin-right:40px" prop="uid">
          <el-input v-model="new_user_dialog_params.uid" placeholder="" style="width:220px" disabled>
            </el-input>
        </el-form-item>
        <el-form-item label="用户名称" class="noselect" style="margin-right:40px" prop="zh_name">
          <el-input v-model="new_user_dialog_params.zh_name" placeholder="例: 陈斤达" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="登陆账号" class="noselect" style="margin-right:40px" prop="accountname">
          <el-input v-model="new_user_dialog_params.accountname" placeholder="例: chenjinda" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="密码" class="noselect" style="margin-right:40px" prop="password">
          <el-input v-model="new_user_dialog_params.password" placeholder="" style="width:220px">
            </el-input>
        </el-form-item>
        <el-button @click="submitForm('new_user_dialog_params')" size="small" type="primary" class="formSubmitBtn" style="margin-right: -220px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 编辑角色表单 -->
    <el-dialog title="编辑用户" :visible.sync="edit_role_dialogVisible" width="400px" :close-on-click-modal="false">
      <el-form :rules="rules" ref="edit_role_dialog_params" :model="edit_role_dialog_params" label-width="100px" label-position="right" v-loading="edit_loading">
        <el-form-item label="选择角色" class="noselect" style="margin-right: 40px" prop="role">
          <el-select v-model="edit_role_dialog_params.role" filterable placeholder="选择角色" clearable>
            <el-option  v-for="(item,key,index) in role_list" :key="index" :value="item['id']" :label="item['showGroup_options_all']">
              <span style="float: left">{{ item["role_name"]}}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item["showGroup_options"] }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账户名称" class="noselect" style="margin-right:40px" prop="uid">
          <el-input v-model="edit_role_dialog_params.uid" placeholder="" style="width:220px" disabled>
          </el-input>
        </el-form-item>
        <el-form-item label="用户名称" class="noselect" style="margin-right:40px" prop="zh_name">
          <el-input v-model="edit_role_dialog_params.zh_name" placeholder="例: 陈斤达" style="width:220px">
          </el-input>
        </el-form-item>
        <el-form-item label="登陆账号" class="noselect" style="margin-right:40px" prop="accountname">
          <el-input v-model="edit_role_dialog_params.accountname" placeholder="例: chenjinda" style="width:220px">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" class="noselect" style="margin-right:40px" prop="password">
          <el-input v-model="edit_role_dialog_params.password" placeholder="" style="width:220px">
          </el-input>
        </el-form-item>
        <el-button @click="submitForm('edit_role_dialog_params')" size="small" type="primary" class="formSubmitBtn" style="margin-right: -220px" >确 定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import crypto from '../crypto.js'
import utils from '../utils'
var reg = new RegExp(/^[a-zA-Z0-9]{1,20}$/)
var reg2 = new RegExp(/^[a-zA-Z]{1,20}$/)
var validatePass = (rule, value, callback) => {
  if (!reg.test(value)) {
    callback(new Error('必填，且只能输入字母或数字'));
  }  else {
    callback();
  }
};
var validatePass2 = (rule, value, callback) => {
  if (!reg2.test(value)) {
    callback(new Error('只能输入字母'));
  }  else {
    callback();
  }
};
export default {
  data() {
    return {
      tableHeight:620,
      //校验规则
      rules: {
        // 申请账号校验规则
        password: [
            { required: true,validator: validatePass, trigger: 'blur' }
        ],
        accountname: [
            {required: true, validator: validatePass, trigger: 'blur' }
        ],
        zh_name: [
          { required: true, message: '用户名称必填', trigger: 'blur' }
        ],
        uid: [
          { required: true, message: '账户名称必填', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '角色必选', trigger: 'change' }
        ]
      },
      new_loading:false,
      edit_loading:false,
      // 新建用户
      new_user_dialogVisible:false,
      new_user_dialog_params: {
        role:'',
        zh_name:'',
        accountname:'',
        uid:null,
        password:'000000',
      },
      // 编辑角色
      edit_role_dialogVisible:false,
      edit_role_dialog_params: {
        role:'',
        zh_name:'',
        accountname:'',
        uid:null,
        password:'',
      },
      // 分组列表
      role_list: null,
      group_list:null,
      key: 0,
      // 加载界面显示与否
      loading: true,
      // 过滤后数据
      ShowTableData: [],
      showGroup: [],
      showGroup_options:[]
    };
  },

  created() {
    this.fetchGroupData().then(()=> {
      this.fetchRoleList()
    }).then(()=> {
      this.fetch();
    })
  },

  methods: {
    getTableHeight() {//获取高度
      if (this.ShowTableData.length >= 12) {
        this.tableHeight = 12*50 + 56
      } else if (this.ShowTableData.length === 0) {
        this.tableHeight = 120
      } else {
        this.tableHeight = this.ShowTableData.length*50 + 56
      }
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
      formData.append("user",1000)
      await this.$http.post("/index.php/index/User/userList",formData).then((res) => {
        var sortArr_group = []
        this.ShowTableData = []
        res.data["0"].forEach(e=> {
          this.showGroup = []
          e["create_time_change"] = utils.getLocalTime(
            parseInt(e["insert_time"])
          ); // 时间戳转换
          e["group"] = e["group"].split(",")
          e["group"].forEach(i=> {
            this.traversal_findGroup(this.group_list,i)
            e["showGroup_sort"] = this.showGroup[0]
            e["showGroup"] = this.showGroup.join(' / ')
          })
          if (sortArr_group.indexOf(this.showGroup[0]) === -1 && this.showGroup[0] != '管理员') {
            sortArr_group.push(this.showGroup[0])
          }
        })
        sortArr_group.unshift('管理员')
        sortArr_group.forEach(a=> {
          res.data[0].forEach(i=> {
            if (i["showGroup_sort"] === a) {
              this.ShowTableData.push(i)
            }
          })
        })
        this.loading = false;
      });
      this.tableHeight = utils.setClientHight(this,220,56,50)
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
    traversal_findGroup_options(obj,targetId){//获取分组信息
      var t = targetId
      obj.forEach(e=> {
        if(e["id"] == targetId){
          this.showGroup_options.push(e["group"])
        }
        var _this = this
        for (var a in e) {
          if (a== "children") {
            _this.traversal_findGroup_options(e[a],t)
          }
        }
      })
    },
    async fetchRoleList() { //获取角色信息
      this.loading = true
      await this.$http.get('/index.php/index/User/roleList').then((res)=> {
        var sortArr_group = []
        this.role_list = []
        res.data[0].forEach(e=> {
          this.showGroup_options = []
          e["show_role"] = e["role_name"] +'-'+ e["group"]
          // 
          e["group"] = e["group"].split(",")
          e["group"].forEach(i=> {
            this.traversal_findGroup_options(this.group_list,i)
            e["showGroup_sort"] = this.showGroup_options[0]
            e["showGroup_options"] = this.showGroup_options.join(' / ')
            e["showGroup_options_all"] = e["role_name"] + '-' + e["showGroup_options"]
          })
          if (sortArr_group.indexOf(this.showGroup_options[0]) === -1 && this.showGroup_options[0] != '管理员') {
            sortArr_group.push(this.showGroup_options[0])
          }
        })
        sortArr_group.unshift('管理员')
        sortArr_group.forEach(a=> {
          res.data[0].forEach(i=> {
            if (i["showGroup_sort"] === a) {
              this.role_list.push(i)
            }
          })
        })
        // this.role_list = res.data[0]
        this.loading = false
      })
    },
    async fetchGroupData() { //获取分组信息
      // this.group_list = JSON.parse(crypto.cryptoDecrypt_string(localStorage.getItem("role_list")))
      await this.$http.get('/index.php/index/Role/groupList').then((res)=> {
        this.group_list = JSON.parse(res.data["group"])
      })
    },
    async new_user_dialog_submit() {//新建用户提交
      this.new_loading = true
      let formData = new FormData()
      formData.append("zh_name",this.new_user_dialog_params.zh_name)
      formData.append("role",this.new_user_dialog_params.role)
      formData.append("accountname",this.new_user_dialog_params.accountname)
      formData.append("uid",this.new_user_dialog_params.uid)
      formData.append("password",this.new_user_dialog_params.password)
      formData.append("name",this.new_user_dialog_params.accountname)
      await this.$http.post('/index.php/index/User/addUser',formData).then((res)=> {
        if (res.data.code === 200) {
          this.$message({
            message: `${res.data.data}`,
            type: "success",
          });
          this.new_loading = false
          this.new_user_dialogVisible = false
          this.fetch()
        } else {
          this.new_loading = false
          this.$message({
            message: `${res.data.data}`,
            type: "error",
          });
        }
      })
    },
    submitForm(formName) {//表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'edit_role_dialog_params') {
            this.edit_role_dialog_submit()
          } else {
            this.new_user_dialog_submit()
          }
        } else {
          return false;
        }
      });
    },
    async edit_role_dialog_submit() {//编辑角色提交
      this.edit_loading = true
      let formData = new FormData()
      formData.append("zh_name",this.edit_role_dialog_params.zh_name)
      formData.append("role",this.edit_role_dialog_params.role)
      formData.append("accountname",this.edit_role_dialog_params.accountname)
      formData.append("uid",this.edit_role_dialog_params.uid)
      formData.append("password",this.edit_role_dialog_params.password)
      formData.append("name",this.edit_role_dialog_params.accountname)
      await this.$http.post('/index.php/index/User/editUser',formData).then((res)=> {
        if (res.data.code === 200) {
          this.$message({
            message: `${res.data.data}`,
            type: "success",
          });
          this.edit_loading = false
          this.edit_role_dialogVisible = false
          this.fetch()
        } else {
          this.edit_loading = false
          this.$message({
            message: `${res.data.data}`,
            type: "error",
          });
        }
      })
    },
    freeze(e) {//冻结角色
    // console.log(e);
      this.$confirm(`是否冻结用户：${e.zh_name}？`,{
        type:"warning"
      })
      .then(
        async () => {
        this.loading = true
        let formData = new FormData()
        formData.append("uid",e.uid)
        formData.append("disable",1)
        await this.$http.post('/index.php/index/User/changeDisable',formData).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: `${res.data.data}`,
              type: "success",
            });
            e.disable = 1
          } else {
            this.$message({
              message: `${res.data.data}`,
              type: "error",
            });
          }
          this.loading = false
        })
      })
      .catch(() => {
        this.$message("已取消");
      });
    },
    unfreeze(e) {//冻结角色
      this.$confirm(`是否取消冻结用户：${e.zh_name}？`,{
        type:"warning"
      })
      .then(
        async () => {
        this.loading = true
        let formData = new FormData()
        formData.append("uid",e.uid)
        formData.append("disable",0)
        await this.$http.post('/index.php/index/User/changeDisable',formData).then((res) => {
          if (res.data.code === 200) {
            this.$message({
              message: `${res.data.data}`,
              type: "success",
            });
            e.disable = 0
          } else {
            this.$message({
              message: `${res.data.data}`,
              type: "error",
            });
          }
          this.loading = false
        })
      })
      .catch(() => {
        this.$message("已取消");
      });
    },
    edit_role_dialog(e) {//编辑角色表单
      this.edit_role_dialogVisible = true
      this.edit_role_dialog_params.zh_name = e.zh_name
      this.edit_role_dialog_params.uid = e.uid
      this.edit_role_dialog_params.accountname = e.name
      this.edit_role_dialog_params.password = e.password
      this.edit_role_dialog_params.role = e.role
    },
    async new_user_dialogVisible_open() {
      this.new_user_dialogVisible = true
      this.new_loading = true
      await this.$http.get('/index.php/index/User/newUid').then((res) => {
        this.new_user_dialog_params.uid = res.data["newUid"]
        this.new_loading = false
      })
    },
    closeDialog_new() {// 关闭dialog时清空验证
      this.$nextTick(() => {
          this.$refs['new_user_dialog_params'].clearValidate()
      })
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
      _this.tableHeight = utils.setClientHight(_this,220,56,50)
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
  .el-button--info {
    background-color: white !important;
    color: #606266 !important;
  }
  .is-active {
    background-color: white !important;
  }
  .el-select-dropdown__item.selected {
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
  .el-button--info.is-disabled:hover{
    color: #C0C4CC!important;
  }
  #delUser:hover {
    color: rgb(245, 108, 108);
    background-color: rgb(254, 240, 240);
  }
  #lock {
    position: absolute;
    left: 30px;
    top: 16px;
  }
</style>
