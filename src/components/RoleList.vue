<template>
  <div>
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;margin-bottom: 10px;min-width:400px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap;width:100%;justify-content: space-between" :disabled="loading">
        <el-form-item class="noselect">
          <!-- <el-input v-model="searchParams.accurateSearch" placeholder="搜索域名" clearable style="width: 200px;margin-right:10px"></el-input>
          <el-button @click="search" type="info" style="height: 30px; position: relative; margin-top: 32px">搜索</el-button> -->
          <el-button class="info_btn iconfont icon-fenzuguanli" @click="groupmanagement_dialog = true" type="info" style="font-size: 12px;height: 30px; position: relative; margin-top: 32px"> 分组管理</el-button>
          <el-button icon="el-icon-plus" class="info_btn" @click="new_role_dialog" type="info" style="height: 30px; position: relative; margin-top: 32px">新建角色</el-button>
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
      style="width:calc(100%-60px);line-height:30px;margin:0 0 25px 0;min-width:700px"
      border>
      <el-table-column prop="" label="详情" width="50px">
        <template slot-scope="scope">
          <el-button
            type="text" icon="el-icon-arrow-right"
            size="small"
            @click="tableOpen(scope.row)"
            style="padding-left: 9px;color:#909399"
          ></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="role_name" label="角色名称"></el-table-column>
      <el-table-column prop="showGroup" label="所属分组"></el-table-column>
      <el-table-column prop="create_time_change" label="创建时间"></el-table-column>
      <!-- <el-table-column fixed="right" label="操作" align="center" width="130px">
        <template slot-scope="scope">
          <el-dropdown placement="bottom" trigger="click">
            <span style="cursor: pointer;" class="el-dropdown-link">
              <i style="color: grey!important" class="el-icon-more"></i>
            </span>
            <el-dropdown-menu :visible-arrow="false" class="noselect" slot="dropdown">
              <el-dropdown-item :disabled="scope.row.use_in === '1' ? true:false" type="text" size="small" @click.native="edit_role_dialog(scope.row)">编辑角色</el-dropdown-item>
              <el-dropdown-item id="delUser" :disabled="scope.row.use_in === '1' ? true:false" type="text" size="small" @click.native="delRole(scope.row)">删除角色</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-tooltip content="编辑角色" placement="top" :visible-arrow="false">
            <el-button :disabled="scope.row.use_in === '1' ? true:false" size="small" @click="edit_role_dialog(scope.row)" icon="el-icon-edit" style="font-size:13px;color:grey;padding:0;margin-right:10px" type="text"></el-button>
          </el-tooltip>
          <el-tooltip content="删除角色" placement="top" :visible-arrow="false">
            <el-button :disabled="scope.row.use_in === '1' ? true:false" size="small" @click="delRole(scope.row)" icon="el-icon-delete" style="font-size:13px;color:red;padding:0;border:none;background-color:rgba(0,0,0,0)" type="text"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情抽屉 -->
    <el-drawer class="noselect" title="详情" :visible.sync="table" direction="rtl" size="600px">
      <el-form ref="makeOver_form" label-width="100px" label-position="left" style="padding-left: 70px" v-loading="loadingDetail">
        <el-form-item size="small" label="权限详情: " class="noselect">
          <el-tree
          :check-strictly="true"
            style="margin-top:3px"
            ref="showTree"
            node-key="value"
            :props="showTreeprops"
            :data="data"
            :show-checkbox="true"
            :load="loadNode"
            :check-on-click-node="true">
          </el-tree>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 分组管理 -->
    <el-dialog title="分组管理" :visible.sync="groupmanagement_dialog" width="400px" :close-on-click-modal="false">
      <div style="position:relative;width:100%;height:50px">
        <el-button style="position:absolute;left:7px"  @click="newgroup_dialog = true" type="text">新建组别</el-button>
      </div>
      <el-tree
        :data="this.group_list"
        :props="datasProps"
        node-key="id"
        :expand-on-click-node="false"
          >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
          disabled
            type="text"
            size="mini"
            @click="() => append(data)">
            Edit
          </el-button>
          <el-button
          disabled
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            Delete
          </el-button>
        </span>
      </span>
      </el-tree>
    </el-dialog>

    <el-dialog title="新建分组" :visible.sync="newgroup_dialog" width="400px" :close-on-click-modal="false">
      <el-form label-width="100px" label-position="right">
        <el-form-item label="选择分组" class="noselect" style="margin-right: 40px">
          <el-cascader v-model="newgroup_dialog_params.newgroup_dialog_group" :options="group_list" :props="{ checkStrictly: true,value:'id',label:'group' }"></el-cascader>
        </el-form-item>
        <el-form-item label="分组名称" class="noselect" style="margin-right:240px" prop="new_form_account">
          <el-input v-model="newgroup_dialog_params.newgroup_dialog_name" placeholder="请输入内容" style="width:220px">
          </el-input>
        </el-form-item>
          <el-button :disabled="newgroup_dialog_params.newgroup_dialog_name === ''?true:false" size="small" type="primary" @click="newgroup_dialog_submit_allow()" class="formSubmitBtn" style="margin-right: -220px;">确 认</el-button>
      </el-form>
    </el-dialog>

    <!-- 创建角色表单 -->
    <el-dialog title="创建角色" :visible.sync="new_role_dialogVisible" width="400px" :close-on-click-modal="false">
      <el-form label-width="100px" label-position="right" v-loading="new_role_dialog_loading">
        <el-form-item label="选择分组" class="noselect" style="margin-right: 40px">
          <el-cascader v-model="new_role_dialog_params.group" :options="group_list" :props="{ checkStrictly: true,value:'id',label:'group' }"></el-cascader>
        </el-form-item>
        <el-form-item label="角色名称" class="noselect" style="margin-right:240px" prop="new_form_account">
          <el-input v-model="new_role_dialog_params.role" placeholder="请输入内容" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="权限限制"  class="noselect">
          <el-tree
          :check-strictly="true"
            style="margin-top:5px"
            ref="tree"
            :props="props"
            :data="data"
            node-key="value"
            :show-checkbox="true"
            :load="loadNode"
            :check-on-click-node="true">
          </el-tree>
        </el-form-item>
        <el-button :disabled="new_role_dialog_params.group === ''|| new_role_dialog_params.role ==='' ? true:false" @click="new_role_dialog_submit" size="small" type="primary" class="formSubmitBtn" style="margin-right: -220px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 编辑角色表单 -->
    <el-dialog title="编辑角色" :visible.sync="edit_role_dialogVisible" width="400px" :close-on-click-modal="false">
      <el-form :model="edit_role_dialog_params" label-width="100px" label-position="right" v-loading="edit_role_dialog_loading">
        <el-form-item label="选择分组" class="noselect" style="margin-right: 40px">
          <el-cascader v-model="edit_role_dialog_params.group" :options="group_list" :props="{ checkStrictly: true,value:'id',label:'group' }"></el-cascader>
        </el-form-item>
        <el-form-item label="角色名称" class="noselect" style="margin-right:240px" prop="new_form_account">
          <el-input v-model="edit_role_dialog_params.role" placeholder="请输入内容" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="权限限制"  class="noselect">
          <el-tree
          :check-strictly="true"
            style="margin-top:5px"
            ref="editTree"
            :props="props"
            :data="data"
            node-key="value"
            :show-checkbox="true"
            :load="loadNode"
            :check-on-click-node="true">
          </el-tree>
        </el-form-item>
        <el-button :disabled="edit_role_dialog_params.group === ''|| edit_role_dialog_params.role ==='' ? true:false" @click="edit_role_dialog_submit" size="small" type="primary" class="formSubmitBtn" style="margin-right: -220px" >确 定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import crypto from '../crypto.js'
import utils from '../utils'
export default {
  data() {
    return {
      new_role_dialog_loading:false,
      edit_role_dialog_loading:false,
      datasProps: {
        label:"group"
      },
      tableHeight:620,
      checkNodeKeys:[],
      props: {
      children: "children",
      label: "label",
      },
      showTreeprops: {
        children: "children",
        label: "label",
        disabled: this.disabledFn
      },
      data:[
        // 广告
        {
            label: "广告",
            value:"ad",
            children: [
              {
                label: "广告站点列表",
                value:"adlist",
                children: [
                  {
                    label: "搜索项-项目",
                    value:"searchsubject",
                  },
                  {
                    label: "搜索项-分组",
                    value:"searchgroup",
                  },
                  {
                    label: "搜索项-用户",
                    value:"searchuser",
                  },
                  {
                    label: "列表-项目",
                    value:"listsubject",
                  },
                  {
                    label: "列表-分组",
                    value:"listgroup",
                  },
                  {
                    label: "列表-用户",
                    value:"listuser",
                  },
                ],
              },
            ],
        },
        // 域名
        {
            label: "域名",
            value:"domainname",
            children: [
              {
                label: "域名列表",
                value:"realmnamelist",
              },
              {
                label: "COD域名列表",
                value:"codrealmnamelist",
              },
              {
                label: "库存管理",
                value:"stockcontrol",
              },
              {
                label: "申请限制",
                value:"applicationrestrictions",
              },
            ],
        },
        // 账号
        {
            label: "账号",
            value:"account",
            children: [
              {
                label: "账号总表",
                value:"accounttable"
              },
              {
                label: "我的账号",
                value:"myaccount",
                children: [
                  {
                    label: "分配账号",
                    value:"adistributeaccount",
                  }
                ]
              },
              {
                label: "账号充值",
                value:"accountrecharge"
              },
              {
                label: "充值审批",
                value:"rechargeapproval"
              },
              {
                label: "回收审批",
                value:"recyclingapproval"
              },
              {
                label: "账号统计",
                value:"accountstatistics",
                children: [
                  {
                    label: "成本导出",
                    value:"costexport",
                  }
                ]
              },
              {
                label: "账号申请限制",
                value:"accountapplicationrestrictions"
              }
            ],
        },
        // 财务
        {
            label: "财务",
            value:"finance",
            children: [
              {
                label: "充值明细",
                value:"rechargedetails"
              },
              {
                label: "消耗列表",
                value:"consumptionlist"
              },
              {
                label: "消耗申报",
                value:"consumptiondeclaration"
              },
              {
                label: "我的消耗",
                value:"myconsumption"
              },
              {
                label: "加粉统计",
                value:"datastatistics",
                children: [
                  {
                    label: "数据编辑",
                    value:"dataedit",
                  }
                ]
              }
            ],
        },
        // 客服
        {
            label: "客服",
            value:"service",
            children: [
              {
                label: "客服列表",
                value:"serviceList",
                children: [
                  {
                    label: "编辑客服",
                    value:"editservice",
                  },
                  {
                    label: "创建客服",
                    value:"createservice",
                  }
                ]
              }
            ],
        },
        // 落地页
        {
            label: "落地页",
            value:"landingpage",
            children: [
              {
                label: "落地页列表",
                value:"landingpagelist",
                children: [
                  {
                    label: "编辑落地页",
                    value:"editlandingpage",
                  },
                  {
                    label: "创建落地页",
                    value:"createlandingpage",
                  }
                ]
              }
            ],
        },
        // 埋点
        {
            label: "埋点",
            value:"eventtracking",
            children: [
              {
                label: "埋点数据",
                value:"eventtrackingdata",
              }
            ],
        },
        // 屏蔽页
        {
            label: "屏蔽页",
            value:"examinedpage",
            children: [
              {
                label: "屏蔽页列表",
                value:"examinedpagelist",
                children: [
                  {
                    label: "编辑屏蔽页",
                    value:"editexaminedpage",
                  },
                  {
                    label: "创建屏蔽页",
                    value:"createexaminedpage",
                  }
                ]
              }
            ],
        },
        // 用户
        {
            label: "用户",
            value:"user",
            children: [
              {
                label: "用户列表",
                value:"stafflist"
              },
              {
                label: "用户列表",
                value:"userlist"
              },
              {
                label: "角色列表",
                value:"rolelist"
              }
            ],
        },
      ],
      // 新建角色
      new_role_dialogVisible:false,
      new_role_dialog_params: {
        group:'',
        role:'',
        authority:[],
        target_group:null,
      },
      // 编辑角色
      edit_role_dialogVisible:false,
      edit_role_dialog_params: {
        group:'',
        role:'',
        authority:[],
        target_group:null
      },
      // 分组列表
      newgrop_btn_diabled:true,
      newgroup_dialog:false,
      groupmanagement_dialog:false,
      group_list: null,
      group_list_submit:null,
      newgroup_dialog_params: {
        newgroup_dialog_name: '',
        newgroup_dialog_group:null
      },
      key: 0,
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
      // 
      count:0,
      targetObj:{},
      uid:null,
      showGroup:[]
    };
  },
  created() {
    this.fetchGroupData().then(()=> {
      this.fetch();
    })
  },
  methods: {
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
          <span>
            <el-button size="mini" type="text" on-click={ () => this.append(data) }>编辑</el-button>
            <el-button style="color:rgb(245, 108, 108)" size="mini" type="text" on-click={ () => this.remove(node, data) }>删除</el-button>
          </span>
        </span>);
    },
    async fetch() {// 数据获取
      this.loading = true
      let formData = new FormData()
      formData.append("user",this.uid)
      await this.$http.post("/index.php/index/Role/roleList",formData).then((res) => {
        var sortArr_group = []
        this.ShowTableData = []
        res.data[0].forEach(e=> {
          this.showGroup = []
          e["checkItems"] = e.content.split(",")
          e["create_time_change"] = utils.getLocalTime(parseInt(e["create_time"]));
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
        this.tableHeight = utils.setClientHight(this,220,56,53)
        this.loading = false;
      });
    },
    async newgroup_dialog_submit() {// 创建分组
      this.group_list_submit = []
      if (this.newgroup_dialog_params["newgroup_dialog_group"] === null || this.newgroup_dialog_params["newgroup_dialog_group"] === '') {//添加一级
        if (this.group_list != null && this.group_list.length != 0) {
          this.count = 0
          this.traversalObject(this.group_list)
        }
        if (this.count === 0) {//首个分组
          this.group_list_submit = [{"group":`${this.newgroup_dialog_params["newgroup_dialog_name"]}`,"id":0}]
        } else {//一级分组但不为首个
          this.group_list_submit = this.group_list
          this.group_list_submit.push({"group":`${this.newgroup_dialog_params["newgroup_dialog_name"]}`,"id":this.count})
        }
      } else {//其余层级
        this.group_list_submit = this.group_list
        // console.log(this.newgroup_dialog_params["newgroup_dialog_group"][this.newgroup_dialog_params["newgroup_dialog_group"].length-1]);
        this.traversal_findObject(this.group_list,this.newgroup_dialog_params["newgroup_dialog_group"][this.newgroup_dialog_params["newgroup_dialog_group"].length-1])
        if (Object.prototype.hasOwnProperty.call(this.targetObj,'children')) {
          this.count = 0
          this.traversalObject(this.group_list)
          this.targetObj["children"].push({"group":`${this.newgroup_dialog_params["newgroup_dialog_name"]}`,"id":this.count})
        } else {
          this.count = 0
          this.traversalObject(this.group_list)
          this.targetObj["children"] = [{"group":`${this.newgroup_dialog_params["newgroup_dialog_name"]}`,"id":this.count}]
        }
      }
      let formData = new FormData()
      formData.append("id",1)
      formData.append("group",JSON.stringify(this.group_list_submit))
      await this.$http.post('/index.php/index/Role/addGroup',formData).then((res) => {
        if (res.data > 0) {
          this.$message.success('创建成功')
          this.fetchGroupData_web()
          this.newgroup_dialog = false
        } else {
          this.$message.error('创建失败')
        }
      })
    },
    newgroup_dialog_submit_allow() {//检验
      // var allow_arr =[] 
      // this.group_list.forEach(e=> {
      //   allow_arr.push(e["group"])
      // })
      // if (allow_arr.indexOf(this.newgroup_dialog_params.newgroup_dialog_name) >= 0) {
      //   this.$message({
      //     type: "error",
      //     message: "已存在该分组",
      //   });
      // } else {
        this.newgroup_dialog_submit()
      // }
    },
    async fetchGroupData() { //获取分组信息
      // this.group_list = JSON.parse(crypto.cryptoDecrypt_string(localStorage.getItem("role_list")))
      await this.$http.get('/index.php/index/Role/groupList').then((res)=> {
        this.group_list = JSON.parse(res.data["group"])
      })
    },
    async fetchGroupData_web() { //获取分组信息
        // this.loading = true
        // await this.$http.get('/index.php/index/Role/groupList').then((res)=> {
        //   localStorage.setItem('role_list',res.data["group"])
        //   this.loading = false
        // })
    },
    traversalObject(obj){ //递归遍历
      obj.forEach(e=> {
        var _this = this
        for (var a in e) {
          if(a=="id"){
            this.count = this.count + 1
          }
          if (typeof (e[a]) == "object") {
            _this.traversalObject(e[a])
          }
        }
      })
    },
    traversal_findObject(obj,targetId){ //递归遍历-寻找符合id的目标对象
    var t= targetId
      obj.forEach(e=> {
        if(e["id"] === targetId){
            this.targetObj = e
          }
        var _this = this
        for (var a in e) {
          if (a== "children") {
            _this.traversal_findObject(e[a],t)
          }
        }
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
    async del_grop(e) {// 删除分组
      let formData = new FormData()
      formData.append("group",e.group)
      await this.$http.post('/index.php/index/Role/deleteGroup',formData).then((res) => {
        if (res.data > 0) {
          this.$message.success('删除成功')
          this.fetchGroupData()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    async new_role_dialog_submit() {//新建角色提交
      let parentArr = this.$refs.tree.getHalfCheckedKeys()//获取半选中状态的value
      let childArr = this.$refs.tree.getCheckedKeys()//获取全选中的value
      this.checkNodeKeys = parentArr.concat(childArr)//拼接
      if (this.checkNodeKeys.length === 0) {
        this.$message({
          message: "权限不可为空",
          type: "error",
        });
      } else {
        this.new_role_dialog_loading = true
        this.new_role_dialog_params["target_group"] = this.new_role_dialog_params["group"][this.new_role_dialog_params["group"].length-1]
        this.new_role_dialog_params.authority =  this.checkNodeKeys
        let formData = new FormData()
        formData.append("target_group",this.new_role_dialog_params.target_group)
        formData.append("group",this.new_role_dialog_params.group)
        formData.append("role",this.new_role_dialog_params.role)
        formData.append("authority",this.new_role_dialog_params.authority)
        await this.$http.post('/index.php/index/Role/addRole',formData).then((res)=> {
          this.new_role_dialog_loading = false
          if (res.data.code === 200) {
            this.$message.success(`${res.data.data}`)
          this.new_role_dialogVisible = false
          this.fetch()
          } else {
            this.$message.error(`${res.data.data}`)
          }
        })
      }
    },
    async edit_role_dialog_submit() {//编辑角色提交
      let parentArr = this.$refs.editTree.getHalfCheckedKeys()//获取半选中状态的value
      let childArr = this.$refs.editTree.getCheckedKeys()//获取全选中的value
      this.checkNodeKeys = parentArr.concat(childArr)//拼接
      if (this.checkNodeKeys.length === 0) {
        this.$message({
          message: "权限不可为空",
          type: "error",
        });
      } else {
        this.edit_role_dialog_loading = true
        this.edit_role_dialog_params.authority =  this.checkNodeKeys
        let formData = new FormData()
        this.edit_role_dialog_params["target_group"] = this.edit_role_dialog_params["group"][this.edit_role_dialog_params["group"].length-1]
        formData.append("target_group",this.edit_role_dialog_params.target_group)
        formData.append("group",this.edit_role_dialog_params.group)
        formData.append("role",this.edit_role_dialog_params.role)
        formData.append("authority",this.edit_role_dialog_params.authority)
        formData.append("id",this.edit_role_dialog_params.id)
        await this.$http.post('/index.php/index/Role/roleEdit',formData).then((res)=> {
          this.edit_role_dialog_loading = false
          if (res.data.code === 200) {
            this.$message.success(`${res.data.data}`)
          this.edit_role_dialogVisible = false
          this.fetch()
          } else {
            this.$message.error(`${res.data.data}`)
          }
        })
      }
    },
    delRole(e) {//删除角色
      this.$confirm(`是否删除角色：${e.role_name}？`,{
        type:"warning"
      })
      .then(() => {
        // console.log(e);
      })
      .catch(() => {
        this.$message("已取消");
      });
    },
    loadNode(node, resolve) {//渲染权限树
      resolve(this.data)
    },
    disabledFn() {//详情权限树禁用
      return true
    },
    edit_role_dialog(e) {//编辑角色表单
    this.edit_role_dialog_params["group"] = []
      this.edit_role_dialog_params.id = e.id
      e.group.forEach(i => {
        this.edit_role_dialog_params["group"].push(Number(i))
      })
      // this.edit_role_dialog_params["group"] = e.group
      this.edit_role_dialogVisible = true
      setTimeout(() => {
        this.$refs.editTree.setCheckedKeys([])
        this.edit_role_dialog_params.role = e.role_name
        e.checkItems.forEach(i=> {
          this.$nextTick(()=> {
            this.$refs.editTree.setChecked(i,true,false)
          })
        })
      }, 1);
    },
    tableOpen(e) {// 详情
      this.table = true;
      this.loadingDetail = true
      setTimeout(() => {
        for (let i = 0; i < this.data.length; i++) {
          this.$refs.showTree.store.nodesMap[this.data[i].value].expanded = false;
        }
        this.$refs.showTree.setCheckedKeys([])
        e.checkItems.forEach(i=> {
          this.$nextTick(()=> {
            this.$refs.showTree.setChecked(i,true,false)
          })
        })
        this.loadingDetail = false
      }, 1);
    },
    new_role_dialog() {// 创建角色树
      this.new_role_dialogVisible = true
      setTimeout(() => {
        for (let i = 0; i < this.data.length; i++) {
          this.$refs.tree.store.nodesMap[this.data[i].value].expanded = false;
        }
        this.$refs.tree.setCheckedKeys([])
      }, 1);
    },
    getTableHeight() {//获取高度
      if (this.ShowTableData.length >= 11) {
        this.tableHeight = 11*53 + 56
      }  else if (this.ShowTableData.length === 0) {
        this.tableHeight = 120
      } else {
        this.tableHeight = this.ShowTableData.length*53 + 56
      }
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
      _this.tableHeight = utils.setClientHight(_this,220,56,53)
    }
  },
};
</script>

<style scoped>
.custom-tree-node {
    width: 100%;
    display: flex;
    line-height: 29px;
    justify-content: space-around;
}
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
  .el-button--info.is-disabled:hover{
    color: #C0C4CC!important;
  }
  #delUser:hover {
    color: rgb(245, 108, 108);
    background-color: rgb(254, 240, 240);
  }
</style>
