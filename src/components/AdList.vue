<template>
  <div style="margin-top:40px">
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;min-width:1400px;margin-top:80px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap" :disabled="loading">
        <el-form-item class="noselect" style="margin-right: 30px">
          <div style="color:#606266;margin-right:12px;text-align:left;margin-bottom:5px;">创建时间</div>
          <el-date-picker :picker-options="pickerOptions" value-format="timestamp" style="width:250px" v-model="searchParams.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item  v-if="this.authority['searchsubject']" class="noselect" style="margin-right:30px">
          <div style="text-align: left; margin-bottom: 5px">项目</div>
          <el-select v-model="searchParams.project" placeholder="筛选" clearable style="width:150px">
            <el-option v-for="item in options.options_project" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  v-if="this.authority['searchgroup']" class="noselect" style="margin-right:30px">
          <div style="text-align: left; margin-bottom: 5px">分组</div>
          <el-select v-model="searchParams.group" placeholder="筛选" clearable style="width: 150px">
            <el-option v-for="item in options.options_group" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  v-if="this.authority['searchuser']" class="noselect" style="margin-right:30px">
          <div style="text-align: left; margin-bottom: 5px">用户</div>
          <el-select v-model="searchParams.user" placeholder="筛选" clearable filterable style="width: 150px">
            <el-option v-for="item in options.options_user" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="noselect" style="margin-right: 30px">
          <div style="text-align: left; margin-bottom: 5px">国家/地区</div>
          <el-select v-model="searchParams.country" placeholder="筛选" clearable style="width: 150px">
            <el-option v-for="(item,key,index) in options.options_country" :key="index" :label="options.options_country[key]" :value="key">
              <span style="float: left">{{ options.options_country[key] }}</span>
              <span style="float: right;color: #8492a6; font-size: 13px">{{ key }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="noselect" style="margin-top: 32px; margin-bottom: 5px">
          <el-input v-model="searchParams.str" placeholder="搜索 域名, 广告名" clearable style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item class="noselect">
          <el-button icon="el-icon-search" @click="search" plain style="height: 30px; position: relative; margin-top: 32px">搜索</el-button>
        </el-form-item>
        <el-form-item class="noselect" style="position: relative; top: 27px; left: 15px">
          <div style="display: flex">
            <div style="width:1px;height:40px;background-color:rgba(187, 187, 187, 0.5);bottom:-4px;left:85px;margin-right:18px;"></div>
            <div style="display:flex;align-content:space-between;flex-wrap:wrap;position:relative;top:-8px;width: 63px; ">
              <el-button type="text" @click="new_form_dialog" style="font-size: 12px; left: 5px; position: relative">创建广告</el-button>
              <el-button type="text" @click="multiple_del" class="delbtn" style="font-size: 12px; left: -5px; position: relative;" :disabled="multipleSelectionFlag_delete">批量删除</el-button>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table :header-row-style="{height:'60px!important'}" highlight-current-row :height="tableHeight" :key="key" stripe v-loading="loading" element-loading-background="rgba(255,255,255,0.5)" ref="multipleTable" :data="ShowTableData" tooltip-effect="dark" style="line-height:30px;margin:20px 0px;min-width:1370px" border @selection-change="handleSelectionChange_delete">
      <el-table-column fixed="left" type="selection" width="55"></el-table-column>
      <el-table-column fixed="left" prop="" label="详情" width="50px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-arrow-right" size="small" @click="tableOpen(scope.row)" style="padding-left: 9px;color:#909399"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="ad_title" label="广告名"></el-table-column>
      <el-table-column prop="cloak_type" label="平台" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row['cloak_type'] === 'tt'">TikTok</div>
          <div v-if="scope.row['cloak_type'] === 'fb'">FaceBook</div>
          <div v-if="scope.row['cloak_type'] === 'gg'">GooGle</div>
        </template>
      </el-table-column>
      <el-table-column prop="ad_title" label="域名" min-width="170px">
        <template slot-scope="scope">
          <div style="text-decoration:underline;cursor: pointer;" @click="linkDomain(scope.row['qualified_domain_name'])">{{scope.row["qualified_domain_name"]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="客服" min-width="170px">
        <template slot-scope="scope">
          <el-popover
          :visible-arrow="false"
                placement="right"
                width="320"
                trigger="click"
              >
                <ul class="tips-content">
                  <li style="margin-left:10px;list-style-type:none;"> WeChat：
                    <div v-if="scope.row['wechat'] != null" style="display:inline;text-decoration:underline;cursor: pointer;" v-clipboard:copy="scope.row['wechat']" v-clipboard:success="onCopy" v-clipboard:error="onError">{{scope.row["wechat"]}}</div>
                    <div v-if="scope.row['wechat'] === null || scope.row['wechat'] === ''" style="display:inline;">/</div>
                  </li>
                  <li style="margin-left:10px;list-style-type:none;"> Line：
                    <div v-if="scope.row['line'] != null" style="display:inline;text-decoration:underline;cursor: pointer;" v-clipboard:copy="scope.row['line']" v-clipboard:success="onCopy" v-clipboard:error="onError">{{scope.row["line"]}}</div>
                    <div v-if="scope.row['line'] === null || scope.row['line'] === ''" style="display:inline;">/</div>
                  </li>
                  <li style="margin-left:10px;list-style-type:none;"> Line-Link：
                    <div style="display:inline;text-decoration:underline;cursor: pointer;" v-clipboard:copy="scope.row['line_link']" v-clipboard:success="onCopy" v-clipboard:error="onError">{{scope.row["line_link"]}}</div>
                  </li>
                </ul>
                <span slot="reference">
                  <a style="color:#606266;text-decoration:underline;cursor: pointer;" class="address">{{scope.row["customer_service"]}}</a>
                </span>
              </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="project" v-if="this.authority['listsubject']" label="项目" width="50px"> </el-table-column>
      <el-table-column prop="landing_page" label="落地页" min-width="150px"> </el-table-column>
      <el-table-column prop="safe_page" label="屏蔽页" min-width="100px"> </el-table-column>
      <el-table-column prop="country_zh" label="国家/地区" min-width="150px"></el-table-column>
      <el-table-column prop="" label="访问/点击" style="position:relative" width="180px">
        <template slot="header">
          <el-tooltip :visible-arrow="false" class="item" effect="dark" content="提交计数及操作列的数据导出只有在使用表单类型落地页才生效" placement="top">
            <el-button
                type="text" icon="el-icon-info"
                size="small"
                style="color:#909399;font-size:15px;display:inline-block;padding:0px!important;position:relative;top:1px"
            ></el-button>
          </el-tooltip>
          <div style="display: inline-block;width:70px">访问/点击/屏蔽/提交</div>
          <!-- <el-button-group> -->
            <el-button v-if="this.ShowTableData.length > 1" @click="allRefresh" style="padding:0;position:absolute;right:10px;top:0px;bottom:0px" type="text" class="el-icon-refresh-right"></el-button>
          <!-- </el-button-group> -->
        </template>
        <template slot-scope="scope">
          <div style="display: inline-block">{{ scope.row.click_visit }}</div>
          <el-button style="position:absolute;right: 10px;top:0px;bottom:0px" @click="singleRefresh(scope.$index, scope.row.click_id,scope.row)" type="text" class="el-icon-refresh-right"></el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="this.authority['listgroup']"  prop="group" label="分组" width="180px"></el-table-column>
      <el-table-column prop="create_time_change" label="创建时间" width="110px">
      </el-table-column>
      <el-table-column v-if="this.authority['listuser']"  prop="user" label="用户" width="80px"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="160px">
        <template slot="header">
          操作
          <!-- <el-button-group> -->
          <el-tooltip  effect="dark" content="批量修复" placement="left">
            <el-button v-if="this.ShowTableData.length > 1" @click="refreshLandingPage_all()" style="padding:0;position:absolute;left:45px;top:0px;bottom:0px;color:grey" type="text" class="el-icon-refresh"></el-button>
          </el-tooltip>
          <!-- </el-button-group> -->
        </template>
        <template slot-scope="scope">
          <el-tooltip content="广告已开启屏蔽" placement="left" :visible-arrow="false">
            <p id="lock" v-if="scope.row.cloak === '1'" class="el-icon-lock" style="margin-right:10px;color:red;display:inline-block;font-size:15px" type="text"></p>
          </el-tooltip>
          <el-tooltip content="修复站点" placement="left" :visible-arrow="false">
            <el-button @click="refreshLandingPage(scope.row)" style="font-size:13px;color:grey" type="text" class="el-icon-refresh"></el-button>
          </el-tooltip>
          <el-button @click="setTop(scope.row,$event)" style="margin-right:10px;font-size:13px" type="text" :class="showTop(scope.row)"></el-button>
          <el-dropdown placement="bottom" trigger="click">
            <span style="cursor: pointer;" class="el-dropdown-link">
              <i style="color: grey!important" class="el-icon-more"></i>
            </span>
            <el-dropdown-menu :visible-arrow="false" class="noselect" slot="dropdown">
              <el-dropdown-item @click.native="edit_dialog(scope.row)">编辑广告</el-dropdown-item>
              <el-dropdown-item @click.native="changeCloak(scope.row)">开关屏蔽</el-dropdown-item>
              <el-dropdown-item :disabled="scope.row['landing_page'].indexOf('表单') === -1" @click.native="dataExoprt(scope.row)">数据导出</el-dropdown-item>
              <el-dropdown-item @click.native="clearClickVisit(scope.row)">重置访问点击</el-dropdown-item>
              <el-dropdown-item id="delAd" @click.native="remove(scope.row)">删除广告</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="remark" label="备注">
      </el-table-column> -->
    </el-table>

    <!-- 分页 -->
    <div class="block" style="position: relative; right: 0px; margin-bottom: 25px" v-if="!loading">
      <el-pagination
        :page-size="20"
        background
        @current-change="fetchPageData"
        :current-page.sync="currentPage"
        layout="total,prev, pager, next"
        :total="totalNum"
        :disabled="loading">
      </el-pagination>
    </div>

    <!-- 创建广告表单 -->
    <el-dialog :close-on-click-modal="false" title="创建广告" :visible.sync="new_form_dialogVisible" width="450px" @close='closeDialog_new'>
      <el-form :rules="rules" ref="new_form" :model="new_form" label-width="110px" label-position="right" v-loading="new_form_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="广告名" class="noselect" style="margin-right: 40px" prop="ad_title">
              <el-input placeholder="可输入任意广告名" v-model="new_form.ad_title" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="国家/地区" class="noselect" style="margin-right: 40px" prop="country">
              <el-select multiple v-model="new_form.country" filterable placeholder="筛选">
                <el-option v-for="(item,key,index) in chooseCountry_dialog" :key="index" :label="chooseCountry_dialog[key]" :value="key">
                    <span style="float: left">{{ chooseCountry_dialog[key] }}</span>
                    <span style="float: right;margin-right:20px; color: #8492a6; font-size: 13px">{{ key }}</span>
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择落地页" class="noselect" style="margin-right: 40px" prop="landingPage">
              <el-select v-model="new_form.landingPage" filterable placeholder="筛选" clearable>
                <el-option v-for="item in chooseLandingPage_dialog" :key="item['id']" :label="item['content']['text']" :value="item['id']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="投放平台" class="noselect" style="margin-right: 40px" prop="cloak_type">
              <el-select v-model="new_form.cloak_type" filterable placeholder="筛选" clearable>
                <el-option v-for="item in [{'label':'FaceBook','value':'fb'},{'label':'TikTok','value':'tt'},{'label':'GooGle','value':'gg'}]" :key="item['value']" :label="item['label']" :value="item['value']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="屏蔽方式" class="noselect" style="margin-right: 40px" prop="safe_type">
              <el-select @change="safe_page_type_chooseChange_new" v-model="new_form.safe_type" filterable placeholder="筛选" clearable>
                <el-option v-for="item in [{'label':'系统屏蔽页','value':1},{'label':'URL跳转','value':2},{'label':'URL拷贝','value':3},]" :key="item['value']" :label="item['label']" :value="item['value']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="new_form.safe_type === 1">
          <el-col :span="24">
            <el-form-item label="选择屏蔽页" class="noselect" style="margin-right: 40px" prop="safePage">
              <el-select v-model="new_form.safePage" filterable placeholder="筛选" clearable>
                <el-option v-for="item in chooseSafepage_dialog" :key="item['id']" :label="item['content']['text']" :value="item['id']">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="new_form.safe_type === 2">
          <el-col :span="24">
            <el-form-item label="URL跳转" class="noselect" style="margin-right: 40px;position:relative" prop="safePage">
              <el-input placeholder="例:https://www.baidu.com" v-model="new_form.safePage" clearable></el-input>
              <el-tooltip :visible-arrow="false" :enterable="false" class="item" effect="dark" content="此方式会跳转至其他域名" placement="top">
                <el-button
                    type="text" icon="el-icon-info"
                    size="small"
                    style="color:#909399;font-size:15px;padding-top:0px;position:absolute;top:11px;left:-100px;"
                ></el-button>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="new_form.safe_type === 3">
          <el-col :span="24">
            <el-form-item label="URL拷贝" class="noselect" style="margin-right: 40px;position:relative" prop="safePage">
              <el-input placeholder="例:https://www.baidu.com" v-model="new_form.safePage" clearable></el-input>
              <el-tooltip :visible-arrow="false" :enterable="false" class="item" effect="dark" content="建议目标网站协议为http" placement="top">
                <el-button
                    type="text" icon="el-icon-info"
                    size="small"
                    style="color:#909399;font-size:15px;padding-top:0px;position:absolute;top:11px;left:-100px;"
                ></el-button>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择域名" class="noselect" style="margin-right:40px" prop="show_domain">
              <el-select v-model="new_form.show_domain" filterable placeholder="筛选" clearable>
                <el-option v-for="item in chooseDomain_dialog" :key="item['id']" :label="item['full_name']" :value="item['id']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="this.showChooseServer_new">
          <el-col :span="24">
            <el-form-item label="选择客服" class="noselect" style="margin-right: 40px" prop="services">
              <el-select v-model="new_form.services" filterable placeholder="筛选" clearable>
                <el-option v-for="item in chooseServices_dialog" :key="item['unique_id']" :label="item['customer_service']" :value="item['unique_id']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="像素代码" class="noselect" style="margin-right: 40px">
              <el-select @change="getPlatforms"  multiple v-model="choosePlatform" filterable placeholder="筛选">
                <el-option v-for="(item,index) in choosePxCode_dialog" :key="index" :label="item['label']" :value="item['value']">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="fbpxcode_input_dialogVisible">
          <el-col :span="24">
            <el-form-item label="FaceBook" class="noselect" style="margin-right: 40px" prop="pxcode.fbpxcode">
              <el-input placeholder="输入FaceBook像素代码" v-model="new_form.pxcode.fbpxcode" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ttpxcode_input_dialogVisible">
          <el-col :span="24">
            <el-form-item label="TikTok" class="noselect" style="margin-right: 40px" prop="pxcode.ttpxcode">
              <el-input placeholder="输入TikTok像素代码" v-model="new_form.pxcode.ttpxcode" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ggpxcode_input_dialogVisible">
          <el-col :span="24">
            <el-form-item label="GooGle" class="noselect" style="margin-right: 40px" prop="pxcode.ggpxcode">
              <el-input placeholder="输入GooGle像素代码" v-model="new_form.pxcode.ggpxcode" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ggpxcode_sp_input_dialogVisible">
          <el-col :span="24">
            <el-form-item label="GooGle_购物" class="noselect" style="margin-right: 40px" prop="pxcode.ggpxcode_sp">
              <el-input placeholder="输入GooGle_购物像素代码" v-model="new_form.pxcode.ggpxcode_sp" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="备注" class="noselect" style="margin-right: 40px">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="new_form.remark">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-button size="small" type="primary" @click="submitForm('new_form')" class="formSubmitBtn" style="margin-right: -270px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 编辑广告表单 -->
    <el-dialog :close-on-click-modal="false" title="编辑广告" :visible.sync="edit_form_dialogVisible" width="450px" @close='closeDialog_edit'>
      <el-form :rules="rules" ref="edit_form" :model="edit_form" label-width="110px" label-position="right" v-loading="edit_form_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="广告名" class="noselect" style="margin-right: 40px" prop="ad_title">
              <el-input placeholder="可输入任意广告名" v-model="edit_form.ad_title" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="国家/地区" class="noselect" style="margin-right: 40px" prop="country">
              <el-select multiple v-model="edit_form.country" filterable placeholder="筛选">
                <el-option v-for="(item,key,index) in chooseCountry_dialog" :key="index" :label="chooseCountry_dialog[key]" :value="key">
                  <span style="float: left">{{ chooseCountry_dialog[key] }}</span>
                  <span style="float: right;margin-right:20px; color: #8492a6; font-size: 13px">{{ key }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择落地页" class="noselect" style="margin-right: 40px" prop="landingPage">
              <el-select v-model="edit_form.landingPage" filterable placeholder="筛选" clearable>
                <el-option v-for="item in chooseLandingPage_dialog" :key="item['id']" :label="item['content']['text']" :value="item['id']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="投放平台" class="noselect" style="margin-right: 40px" prop="cloak_type">
              <el-select v-model="edit_form.cloak_type" filterable placeholder="筛选" clearable>
                <el-option v-for="item in [{'label':'FaceBook','value':'fb'},{'label':'TikTok','value':'tt'},{'label':'GooGle','value':'gg'}]" :key="item['value']" :label="item['label']" :value="item['value']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="屏蔽方式" class="noselect" style="margin-right: 40px" prop="safe_type">
              <el-select @change="safe_page_type_chooseChange_edit" v-model="edit_form.safe_type" filterable placeholder="筛选" clearable>
                <el-option v-for="item in [{'label':'系统屏蔽页','value':1},{'label':'URL跳转','value':2},{'label':'URL拷贝','value':3},]" :key="item['value']" :label="item['label']" :value="item['value']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="edit_form.safe_type === 1">
          <el-col :span="24">
            <el-form-item label="选择屏蔽页" class="noselect" style="margin-right: 40px" prop="safePage">
              <el-select v-model="edit_form.safePage" filterable placeholder="筛选" clearable>
                <el-option v-for="item in chooseSafepage_dialog" :key="item['id']" :label="item['content']['text']" :value="item['id']">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="edit_form.safe_type === 2">
          <el-col :span="24">
            <el-form-item label="URL跳转" class="noselect" style="margin-right: 40px;position:relative" prop="safePage">
              <el-input placeholder="例:https://www.baidu.com" v-model="edit_form.safePage" clearable></el-input>
              <el-tooltip :visible-arrow="false" :enterable="false" class="item" effect="dark" content="此方式会跳转至其他域名" placement="top">
                <el-button
                  type="text" icon="el-icon-info"
                  size="small"
                  style="color:#909399;font-size:15px;padding-top:0px;position:absolute;top:11px;left:-100px;"
                ></el-button>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="edit_form.safe_type === 3">
          <el-col :span="24">
            <el-form-item label="URL拷贝" class="noselect" style="margin-right: 40px;position:relative" prop="safePage">
              <el-input placeholder="例:https://www.baidu.com" v-model="edit_form.safePage" clearable></el-input>
              <el-tooltip :visible-arrow="false" :enterable="false" class="item" effect="dark" content="建议目标网站协议为http" placement="top">
                <el-button
                    type="text" icon="el-icon-info"
                    size="small"
                    style="color:#909399;font-size:15px;padding-top:0px;position:absolute;top:11px;left:-100px;"
                ></el-button>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择域名" class="noselect" style="margin-right:40px" prop="domain">
              <el-select v-model="edit_form.qualified_domain_name" filterable placeholder="筛选" clearable disabled>
                <el-option v-for="item in chooseDomain_dialog" :key="item['id']" :label="item['full_name']" :value="item['id']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="选择客服" class="noselect" style="margin-right: 40px">
              <el-select v-model="edit_form.services" filterable placeholder="筛选" clearable>
                <el-option v-for="item in chooseServices_dialog" :key="item['unique_id']" :label="item['customer_service']" :value="item['unique_id']"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="像素代码" class="noselect" style="margin-right: 40px">
              <el-select @change="getPlatforms_edit"  multiple v-model="choosePlatform_edit" filterable placeholder="筛选">
                <el-option v-for="(item,index) in choosePxCode_dialog" :key="index" :label="item['label']" :value="item['value']">
                  </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="fbpxcode_edit_input_dialogVisible">
          <el-col :span="24">
            <el-form-item label="FaceBook" class="noselect" style="margin-right: 40px" prop="pxcode.fbpxcode">
              <el-input placeholder="输入FaceBook像素代码" v-model="edit_form.pxcode.fbpxcode" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ttpxcode_edit_input_dialogVisible">
          <el-col :span="24">
            <el-form-item label="TikTok" class="noselect" style="margin-right: 40px" prop="pxcode.ttpxcode">
              <el-input placeholder="输入TikTok像素代码" v-model="edit_form.pxcode.ttpxcode" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ggpxcode_edit_input_dialogVisible">
          <el-col :span="24">
            <el-form-item label="GooGle" class="noselect" style="margin-right: 40px" prop="pxcode.ggpxcode">
              <el-input placeholder="输入GooGle像素代码" v-model="edit_form.pxcode.ggpxcode" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="ggpxcode_sp_edit_input_dialogVisible">
          <el-col :span="24">
            <el-form-item label="GooGle_购物" class="noselect" style="margin-right: 40px" prop="pxcode.ggpxcode_sp">
              <el-input placeholder="输入GooGle_购物像素代码" v-model="edit_form.pxcode.ggpxcode_sp" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="备注" class="noselect" style="margin-right: 40px">
              <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="edit_form.remark">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-button size="small" type="primary" @click="submitForm('edit_form')" class="formSubmitBtn" style="margin-right: -270px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 详情抽屉 -->
    <el-drawer  title="详情" :visible.sync="table" direction="rtl" size="600px">
      <el-form ref="makeOver_form" label-width="100px" label-position="left" style="padding-left: 70px">
        <el-form-item size="small" label="微信：" v-clipboard:copy="this.detai_value.detail_wechat" v-clipboard:success="onCopy" v-clipboard:error="onError">
          <p style="text-align:left;text-decoration:underline">{{this.detai_value.detail_wechat}}</p>
        </el-form-item>
        <el-form-item size="small" label="Line：" v-clipboard:copy="this.detai_value.detail_line" v-clipboard:success="onCopy" v-clipboard:error="onError">
          <p style="text-align:left;text-decoration:underline">{{this.detai_value.detail_line}}</p>
        </el-form-item>
        <el-form-item size="small" label="Line-Link：" style="cursor: pointer;">
          <p style="text-align:left;text-decoration:underline" v-clipboard:copy="this.detai_value.detail_line_link" v-clipboard:success="onCopy" v-clipboard:error="onError">{{this.detai_value.detail_line_link}}</p>
        </el-form-item>
        <el-form-item size="small" label="总访问">
          <p style="text-align:left;">{{this.detai_value.detail_sum_visit}}</p>
        </el-form-item>
        <el-form-item size="small" label="总点击：">
          <p style="text-align:left;">{{this.detai_value.detail_sum_click}}</p>
        </el-form-item>
        <el-form-item size="small" label="屏蔽次数：">
          <p style="text-align:left;">{{this.detai_value.detail_sum_safe}}</p>
        </el-form-item>
        <el-form-item size="small" label="落地页：">
          <p style="text-align:left;">{{this.detai_value.detail_landing_page}}</p>
        </el-form-item>
        <el-form-item size="small" label="屏蔽页：">
          <p style="text-align:left;">{{this.detai_value.detail_safe_page}}</p>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 批量修复 -->
    <el-dialog :show-close="this.showRes != 0" title="批量修复" :visible.sync="landingPageAllRefresh_dialogVisible" width="400px" :close-on-click-modal="false">
      <div v-if="this.showRes === 1" style="width: 100%;height: 30px;line-height: 30px;background-color: #dff0d8;border-radius: 3px;color: #20A53A;margin-bottom:10px;position:relative;top:-20px;">全部项目执行成功</div>
      <div v-if="this.showRes === 0" style="width: 100%;height: 30px;line-height: 30px;background-color: #F1F1F1;border-radius: 3px;color: #909399;margin-bottom:10px;position:relative;top:-20px;">执行中</div>
      <div v-if="this.showRes === 2" style="width: 100%;height: 30px;line-height: 30px;background-color: #fdf6ec;border-radius: 3px;color: #E6A23C;margin-bottom:10px;position:relative;top:-20px;">存在执行失败项目</div>
      <el-table :max-height="300" :key="refreshKey" :data="landingPageAllRefresh_showTableData" style="position: relative;top:-20px;">
        <el-table-column property="full_domain" label="域名"></el-table-column>
        <el-table-column label="执行状态">
          <template slot-scope="scope">
            <p v-if="scope.row.refreshStatus == 0" class="el-icon-loading" style="color:grey;" type="text"></p>
            <p v-if="scope.row.refreshStatus == 1" class="el-icon-circle-check" style="color:#67C23A;" type="text"></p>
            <p v-if="scope.row.refreshStatus == 2" class="el-icon-circle-close" style="color:rgb(245, 108, 108);" type="text"></p>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { export_json_to_excel } from '../Export2Excel.js'
import utils from '../utils'
import crypto from '../crypto.js'
var reg2 = new RegExp(/^[a-zA-Z0-9]{1,21}$/)
var reg3 = new RegExp(/^[a-zA-Z0-9]{1,20}$/)
var reg4 = new RegExp(/^[a-zA-Z0-9]{1,11}$/)
var reg5 = new RegExp(/^[a-zA-Z0-9/]{1,32}$/)
var reg6 = new RegExp(/^[a-z0-9:./]{1,50}$/)
var validatePass2 = (rule, value, callback) => {
  if (value === '' || value === null) {
    callback(new Error('必填'))
  } else if (value != '' && value != null) {
    reg2.test(value) ? callback() : callback(new Error('请检查输入的内容格式'))
  }
};
var validatePass3 = (rule, value, callback) => {
  if (value === '' || value === null) {
    callback(new Error('必填'))
  } else if (value != '' && value != null) {
    reg3.test(value) ? callback() : callback(new Error('请检查输入的内容格式'))
  }
};
var validatePass4 = (rule, value, callback) => {
  if (value === '' || value === null) {
    callback(new Error('必填'))
  } else if (value != '' && value != null) {
    reg4.test(value) ? callback() : callback(new Error('请检查输入的内容格式'))
  }
};
var validatePass5 = (rule, value, callback) => {
  if (value === '' || value === null) {
    callback(new Error('必填'))
  } else if (value != '' && value != null) {
    reg5.test(value) ? callback() : callback(new Error('请检查输入的内容格式'))
  }
};
var validatePass6 = (rule, value, callback) => {
  if (value === '' || value === null) {
      callback(new Error('不可为空'))
  } else if (value != '' && value != null) {
    reg6.test(value) ? callback() : callback(new Error('请检查输入的内容格式'))
  }
};
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() >= new Date().getTime();
        }
      },
      menuAuthrity: {
        "searchsubject":false,
        "searchgroup":false,
        "searchuser":false,
        "listsubject":false,
        "listgroup":false,
        "listuser":false
      },
      rules: {
        landingPage: [
          { required: true, message: '落地页必选', trigger: 'change' }
        ],
        country: [
          { required: true, message: '国家/地区必选', trigger: 'change' }
        ],
        safePage: [
          { validator: validatePass6, required: true,trigger: 'change' }
        ],
        safe_type:[
          { required: true, message: '屏蔽方式必选', trigger: 'change' }
        ],
        domain: [
          { required: true, message: '域名必选', trigger: 'change' }
        ],
        show_domain:[
          { required: true, message: '域名必选', trigger: 'change' }
        ],
        services: [
          { required: true, message: '客服必选', trigger: 'change' }
        ],
        "pxcode.fbpxcode": [
          { validator: validatePass2, required: true,trigger: 'change' }
        ],
        "pxcode.ttpxcode": [
          { validator: validatePass3, required: true,trigger: 'change' }
        ],
        "pxcode.ggpxcode": [
          { validator: validatePass4, required: true,trigger: 'change' }
        ],
        "pxcode.ggpxcode_sp": [
          { validator: validatePass5, required: true,trigger: 'change'  }
        ],
        cloak_type: [
          { required: true, message: '投放平台必选', trigger: 'change' }
        ],
        ip: [
          { required: true, message: '服务器必选', trigger: 'change' }
        ],
        ad_title: [
          { required: true, message: '广告名必填', trigger: 'blur' }
        ]
      },
      uid:null,
      // 回流key
      key: 0,
      //编辑广告表单
      edit_form_dialogVisible: false,
      edit_form_loading:false,
      standBy_e:null,
      edit_form: {
        ad_title:null,
        landingPage:null,
        safe_type:null,
        safePage:null,
        domain:null,
        services:null,
        cloak_type:null,
        pxcode: {
          fbpxcode:'',
          ttpxcode:'',
          ggpxcode:'',
          ggpxcode_sp:''
        },
        remark:null,
        country:[],
        id:null,
        top:null
      },
      choosePlatform_edit:[],
      //新建广告表单
      new_form_dialogVisible: false,
      new_form_loading:false,
      new_form: {
        ad_title:null,
        landingPage:null,
        safe_type:1,
        safePage:null,
        domain:null,
        services:null,
        cloak_type:null,
        pxcode: {
          fbpxcode:'',
          ttpxcode:'',
          ggpxcode:'',
          ggpxcode_sp:''
        },
        remark:null,
        country:[],
        top:null,
        show_domain:null
      },
      choosePlatform:null,
      // 批量删除
      multipleSelectionFlag_delete: true, //删除按钮出现与否
      multipleSelection_delete: [], //选中项
      // 加载界面显示与否
      loading: true,
      // 过滤后数据
      ShowTableData: [],
      // 原始数据
      tableData: [],
      //表单选项
      chooseSafepage_dialog: [],
      choosepxcode_dialog:[],
      chooseLandingPage_dialog:[],
      chooseServices_dialog:[],
      chooseDomain_dialog:[],
      chooseIp_dialog:[],
      chooseCountry_dialog:[],
      choosePxCode_dialog:[{label:'FaceBook',value:'fbpxcode'},{label:'TikTok',value:'ttpxcode'},{label:'GooGle',value:'ggpxcode'},{label:'GooGle_购物',value:'ggpxcode_sp'}],
      //搜索记录
      searchParams: {
        date:null,
        project:null,
        user:null,
        group:null,
        country:null,
        str:null
      },
      // 详情抽屉
      detai_value: {
        detail_wechat:null,// 微信
        detail_line:null,// line
        detail_line_link:null,// line链接
        detail_sum_click:null,// 总点击
        detail_sum_visit:null,// 总访问
        detail_landing_page:null,//落地页
        detail_check_page:null,//审核页
      },
      table: false,//抽屉
      // 按钮权限
      // 选项
      options: {
        options_project: [],
        options_group: [],
        options_user: [],
        options_country: [],
      },
      // 分页
      totalNum: 10,
      currentPage: 1,
      useSearchData: false,
      //选择平台
      standBy_platform:null,
      ttpxcode_input_dialogVisible:false,
      ggpxcode_input_dialogVisible:false,
      ggpxcode_sp_input_dialogVisible:false,
      fbpxcode_input_dialogVisible:false,
      ttpxcode_edit_input_dialogVisible:false,
      ggpxcode_edit_input_dialogVisible:false,
      ggpxcode_sp_edit_input_dialogVisible:false,
      fbpxcode_edit_input_dialogVisible:false,
      check_platform:['ttpxcode','ggpxcode','fbpxcode','ggpxcode_sp'],
      tableHeight:620,
      // authority
      authority:{},
      // 更新全部广告
      landingPageAllRefresh_dialogVisible:false,
      landingPageAllRefresh_showTableData:[],
      showRes:0,
      refreshKey:0,
      showChooseServer_new:true
    };
  },

  created() {
    this.getUid()
    this.fetch();
    this.fetchOptions();
    this.fetchTotal();
  },

  methods: {
    async dataExoprt(e) {
      let formData = new FormData()
      formData.append('domain',e["qualified_domain_name"])
      await this.$http.post('/index.php/index/ad/exportForm',formData).then((res) => {
        if (res.data["data"].length != 0) {
          var arrA = []
          var arrQ = []
          res.data["data"].forEach(e=> {
            e["content"] = JSON.parse(e["content"])
            e["link"] = e["content"]["link"]
            e["ways"] = e["content"]["ways"]
            e["date"] = this.timestampToTime(e["date"])
            e["content"]["dataA"] = JSON.parse(e["content"]["dataA"])
            e["content"]["dataQ"] = JSON.parse(e["content"]["dataQ"])
            e["content"]["dataA"].forEach((i,index)=> {
              e[`A${index+1}`] = i
              arrA.push(`A${index+1}`)
            })
            for (const key in e["content"]["dataQ"]) {
              e[key] = e["content"]["dataQ"][key]
              arrQ.push(`${key}`)
            }
          })
          var arr = res.data["data"]
          var tHeader = ["域名","提交日期","联系途径","联系方式"]
          var filterVal = ['domain','date','ways','link']
          arrQ.forEach((e,index)=> {
            tHeader.push(e)
            tHeader.push(arrA[index])
            filterVal.push(e)
            filterVal.push(arrA[index])
          })
          var filename = `${arr[0]["domain"]}用户提交数据`
          var data = this.formatJson(filterVal, arr)
          export_json_to_excel({
            header: tHeader,
            data,
            filename
          })
          } else {
          this.$message.warning('无数据')
          }
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
    timestampToTime(timestamp) {
      var date = new Date(timestamp * 1000);
      var Y = date.getFullYear() + '-';
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      var D = date.getDate() + ' ';
      var h = date.getHours() + ':';
      var m = date.getMinutes() + ':';
      var s = date.getSeconds();
      return Y + M + D + h + m + s;
    },
    refreshLandingPage_all() {// 批量修复
      var resArr = []
      this.showRes = 0
      this.landingPageAllRefresh_showTableData = this.ShowTableData
      this.landingPageAllRefresh_showTableData.forEach(e => {
        this.$set(e, 'refreshStatus', 0)
      })
      this.landingPageAllRefresh_dialogVisible = true
      this.landingPageAllRefresh_showTableData.forEach(async e=> {
        if (e["cloak_type"] != null && e["cloak_type"] != undefined && e["cloak_type"] != '') {
          var obj = {}
          if (e.safe_type) {
            obj.safe_type = e.safe_type
          } else {
            obj.safe_type = 1
          }
          obj.ad_title = e.ad_title
          obj.landingPage = e.landing_page_id
          obj.safePage = e.safe_page_id
          obj.domain = e.domain
          obj.services = e.services_id
          obj.cloak_type = e.cloak_type
          obj.pxcode = e.px_code
          obj.remark = e.remark
          if (e.country instanceof Array) {
            obj.country = e.country
          } else {
            obj.country = e.country.split(',')
          }
          obj.id = e.id
          obj.top = e.top
          obj.user = this.uid
          var data = JSON.stringify(obj)
          let formData = new FormData();
          formData.append("data", data);
          try {
            await this.$http.post("/index.php/index/ad/editAd/",formData).then((res) => {
              if (res.data["code"] === 200) {
                resArr.push(1)
                e["cloak"] = "1"
                // e["refreshStatus"] = 1
                this.$set(e, 'refreshStatus', 1)
              } else {
                resArr.push(2)
                // e["refreshStatus"] = 2
                this.$set(e, 'refreshStatus', 2)
              }
            })
          } catch (error) {
            resArr.push(2)
            this.$set(e, 'refreshStatus', 2)
            // e["refreshStatus"] = 2
          }
        } else {
          resArr.push(2)
          this.$set(e, 'refreshStatus', 2)
        }
        if (resArr.length === this.ShowTableData.length) {
          if (resArr.indexOf(2) != -1) {
            this.showRes = 2
          } else {
            this.showRes = 1
          }
        }
        // this.handleUpdateClick_refresh()
      })
    },
    handleUpdateClick_refresh() {// 回流
      this.refreshKey += 1 
    },
    // 屏蔽方式
    safe_page_type_chooseChange_edit(e) {
      this.edit_form["safePage"] = null
    },
    safe_page_type_chooseChange_new(e) {
      this.new_form["safePage"] = null
    },
    // 像素代码
    getPlatforms(e) {
      this.check_platform.forEach(i=> {
        if (e.indexOf(i) === -1) {
          this.new_form.pxcode[i] = ''
          this[`${i}_input_dialogVisible`] = false
        } else {
          this[`${i}_input_dialogVisible`] = true
        }
      })
    },
    getPlatforms_edit(e) {
      this.check_platform.forEach(i=> {
        if (e.indexOf(i) === -1) {
          this.edit_form.pxcode[i] = ''
          this[`${i}_edit_input_dialogVisible`] = false
        } else {
          this[`${i}_edit_input_dialogVisible`] = true
        }
      })
    },
    linkDomain(e) {// 域名跳转
      window.open(`https://${e}`);
    },
    new_form_dialog() {
      this.new_form_dialogVisible = true
      this.new_form_loading = true
      this.getOptions().then(()=> {
        this.new_form_loading = false
      })
    },
    checkAuthority() {// 权限验证
      var authority = crypto.cryptoDecrypt_string(localStorage.getItem('authority'))
      //console.log('子组件页面权限',authority);
      if (authority.indexOf('pageA') === -1 ) {
        //console.log('侧边栏没有该页面，但通过地址栏进入，且没有该页面的权限');
        this.$router.push('/404')
      }
    },
    async clearClickVisit(e) {// 重置访问点击
      this.loading = true
      let formData = new FormData()
      formData.append("click_id",e.click_id)
      await this.$http.post('/index.php/index/ad/clickClear',formData).then((res) => {
        this.useSearchData = false
        this.fetchPageData(this.currentPage)
      })
    },
    async changeCloak(e) { // 开关屏蔽
      this.loading = true
      var cloak_value
      if (e.cloak === '0') {
        cloak_value = 1
      } else {
        cloak_value = 0
      }
      let formData = new FormData()
      formData.append("id",e.id)
      formData.append("cloak",cloak_value)
      await this.$http.post('/index.php/index/ad/cloak',formData).then((res) => {
        if (res.data["code"] === 200) {
          this.loading = false
          if (e.cloak === '0') {
            e.cloak = '1'
          } else {
            e.cloak = '0'
          }
          this.$message.success(`${res.data["data"]}`)
        } else {
          this.$message.error(`${res.data["data"]}`)
        }
      })
    },
    closeDialog_new() {// 关闭dialog时清空验证
      this.$nextTick(() => {
          this.$refs['new_form'].clearValidate()
      })
    },
    closeDialog_edit() {// 关闭dialog时清空验证
      this.$nextTick(() => {
          this.$refs['edit_form'].clearValidate()
      })
    },
    async getOptions() { //获取选项
      let formData = new FormData()
      formData.append("user",this.uid)
      if (this.edit_form_dialogVisible === true) {
        formData.append("msg",'edit')
      } else {
        formData.append("msg",'add')
      }
      try {
        await this.$http.post('/index.php/index/ad/addCreation/',formData).then((res) => {
          if (res.data["code"] && res.data["code"] === '500') {
            this.$message.warning('请在申请域名并添加二级域名后创建广告')
            this.new_form_dialogVisible = false
          } else {
            res.data["safePage"].forEach(e=> {
            e["content"] = JSON.parse(e["content"])
            })
            res.data["landingPage"].forEach(e=> {
              e["content"] = JSON.parse(e["content"])
            })
            var group_all = crypto.cryptoDecrypt_string(localStorage.getItem('group_all'))
            if (group_all.indexOf('丰胸组') != -1) {
              res.data["landingPage"] = res.data["landingPage"].filter(e=>{
                return e["project"] === 'fx' || e["project"] === 'bf' || e["project"] === 'qb'
              })
              res.data["services"] = res.data["services"].filter(e=>{
                return e["project"] === 'fx' || e["project"] === 'bf' || e["project"] === 'qb'
              })
            } else if (group_all.indexOf('减肥组') != -1) {
              if (localStorage.getItem("role_name") === '组长') {
                res.data["landingPage"] = res.data["landingPage"].filter(e=>{
                  return e["project"] === 'jf' || e["project"] === 'zy'
                })
                res.data["services"] = res.data["services"].filter(e=>{
                  return e["project"] === 'jf' || e["project"] === 'zy'
                })
              } else {
                res.data["landingPage"] = res.data["landingPage"].filter(e=>{
                  return e["project"] === 'jf'
                })
                res.data["services"] = res.data["services"].filter(e=>{
                  return e["project"] === 'jf'
                })
              }
            } else if (group_all.indexOf('白发组') != -1) {
              res.data["landingPage"] = res.data["landingPage"].filter(e=>{
                return e["project"] === 'bf'
              })
              res.data["services"] = res.data["services"].filter(e=>{
                return e["project"] === 'bf'
              })
            } else if (group_all.indexOf('丰胸痔疮组') != -1) {
              if (localStorage.getItem("role_name") === '组长') {
                res.data["landingPage"] = res.data["landingPage"].filter(e=>{
                  return e["project"] === 'fx' || e["project"] === 'bf' || e["project"] === 'qb'|| e["project"] === 'zc' || e["project"] === 'zy'
                })
                res.data["services"] = res.data["services"].filter(e=>{
                  return e["project"] === 'fx' || e["project"] === 'bf' || e["project"] === 'qb'|| e["project"] === 'zc' || e["project"] === 'zy'
                })
              } else {
                res.data["landingPage"] = res.data["landingPage"].filter(e=>{
                  return e["project"] === 'fx' || e["project"] === 'zc'
                })
                res.data["services"] = res.data["services"].filter(e=>{
                  return e["project"] === 'fx' || e["project"] === 'zc'
                })
              }
            }
            this.chooseSafepage_dialog = res.data["safePage"]
            this.chooseLandingPage_dialog = res.data["landingPage"]
            this.chooseServices_dialog = res.data["services"]
            res.data["domain"].forEach(e=> {
              e["full_name"] = `${e["top"]}.${e["zone_name"]}`
            })
            this.chooseDomain_dialog = res.data["domain"]
            this.chooseCountry_dialog = res.data["country"]
          }
        })
      } catch (error) {
        this.$message.error('请求失败')
        this.new_form_loading = false
        this.new_form_dialogVisible = false
        this.edit_form_loading = false
        this.edit_form_dialogVisible = false
      }
    },
    getUid() { // 获取用户uid
      this.uid = localStorage.getItem("uid")
      crypto.cryptoDecrypt_string(localStorage.getItem('authority')).split(',').forEach(e=> {
        this.authority[e] = true
      })
    },
    handleUpdateClick() {// 回流
      this.key += 1 
    },
    showTop(e) {// 置顶按钮颜色
      return [
        'iconfont icon-zhiding',{'iftop':e["rank"] !== '0'},{'iftop_not':e["rank"] === '0'}
      ]
    },
    async setTop(e,event) {// 设置置顶
      let formData = new FormData();
      formData.append("id", e.id);
      await this.$http.post("/index.php/index/ad/addRank/",formData).then((res) => {
        if (res.data["rank"] === 0) {
          let obj1 = {}
          this.ShowTableData.forEach((item)=> {
            if (`${item["id"]}` === res.data["id"]) {
              item["rank"] = `${res.data["rank"]}`
            }
          })
          this.ShowTableData.forEach((item,index)=> {
            if(`${item["id"]}` === res.data["id"]){
              obj1 = item;
              this.ShowTableData.splice(index,1)
              return;
            }
          })
          this.ShowTableData.push(obj1);
          event.target.style.cssText = "color:grey;margin-right:10px;font-weight:bolder;"
          this.handleUpdateClick()
        } else {
          let obj = {}
          this.ShowTableData.forEach((item)=> {
            if (`${item["id"]}` === res.data["id"]) {
              item["rank"] = `${res.data["rank"]}`
            }
          })
          this.ShowTableData.forEach((item,index)=> {
            if(`${item["id"]}` === res.data["id"]){
              obj = item;
              this.ShowTableData.splice(index,1)
              return;
            }
          })
          this.ShowTableData.unshift(obj);
          event.target.style.cssText = "color:#409EFF;margin-right:10px;font-weight:bolder;"
          this.handleUpdateClick()
        }
      })
    },
    async allRefresh() {// 全部刷新
      if (this.ShowTableData.length === 0) {
        //
      } else {
        this.loading = true;
        var data = []
        let formData = new FormData();
        this.ShowTableData.forEach(e=> {
          data.push(e["click_id"])
        })
        formData.append("data", data);
        await this.$http.post("/index.php/index/ad/updateClickAll/",formData).then((res) => {
          this.ShowTableData.forEach(e=> {
            var check = e["click_id"]
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i]["click_id"] === check) {
                if (e["landing_page"].indexOf('表单') != -1) {
                  e["click_visit"] = res.data[i]["now_visit"] + " / " + res.data[i]["now_click"] + " / " + res.data[i]["safe_visit"] + " / " + res.data[i]["form_info"];
                } else {
                  e["click_visit"] = res.data[i]["now_visit"] + " / " + res.data[i]["now_click"] + " / " + res.data[i]["safe_visit"] + " / -"
                }
                e["sum_click"] = Number(e["sum_click"]) + (Number(res.data[i]["now_click"]) - Number(e["now_click"]))
                e["sum_visit"] = Number(e["sum_visit"]) + (Number(res.data[i]["now_visit"]) - Number(e["now_visit"]))
                e["sum_safe_visit"] = Number(e["sum_safe_visit"]) + (Number(res.data[i]["safe_visit"]) - Number(e["safe_visit"]))
                e["now_click"] = res.data[i]["now_click"]
                e["now_visit"] = res.data[i]["now_visit"]
                e["safe_visit"] = res.data[i]["safe_visit"]
                e["form_info"] = res.data[i]["form_info"]
              }
            }
          })
          this.loading = false
        });
      }
    },
    async singleRefresh(index, e,row) {// 单独刷新
      this.loading = true;
      let formData = new FormData();
      formData.append("click_id", e);
      await this.$http.post("/index.php/index/ad/updateClick/",formData).then((res) => {
        if (row["landing_page"].indexOf('表单') != -1) {
          this.ShowTableData[index]["click_visit"] = res.data["now_visit"] + " / " + res.data["now_click"] + " / " + res.data["safe_visit"] + " / " + res.data["form_info"];
        } else {
          this.ShowTableData[index]["click_visit"] = res.data["now_visit"] + " / " + res.data["now_click"] + " / " + res.data["safe_visit"] + " / -" 
        }
        row["sum_click"] = Number(row["sum_click"]) + (Number(res.data["now_click"]) - Number(row["now_click"]))
        row["sum_visit"] = Number(row["sum_visit"]) + (Number(res.data["now_visit"]) - Number(row["now_visit"]))
        row["sum_safe_visit"] = Number(row["sum_safe_visit"]) + (Number(res.data["safe_visit"]) - Number(row["safe_visit"]))
        row["now_click"] = res.data["now_click"]
        row["now_visit"] = res.data["now_visit"]
        row["safe_visit"] = res.data["safe_visit"]
        row["form_info"] = res.data["form_info"]
        this.loading = false
      });
    },
    async fetchPageData(val) {// 点击页码
      this.loading = true;
      if (this.useSearchData === false) {
        let formData = new FormData();
        formData.append("page", val);
        formData.append("user",this.uid)
        await this.$http.post("/index.php/index/ad/adPage/",formData)
          .then((res) => {
            res.data.forEach((e) => {
              e["create_time_change"] = utils.getTimeData(
                parseInt(e["create_time"])
              );
              e["px_code"] = JSON.parse(e["px_code"])
              if (e["landing_page"].indexOf('表单') != -1) {
                e["click_visit"] = e["now_visit"] + " / " + e["now_click"] + " / " + e["safe_visit"] + " / " + e["form_info"];
              } else {
                e["click_visit"] = e["now_visit"] + " / " + e["now_click"] + " / " + e["safe_visit"] + " / -"
              }
              e["qualified_domain_name"] = e["top"] + "." + e["domain"];
              if (typeof e["country_zh"] === 'string') {
                //
              } else {
                e["country_zh"] = e["country_zh"].join()
              }
            });
            this.ShowTableData = [];
            this.tableData = res.data;
            this.tableData.forEach((e) => {
              if (this.tableData.indexOf(e) <= 19) {
                this.ShowTableData.push(e);
              }
            });
            this.loading = false;
            this.handleUpdateClick()
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
          this.handleUpdateClick()
        }
      this.tableHeight = utils.setClientHight(this,280,61,60)
    },
    async search() {// 搜索
    var a = utils.getTimeData(1636387200)
      this.loading = true;
      this.useSearchData = true;
      this.currentPage = 1;
      let formData = new FormData();
      var submitSearchParams = {};
      for (const key in this.searchParams) {
        submitSearchParams[key] = this.searchParams[key]
      }
      for (let key in submitSearchParams) {
        if (submitSearchParams[key] === null ||submitSearchParams[key] === "") {
          submitSearchParams[key] = false;
        }
      }
      if (submitSearchParams["date"] === false &&submitSearchParams["project"] === false &&submitSearchParams["user"] === false &&submitSearchParams["group"] === false &&submitSearchParams["country"] === false &&submitSearchParams["str"] === false) {
        this.loading = false;
        this.useSearchData = false;
        this.fetch();
        this.fetchTotal();
      } else {
        if (submitSearchParams["user"] === false) {
          submitSearchParams["user"] = this.uid
        }
        if (submitSearchParams["date"] != false) {
          submitSearchParams["date"][0] = submitSearchParams["date"][0]/1000
          submitSearchParams["date"][1] = submitSearchParams["date"][1]/1000
        }
        for (let key in submitSearchParams) {
          formData.append(`${key}`, submitSearchParams[key]);
        }
        await this.$http.post("/index.php/index/ad/search",formData)
          .then((res) => {
            if (res.data != null) {
              res.data.forEach((e) => {
                e["create_time_change"] = utils.getTimeData(parseInt(e["create_time"]));
                e["px_code"] = JSON.parse(e["px_code"])
                if (e["landing_page"].indexOf('表单') != -1) {
                  e["click_visit"] = e["now_visit"] + " / " + e["now_click"] + " / " + e["safe_visit"] + " / " + e["form_info"];
                } else {
                  e["click_visit"] = e["now_visit"] + " / " + e["now_click"] + " / " + e["safe_visit"] + " / -"
                }
                e["qualified_domain_name"] = e["top"] + "." + e["domain"];
                if (typeof e["country_zh"] === 'string') {//
                } else {
                  e["country_zh"] = e["country_zh"].join()
                }
              });
              this.ShowTableData = [];
              this.tableData = res.data;
              this.tableData.forEach((e) => {
                if (this.tableData.indexOf(e) <= 19) {
                  this.ShowTableData.push(e);
                }
              });
              this.totalNum = res.data.length;
            } else {
              this.ShowTableData = [];
              this.tableData = res.data;
              this.totalNum = 0
            }
            this.loading = false;
          });
      }
      this.tableHeight = utils.setClientHight(this,280,61,60)
    },
    edit_dialog(e) {// 编辑表单
      this.choosePlatform_edit = []
      for (const key in e.px_code) {
          this[`${key}_edit_input_dialogVisible`] = false
      }
      this.edit_form_dialogVisible = true;
      this.edit_form_loading = true
      this.getOptions().then(()=> {
        this.edit_form_loading = false
      })
      if (e.safe_type) {
        this.edit_form.safe_type = e.safe_type
      } else {
        e.safe_type = 1
        this.edit_form.safe_type = 1
      }
      
      this.edit_form.ad_title = e.ad_title
      this.edit_form.landingPage = Number(`${e.landing_page_id}`)
      if (e.safe_page_id != '2' && e.safe_page_id != '3') {
        this.edit_form["safe_type"] = 1
        this.edit_form.safePage = Number(`${e.safe_page_id}`)
      } else {
          this.edit_form["safe_type"] = Number(e.safe_page_id)
          this.edit_form.safePage = e.safe_page
      }
      this.edit_form.qualified_domain_name = e.qualified_domain_name
      this.edit_form.domain = e.domain
      this.edit_form.top = e.top
      this.edit_form.ip = e.ip
      this.edit_form.cloak_type = e.cloak_type
      this.edit_form.remark = e.remark
      if (typeof e.country != 'object') {
        this.edit_form.country = e.country.split(',')
      } else {
        this.edit_form.country = e.country
      }
      for (const key in e.px_code) {
        this.edit_form.pxcode[`${key}`] = e.px_code[`${key}`]
        if (e.px_code[`${key}`]  === '' || e.px_code[`${key}`]  === null) {
          //
        } else {
          this.choosePlatform_edit.push(`${key}`)
          this[`${key}_edit_input_dialogVisible`] = true
        }
      }
      this.edit_form.id = e.id
      this.edit_form.services = Number(`${e.services_id}`)
      this.standBy_e = e
    },
    submitForm(formName) {// 表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'new_form') {
            this.new_form_sumbitForm_check()
          } else {
            this.edit_form_sumbitForm_check()
          }
        } else {
          return false;
        }
      });
    },
    new_form_sumbitForm_check() { //创建广告表单校验
      var landingPage_name
      var service_name
      this.chooseLandingPage_dialog.find((obj) => {
        if (obj['id'] === this.new_form.landingPage) {
          landingPage_name = obj['content']['text']
        }
      })
      this.chooseServices_dialog.find((obj) => {
        if (obj['unique_id'] === this.new_form.services) {
          service_name = obj['customer_service']
        }
      })
      if (landingPage_name.indexOf("双") != -1 || landingPage_name.indexOf("lv") != -1) {
        if (service_name.indexOf("双") === -1) {
          this.$message.error('提交前请确保落地页类型与客服类型对应')
        } else {
          this.new_form_sumbitForm()
        }
      } else if (landingPage_name.indexOf("赖") != -1 || landingPage_name.indexOf("line") != -1) {
        if (service_name.indexOf("赖") === -1) {
          this.$message.error('提交前请确保落地页类型与客服类型对应')
        } else {
          this.new_form_sumbitForm()
        }
      } else if (landingPage_name.indexOf("微") != -1){
        if (service_name.indexOf("微") === -1) {
          this.$message.error('提交前请确保落地页类型与客服类型对应')
        } else {
          this.new_form_sumbitForm()
        }
      }
    },
    async new_form_sumbitForm() {// 创建广告表单提交
      this.new_form_loading = true
      this.chooseDomain_dialog.forEach(e=> {
        if (e["id"] === this.new_form["show_domain"]) {
          this.new_form["top"] = e["top"]
          this.new_form["domain"] = e["zone_name"]
        }
      })
      this.new_form["user"] = this.uid
      var data = JSON.stringify(this.new_form)
      let formData = new FormData();
      formData.append("data", data);
      await this.$http.post("/index.php/index/ad/saveCreation/",formData).then((res) => {
        if (res.data["code"] === 200) {
          this.new_form_dialogVisible = false
          this.$message.success(`${res.data["data"]}`)
          this.useSearchData = false
          this.fetchPageData(1);
          this.fetchTotal();
          this.$refs['new_form'].resetFields()
        } else {
          this.$message.error('创建失败')
        }
          this.new_form_loading = false
      })
    },
    edit_form_sumbitForm_check() { //编辑广告表单校验
      var landingPage_name
      var service_name
      this.chooseLandingPage_dialog.find((obj) => {
        if (obj['id'] === this.edit_form.landingPage) {
          landingPage_name = obj['content']['text']
        }
      })
      this.chooseServices_dialog.find((obj) => {
        if (obj['unique_id'] === this.edit_form.services) {
          service_name = obj['customer_service']
        }
      })
      if (landingPage_name.indexOf("双") != -1 || landingPage_name.indexOf("lv") != -1) {
        if (service_name.indexOf("双") === -1) {
          this.$message.error('提交前请确保落地页类型与客服类型对应')
        } else {
          this.edit_form_sumbitForm()
        }
      } else if (landingPage_name.indexOf("赖") != -1 || landingPage_name.indexOf("line") != -1) {
        if (service_name.indexOf("赖") === -1) {
          this.$message.error('提交前请确保落地页类型与客服类型对应')
        } else {
          this.edit_form_sumbitForm()
        }
      } else if (landingPage_name.indexOf("微") != -1){
        if (service_name.indexOf("微") === -1) {
          this.$message.error('提交前请确保落地页类型与客服类型对应')
        } else {
          this.edit_form_sumbitForm()
        }
      }
    },
    async edit_form_sumbitForm() {// 编辑广告表单提交
      this.edit_form_loading = true
      this.edit_form["user"] = this.uid
      var data = JSON.stringify(this.edit_form)
      let formData = new FormData();
      formData.append("data", data);
      await this.$http.post("/index.php/index/ad/editAd/",formData).then((res) => {
        if (res.data["code"] === 200) {
          this.edit_form_dialogVisible = false
          this.$message.success(`${res.data["data"]}`)
          for (const key in this.edit_form) {
            this.standBy_e[key] = this.edit_form[key]
          }
          this.standBy_e["px_code"] = this.edit_form["pxcode"]
          this.chooseLandingPage_dialog.forEach(e=> {
            if(e["id"] === Number(this.edit_form["landingPage"])) {
              this.standBy_e["landing_page"] = e["content"]["text"]
              this.standBy_e.landing_page_id = `${e["id"]}`
            }
          })
          if (this.edit_form["safe_type"] === 1) {
            this.chooseSafepage_dialog.forEach(e=> {
              if(e["id"] === Number(this.edit_form["safePage"])) {
                this.standBy_e["safe_page"] = e["content"]["text"]
                this.standBy_e.safe_page_id = `${e["id"]}`
              }
            }) 
          } else {
            this.standBy_e["safe_page"] = this.edit_form["safePage"]
            this.standBy_e["safe_page_id"] = `${this.edit_form["safe_type"]}`
          }
          this.chooseServices_dialog.forEach(e=> {
            if(e["unique_id"] === this.edit_form["services"]) {
              this.standBy_e["project"] = e["project"]
              this.standBy_e["wechat"] = e["wechat"]
              this.standBy_e["line"] = e["line"]
              this.standBy_e["line_link"] = e["line_link"]
              this.standBy_e["services_id"] = `${e["unique_id"]}`
              this.standBy_e["customer_service"] = `${e["customer_service"]}`
            }
          })
          var arr1 = []
          this.edit_form["country"].forEach(e=> {
            arr1.push(this.chooseCountry_dialog[e])
          })
          this.standBy_e["country_zh"] = arr1.join()
          this.standBy_e["cloak"] = "1"
        } else {
          this.$message.error('修改失败')
        }
        this.edit_form_loading = false
      })
    },
    async refreshLandingPage(e) {
      if (e["cloak_type"] != null && e["cloak_type"] != undefined && e["cloak_type"] != '') {
      var obj = {}
      if (e.safe_type) {
        obj.safe_type = e.safe_type
      } else {
        obj.safe_type = 1
      }
        obj.ad_title = e.ad_title
        obj.landingPage = e.landing_page_id
        obj.safePage = e.safe_page_id
        obj.domain = e.domain
        obj.services = e.services_id
        obj.cloak_type = e.cloak_type
        obj.pxcode = e.px_code
        obj.remark = e.remark
        if (e.country instanceof Array) {
          obj.country = e.country
        } else {
          obj.country = e.country.split(',')
        }
        obj.id = e.id
        obj.top = e.top
        obj.user = this.uid
        var data = JSON.stringify(obj)
        let formData = new FormData();
        formData.append("data", data);
        this.loading = true
        try {
          await this.$http.post("/index.php/index/ad/editAd/",formData).then((res) => {
            this.loading = false
            if (res.data["code"] === 200) {
              e["cloak"] = "1"
              this.$message.success('更新成功')
            } else {
              this.$message.error('更新失败')
            }
          })
        } catch (error) {
          this.loading = false
          this.$message.error(`${error}`)
        }
      } else {
        this.$message.warning('操作失败，投放平台为空')
      }
    },
    onCopy() {// 复制成功
      this.$message.success('复制成功')
    },
    onError() {// 复制失败
      this.$message.error('复制失败')
    },
    handleSelectionChange_delete(val) {// 批量(待添加async await)
      this.multipleSelection_delete = []
      if (val.length != 0) {
        val.forEach(e=> {
          this.multipleSelection_delete.push(e["id"])
        })
      }
      this.multipleSelectionFlag_delete = false;
      if (this.multipleSelection_delete.length == 0) {
        // 如不进行判断则勾选完毕后批量删除按钮还是会在
        this.multipleSelectionFlag_delete = true;
      }
    },
    async multiple_del() {// 多项删除
      this.$confirm(`是否删除选中的项目`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
          var data = JSON.stringify(this.multipleSelection_delete)
          let formData = new FormData();
          formData.append("data", data);
          formData.append("user",this.uid)
          await this.$http.post('/index.php/index/ad/batchDelete/', formData).then((res) => {
            if (res.data["data"].length === 0) {
              this.$message.success('批量删除成功')
            } else {
              var log = ''
              for (const key in res.data["data"]) {
                log = log + `${key}` + ' '
              }
              this.$message.error(`以下项目删除失败: ${log}`)
            }
            var a = Math.ceil((this.totalNum - this.multipleSelection_delete.length)/20)
            if (this.currentPage <= a) {
              this.fetchPageData(this.currentPage)
              this.fetchTotal();
            } else {
              this.currentPage = this.currentPage - 1
              this.fetchPageData(this.currentPage)
              this.fetchTotal();
            }
          })
        })
    },
    tableOpen(e) {// 权限详情
      this.detai_value = {}
      this.detai_value.detail_wechat = e.wechat
      this.detai_value.detail_line = e.line
      this.detai_value.detail_line_link = e.line_link
      this.detai_value.detail_sum_click = e.sum_click
      this.detai_value.detail_sum_visit = e.sum_visit
      this.detai_value.detail_sum_safe = e.sum_safe_visit
      this.detai_value.detail_landing_page = e.landing_page
      this.detai_value.detail_safe_page = e.safe_page
      this.table = true;
    },
    async fetch() {// 数据获取
      this.loading = true
      let formData = new FormData()
      formData.append("user",this.uid)
      try {
        await this.$http.post("/index.php/index/ad/adlist",formData).then((res) => {
        if (res.data === null) {
          res.data = []
        }
        res.data.forEach((e) => {
          e["create_time_change"] = utils.getTimeData(
            parseInt(e["create_time"])
          );
          if (e["landing_page"].indexOf('表单') != -1) {
            e["click_visit"] = e["now_visit"] + " / " + e["now_click"] + " / " + e["safe_visit"] + " / " + e["form_info"];
          } else {
            e["click_visit"] = e["now_visit"] + " / " + e["now_click"] + " / " + e["safe_visit"] + " / -"
          }
          e["px_code"] = JSON.parse(e["px_code"])
          e["qualified_domain_name"] = e["top"] + "." + e["domain"]; //一二级域名合并
          if (typeof e["country_zh"] === 'string') {
            //
          } else {
            e["country_zh"] = e["country_zh"].join()
          }
        });
        this.tableData = res.data;
        this.ShowTableData = this.tableData;
        if (this.ShowTableData.length != 0) {
          this.tableHeight = utils.setClientHight(this,280,61,60)
        } else {
          this.tableHeight = utils.setClientHight(this,280,61,60) + 16
        }
        this.loading = false;
      });
      } catch (error) {
        this.$message.error('请求出错')
        this.tableHeight = utils.setClientHight(this,280,61,60) + 16
        this.loading = false
      }
      
    },
    async fetchTotal() {// 获取条目总数
      let formData = new FormData()
      formData.append("user",this.uid)
      await this.$http.post("/index.php/index/ad/adsum/",formData).then((res) => {
        this.totalNum = res.data;
      });
    },
    async fetchOptions() {// 选项获取
      let formData = new FormData()
      formData.append("user",this.uid)
      await this.$http.post("/index.php/index/ad/category/",formData).then((res) => {
        this.options.options_project =[]
        this.options.options_group = []
        this.options.options_user = []
        this.options.options_country = []
        res.data[0].forEach((e) => {
          this.options.options_project.push(e["project"]);
        });
        res.data[1].forEach((e) => {
          this.options.options_group.push(e["group"]);
        });
        res.data[2].forEach((e) => {
          this.options.options_user.push(e["user"]);
        });
        this.options.options_country = res.data[3]
      });
    },
    async remove(e) {// 移除单项
      this.$confirm(`是否删除 ${e.ad_title}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(async () => {
        this.loading = true
        let formData = new FormData()
        formData.append("user",this.uid)
        formData.append("id",e.id)
        await this.$http.post("/index.php/index/ad/adDelete/",formData).then((res) => {
          if (res.data["code"] === 200) {
            var a = Math.ceil((this.totalNum - 1)/20)
            if (this.currentPage <= a) {
              this.fetchPageData(this.currentPage)
              this.fetchTotal();
            } else {
              this.currentPage = this.currentPage - 1
              this.fetchPageData(this.currentPage)
              this.fetchTotal();
            }
              this.$message.success(`${res.data["data"]}`)
          } else {
            this.$message.error(`${res.data["data"]}`)
          }
        })
      }).catch((err)=> {
        //
      })
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
      _this.tableHeight = utils.setClientHight(_this,280,61,60)
    }
  },
};
</script>

<style scoped>
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
  #delAd:hover {
    color: rgb(245, 108, 108);
    background-color: rgb(254, 240, 240);
  }
  .el-button.is-disabled {
    color: #C0C4CC!important;
  }
  .delbtn {
    color:rgb(245, 108, 108)!important
  }
  .el-button.is-disabled.el-button--text {
    color: #C0C4CC!important;;
  }
  #lock {
    position: absolute;
    left: 20px;
    top: 21px;
  }
  /* .el-table {
    border: 1px solid #EBEEF5!important;
  } */
</style>
