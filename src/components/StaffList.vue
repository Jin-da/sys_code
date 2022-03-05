<template>
  <div >
    <!-- 搜索框 -->
      <div style="display: flex;position:relative;min-width:1025px;margin-top:70px">
        <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap;width:100%;justify-content: space-between" :disabled="loading">
            <el-form-item label="出生月份" class="noselect" style="margin-right: 30px">
              <el-input @change="utils_run" v-model="searchParams.date" placeholder="输入月份如：12" clearable style="width: 150px"></el-input>
            </el-form-item>
            <el-form-item class="noselect">
              <el-button icon="el-icon-upload2" class="info_btn" @click="import_form_dialogVisible = true" type="info" style="height: 30px; position: relative;">Excel 导入</el-button>
              <el-button  class="info_btn" icon="el-icon-download" @click="exportExcel_confirm" type="info" style="height: 30px; position: relative;right:-10px;margin-left:10px;" >导出</el-button>
              <!-- <el-button v-if="this.authority['createservice']" class="info_btn" @click="new_service_dialogVisible = true" type="info" style="height: 30px; position: relative; margin-top: 32px">创建员工</el-button> -->
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
      style="width:calc(100%-60px);line-height:30px;margin:10px 0 25px 0;min-width:1025px;"
      border>
      <el-table-column fixed="left" prop="" label="详情" width="50px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-arrow-right" size="small" @click="tableOpen(scope.row)" style="padding-left: 9px;color:#909399"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="index" label="序号" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row['index'] != null && scope.row['index'] != ''">{{scope.row['index']}}</div>
          <div v-else>/</div>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row['name'] != null && scope.row['name'] != ''">{{scope.row['name']}}</div>
          <div v-else>/</div>
        </template>
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="100px">
        <template slot-scope="scope">
          <div v-if="scope.row['gender'] != null && scope.row['gender'] != ''">{{scope.row['gender']}}</div>
          <div v-else>/</div>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="联系方式" width="250px">
        <template slot-scope="scope">
          <div v-if="scope.row['phone'] != null && scope.row['phone'] != ''">{{scope.row['phone']}}</div>
          <div v-else>/</div>
        </template>
      </el-table-column>
      <el-table-column prop="department" label="部门" width="150px">
        <template slot-scope="scope">
          <div v-if="scope.row['department'] != null && scope.row['department'] != ''">{{scope.row['department']}}</div>
          <div v-else>/</div>
        </template>
      </el-table-column>
      <el-table-column prop="position" label="职位" width="150px">
        <template slot-scope="scope">
          <div v-if="scope.row['position'] != null && scope.row['position'] != ''">{{scope.row['position']}}</div>
          <div v-else>/</div>
        </template>
      </el-table-column>
      <el-table-column prop="contract_period" label="劳动合同期限" width="250px">
        <template slot-scope="scope">
          <div v-if="scope.row['contract_period'] != null && scope.row['contract_period'] != ''">{{scope.row['contract_period']}}</div>
          <div v-else>/</div>
        </template>
      </el-table-column>
      <el-table-column prop="birth_date" label="出生日期" width="120px">
        <template slot-scope="scope">
          <div v-if="scope.row['birth_date'] != null && scope.row['birth_date'] != ''">{{scope.row['birth_date']}}</div>
          <div v-else>/</div>
        </template>
      </el-table-column>
      <el-table-column prop="entry_date" label="入职时间" width="120px">
        <template slot-scope="scope">
          <div v-if="scope.row['entry_date'] != null && scope.row['entry_date'] != ''">{{scope.row['entry_date']}}</div>
          <div v-else>/</div>
        </template>
      </el-table-column>
      <el-table-column prop="dimission" label="是否离职" width="120px">
        <template slot-scope="scope">
          <div v-if="scope.row['dimission'] != null && scope.row['dimission'] != ''">{{scope.row['dimission']}}</div>
          <div v-else>/</div>
        </template>
      </el-table-column>
      <el-table-column prop="dimission_date" label="离职时间">
        <template slot-scope="scope">
          <div v-if="scope.row['dimission_date'] != null && scope.row['dimission_date'] != ''">{{scope.row['dimission_date']}}</div>
          <div v-else>/</div>
        </template>
      </el-table-column>
      <!-- <el-table-column fixed="right" label="操作" align="center" width="130px">
        <template slot-scope="scope">
          <el-dropdown placement="bottom" trigger="click">
            <span style="cursor: pointer;" class="el-dropdown-link">
              <i style="color: grey!important" class="el-icon-more"></i>
            </span>
            <el-dropdown-menu :visible-arrow="false" class="noselect" slot="dropdown">
              <el-dropdown-item @click.native="edit_service(scope.row)">编辑员工</el-dropdown-item>
              <el-dropdown-item id="delAd" @click.native="remove(scope.row)">删除员工</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-tooltip content="编辑员工" placement="top" :visible-arrow="false">
            <el-button  @click="edit_service(scope.row)" icon="el-icon-edit" style="font-size:13px;color:grey;padding:0;margin-right:10px" type="text"></el-button>
          </el-tooltip>
          <el-tooltip content="删除员工" placement="top" :visible-arrow="false">
            <el-button  @click="remove(scope.row)" icon="el-icon-delete" style="font-size:13px;color:red;padding:0;border:none;background-color:rgba(0,0,0,0)" type="text"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <!-- <div class="block" style="position: relative; right: 0px;min-width:1025px;margin-bottom:20px" v-if="!loading">
      <el-pagination :page-size="20" background @current-change="fetchPageData()" :current-page.sync="currentPage" layout="prev, pager, next" :total="totalNum" :disabled="loading">
      </el-pagination>
    </div> -->

    <!-- 创建员工表单 -->
    <el-dialog title="创建员工" :visible.sync="new_service_dialogVisible" width="400px" :close-on-click-modal="false" @close='closeDialog_new'>
      <el-form :rules="rules" ref="new_service_dialog_params" :model="new_service_dialog_params" label-width="100px" label-position="right" v-loading="new_loading">
        <el-form-item label="项目" class="noselect" style="margin-right: 40px" prop="project">
          <el-select v-model="new_service_dialog_params.project" placeholder="请选择">
            <el-option
              v-for="item in [{label:'减肥',value:'jf'},{label:'丰胸',value:'fx'},{label:'白发',value:'bf'},{label:'痔疮',value:'zc'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" class="noselect" style="margin-right: 40px" prop="type">
          <el-select v-model="new_service_dialog_params.type" placeholder="请选择">
            <el-option
              v-for="item in [{label:'双号',value:'vl'},{label:'单微',value:'v'},{label:'单Line',value:'l'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工名称" class="noselect" style="margin-right:40px" prop="customer_service">
          <el-input v-model="new_service_dialog_params.customer_service" placeholder="请输入员工名称" style="width:220px">
          </el-input>
        </el-form-item>
        <el-form-item label="WeChat" class="noselect" style="margin-right:40px">
          <el-input v-model="new_service_dialog_params.wechat" placeholder="请输入微信号" style="width:220px">
          </el-input>
        </el-form-item>
        <el-form-item label="Line" class="noselect" style="margin-right:40px">
          <el-input v-model="new_service_dialog_params.line" placeholder="请输入Line号" style="width:220px">
          </el-input>
        </el-form-item>
        <el-form-item label="Line-Link" class="noselect" style="margin-right:40px" prop="line_link">
          <el-input v-model="new_service_dialog_params.line_link" placeholder="请输入Line-Link" style="width:220px">
            </el-input>
        </el-form-item>
        <el-button @click="submitForm('new_service_dialog_params')" size="small" type="primary" class="formSubmitBtn" style="margin-right: -220px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 编辑员工表单 -->
    <el-dialog title="编辑员工" :visible.sync="edit_service_dialogVisible" width="420px" :close-on-click-modal="false">
      <el-form :model="edit_service_dialog_params" label-width="120px" label-position="right" v-loading="edit_loading">
        <!-- <el-form-item label="项目" class="noselect" style="margin-right: 40px" prop="project">
          <el-select v-model="edit_service_dialog_params.project" placeholder="请选择">
            <el-option
              v-for="item in [{label:'减肥',value:'jf'},{label:'丰胸',value:'fx'},{label:'白发',value:'bf'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" class="noselect" style="margin-right: 40px" prop="type">
          <el-select v-model="edit_service_dialog_params.type" placeholder="请选择">
            <el-option
              v-for="item in [{label:'双号',value:'vl'},{label:'单微',value:'v'},{label:'单Line',value:'l'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="序号" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.index" placeholder="请输入序号" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="姓名" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.name" placeholder="请输入姓名" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="性别" class="noselect" style="margin-right: 40px" prop="project">
          <el-select v-model="edit_service_dialog_params.gender" placeholder="请选择性别">
            <el-option
              v-for="item in [{label:'男',value:'男'},{label:'女',value:'女'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.identity_id" placeholder="请输入身份证号" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="联系方式" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.phone" placeholder="请输入联系方式" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="入职时间" class="noselect" style="margin-right:40px">
          <el-date-picker
            v-model="edit_service_dialog_params.entry_date"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="部门" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.department" placeholder="请输入部门" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="职位" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.position" placeholder="请输入职位" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="出生日期" class="noselect" style="margin-right:40px">
          <el-date-picker
            v-model="edit_service_dialog_params.birth_date"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="籍贯" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.place" placeholder="请输入籍贯" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="户口性质" class="noselect" style="margin-right:40px">
          <el-select v-model="edit_service_dialog_params.account_type" placeholder="请选择户口性质">
            <el-option
              v-for="item in [{label:'农村',value:'农村'},{label:'城市',value:'城市'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="户口地址" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.account_address" placeholder="请输入户口地址" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="现住址" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.now_address" placeholder="请输入现住址" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="最高学历" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.education" placeholder="请输入最高学历" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="QQ号" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.qq" placeholder="请输入QQ号" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="微信号" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.wechat" placeholder="请输入微信号" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="劳动合同期限" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.contract_period" placeholder="请输入劳动合同期限" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="转正日期" class="noselect" style="margin-right:40px">
          <el-date-picker
            v-model="edit_service_dialog_params.regular_date"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="紧急联系人" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.emergency" placeholder="请输入紧急联系人" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="紧急联系人电话" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.emergency_phone" placeholder="请输入紧急联系人电话" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="银行卡" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.bank_card" placeholder="请输入银行卡" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="银行卡卡号" class="noselect" style="margin-right:40px">
          <el-input v-model="edit_service_dialog_params.bank_card_num" placeholder="请输入银行卡卡号" style="width:220px">
            </el-input>
        </el-form-item>
        <el-form-item label="是否离职" class="noselect" style="margin-right:40px">
          <el-select v-model="edit_service_dialog_params.dimission" placeholder="请选择">
            <el-option
              v-for="item in [{label:'是',value:'是'},{label:'否',value:'否'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="离职日期" class="noselect" style="margin-right:40px">
          <el-date-picker
            v-model="edit_service_dialog_params.dimission_date"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp">
          </el-date-picker>
        </el-form-item>
        <el-button @click="edit_user_dialog_submit()" size="small" type="primary" class="formSubmitBtn" style="margin-right: -240px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- excel导入 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="import_form_dialogVisible" width="800px" >
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
      stripe
      :data="ShowTableData_excel"
      tooltip-effect="dark"
      style="width:700px;line-height:30px;margin:25px 30px;"
      :row-style="{height: '50px'}"
      border>
      <el-table-column prop="index" label="序号" width="100px">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="100px">
      </el-table-column>
      <el-table-column prop="gender" label="性别" width="50px">
      </el-table-column>
      <el-table-column prop="identity_id" label="身份证号" width="180px">
      </el-table-column>
      <el-table-column prop="phone" label="联系方式" width="120px">
      </el-table-column>
      <el-table-column prop="entry_date" label="入职时间" width="120px">
      </el-table-column>
      <el-table-column prop="department" label="部门" width="100px">
      </el-table-column>
      <el-table-column prop="position" label="职位" width="80px">
      </el-table-column>
      <el-table-column prop="birth_date" label="出生日期" width="120px">
      </el-table-column>
      <el-table-column prop="place" label="籍贯" width="100px">
      </el-table-column>
      <el-table-column prop="account_type" label="户口性质" width="100px">
      </el-table-column>
      <el-table-column prop="account_address" label="户口地址" width="400px">
      </el-table-column>
      <el-table-column prop="now_address" label="现住址" width="120px">
      </el-table-column>
      <el-table-column prop="education" label="最高学历" width="100px">
      </el-table-column>
      <el-table-column prop="qq" label="QQ号" width="120px">
      </el-table-column>
      <el-table-column prop="wechat" label="微信号" width="120px">
      </el-table-column>
      <el-table-column prop="contract_period" label="劳动合同期限" width="200px">
      </el-table-column>
      <el-table-column prop="regular_date" label="转正日期" width="120px">
      </el-table-column>
      <el-table-column prop="emergency" label="紧急联系人" width="100px">
      </el-table-column>
      <el-table-column prop="emergency_phone" label="紧急联系人电话" width="120px">
      </el-table-column>
      <el-table-column prop="'bank_card" label="银行卡" width="100px">
      </el-table-column>
      <el-table-column prop="bank_card_num" label="银行卡号" width="200px">
      </el-table-column>
      <el-table-column prop="dimission" label="是否离职" width="100px">
      </el-table-column>
      <el-table-column prop="dimission_date" label="离职日期" width="120px">
      </el-table-column>
    </el-table>

    </el-dialog>

    <!-- 详情抽屉 -->
    <el-drawer title="详情" :visible.sync="table" direction="rtl" size="600px">
      <el-form label-width="130px" label-position="left" style="padding-left: 70px">
        <el-form-item size="small" label="身份证号：">
          <p v-if="this.detai_value.identity_id != null && this.detai_value.identity_id != ''" style="text-align:left;">{{this.detai_value.identity_id}}</p>
          <p v-else style="text-align:left;">/</p>
        </el-form-item>
        <el-form-item size="small" label="籍贯：">
          <p v-if="this.detai_value.place != null && this.detai_value.place != ''" style="text-align:left;">{{this.detai_value.place}}</p>
          <p v-else style="text-align:left;">/</p>
        </el-form-item>
        <el-form-item size="small" label="户口性质：">
          <p v-if="this.detai_value.account_type != null && this.detai_value.account_type != ''" style="text-align:left;">{{this.detai_value.account_type}}</p>
          <p v-else style="text-align:left;">/</p>
        </el-form-item>
        <el-form-item size="small" label="户口地址：">
          <p v-if="this.detai_value.account_address != null && this.detai_value.account_address != ''" style="text-align:left;">{{this.detai_value.account_address}}</p>
          <p v-else style="text-align:left;">/</p>
        </el-form-item>
        <el-form-item size="small" label="现住址：">
          <p v-if="this.detai_value.now_address != null && this.detai_value.now_address != ''" style="text-align:left;">{{this.detai_value.now_address}}</p>
          <p v-else style="text-align:left;">/</p>
        </el-form-item>
        <el-form-item size="small" label="最高学历：">
          <p v-if="this.detai_value.education != null && this.detai_value.education != ''" style="text-align:left;">{{this.detai_value.education}}</p>
          <p v-else style="text-align:left;">/</p>
        </el-form-item>
        <el-form-item size="small" label="QQ号：">
          <p v-if="this.detai_value.qq != null && this.detai_value.qq != ''" style="text-align:left;">{{this.detai_value.qq}}</p>
          <p v-else style="text-align:left;">/</p>
        </el-form-item>
        <el-form-item size="small" label="微信号：">
          <p v-if="this.detai_value.wechat != null && this.detai_value.wechat != ''" style="text-align:left;">{{this.detai_value.wechat}}</p>
          <p v-else style="text-align:left;">/</p>
        </el-form-item>
        <el-form-item size="small" label="转正日期：">
          <p v-if="this.detai_value.regular_date != null && this.detai_value.regular_date != ''" style="text-align:left;">{{this.detai_value.regular_date}}</p>
          <p v-else style="text-align:left;">/</p>
        </el-form-item>
        <el-form-item size="small" label="紧急联系人：">
          <p v-if="this.detai_value.emergency != null && this.detai_value.emergency != ''" style="text-align:left;">{{this.detai_value.emergency}}</p>
          <p v-else style="text-align:left;">/</p>
        </el-form-item>
        <el-form-item size="small" label="紧急联系人电话：">
          <p v-if="this.detai_value.emergency_phone != null && this.detai_value.emergency_phone != ''" style="text-align:left;">{{this.detai_value.emergency_phone}}</p>
          <p v-else style="text-align:left;">/</p>
        </el-form-item>
        <el-form-item size="small" label="银行卡：">
          <p v-if="this.detai_value.bank_card != null && this.detai_value.bank_card != ''" style="text-align:left;">{{this.detai_value.bank_card}}</p>
          <p v-else style="text-align:left;">/</p>
        </el-form-item>
        <el-form-item size="small" label="银行卡卡号：">
          <p v-if="this.detai_value.bank_card_num != null && this.detai_value.bank_card_num != ''" style="text-align:left;">{{this.detai_value.bank_card_num}}</p>
          <p v-else style="text-align:left;">/</p>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 导出员工表单 -->
    <el-dialog :close-on-click-modal="false" title="导出Excel" :visible.sync="exportExcel_confirm_dialogVisible" width="450px">
      <el-form :model="output_form" label-width="100px" label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="分组" class="noselect" style="margin-right: 40px" prop="group">
              <el-select v-model="output_form.group" placeholder="选择导出组别" clearable style="width:270px">
                <el-option v-for="item in [{value: 'RT',label: '加粉'},{value: 'COD',label: 'COD'}]" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button :disabled="this.output_form.group === null || this.output_form.group === ''" @click="exportExcel()" size="small" type="primary" class="formSubmitBtn" style="margin-right: -270px" >确 定</el-button>
      </el-form>
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
      //校验规则
      rules: {
        // 申请账号校验规则
        wechat: [
          { required: true, message: '微信号必填', trigger: 'blur' }
        ],
        customer_service: [
          { required: true, message: '员工名称必填', trigger: 'blur' }
        ],
        line: [
          { required: true, message: 'Line号必填', trigger: 'blur' }
        ],
        line_link: [
          { required: true, message: 'Line-Link必填', trigger: 'blur' }
        ],
        project: [
          { required: true, message: '项目必选', trigger: 'change' }
        ],
        type: [
          { required: true, message: '类型必选', trigger: 'change' }
        ],
      },
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
        date: null,
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
      new_service_dialogVisible:false,
      new_loading:false,
      new_service_dialog_params:{
        project:null,
        type:null,
        customer_service:null,
        wechat:null,
        line:null,
        line_link:'https://',
      },
      edit_service_dialogVisible:false,
      edit_loading:false,
      edit_service_dialog_params:{},
      tableHeight:620,
      ShowTableData_excel_crypto:[],
      detai_value:{},
      userList:[],
      exportExcel_confirm_dialogVisible:false
    };
  },

  created() {
    this.fetch();
    this.fetchTotal()
    this.getAuthority()
    this.fetchUserList()
  },

  methods: {
    exportExcel_confirm() {
      this.exportExcel_confirm_dialogVisible = true
    },
    exportExcel() {
          var arr = []
          arr = this.tableData.filter(e=> {
            return e["index"].indexOf(this.output_form.group) != -1
          })
          var tHeader = ["序号","姓名","性别","身份证号","联系方式","入职时间","部门","职位","出生日期","籍贯","户口性质","户口地址","现住址","最高学历","QQ号","微信号","劳动合同期限","转正日期","紧急联系人","紧急联系人电话","银行卡","银行卡卡号","是否离职","离职日期"]
          var filterVal = ['index','name','gender','identity_id','phone','entry_date','department','position','birth_date','place','account_type','account_address','now_address','education','qq','wechat','contract_period','regular_date','emergency','emergency_phone','bank_card','bank_card_num','dimission','dimission_date']
          var time = this.getCurentTime()
          var filename = `${time}`
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
      let formData = new FormData()
      formData.append("user",1000)
      await this.$http.post("/index.php/index/User/userList",formData).then((res) => {
        this.userList = res.data["0"]
      });
    },
    utils_run() {
      if (this.searchParams.date === null || this.searchParams.date === '') {
        this.ShowTableData = this.tableData
        this.tableHeight = utils.setClientHight(this,250,56,53)
        this.handleUpdateClick()
      } else {
        this.ShowTableData = []
        this.tableData.forEach(e=> {
          var standBy_searchDate = e["birth_date"].split('/')[1]
          if (standBy_searchDate == this.searchParams["date"]) {
            this.ShowTableData.push(e)
          }
        })
        this.tableHeight = utils.setClientHight(this,250,56,53)
        this.handleUpdateClick()
      }
      
    },
    handleUpdateClick() {// 回流
      this.key += 1 
    },
    async remove(e) {// 移除单项
      this.$confirm(`是否删除员工 ${e.name}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
      .then(async () => {
        this.loading = true
        let formData = new FormData()
        formData.append("id",e.id)
        await this.$http.post("/index.php/index/user/delPersonnel/",formData).then((res) => {
          if (res.data["code"] === 200) {
            this.fetch().then(()=> {
              this.$message.success(`${res.data["data"]}`)
            })
          } else {
            this.$message.error(`${res.data["data"]}`)
          }
        })
      }).catch((err)=> {
        //
      })
    },
    tableOpen(e) {
      this.detai_value = {}
      this.detai_value = utils.deepClone(e)
      this.table = true;
    },
    // excel导入
    excelImport() {
      var resArr = []
      this.loading_import = true
      this.ShowTableData_excel_crypto = utils.deepClone(this.ShowTableData_excel)
      this.ShowTableData_excel_crypto.forEach(async e=> {
        if (e["entry_date"] != null && e["entry_date"] != '' && e["entry_date"] != undefined) {
          e["entry_date"] = (new Date(e["entry_date"])).getTime()/1000
        }
        if (e["birth_date"] != null && e["birth_date"] != '' && e["birth_date"] != undefined) {
          e["birth_date"] = (new Date(e["birth_date"])).getTime()/1000
        }
        if (e["dimission_date"] != null && e["dimission_date"] != '' && e["dimission_date"] != undefined) {
          e["dimission_date"] = (new Date(e["dimission_date"])).getTime()/1000
        }
        if (e["regular_date"] != null && e["regular_date"] != '' && e["regular_date"] != undefined) {
          e["regular_date"] = (new Date(e["regular_date"])).getTime()/1000
        }
        let formData = new FormData()
        for (const key in e) {
          if (typeof e[key] === 'number') {
            e[key] = e[key].toString()
          }
          e[key] = crypto.cryptoEncrypt_string(e[key])
          formData.append(`${key}`,e[key])
        }
        await this.$http.post('/index.php/index/user/addPersonnel/',formData).then((res) => {
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
          obj.name = e["姓名"]
          obj.gender = e["性别"]
          obj.identity_id = e["身份证号"]
          obj.phone = e["联系方式"]
          obj.entry_date = e["入职时间"]
          obj.department = e["部门"]
          obj.position = e["职位"]
          obj.birth_date = e["出生日期"]
          obj.place = e["籍贯"]
          obj.account_type = e["户口性质"]
          obj.account_address = e["户口地址"]
          obj.now_address = e["现住址"]
          obj.education = e["最高学历"]
          obj.qq = e["QQ号"]
          obj.wechat = e["微信号"]
          obj.contract_period = e["劳动合同期限"]
          obj.regular_date = e["转正日期"]
          obj.emergency = e["紧急联系人"]
          obj.emergency_phone = e["紧急联系人电话"]
          obj.bank_card = e["银行卡"]
          obj.bank_card_num = e["银行卡卡号"]
          obj.dimission = e["是否离职"]
          obj.dimission_date = e["离职日期"]
          obj.index = e["序号"]
          if (obj["birth_date"] != null && obj["birth_date"] != undefined && obj["birth_date"] != '') {
            obj["birth_date"] = this.formatDate(obj["birth_date"], '/')
          }
          if (obj["entry_date"] != null && obj["entry_date"] != undefined && obj["entry_date"] != '') {
            obj["entry_date"] = this.formatDate(obj["entry_date"], '/')
          }
          if (obj["regular_date"] != null && obj["regular_date"] != undefined && obj["regular_date"] != '') {
            obj["regular_date"] = this.formatDate(obj["regular_date"], '/')
          }
          if (obj["dimission_date"] != null && obj["dimission_date"] != undefined && obj["dimission_date"] != '') {
            obj["dimission_date"] = this.formatDate(obj["dimission_date"], '/')
          }
          this.ShowTableData_excel.push(obj)
        })
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
    submitForm(formName) {//表单提交
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (formName === 'new_service_dialog_params') {
            this.new_user_dialog_submit()
          } else {
            this.edit_user_dialog_submit()
          }
        } else {
          return false;
        }
      });
    },
    async search() {// 搜索
      this.loading = true;
      this.useSearchData = true;
      this.currentPage = 1;
      let formData = new FormData();
      formData.append("str",this.searchParams.accurateSearch)
      if (this.searchParams.accurateSearch === null || this.searchParams.accurateSearch === '') {
        this.useSearchData = false;
        this.fetch()
        this.fetchTotal()
      } else {
          await this.$http.post("/index.php/index/Services/search/",formData).then((res) => {
          this.tableData = res.data["data"]
          this.totalNum = res.data["data"].length
          this.ShowTableData =[]
          if (res.data["data"].length <=20) {
            for (let i = 0; i < res.data["data"].length; i++) {
              this.ShowTableData.push(res.data["data"][i])
            }
          } else {
              for (let i = 0; i < 20; i++) {
                this.ShowTableData.push(res.data["data"][i])
              }
          }
          this.loading = false;
        });
      }
      this.tableHeight = utils.setClientHight(this,250,56,53)
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
      formData.append("num",1)
      await this.$http.post("/index.php/index/user/personnelList/",formData).then((res) => {
        var arr_cod = []
        var arr_rt = []
        res.data["data"].forEach(e=> {
          for (const key in e) {
            if (e[key] != null && e[key] != '' && key != 'id') {
              e[key] = crypto.cryptoDecrypt_string(e[key])
            }
          }
          if (e["entry_date"] != null && e["entry_date"] != undefined && e["entry_date"] != '') {
            e["entry_date"] = utils.getLocalTime1(parseInt(e["entry_date"]));
          }
          if (e["birth_date"] != null && e["birth_date"] != undefined && e["birth_date"] != '') {
            e["birth_date"] = utils.getLocalTime1(parseInt(e["birth_date"]));
          }
          if (e["dimission_date"] != null && e["dimission_date"] != undefined && e["dimission_date"] != '') {
            e["dimission_date"] = utils.getLocalTime1(parseInt(e["dimission_date"]));
          }
          if (e["regular_date"] != null && e["regular_date"] != undefined && e["regular_date"] != '') {
            e["regular_date"] = utils.getLocalTime1(parseInt(e["regular_date"]));
          }
          if (e["index"].indexOf('RT') != -1) {
            arr_rt.push(e)
          } else {
            arr_cod.push(e)
          }
        })
        arr_cod.forEach(i => {
          i["index_show"] = i["index"].replace('COD ','')
        })
        arr_rt.forEach(i => {
          i["index_show"] = i["index"].replace('RT ','')
        })
        arr_rt.sort(function(a,b){
          return a.index_show - b.index_show
        })
        arr_cod.sort(function(a,b){
          return a.index_show - b.index_show
        })
        this.tableData = arr_rt.concat(arr_cod)
        this.ShowTableData = this.tableData;
        this.tableHeight = utils.setClientHight(this,250,56,53)
        if (this.ShowTableData.length === 0) {
          this.tableHeight = 120
        }
        this.loading = false;
      });
    },
    async fetchTotal() {//总数获取
      await this.$http.get('/index.php/index/Services/servicesSum/').then((res) => {
        this.totalNum = res.data;
      })
    },
    closeDialog_new() {// 关闭dialog时清空验证
      this.$nextTick(() => {
          this.$refs['new_service_dialog_params'].clearValidate()
      })
    },
    closeDialog_edit() {
      this.$nextTick(() => {
        this.$refs['edit_service_dialog_params'].clearValidate()
      })
    },
    async new_user_dialog_submit() {// 新建提交
      if (this.new_service_dialog_params["line"] === '') {
        this.new_service_dialog_params["line"] = null
      }
      if (this.new_service_dialog_params["wechat"] === '') {
        this.new_service_dialog_params["wechat"] = null
      }
      this.new_loading = true
      let formData = new FormData()
      var data = JSON.stringify(this.new_service_dialog_params)
      formData.append('data',data)
      await this.$http.post('/index.php/index/Services/addServices/',formData).then((res) => {
        this.new_loading = false
        if (res.data["code"] === 200) {
          this.new_service_dialogVisible = false
          this.fetch()
          this.$message.success(`${res.data["data"]}`)
        } else {
          this.$message.error(`${res.data["data"]}`)
        }
      })
    },
    edit_service(e) {// 编辑
      this.edit_service_dialog_params = utils.deepClone(e)
      if (this.edit_service_dialog_params["entry_date"] != null && this.edit_service_dialog_params["entry_date"] != '' && this.edit_service_dialog_params["entry_date"] != undefined) {
        this.edit_service_dialog_params["entry_date"] = (new Date(this.edit_service_dialog_params["entry_date"])).getTime()
      }
      if (this.edit_service_dialog_params["birth_date"] != null && this.edit_service_dialog_params["birth_date"] != '' && this.edit_service_dialog_params["birth_date"] != undefined) {
        this.edit_service_dialog_params["birth_date"] = (new Date(this.edit_service_dialog_params["birth_date"])).getTime()
      }
      if (this.edit_service_dialog_params["dimission_date"] != null && this.edit_service_dialog_params["dimission_date"] != '' && this.edit_service_dialog_params["dimission_date"] != undefined) {
        this.edit_service_dialog_params["dimission_date"] = (new Date(this.edit_service_dialog_params["dimission_date"])).getTime()
      }
      if (this.edit_service_dialog_params["regular_date"] != null && this.edit_service_dialog_params["regular_date"] != '' && this.edit_service_dialog_params["regular_date"] != undefined) {
        this.edit_service_dialog_params["regular_date"] = (new Date(this.edit_service_dialog_params["regular_date"])).getTime()
      }
      this.edit_service_dialogVisible = true
    },
    async edit_user_dialog_submit() { // 编辑提交
      this.edit_loading = true
      var edit_service_dialog_params_deepclone = utils.deepClone(this.edit_service_dialog_params)
      if (edit_service_dialog_params_deepclone["dimission"] === '是') {
        this.userList.forEach(async i=> {
          if (i["zh_name"] === edit_service_dialog_params_deepclone['name'] && i["disable"] === 0) {
            let formData = new FormData()
            formData.append("uid",i.uid)
            formData.append("disable",1)
            await this.$http.post('/index.php/index/User/changeDisable',formData).then((res) => {
              //
            })
          }
        })
      }
      if (edit_service_dialog_params_deepclone["dimission"] === '否') {
        this.userList.forEach(async i=> {
          if (i["zh_name"] === edit_service_dialog_params_deepclone['name'] && i["disable"] === 1) {
            let formData = new FormData()
            formData.append("uid",i.uid)
            formData.append("disable",0)
            await this.$http.post('/index.php/index/User/changeDisable',formData).then((res) => {
              //
            })
          }
        })
      }
      if (edit_service_dialog_params_deepclone["entry_date"] != null && edit_service_dialog_params_deepclone["entry_date"] != '' && edit_service_dialog_params_deepclone["entry_date"] != undefined) {
        edit_service_dialog_params_deepclone["entry_date"] = edit_service_dialog_params_deepclone["entry_date"]/1000
      }
      if (edit_service_dialog_params_deepclone["birth_date"] != null && edit_service_dialog_params_deepclone["birth_date"] != '' && edit_service_dialog_params_deepclone["birth_date"] != undefined) {
        edit_service_dialog_params_deepclone["birth_date"] = edit_service_dialog_params_deepclone["birth_date"]/1000
      }
      if (edit_service_dialog_params_deepclone["dimission_date"] != null && edit_service_dialog_params_deepclone["dimission_date"] != '' && edit_service_dialog_params_deepclone["dimission_date"] != undefined) {
        edit_service_dialog_params_deepclone["dimission_date"] = edit_service_dialog_params_deepclone["dimission_date"]/1000
      }
      if (edit_service_dialog_params_deepclone["regular_date"] != null && edit_service_dialog_params_deepclone["regular_date"] != '' && edit_service_dialog_params_deepclone["regular_date"] != undefined) {
        edit_service_dialog_params_deepclone["regular_date"] = edit_service_dialog_params_deepclone["regular_date"]/1000
      }
      let formData = new FormData()
      for (const key in edit_service_dialog_params_deepclone) {
        if (key === 'id') {
          formData.append("id",edit_service_dialog_params_deepclone["id"])
        } else {
          if (typeof edit_service_dialog_params_deepclone[key] === 'number') {
            edit_service_dialog_params_deepclone[key] = edit_service_dialog_params_deepclone[key].toString()
          }
          edit_service_dialog_params_deepclone[key] = crypto.cryptoEncrypt_string(edit_service_dialog_params_deepclone[key])
          formData.append(`${key}`,edit_service_dialog_params_deepclone[key])
        }
      }
      await this.$http.post('/index.php/index/user/editPersonnel/',formData).then((res) => {
        this.edit_loading = false
        if (res.data["code"] === 200) {
          this.edit_service_dialogVisible = false
          this.fetch()
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
    }
  },
  watch: {
    clientHeight_watch (val) {
      var _this = this;
      _this.tableHeight = utils.setClientHight(_this,250,56,53)
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
