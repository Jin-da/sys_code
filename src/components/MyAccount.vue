<template>
  <div>
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;min-width:1650px;margin-top:70px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap;" :disabled="loading">
        <el-form-item class="noselect" style="margin-right: 30px">
          <el-date-picker :picker-options="pickerOptions" value-format="timestamp" style="width:250px" v-model="searchParams.date" type="daterange" range-separator="至" start-placeholder="分配时间-始" end-placeholder="分配时间-末">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right:30px">
          <el-select v-model="searchParams.state" placeholder="状态" clearable style="width:120px">
            <el-option v-for="(item,index) in chooseStatus" :key="index" :label="item['label']" :value="item['value']"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right:30px">
          <el-select v-model="searchParams.account_type" placeholder="账号类型" clearable style="width:130px">
            <el-option v-for="(item,index) in chooseType" :key="index" :label="item['label']" :value="item['value']"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right: 30px">
          <el-input v-model="searchParams.account_name" placeholder="搜索账户名称" clearable style="width: 130px;"></el-input>
        </el-form-item>
        <el-form-item  class="noselect" style="margin-right:30px">
          <el-input v-model="searchParams.account_id" placeholder="搜索账号" clearable style="width: 130px;"></el-input>
        </el-form-item>
        <el-form-item  class="noselect" style="margin-right:30px">
          <el-input v-model="searchParams.ad_id" placeholder="搜索广告账号ID" clearable style="width: 130px;"></el-input>
        </el-form-item>
        <el-form-item  class="noselect" style="margin-right:30px">
          <el-input v-model="searchParams.card_id" placeholder="搜索信用卡号" clearable style="width: 130px;"></el-input>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right: 30px">
          <el-input v-model="searchParams.pay_id" placeholder="搜索充值卡号" clearable style="width: 130px;"></el-input>
        </el-form-item>
        <el-form-item  class="noselect" style="margin-right:30px">
          <el-input v-model="searchParams.bank" placeholder="搜索BM" clearable style="width: 130px;"></el-input>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right: 30px">
          <el-input v-model="searchParams.remark" placeholder="搜索备注" clearable style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right: 30px">
          <el-input v-model="searchParams.user_remark" placeholder="搜索个人备注" clearable style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item class="noselect">
          <el-button icon="el-icon-search" @click="research(1)" plain style="height: 30px; position: relative;">搜索</el-button>
        </el-form-item>
        <el-form-item class="noselect">
          <el-button icon="el-icon-plus" @click="getAccount" class="info_btn" type="info" style="height: 30px; position: relative;right:-10px;margin-left:10px;" >申请账号</el-button>
          <el-button :disabled="showIf" class="info_btn" icon="el-icon-download" @click="exportExcel" type="info" style="height: 30px; position: relative;right:-10px;margin-left:10px;" >导出
          </el-button>
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
      style="width:calc(100%-60px);line-height:30px;margin:5px 0px;min-width:1620px;margin-bottom:25px"
      :row-style="{height: '50px'}"
      border
      @selection-change="handleSelectionChange_delete">
      <el-table-column type="selection" width="55" fixed="left"></el-table-column>
      <el-table-column prop="" label="详情" width="50px" fixed="left">
          <template slot-scope="scope">
            <div style="height:25px;width:50px;cursor:pointer" @click="tableOpen(scope.row)">
              <el-button
              type="text" icon="el-icon-arrow-right"
              size="small"
              style="color:#909399;padding:0 0 0 9px!important;"
              ></el-button>
            </div>
          </template>
      </el-table-column>
      <!-- <el-table-column prop="id" label="ID" width="50px">
      </el-table-column> -->
      <el-table-column prop="account_id" label="账号" min-width="550px">
      </el-table-column>
      <el-table-column prop="account_type" label="类型" width="80px">
      </el-table-column>
      <el-table-column prop="card_id" label="信用卡号" width="160px">
      </el-table-column>
      <el-table-column prop="account_name" label="账户名称" width="350px">
      </el-table-column>
      <el-table-column prop="account_limit" label="限额" min-width="50px">
      </el-table-column>
      <el-table-column prop="login_ip" label="IP" width="50px">
      </el-table-column>
      <el-table-column prop="allot_time" label="分配时间" width="90px">
      </el-table-column>
      <el-table-column prop="user_remark" label="个人备注" min-width="150px">
        <template slot="header">
          <div>个人备注</div>
        </template>
        <template slot-scope="scope">
          <el-input @focus="getRemark(scope.row)" @blur="remark_submit(scope.row)" size="mini" placeholder="无备注" v-model="scope.row.user_remark" clearable></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="100px">
      </el-table-column>
      <el-table-column prop="state" label="状态" width="80px">
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" align="center" width="130px">
        <template slot-scope="scope">
          <el-dropdown placement="bottom" trigger="click">
            <span style="cursor: pointer;" class="el-dropdown-link">
              <i style="color: grey!important" class="el-icon-more"></i>
            </span>
            <el-dropdown-menu :visible-arrow="false" class="noselect" slot="dropdown">
              <el-dropdown-item @click.native="user_remark_dialog(scope.row)">编辑备注</el-dropdown-item>
              <el-dropdown-item :disabled="scope.row['state'] === '不可用' || scope.row['state'] === '审批中'|| scope.row['state'] === '充值中'?true:false" @click.native="make_over_dialog(scope.row)">账号转让</el-dropdown-item>
              <el-dropdown-item :disabled="scope.row['state'] === '不可用' || scope.row['state'] === '审批中'|| scope.row['state'] === '充值中'?true:false" @click.native="account_back_dialog(scope.row)">账号退回</el-dropdown-item>
              <el-dropdown-item :disabled="scope.row['state'] === '不可用' || scope.row['state'] === '审批中'|| scope.row['state'] === '充值中'?true:false" id="delAccount" @click.native="remove(scope.row)">账号停用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <!-- <el-tooltip content="广告已开启屏蔽" placement="left" :visible-arrow="false">
            <p id="lock" v-if="scope.row.cloak === '1'" class="el-icon-lock" style="margin-right:10px;color:red;display:inline-block;font-size:15px" type="text"></p>
          </el-tooltip> -->
          <el-tooltip content="账号转让" placement="top" :visible-arrow="false">
            <el-button :class="{'disabled_btn':scope.row['state'] === '不可用' || scope.row['state'] === '审批中'|| scope.row['state'] === '充值中'?true:false}" :disabled="scope.row['state'] === '不可用' || scope.row['state'] === '审批中'|| scope.row['state'] === '充值中'?true:false" @click="make_over_dialog(scope.row)" style="font-size:13px;color:grey;padding:0" type="text" class="el-icon-refresh"></el-button>
          </el-tooltip>
          <el-tooltip content="账号退回" placement="top" :visible-arrow="false">
            <el-button :class="{'disabled_btn':scope.row['state'] === '不可用' || scope.row['state'] === '审批中'|| scope.row['state'] === '充值中'?true:false}" :disabled="scope.row['state'] === '不可用' || scope.row['state'] === '审批中'|| scope.row['state'] === '充值中'?true:false" @click="account_back_dialog(scope.row)" style="font-size:13px;color:grey;padding:0;border:none;background-color:rgba(0,0,0,0)" class=" iconfont icon-tuihui"></el-button>
          </el-tooltip>
          <el-tooltip content="账号停用" placement="top" :visible-arrow="false">
            <el-button :class="{'disabled_btn':scope.row['state'] === '不可用' || scope.row['state'] === '审批中'|| scope.row['state'] === '充值中'?true:false}" :disabled="scope.row['state'] === '不可用' || scope.row['state'] === '审批中'|| scope.row['state'] === '充值中'?true:false" @click="remove(scope.row)" style="font-size:13px;color:red;padding:0;border:none;background-color:rgba(0,0,0,0)" class=" iconfont icon-jinyong"></el-button>
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
          <!-- <el-button type="text" icon="el-icon-arrow-left"
              size="small" @click="innerDrawer = true" style="position: absolute;left:0;color:black"></el-button> -->
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
        <el-form-item size="small" label="退回记录：" class="noselect">
          <template>
            <p v-if="this.detail_apply_reason!=null && this.detail_refuse_reason!=null" style="text-align:left;color:red">历史退回申请理由:{{this.detail_apply_reason}};<br>管理员拒绝理由:{{this.detail_refuse_reason}}</p>
            <p  style="text-align:left;color:red" v-else>无</p>
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
            <!-- 嵌套抽屉 -->
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

    <!-- 重复项目详情抽屉 -->
    <el-drawer :wrapperClosable="false" class="noselect" title="以下项目导入失败(重复项)" :visible.sync="repeat_table" direction="rtl" size="600px">
      <el-form ref="makeOver_form" label-width="100px" label-position="left" style="padding-left:70px;min-height:500px">
        <el-form-item size="small" label="广告账号ID: " class="noselect">
          <p style="text-align:left;text-decoration:underline;cursor: pointer;" v-for="item in repeat_table_data" :key="item" :label="item" :value="item" v-clipboard:copy="item" v-clipboard:success="onCopy" v-clipboard:error="onError">{{item}}</p>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 导出表单 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="export_form_dialogVisible" width="500px">
      <el-form ref="export_form" :model="export_form" label-width="100px" label-position="right">
        <el-form-item label="请选择时间段" label-width="100px" style="position:relative">
          <el-date-picker
          v-model="export_form.selected"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        </el-form-item>
        <el-button size="small" type="primary" @click="submitForm('export_form')" class="formSubmitBtn" style="margin-right: 390px;">确 定</el-button>
      </el-form>
    </el-dialog>

    <!--申请账号表单  -->
    <el-dialog :close-on-click-modal="false" @close='closeDialog_new' :visible.sync="new_form_dialogVisible" width="600px" label-width="80px">
      <el-form v-loading="get_account_loading" :rules="rules" ref="new_form" :model="new_form" label-width="100px" label-position="right">
        <el-form-item label="账号类型" class="noselect" style="margin-right:240px" prop="type" clearable>
          <el-select @change="utils_run" v-model="new_form.type" placeholder="筛选" clearable>
            <el-option v-for="(item,index) in chooseOptions['type']" :key="index" :label="item['label']" :value="item['value']"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="限额" class="noselect" style="margin-right:240px" prop="limit" clearable>
          <el-select @change="utils_run" v-model="new_form.limit" placeholder="筛选" clearable>
            <el-option v-for="(item,index) in chooseOptions['limit']" :key="index" :label="item['label']" :value="item['value']"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="来号批次" class="noselect" style="margin-right:240px" prop="batch">
          <el-select @change="utils_run" v-model="new_form.batch" placeholder="筛选" clearable>
            <el-option v-for="(item,index) in chooseOptions['batch']" :key="index" :label="item['label']" :value="item['value']"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="this.authority['adistributeaccount']" label="目标用户" class="noselect" style="margin-right:30px">
          <el-select v-model="new_form.uid" placeholder="筛选" clearable style="width:220px">
            <el-option v-for="(item,index) in chooseNewUser" :key="index" :label="item['zh_name']" :value="item['uid']"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请数量" class="noselect" style="margin-right:240px" prop="num">
          <el-input-number @change="num_watch" :disabled="this.maxNum<=0||new_form.limit === '' || new_form.type === '' || new_form.batch === ''?true:false" v-model="new_form.num" :min="1" :max="this.maxNum" style="position: absolute;left: 0"></el-input-number>
        </el-form-item>
        <el-form-item label="今日限制" class="noselect" style="margin-right:240px">
          <div v-if="this.showOwnLimit === null || this.showOwnLimit === ''||this.showOwnLimit === undefined" style="text-align:left">请选择项目</div>
          <div v-else style="text-align:left">{{this.showOwnLimit}}</div>
        </el-form-item>
          <el-button :disabled="new_form_btn" size="small" type="primary" @click="submitForm('new_form')" class="formSubmitBtn" style="margin-right: 300px;">确 定</el-button>
      </el-form>
      <el-table v-if="this.ShowTableData_getAccount.length != 0" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255,255,255,0.5)" ref="multipleTable" :data="ShowTableData_getAccount" tooltip-effect="dark" style="width: calc(100% - 60px); line-height: 30px; margin:30px;margin-top: 25px" border><!--@selection-change="handleSelectionChange_delete"-->
      <el-table-column prop="type" label="类型">
      </el-table-column>
      <el-table-column prop="limit" label="限额">
      </el-table-column>
      <el-table-column prop="batch" label="批次">
      </el-table-column>
      <el-table-column prop="num" label="数量">
      </el-table-column>
    </el-table>
    </el-dialog>

    <!-- 转让表单 -->
    <el-dialog :close-on-click-modal="false" title="账号转让" :visible.sync="make_over_dialogVisible" width="450px" @close='closeDialog_make_over'>
      <el-form :rules="rules" ref="make_over" :model="make_over" label-width="110px" label-position="right" v-loading="make_over_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="转让账号" class="noselect" style="margin-right: 40px">
              <div style="text-align: left;">{{this.make_over["account"]}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="目标用户" class="noselect" style="margin-right: 40px" prop="new_user">
              <el-select v-model="make_over.new_user" placeholder="筛选" filterable>
                <el-option v-for="(item,index) in chooseNewUser" :key="index" :label="item['zh_name']" :value="item['uid']">
                  <span style="float: left">{{ item['zh_name'] }}</span>
                  <span style="float: right;color: #8492a6; font-size: 13px">{{item['uid'] }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="small" type="primary" @click="submitForm('make_over')" class="formSubmitBtn" style="margin-right: -270px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 退回表单 -->
    <el-dialog :close-on-click-modal="false" title="账号退回" :visible.sync="account_back_dialogVisible" width="450px" @close='closeDialog_account_back'>
      <el-form :rules="rules" ref="account_back" :model="account_back" label-width="110px" label-position="right" v-loading="account_back_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="退回账号" class="noselect" style="margin-right: 40px">
              <div style="text-align: left;">{{this.account_back["account"]}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="退回理由" class="noselect" style="margin-right: 40px" prop="reason"> 
              <el-input v-model="account_back.reason" placeholder="请输入退回理由">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="small" type="primary" @click="submitForm('account_back')" class="formSubmitBtn" style="margin-right: -270px" >确 定</el-button>
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
import { export_json_to_excel } from '../Export2Excel.js'
  export default {
    data() {
      return {
        authority:{},
        standBy_user_remark:null,
        pickerOptions: {
          disabledDate(v) {
            return v.getTime() >= new Date().getTime();
          }
        },
        showOwnLimit:null,
        // 备注
        remark_form_dialogVisible:false,
        remark_form_loading:false,
        remark_form:{
          remark:null,
          id:null
        },
        // 转让
        make_over_dialogVisible:false,
        make_over:{
          account:null,
          new_user:null,
          id:null
        },
        make_over_loading:false,
        chooseNewUser:[],
        // 退回
        account_back_loading:false,
        account_back_dialogVisible:false,
        account_back:{
          account:null,
          reason:null,
          id:null
        },
        // 申请账号
        get_account_loading:false,
        new_form_dialogVisible:false,
        new_form:{
          type:'',
          limit:'',
          batch:'',
          num:0,
          uid:null
        },
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
        //停用表单的数据
        deactivate_form: {
          deactivate_id : null,
          deactivate_accountname: null,
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
          account_type: null,
          account_user: null,
          ad_id: null,
          bank: null,
          card_id: null,
          pay_id: null,
          remark: null,
          state: null,
          date:null,
          user_remark:null
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
        pageSize:50,
        searchPageChange:false,
        standBy_search:null,
        clientHeight: 0, 
      }
    },

    created() {
      this.getAuthority()
      // 执行网络请求
      this.getUid()
      //获取表单选项及表格数据
      this.fetch()
      this.fetchOption()
      this.fetchUser()
    },

    methods: {
      getAuthority() {
        crypto.cryptoDecrypt_string(localStorage.getItem('authority')).split(',').forEach(e=> {
          this.authority[e] = true
        })
      },
      // 编辑备注
      user_remark_dialog(e) {
        this.remark_form_dialogVisible = true
        this.remark_form["remark"] = e["user_remark"]
        this.remark_form["id"] = e["id"]
      },
      getRemark(e) {
        this.standBy_user_remark = e["user_remark"]
      },
      async remark_submit(e) {
        if (e["user_remark"] != this.standBy_user_remark) {
          let formData = new FormData()
          formData.append('user',this.uid)
          formData.append("id",e["id"])
          formData.append("remark",e["user_remark"])
          await this.$http.post('/index.php/index/account/userRemark/',formData).then((res) => {
            if (res.data["code"] === 200) {
              this.remark_form_dialogVisible = false
              this.$message.success(`${res.data["data"]}`)
              this.fetchPageData(this.currentPage)
            } else {
              this.$message.error(`${res.data["data"]}`)
            }
          })
        }
      },
      // 转让
      make_over_dialog(e) {
        this.make_over["account"] = e["account_id"]
        this.make_over["id"] = e["id"]
        this.make_over_dialogVisible = true
      },
      async make_over_submit() {
        this.make_over_loading = true
        let formData = new FormData()
        formData.append("user",this.uid)
        formData.append("new_user",this.make_over["new_user"])
        formData.append("id",this.make_over["id"])
        await this.$http.post('/index.php/index/account/transferAccount/',formData).then((res)=> {
          this.make_over_loading = false
          if (res.data["code"] === 200) {
            this.$message.success(`${res.data["data"]}`)
            this.make_over_dialogVisible = false
            this.fetchPageData(this.currentPage)
          } else {
            this.$message.error(`${res.data["data"]}`)
          }
        })
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
      exportExcel() {
        var tHeader = ['账号','密码','cookie','UA','账号类型','广告账户名称','广告账号ID','登陆IP地区','信用卡号','账户限额','分配时间','备注']
        var filterVal = ['account_id','pass','cookie','ua','account_type','account_name','ad_id','login_ip','card_id','account_limit','allot_time','remark']
        var time = this.getCurentTime()
        var filename = `${time}`
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
        await this.$http.post("/index.php/index/account/myList/",formData).then((res) => {
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
          formData.append("user",this.uid)
          await this.$http.post("/index.php/index/account/myList/",formData).then((res) => {
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
        await this.$http.post("/index.php/index/account/myList/",formData).then((res) => {
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
      // -----------------------------------------------------------
      // 退回
      account_back_dialog(e) {
        this.account_back["account"] = e["account_id"]
        this.account_back["id"] = e["id"]
        this.account_back_dialogVisible = true
      },
      async account_back_submit() {
        this.account_back_loading = true
        let formData = new FormData()
        formData.append("user",this.uid)
        formData.append("apply_reason",this.account_back["reason"])
        formData.append("id",this.account_back["id"])
        await this.$http.post('/index.php/index/account/backAccount/',formData).then((res)=> {
          this.account_back_loading = false
          if (res.data["code"] === 200) {
            this.$store.commit("send",'backAccount:admin');
            this.$message.success(`${res.data["data"]}`)
            this.account_back_dialogVisible = false
            this.fetchPageData(this.currentPage)
          } else {
            this.$message.error(`${res.data["data"]}`)
          }
        })
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
              this.new_form_submit()
            } else if(formName === 'make_over') {
              this.make_over_submit()
            } else if (formName === 'remark_form') {
              this.remark_submit()
            } else {
              this.account_back_submit()
            }
          } else {
            return false;
          }
        });
      },
      async edit_form_submit() {
        this.edit_form["zh_name"] = this.zh_name
        let formData = new FormData()
        formData.append('data',JSON.stringify(this.edit_form))
        await this.$http.post('/index.php/index/account/saveAccount/',formData).then((res) => {
          if (res.data["code"] === 200) {
            this.fetchPageData(this.currentPage)
            this.edit_form_dialogVisible = false
            this.$message.success(`${res.data["data"]}`)
          } else {
            this.$message.onError(`${res.data["data"]}`)
          }
        })
      },
      async new_form_submit() {
        this.get_account_loading = true
        let formData = new FormData()
        if (this.new_form["uid"] != null && this.new_form["uid"] != '') {
          formData.append('user',this.new_form["uid"])
        } else {
          formData.append('user',this.uid)
        }
        formData.append('type',this.new_form["type"])
        formData.append('limit',this.new_form["limit"])
        formData.append('come_batch',this.new_form["batch"])
        formData.append('num',this.new_form["num"])
        formData.append('group_type',crypto.cryptoDecrypt_string(localStorage.getItem("main_group")))
        this.$http.post('/index.php/index/account/applySave/',formData).then((res) => {
          if (res.data["code"] === 500) {
            this.$message.warning(`${res.data["data"]}`)
          } else {
            this.$message.success(`${res.data["data"]}`)
            this.new_form_dialogVisible = false
          }
          this.get_account_loading = false
          this.getAccount()
          this.fetch()
        })
      },
      closeDialog_new() {
        this.$nextTick(() => {
          this.$refs['new_form'].clearValidate()
        })
        for (const k in this.new_form) {
          this.new_form[k] = ''
        }
        this.new_form['num'] = null
        this.new_form_btn = false
        this.showOwnLimit = ''
      },
      closeDialog_make_over() {
        this.$nextTick(() => {
          this.$refs['make_over'].clearValidate()
        })
        this.make_over['new_user'] = null
      },
      closeDialog_account_back() {
        this.$nextTick(() => {
          this.$refs['account_back'].clearValidate()
        })
        this.account_back['reason'] = null
      },
      closeDialog_remark_form() {
        this.$nextTick(() => {
          this.$refs['remark_form'].clearValidate()
        })
        this.remark_form['remark'] = null
      },
      //--------------------------------------------------------------
      // 详情
      tableOpen(e) {
        this.detail_uploaddate = utils.getLocalTime(parseInt(e["create_time"]));
        this.detail_updatedate = utils.getLocalTime(parseInt(e["update_time"]));
        this.detail_cookie = e.cookie
        this.detail_ua = e.ua
        this.detail_account = e.account_id
        this.detail_password = e.pass
        this.detail_accountbm = e.bank
        this.detail_accountname = e.account_name,
        this.detail_adid = e.ad_id,
        this.detail_cardNumber = e.card_id,
        this.detail_rechargeCardNumber = e.pay_id,
        this.detail_ComeDate = e.come_date,
        this.detail_ip = e.login_ip,
        this.detail_Logging = e.showLog
        this.detail_apply_reason =e.apply_reason
        this.detail_refuse_reason = e.refuse_reason
        this.table = true
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
            if (e!='确认回收') {
              this.chooseStatus.push({"label":e,"value":e})
            }
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
            });
            this.tableHeight = utils.setClientHight(this,255,56,50)
            this.loading = false
          })
        }
        this.handleUpdateClick()
      },
      async remove(e) {//停用
        this.$confirm(`是否停用账号 ${e["account_id"]}`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(async () => {
          this.loading = true
          let formData = new FormData()
          formData.append("user",this.uid)
          formData.append("id",e["id"])
          await this.$http.post("/index.php/index/account/stopAccount/",formData).then((res) => {
            if (res.data["code"] === 200) {
              e["state"] = '不可用'
              this.$message.success(`${res.data["data"]}`)
            } else {
              this.$message.error(`${res.data["data"]}`)
            }
            this.loading = false
          })
        }).catch((err)=> {
          // /
        })
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
    .disabled_btn {
    color: #C0C4CC!important
  }
</style>
