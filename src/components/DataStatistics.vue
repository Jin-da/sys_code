<template>
  <div >
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;min-width:1345px;;margin-top:80px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap;" :disabled="loading">
        <el-form-item label="日期" class="noselect" style="margin-right: 30px">
          <el-date-picker :picker-options="pickerOptions" value-format="timestamp" style="width:300px" v-model="searchParams.date" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item  label="渠道" class="noselect" style="margin-right:30px">
          <el-select v-model="searchParams.channel" placeholder="筛选" clearable style="width:120px">
            <el-option v-for="(item,index) in chooseChannel" :key="index" :label="item['label']" :value="item['value']"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目" class="noselect" style="margin-right:30px">
          <el-select v-model="searchParams.project" placeholder="筛选" clearable style="width:120px">
            <el-option v-for="(item,index) in chooseProject" :key="index" :label="item['label']" :value="item['value']"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="推广" class="noselect" style="margin-right: 30px;">
            <el-select clearable v-model="searchParams.name" placeholder="筛选" filterable style="width:120px">
                <el-option v-for="(item,index) in userList" :key="index" :label="item['label']" :value="item['value']"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item class="noselect">
          <el-button icon="el-icon-search" @click="research(1)" plain style="height: 30px; position: relative;">搜索</el-button>
        </el-form-item>
        <el-form-item class="noselect">
          <el-button icon="el-icon-data-analysis" class="info_btn" @click="collect_dialogVisible = true" type="info" style="height: 30px; position: relative;">加粉汇总</el-button>
          <el-button v-if="this.authority['dataedit']" icon="el-icon-upload2" class="info_btn" @click="import_form_dialogVisible = true" type="info" style="height: 30px; position: relative;">Excel 导入</el-button>
          <el-button :disabled="this.standBy_search === null?true:false" icon="el-icon-download" class="info_btn" @click="exportExcel()" type="info" style="height: 30px; position: relative;">导出 Excel</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table
      highlight-current-row
      :max-height="tableHeight"
      :key="key"
      stripe
      v-loading="loading"
      element-loading-background="rgba(255,255,255,0.5)"
      ref="multipleTable"
      :data="ShowTableData"
      tooltip-effect="dark"
      style="width:calc(100%-60px);line-height:30px;margin:10px 0 25px 0;min-width:1345px;"
      border>
      <el-table-column fixed="left" prop="channel" label="渠道" min-width="100px">
      </el-table-column>
      <el-table-column fixed="left" prop="project" label="项目" min-width="100px">
      </el-table-column>
      <el-table-column fixed="left" prop="date" label="日期" min-width="100px">
      </el-table-column>
      <el-table-column fixed="left" prop="name" label="姓名" min-width="100px">
      </el-table-column>
      <el-table-column v-for="(item,index) in tableHead" :key="index" :label="item">
        <template slot-scope="scope">
            <span v-if="scope.row.area[index] != undefined && scope.row.area[index]['num'] != 0 && scope.row.area[index]['num'] != '0'">{{scope.row.area[index]["num"]}}</span>
            <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="wechat" label="微信粉量" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row['wechat'] != 0 && scope.row['wechat'] != '0' && scope.row['wechat'] != null && scope.row['wechat'] != undefined">{{scope.row['wechat']}}</div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column prop="line" label="赖粉量" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row['line'] != 0 && scope.row['line'] != '0' && scope.row['line'] != null && scope.row['line'] != undefined">{{scope.row['line']}}</div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column prop="am" label="上午加粉" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row['am'] != 0 && scope.row['am'] != '0' && scope.row['am'] != null && scope.row['am'] != undefined">{{scope.row['am']}}</div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column prop="pm" label="下午加粉" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row['pm'] != 0 && scope.row['pm'] != '0' && scope.row['pm'] != null && scope.row['pm'] != undefined">{{scope.row['pm']}}</div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column prop="jf_sum" label="加粉总数" width="100px">
      </el-table-column>
      <el-table-column prop="card_sum" width="120px">
        <template slot="header">
          <div style="display:inline">申请总账户</div>
          <el-tooltip :visible-arrow="false" class="item" effect="dark" content="信用卡" placement="top">
            <el-button
                type="text" icon="el-icon-info"
                size="small"
                style="color:#909399;font-size:15px;display:inline-block;padding:0px!important"
            ></el-button>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <div v-if="scope.row['card_sum'] != 0 && scope.row['card_sum'] != '0' && scope.row['card_sum'] != null && scope.row['card_sum'] != undefined">{{scope.row['card_sum']}}</div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column prop="dimission_date">
      <template slot="header">
          <div style="display:inline">转化率</div>
          <el-tooltip :visible-arrow="false" class="item" effect="dark" content="加粉总数 / 申请总账户数" placement="top">
            <el-button
                type="text" icon="el-icon-info"
                size="small"
                style="color:#909399;font-size:15px;display:inline-block;padding:0px!important"
            ></el-button>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <div>{{Number(scope.row["jf_sum"])/Number(scope.row["card_sum"])}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="apply_domain_sum" label="申请域名总数" width="110px">
        <template slot-scope="scope">
          <div v-if="scope.row['apply_domain_sum'] != 0 && scope.row['apply_domain_sum'] != '0' && scope.row['apply_domain_sum'] != null && scope.row['apply_domain_sum'] != undefined">{{scope.row['apply_domain_sum']}}</div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column prop="del_domain_sum" label="已废弃域名" width="110px">
        <template slot-scope="scope">
          <div v-if="scope.row['del_domain_sum'] != 0 && scope.row['del_domain_sum'] != '0' && scope.row['del_domain_sum'] != null && scope.row['del_domain_sum'] != undefined">{{scope.row['del_domain_sum']}}</div>
          <div v-else></div>
        </template>
      </el-table-column>
      <el-table-column prop="dimission" width="100px">
        <template slot="header">
          <div style="display:inline">转化率</div>
          <el-tooltip :visible-arrow="false" class="item" effect="dark" content="加粉总数 / 域名申请总数" placement="top">
            <el-button
                type="text" icon="el-icon-info"
                size="small"
                style="color:#909399;font-size:15px;display:inline-block;padding:0px!important"
            ></el-button>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <div>{{Number(scope.row["jf_sum"])/Number(scope.row["apply_domain_sum"])}}</div>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="this.authority['dataedit']" fixed="right" label="操作" align="center" min-width="130px">
        <template slot-scope="scope">
          <el-dropdown placement="bottom" trigger="click">
            <span style="cursor: pointer;" class="el-dropdown-link">
              <i style="color: grey!important" class="el-icon-more"></i>
            </span>
            <el-dropdown-menu :visible-arrow="false" class="noselect" slot="dropdown">
              <el-dropdown-item @click.native="edit_log(scope.row)">编辑记录</el-dropdown-item>
              <el-dropdown-item id="delAd" @click.native="remove(scope.row)">删除记录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
      <el-table-column v-if="this.authority['dataedit']" fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-tooltip content="编辑记录" placement="top" :visible-arrow="false">
            <el-button  @click="edit_log(scope.row)" icon="el-icon-edit" style="font-size:13px;color:grey;padding:0;margin-right:10px" type="text"></el-button>
          </el-tooltip>
          <el-tooltip content="删除记录" placement="top" :visible-arrow="false">
            <el-button  @click="remove(scope.row)" icon="el-icon-delete" style="font-size:13px;color:red;padding:0;border:none;background-color:rgba(0,0,0,0)" type="text"></el-button>
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

    <!-- 编辑记录表单 -->
    <el-dialog title="编辑记录" :visible.sync="edit_service_dialogVisible" width="420px" :close-on-click-modal="false">
      <el-form :model="edit_service_dialog_params" label-width="120px" label-position="right" v-loading="edit_loading">
        <el-form-item label="渠道" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.channel" placeholder="请输入渠道" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="项目" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.project" placeholder="请输入项目" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="时间" class="noselect" style="margin-right:40px">
          <el-date-picker
            v-model="edit_service_dialog_params.date"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="姓名" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.name" placeholder="请输入姓名" style="width:220px">
            </el-input>
        </el-form-item>
        <!--  -->
        <!-- <template v-for="(item,index) in edit_service_dialog_params.area">
          <el-table-column :prop="item.num" label="aaa" :key="index">
            <el-input v-model="item['num']" :key="index" placeholder="请输入加粉数" style="width:220px">
            </el-input>
          </el-table-column>
        </template> -->

          <el-form-item
            style="margin-right:40px"
            v-for="(item, index) in edit_service_dialog_params.area"
            :label="item.place"
            :key="index"
            :prop="item.place"
          >
            <el-input v-model="item.num">
            </el-input>
          </el-form-item>
        <!--  -->
        <el-form-item label="微信粉量" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.wechat" placeholder="请输入微信粉量" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="赖粉量" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.line" placeholder="请输入赖粉量" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="上午加粉" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.am" placeholder="请输入上午加粉" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="下午加粉" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.pm" placeholder="请输入下午加粉" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="加分总数" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.jf_sum" placeholder="请输入加分总数" style="width:220px">
            </el-input>
        </el-form-item>
        <el-button @click="edit_user_dialog_submit()" size="small" type="primary" class="formSubmitBtn" style="margin-right: -240px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- excel导入 -->
    <el-dialog @open='openDialog_import_form' @close='closeDialog_import_form' :close-on-click-modal="false" :visible.sync="import_form_dialogVisible" width="1200px" >
      <el-upload
        v-loading="loading_import"
        drag
        style="margin-bottom: 10px;"
        :limit=limitNum
        :auto-upload="false" 
        accept=".xlsx"
        action="#"
        :before-upload="beforeUploadFile"
        :on-change="handleUpload"
        :on-remove="handleRemove"
        :file-list="fileList">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em style="color: #409EFF;">点击上传</em></div>
        <div class="el-upload__tip" slot="tip">仅接收一个xlsx文件 / 不支持分表</div>
      </el-upload>
      <el-button :disabled="loading_import || this.ShowTableData_excel.length === 0" size="small" type="primary" @click="excelImport">立即上传</el-button>
          <!-- 表格 -->
    <el-table
    :max-height="500"
      stripe
      :data="ShowTableData_excel"
      tooltip-effect="dark"
      style="width:1100px;line-height:30px;margin:25px 30px;"
      :row-style="{height: '50px'}"
      border>
      <el-table-column fixed="left" prop="channel" label="渠道" min-width="100px">
      </el-table-column>
      <el-table-column fixed="left" prop="project" label="项目" min-width="100px">
      </el-table-column>
      <el-table-column fixed="left" prop="date" label="日期" min-width="100px">
      </el-table-column>
      <el-table-column fixed="left" prop="name" label="姓名" width="100px">
      </el-table-column>
      <!-- <el-table-column prop="phone" label="动态地区" width="250px">
      </el-table-column> -->
      <!-- <template v-for="(item,index) in tableHead">
        <el-table-column :prop="item.column_name" :label="item.column_comment" :key="index">
          <template slot-scope="scope">
            <div v-for="(i,ind) in scope.row['area']" :key="ind">{{i["num"]}}</div>
          </template>
        </el-table-column>
      </template> -->
      <el-table-column v-for="(item,index) in tableHead" :key="index" :label="item">
        <template slot-scope="scope">
            <span v-if="scope.row.area[index] != undefined">{{scope.row.area[index]["num"]}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="wechat" label="微信粉量" width="100px">
      </el-table-column>
      <el-table-column prop="line" label="赖粉量" width="100px">
      </el-table-column>
      <el-table-column prop="am" label="上午加粉" width="100px">
      </el-table-column>
      <el-table-column prop="pm" label="下午加粉" width="100px">
      </el-table-column>
      <el-table-column prop="jf_sum" label="加粉总数" width="100px">
      </el-table-column>
    </el-table>

    </el-dialog>

    <!--汇总dialog  -->
    <el-dialog :close-on-click-modal="false" :visible.sync="collect_dialogVisible" width="1000px" label-width="80px">
      <el-form :disabled="loading_collect===true?true:false" v-loading="collect_loading" :model="searchParams_collect" label-width="100px" label-position="right">
        <el-form-item label="汇总日期" class="noselect" style="margin-right: 30px">
          <el-date-picker size="small" :picker-options="pickerOptions" :clearable="false" @change="sendDate" value-format="timestamp" style="width:300px;position:relative;left:-250px" v-model="searchParams_collect.date" type="daterange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <el-button icon="el-icon-download" size="small" :disabled="ShowTableData_collect.length === 0 || loading_collect===true?true:false" class="info_btn" @click="exportExcel_collect()" type="info" style="position: absolute;top: 65px;right: 50px;">导出Excel</el-button>
      <el-table v-loading="loading_collect" highlight-current-row element-loading-background="rgba(255,255,255,0.5)" :data="ShowTableData_collect" tooltip-effect="dark" style="width: calc(100% - 60px); line-height: 30px; margin:30px;margin-top: 25px" border>
          <el-table-column prop="object" label="项目" width="60px">
          </el-table-column>
          <el-table-column prop="jf_sum" label="加粉总数" width="100px">
          </el-table-column>
          <el-table-column prop="card_sum" label="申请总账户数" width="110px">
          </el-table-column>
          <el-table-column prop="num" label="总转化率 (加粉总数 / 申请总账户数)">
            <template slot-scope="scope">
              <div>{{Number(scope.row["jf_sum"])/Number(scope.row["card_sum"])}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="apply_domain_sum" label="申请域名总数" width="110px">
          </el-table-column>
          <el-table-column prop="num" label="总转化率 (加粉总数 / 域名申请总数)">
            <template slot-scope="scope">
              <div>{{Number(scope.row["jf_sum"])/Number(scope.row["apply_domain_sum"])}}</div>
            </template>
          </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { export_json_to_excel } from '../Export2Excel.js'
import { readExcel } from "../importExcel";
import crypto from '../crypto.js'
import utils from '../utils'
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() >= new Date().getTime();
        }
      },
      // 汇总
      ShowTableData_collect:[],
      collect_dialogVisible:false,
      searchParams_collect:{
        date:null
      },
      loading_collect:false,
      collect_loading:false,
      //
      tableHead:[
        "动态地区"
      ],
      chooseChannel:[],
      chooseProject:[],
      // excel
      output_form: {
        group: null
      },
      loading_import:false,
      fileList: [],
      limitNum: 1,
      import_form_dialogVisible: false,
      ShowTableData_excel:[],
      // authority
      authority:{},
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
        date: null,
      },
      // 详情抽屉
      table: false,
      // 分页
      totalNum: 0,
      currentPage: 1,
      useSearchData: false,
      pageSize:50,
      searchPageChange:false,
      standBy_search:null,
      
      edit_service_dialogVisible:false,
      edit_loading:false,
      edit_service_dialog_params:{},
      tableHeight:620,
      ShowTableData_excel_deepClone:[],
      userList:[],
    };
  },

  created() {
    this.fetch();
    this.getAuthority()
    this.fetchUserList()
  },

  methods: {
    async sendDate() {
      this.loading_collect = true
      let formData = new FormData()
      var arr = []
      this.searchParams_collect.date.forEach(e=> {
        arr.push(e/1000)
      })
      formData.append('date',arr)
      try {
        await this.$http.post('/index.php/index/account/collectJf/',formData).then((res) => {
        this.loading_collect = false
        this.ShowTableData_collect = []
        if (res.data["data"].length != 0) {
          for (const key in res.data["data"]) {
          this.ShowTableData_collect.push({"object":key,"jf_sum":res.data["data"][key]["jf_sum"],"card_sum":res.data["data"][key]["card_sum"],"apply_domain_sum":res.data["data"][key]["apply_domain_sum"],"change_jf_card":res.data["data"][key]["jf_sum"]/res.data["data"][key]["card_sum"],"change_jf_domain":res.data["data"][key]["jf_sum"]/res.data["data"][key]["apply_domain_sum"]})
        }
        }
      })
      } catch (error) {
        this.loading_collect = false
        this.$message.error('请求出错')
      }
    },
    closeDialog_import_form() {
      var sortArr_place = []
      this.ShowTableData.forEach(e=> {
        e["area"].forEach(i=> {
          if (sortArr_place.indexOf(i["place"]) === -1) {
            sortArr_place.push(i["place"])
          }
        })
      })
      this.tableHead = sortArr_place
    },
    openDialog_import_form() {
      if (this.ShowTableData_excel.length != 0) {
        var sortArr_place = []
        this.ShowTableData_excel.forEach(e=> {
          e["area"].forEach(i=> {
            if (sortArr_place.indexOf(i["place"]) === -1) {
              sortArr_place.push(i["place"])
            }
          })
        })
        this.tableHead = sortArr_place
      }
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
        this.standBy_search = null
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
        var arr1 = []
        this.searchParams["date"].forEach(e=> {
          arr1.push(e/1000)
        })
        formData.append('date',arr1)
      }
      await this.$http.post('/index.php/index/account/searchJf/',formData).then((res) => {
        var sortArr_channel = []
          var sortArr_project = []
          var sortArr_name = []
          var sortArr_place = []
        res.data["data"].forEach(e=> {
          if (e["date"] != null && e["date"] != undefined && e["date"] != '') {
            e["date"] = utils.getLocalTime1(parseInt(e["date"]));
          }
          e["area"] = JSON.parse(e["area"])
          if (sortArr_channel.indexOf(e["channel"]) === -1) {
            sortArr_channel.push(e["channel"])
          }
          if (sortArr_project.indexOf(e["project"]) === -1) {
            sortArr_project.push(e["project"])
          }
          if (sortArr_name.indexOf(e["name"]) === -1) {
            sortArr_name.push(e["name"])
          }
          e["area"].forEach(i=> {
            if (sortArr_place.indexOf(i["place"]) === -1) {
              sortArr_place.push(i["place"])
            }
          })
        })
        this.tableHead = sortArr_place
        this.tableData = []
        sortArr_channel.forEach(a=> {
            sortArr_project.forEach(b=> {
              sortArr_name.forEach(c=> {
                res.data["data"].forEach(i=> {
                if (i["channel"] === a && i["project"] === b && i["name"] === c) {
                  this.tableData.push(i)
                }
              })
              })
            })
          })
        this.standBy_search = utils.deepClone(this.searchParams)//缓存搜索项
        this.searchPageChange = true
        this.useSearchData = true
        this.totalNum = res.data["sum"]
        this.currentPage = val
        this.ShowTableData = this.tableData
        this.currentPage = 1
        this.tableHeight = utils.setClientHight(this,255,56,78)
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
          var arr2 = []
          this.searchParams["date"].forEach(e=> {
            arr2.push(e/1000)
          })
          formData.append('date',arr2)
        }
        await this.$http.post('/index.php/index/account/searchJf/',formData).then((res) => {
          var sortArr_channel = []
          var sortArr_project = []
          var sortArr_name = []
          var sortArr_place = []
          this.searchPageChange = true
          this.useSearchData = true
          this.totalNum = res.data["sum"]
          this.currentPage = val
          res.data["data"].forEach((e) => {
            if (e["date"] != null && e["date"] != undefined && e["date"] != '') {
              e["date"] = utils.getLocalTime1(parseInt(e["date"]));
            }
              e["area"] = JSON.parse(e["area"])
              if (sortArr_channel.indexOf(e["channel"]) === -1) {
                sortArr_channel.push(e["channel"])
              }
              if (sortArr_project.indexOf(e["project"]) === -1) {
                sortArr_project.push(e["project"])
              }
              if (sortArr_name.indexOf(e["name"]) === -1) {
                sortArr_name.push(e["name"])
              }
              e["area"].forEach(i=> {
                if (sortArr_place.indexOf(i["place"]) === -1) {
                  sortArr_place.push(i["place"])
                }
              })
          });
          this.tableHead = sortArr_place
          this.tableData = []
          sortArr_channel.forEach(a=> {
            sortArr_project.forEach(b=> {
              sortArr_name.forEach(c=> {
                res.data["data"].forEach(i=> {
                if (i["channel"] === a && i["project"] === b && i["name"] === c) {
                  this.tableData.push(i)
                }
              })
              })
            })
          })
          this.ShowTableData = this.tableData
          this.tableHeight = utils.setClientHight(this,255,56,78)
          this.loading = false
        })
      }
      this.handleUpdateClick()
    },
    async handleSizeChange(val) {// 页大小
      if (this.searchPageChange === false && this.useSearchData === false) {
        this.loading = true;
        let formData = new FormData()
        formData.append("page",1)
        formData.append("num",val)
        await this.$http.post("/index.php/index/account/jfList/",formData).then((res) => {
          var sortArr_channel = []
          var sortArr_project = []
          var sortArr_name = []
          var sortArr_place = []
          res.data["data"].forEach((e) => {
            if (e["date"] != null && e["date"] != undefined && e["date"] != '') {
              e["date"] = utils.getLocalTime1(parseInt(e["date"]));
            }
              e["area"] = JSON.parse(e["area"])
              if (sortArr_channel.indexOf(e["channel"]) === -1) {
                sortArr_channel.push(e["channel"])
              }
              if (sortArr_project.indexOf(e["project"]) === -1) {
                sortArr_project.push(e["project"])
              }
              if (sortArr_name.indexOf(e["name"]) === -1) {
                sortArr_name.push(e["name"])
              }
              e["area"].forEach(i=> {
                if (sortArr_place.indexOf(i["place"]) === -1) {
                  sortArr_place.push(i["place"])
                }
              })
          });
          this.tableHead = sortArr_place
          this.tableData = []
          sortArr_channel.forEach(a=> {
            sortArr_project.forEach(b=> {
              sortArr_name.forEach(c=> {
                res.data["data"].forEach(i=> {
                if (i["channel"] === a && i["project"] === b && i["name"] === c) {
                  this.tableData.push(i)
                }
              })
              })
            })
          })
          this.ShowTableData = this.tableData
        this.totalNum = res.data["sum"]
        this.currentPage = 1
        this.pageSize = val
        this.tableHeight = utils.setClientHight(this,255,56,78)
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
      await this.$http.post("/index.php/index/account/jfList/",formData).then((res) => {
          var sortArr_channel = []
          var sortArr_project = []
          var sortArr_name = []
          var sortArr_place = []
          res.data["data"].forEach((e) => {
            if (e["date"] != null && e["date"] != undefined && e["date"] != '') {
              e["date"] = utils.getLocalTime1(parseInt(e["date"]));
            }
              e["area"] = JSON.parse(e["area"])
            if (sortArr_channel.indexOf(e["channel"]) === -1) {
              sortArr_channel.push(e["channel"])
            }
            if (sortArr_project.indexOf(e["project"]) === -1) {
              sortArr_project.push(e["project"])
            }
            if (sortArr_name.indexOf(e["name"]) === -1) {
              sortArr_name.push(e["name"])
            }
            e["area"].forEach(i=> {
              if (sortArr_place.indexOf(i["place"]) === -1) {
                sortArr_place.push(i["place"])
              }
            })
          });
          this.tableHead = sortArr_place
          this.tableData = []
          sortArr_channel.forEach(a=> {
            sortArr_project.forEach(b=> {
              sortArr_name.forEach(c=> {
                res.data["data"].forEach(i=> {
                if (i["channel"] === a && i["project"] === b && i["name"] === c) {
                  this.tableData.push(i)
                }
              })
              })
            })
          })
          this.ShowTableData = this.tableData
        this.totalNum = res.data["sum"]
        this.tableHeight = utils.setClientHight(this,255,56,78)
        this.handleUpdateClick()
        this.loading = false;
      });
      } else {
      this.search(val)
      }
    },
    exportExcel() {
      this.$confirm(`是否导出符合搜索条件的所有记录`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
      })
      .then(async () => {
          this.loading = true
          var arr = []
          var standBy_downLoad = utils.deepClone(this.standBy_search)
          delete standBy_downLoad["page"]
          delete standBy_downLoad["num"]
          let formData = new FormData()
          for (const key in standBy_downLoad) {
              formData.append(`${key}`,standBy_downLoad[key])
          }
          formData.delete('date')
          if (this.searchParams["date"] != undefined) {
            var arr1 = []
            this.searchParams["date"].forEach(e=> {
              arr1.push(e/1000)
            })
            formData.append('date',arr1)
          }
          var sortArr_channel = []
          var sortArr_project = []
          var sortArr_name = []
          var sortArr_place = []
          await this.$http.post('/index.php/index/account/searchJf/',formData).then((res)=> {
              res.data["data"].forEach(e=> {
                e["date"] = utils.getLocalTime1(parseInt(e["date"]))
                e["area"] = JSON.parse(e["area"])
                if (sortArr_channel.indexOf(e["channel"]) === -1) {
                  sortArr_channel.push(e["channel"])
                }
                if (sortArr_project.indexOf(e["project"]) === -1) {
                  sortArr_project.push(e["project"])
                }
                if (sortArr_name.indexOf(e["name"]) === -1) {
                  sortArr_name.push(e["name"])
                }
                e["area"].forEach(i=> {
                  if (sortArr_place.indexOf(i["place"]) === -1) {
                    sortArr_place.push(i["place"])
                  }
                  e[i["place"]] = i["num"]
                })
                e["change_jf_card"] = e["jf_sum"]/e["card_sum"]
                e["change_jf_domain"] = e["jf_sum"]/e["apply_domain_sum"]
              })
              sortArr_channel.forEach(a=> {
                sortArr_project.forEach(b=> {
                  sortArr_name.forEach(c=> {
                    res.data["data"].forEach(i=> {
                    if (i["channel"] === a && i["project"] === b && i["name"] === c) {
                      arr.push(i)
                    }
                  })
                  })
                })
              })
          })
          var tHeader1 = ['渠道','项目','日期','姓名']
          var tHeader2 = ['微信粉量','赖粉量','上午加粉','下午加粉','加粉总数','申请总账户数','转化率(加粉总数/申请总账户数)','申请域名总数','已废弃域名',"转化率(加粉总数/域名申请总数)"]
          var tHeader = tHeader1.concat(sortArr_place,tHeader2)
          var filterVal1 = ['channel','project','date','name']
          var filterVal2 = ['wechat','line','am','pm','jf_sum','card_sum','change_jf_card','apply_domain_sum','del_domain_sum','change_jf_domain']
          var filterVal = filterVal1.concat(sortArr_place,filterVal2)
          var time = this.getCurentTime()
          var filename = `${time}`
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
    exportExcel_collect() {
      var arr = []
      arr = this.ShowTableData_collect
      var tHeader = ["项目","加粉总数","申请总账户数","总转化率(加粉总数/申请总账户数)","申请域名总数","总转化率(加粉总数/域名申请总数)"]
      var filterVal = ['object','jf_sum','card_sum','change_jf_card','apply_domain_sum','change_jf_domain']
      var filename = `${utils.getLocalTime(parseInt(this.searchParams_collect.date[0]/1000))} - ${utils.getLocalTime(parseInt(this.searchParams_collect.date[1]/1000))}加粉数据汇总`
      var data = this.formatJson(filterVal, arr)
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
    async fetchUserList() {// 数据获取
      // let formData = new FormData()
      // formData.append("user",1000)
      await this.$http.get("/index.php/index/account/optionJf").then((res) => {
        // this.userList = res.data["0"]
        if (res.data["data"].length != 0) {
          res.data["data"]["name"].forEach(e=> {
            this.userList.push({"label":e,"value":e})
          })
          res.data["data"]["project"].forEach(e=> {
            this.chooseProject.push({"label":e,"value":e})
          })
          res.data["data"]["channel"].forEach(e=> {
            this.chooseChannel.push({"label":e,"value":e})
          })
        }
      });
    },
    utils_run() {
      if (this.searchParams.date === null || this.searchParams.date === '') {
        this.ShowTableData = this.tableData
        this.tableHeight = utils.setClientHight(this,250,56,44)
        this.handleUpdateClick()
      } else {
        this.ShowTableData = []
        this.tableData.forEach(e=> {
          var standBy_searchDate = e["birth_date"].split('/')[1]
          if (standBy_searchDate == this.searchParams["date"]) {
            this.ShowTableData.push(e)
          }
        })
        this.tableHeight = utils.setClientHight(this,250,56,44)
        this.handleUpdateClick()
      }
      
    },
    handleUpdateClick() {// 回流
      this.key += 1 
    },
    async remove(e) {// 移除单项
      this.$confirm(`是否该记录?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(async () => {
        this.loading = true
        let formData = new FormData()
        formData.append("id",e.id)
        await this.$http.post("/index.php/index/account/delJf/",formData).then((res) => {
          if (res.data["code"] === 200) {
            this.fetch().then(()=> {
              this.$message.success(`${res.data["data"]}`)
            })
          } else {
            this.$message.error('操作失败')
          }
        })
      }).catch((err)=> {
        //
      })
    },
    // excel导入
    excelImport() {
      var resArr = []
      this.loading_import = true
      this.ShowTableData_excel_deepClone = utils.deepClone(this.ShowTableData_excel)
      this.ShowTableData_excel_deepClone.forEach(async e=> {
        e["area"] = JSON.stringify(e["area"])
        if (e["date"] != null && e["date"] != '' && e["date"] != undefined) {
          e["date"] = (new Date(e["date"])).getTime()/1000
        }
        let formData = new FormData()
        for (const key in e) {
          if (['channel','project','date','name','area','wechat','line','am','pm','jf_sum'].indexOf(key) != -1) {
            formData.append(`${key}`,e[key])
          }
        }
        await this.$http.post('/index.php/index/account/addJf/',formData).then((res) => {
          resArr.push(res.data["code"])
          if (resArr.length === this.ShowTableData_excel.length) {
            this.loading_import = false
            this.import_form_dialogVisible = false
            if (resArr.indexOf(500) === -1) {
              this.$message.success('Excel导入成功')
            } else {
              this.$message.warning('存在操作失败项目')
            }
            this.fileList = [];
            this.ShowTableData_excel = []
            this.fetch()
            this.fetchUserList()
          }
        })
      })
    },
    formatDate(numb, format) {
      const old = numb - 1;
      const t = Math.round((old - Math.floor(old)) * 24 * 60 * 60);
      const time = new Date(1900, 0, old, 0, 0, t)
      const year = time.getFullYear() ;
      const month = time.getMonth() + 1 ;
      const date = time.getDate() ;
      return year + format + (month < 10 ? '0' + month : month) + format + (date < 10 ? '0' + date : date)
    },
    handleUpload(file, fileList) {
      var excelJson = readExcel(file);
      setTimeout(() => {
        excelJson[0]["sheet"].forEach(e => {
          var obj = {}
          obj.channel = e["渠道"]
          obj.project = e["项目"]
          obj.date = e["日期"]
          obj.name = e["姓名"]
          obj.area = []
          for (const key in e) {
            if (["渠道","项目","日期","姓名","微信粉量","赖粉量","上午加粉","下午加粉","加粉总数"].indexOf(key) === -1) {
              obj.area.push({"place":key,"num":e[key]})
            }
          }
          obj.wechat = e["微信粉量"]
          obj.line = e["赖粉量"]
          obj.am = e["上午加粉"]
          obj.pm = e["下午加粉"]
          obj.jf_sum = e["加粉总数"]
          if (obj["date"] != null && obj["date"] != undefined && obj["date"] != '') {
            obj["date"] = this.formatDate(obj["date"], '/')
          }
          this.ShowTableData_excel.push(obj)
        })
        var sortArr_place = []
        this.ShowTableData_excel.forEach(e=> {
          e["area"].forEach(i=> {
            if (sortArr_place.indexOf(i["place"]) === -1) {
              sortArr_place.push(i["place"])
            }
          })
        })
        this.tableHead = sortArr_place
      },100);
    },
    beforeUploadFile(file) {// 上传文件之前的钩子
      let extension = file.name.substring(file.name.lastIndexOf('.')+1);
      let size = file.size / 1024 / 1024;
      if(extension !== 'xlsx') {
        this.$message.warning('只能上传后缀是.xlsx的文件');
      }
    },
    // 移除excel表
    handleRemove(file, fileList) {
      this.fileList = [];
      this.ShowTableData_excel = []
    },
    // 
    getAuthority() {
      crypto.cryptoDecrypt_string(localStorage.getItem('authority')).split(',').forEach(e=> {
        this.authority[e] = true
      })
    },
    async fetch() {// 数据获取
      this.loading = true
      let formData = new FormData()
      formData.append("page",1)
      formData.append("num",this.pageSize)
      await this.$http.post("/index.php/index/account/jfList/",formData).then((res) => {
        var sortArr_channel = []
        var sortArr_project = []
        var sortArr_name = []
        var sortArr_place = []
        res.data["data"].forEach(e=> {
          if (e["date"] != null && e["date"] != undefined && e["date"] != '') {
            e["date"] = utils.getLocalTime1(parseInt(e["date"]));
          }
          e["area"] = JSON.parse(e["area"])
          if (sortArr_channel.indexOf(e["channel"]) === -1) {
            sortArr_channel.push(e["channel"])
          }
          if (sortArr_project.indexOf(e["project"]) === -1) {
            sortArr_project.push(e["project"])
          }
          if (sortArr_name.indexOf(e["name"]) === -1) {
            sortArr_name.push(e["name"])
          }
          e["area"].forEach(i=> {
            if (sortArr_place.indexOf(i["place"]) === -1) {
              sortArr_place.push(i["place"])
            }
          })
        })
        this.tableHead = sortArr_place
        this.tableData = []
        sortArr_channel.forEach(a=> {
          sortArr_project.forEach(b=> {
            sortArr_name.forEach(c=> {
              res.data["data"].forEach(i=> {
              if (i["channel"] === a && i["project"] === b && i["name"] === c) {
                this.tableData.push(i)
              }
            })
            })
          })
        })
        // this.tableData = res.data["data"]
        this.totalNum = res.data["sum"]
        this.ShowTableData = this.tableData;
        this.tableHeight = utils.setClientHight(this,250,56,44)
        if (this.ShowTableData.length === 0) {
          this.tableHeight = 120
        }
        this.loading = false;
      });
    },
    edit_log(e) {// 编辑
      this.edit_service_dialog_params = utils.deepClone(e)
      if (this.edit_service_dialog_params["date"] != null && this.edit_service_dialog_params["date"] != '' && this.edit_service_dialog_params["date"] != undefined) {
        this.edit_service_dialog_params["date"] = (new Date(this.edit_service_dialog_params["date"])).getTime()
      }
      this.edit_service_dialogVisible = true
    },
    async edit_user_dialog_submit() { // 编辑提交
      this.edit_loading = true
      var edit_service_dialog_params_deepclone = utils.deepClone(this.edit_service_dialog_params)
      if (edit_service_dialog_params_deepclone["date"] != null && edit_service_dialog_params_deepclone["date"] != '' && edit_service_dialog_params_deepclone["date"] != undefined) {
        edit_service_dialog_params_deepclone["date"] = edit_service_dialog_params_deepclone["date"]/1000
      }
      let formData = new FormData()
      for (const key in edit_service_dialog_params_deepclone) {
        edit_service_dialog_params_deepclone["area"].forEach(i=> {
          i["num"] = Number(i["num"])
        })
        if (key === 'area') {
          formData.append('area',JSON.stringify(edit_service_dialog_params_deepclone["area"]))
        } else {
          if (['channel','project','date','name','area','wechat','line','am','pm','jf_sum','id'].indexOf(key) != -1) {
          formData.append(`${key}`,edit_service_dialog_params_deepclone[key])
        }
        }
      }
      await this.$http.post('/index.php/index/account/editJf/',formData).then((res) => {
        this.edit_loading = false
        if (res.data["code"] === 200) {
          this.edit_service_dialogVisible = false
          this.fetchPageData(this.currentPage)
          this.$message.success(`${res.data["data"]}`)
        } else {
          this.$message.error(`${res.data["data"]}`)
        }
      })
    }
  },
  computed: {
    clientHeight_watch () {
      return this.$store.state.clientHeight || Number(document.documentElement.clientHeight)
    },
  },
  watch: {
    clientHeight_watch (val) {
      var _this = this;
      _this.tableHeight = utils.setClientHight(_this,250,56,44)
    }
  },
};
</script>

<style scoped>
  #delAd:hover {
    color: rgb(245, 108, 108);
    background-color: rgb(254, 240, 240);
  }
  .el-tag.el-tag--info {
    background-color: white!important;
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
</style>
