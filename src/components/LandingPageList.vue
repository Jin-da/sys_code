<template>
  <div>
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;min-width:915px;margin-top:80px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap" :disabled="loading">
        <el-form-item label="项目" style="margin-right: 30px">
          <el-select  @change="utils_run" v-model="searchParams.project" placeholder="筛选" clearable style="width:150px">
            <el-option v-for="item in [{value: 'fx',label: '丰胸'}, {value: 'jf',label: '减肥'}, {value: 'bf',label: '白发'}, {value: 'zc',label: '痔疮'}, {value: 'by',label: '鼻炎'}, {value: 'zy',label: '男性'}, {value: 'qb',label: '祛斑'}]" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" style="margin-right: 30px">
          <el-select @change="utils_run" v-model="searchParams.type" placeholder="筛选" clearable style="width:150px">
            <el-option v-for="item in [{value: 'lv',label: '双号'}, {value: 'l',label: '单Line'}, {value: 'v',label: '单微'}]" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="落地页名称" class="noselect" style="margin-right: 30px">
          <el-input @change="utils_run" v-model="searchParams.text" placeholder="筛选" clearable style="width: 150px"></el-input>
        </el-form-item>
        <el-form-item class="noselect">
          <el-button icon="el-icon-plus" v-if="this.authority['createlandingpage']" class="info_btn" @click="newPage()" type="info" style="height: 30px; position: relative;">创建落地页</el-button>
          <el-button icon="el-icon-copy-document" :disabled="this.synchronism_loading" v-if="this.authority['createlandingpage']" class="info_btn" @click="synchronism()" type="info" style="height: 30px; position: relative;">落地页同步</el-button>
          <!-- :icon="{'el-icon-loading':synchronism_loading}" -->
        </el-form-item>
      </el-form>
    </div>
    <!-- 卡片 -->
    <div class="card-div" v-loading="loading">
        <el-card v-for="(item,index) in this.ShowTableData" :key="index" :body-style="{ padding: '0px' }">
          <el-image @click="clickImg(item['content']['value'])" style="cursor: pointer;" :src="item['content']['previewImg']" class="image" lazy></el-image>
          <div style="padding: 14px;">
            <div style="text-align:left;font-weight: bolder;font-size: 15px;">{{item['content']['text']}}</div>
            <div class="bottom clearfix" style="position:relative">
              <div class="des_div">{{item['content']['title']}}</div>
              <div class="des_div">{{item['content']['description']}}</div>
              <div class="time">{{item['content']['uptime']}}</div>
              <!-- v-if="this.authority['editlandingpage']" -->
              <div v-if="authority['editlandingpage']">
                <el-button  type="text" class="button" @click="edit(item)">编辑</el-button>
              </div>
            </div>
          </div>
        </el-card>
        <div v-for="item in this.ShowTableData" :key="item['id']" style="width:280px;heigt:370px;"></div>
    </div>
    <!-- 编辑落地页表单 -->
    <el-dialog :close-on-click-modal="false" title="编辑落地页" :visible.sync="edit_form_dialogVisible" width="450px">
      <el-form label-width="100px" label-position="right" v-loading="edit_form_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="落地页名称" class="noselect" style="margin-right: 40px" prop="ad_title">
              <el-input placeholder="例：减肥-双号-29-01" v-model="edit_form['content']['text']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="落地页标题" class="noselect" style="margin-right: 40px" prop="ad_title">
              <el-input placeholder="可输入任意标题" v-model="edit_form['content']['title']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="落地页描述" class="noselect" style="margin-right: 40px" prop="ad_title">
              <el-input placeholder="可输入任意描述" v-model="edit_form['content']['description']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目" class="noselect" style="margin-right: 40px" prop="country">
              <el-input placeholder="例：jf" v-model="edit_form['project']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="类型" class="noselect" style="margin-right: 40px" prop="country">
              <el-input placeholder="例：lv" v-model="edit_form['content']['type']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="指向文件" class="noselect" style="margin-right: 40px" prop="ad_title">
              <el-input placeholder="例：jf-lv-29-01" v-model="edit_form['content']['value']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="图片路径" class="noselect" style="margin-right: 40px" prop="ad_title">
              <el-input placeholder="例：/static/img/previewImg/jf/jf-line-33.webp" v-model="edit_form['content']['previewImg']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="small" type="primary" @click="edit_form_submit()" class="formSubmitBtn" style="margin-right: -270px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 创建落地页表单 -->
    <el-dialog :close-on-click-modal="false" title="创建落地页" :visible.sync="new_form_dialogVisible" width="450px">
      <el-form label-width="100px" label-position="right" v-loading="new_form_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="落地页名称" class="noselect" style="margin-right: 40px" prop="ad_title">
              <el-input placeholder="例：减肥-双号-29-01" v-model="new_form['content']['text']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="落地页标题" class="noselect" style="margin-right: 40px" prop="ad_title">
              <el-input placeholder="可输入任意标题" v-model="new_form['content']['title']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="落地页描述" class="noselect" style="margin-right: 40px" prop="ad_title">
              <el-input placeholder="可输入任意描述" v-model="new_form['content']['description']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目" class="noselect" style="margin-right: 40px" prop="country">
              <el-input placeholder="例：jf" v-model="new_form['project']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="类型" class="noselect" style="margin-right: 40px" prop="country">
              <el-input placeholder="例：lv" v-model="new_form['content']['type']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="指向文件" class="noselect" style="margin-right: 40px" prop="ad_title">
              <el-input placeholder="例：jf-lv-29-01" v-model="new_form['content']['value']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="图片路径" class="noselect" style="margin-right: 40px" prop="ad_title">
              <el-input placeholder="例：/static/img/previewImg/jf/jf-line-33.webp" v-model="new_form['content']['previewImg']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="日期" class="noselect" style="margin-right: 40px" prop="ad_title">
              <el-input placeholder="例：2021.11.05" v-model="new_form['content']['uptime']" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="small" type="primary" @click="new_form_submit()" class="formSubmitBtn" style="margin-right: -270px" >确 定</el-button>
      </el-form>
    </el-dialog>

    <!-- 同步 -->
    <el-dialog title="同步结果" :visible.sync="synchronism_dialogVisible" width="400px" :close-on-click-modal="false">
      <el-table :max-height="300" :data="synchronism_showTableData" style="position: relative;top:-20px;">
        <el-table-column property="file_name" label="文件"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import crypto from '../crypto.js'
import utils from '../utils'
export default {
  data() {
    return {
      synchronism_loading:false,
      synchronism_dialogVisible:false,
      synchronism_showTableData:[],
      // authority
      authority:{},
      options: null,
      uid:null,
      // 回流key
      key: 0,
      // 加载界面显示与否
      loading: true,
      // 过滤后数据
      ShowTableData: [],
      // 原始数据
      tableData: [],
      //搜索记录
      searchParams: {
        project:'',
        type:'',
        text:''
      },
      // 按钮权限
      buttonAuthority: {
        searchGroupAuthority: true,
        searchNameAuthority: true,
        searchObjectAuthority: true,
      },
      // 编辑落地页
      edit_form_dialogVisible: false,
      edit_form: {
        content: {
          description: null,
          disable: null,
          previewImg: null,
          sequence: null,
          text: null,
          title: null,
          type: null,
          uptime: null,
          value: null,
        },
        delete: null,
        id: null,
        project:null
      },
      // 创建落地页
      new_form_dialogVisible:false,
      new_form: {
        content: {
          description: '无描述',
          disable: false,
          previewImg: 'static/img/previewImg/jf/jf-line-33.webp',
          text: null,
          title: '无标题',
          type: null,
          uptime: null,
          value: null,
        },
        project:null
      },
      edit_form_loading:false,
      new_form_loading:false,
    };
  },

  created() {
    this.getUid()
    this.fetch();
  },

  methods: {
    async synchronism() {
      this.$message.info('同步中')
      this.synchronism_loading = true
      await this.$http.get('/index.php/index/Synchro/ftp/').then((res) => {
        if (res.data["code"] === 200) {
          this.synchronism_showTableData = []
          res.data["data"].forEach(e=> {
            this.synchronism_showTableData.push({"file_name":e})
          })
          this.synchronism_dialogVisible = true
          this.$message.success('已同步')
        } else {
          this.$message.error('同步失败')
        }
        this.synchronism_loading = false
      })
    },
    handleUpdateClick() {// 回流
      this.key += 1 
    },
    clickImg(e) {//图片跳转预览
      window.open(`http://move.icethem01.xyz/landingPage/${e}`)
    },
    getUid() { // 获取用户uid
      this.uid = localStorage.getItem("uid")
      crypto.cryptoDecrypt_string(localStorage.getItem('authority')).split(',').forEach(e=> {
        this.authority[e] = true
      })
    },
    utils_run() {
        var _this = this
        this.ShowTableData = this.tableData// 触发搜索前重新赋值原始数据
        utils.multiplexFilter1(_this,this.searchParams['project'], 'project',2)
        utils.multiplexFilter1(_this,this.searchParams['type'], 'type',2)
        utils.multiplexFilter1(_this,this.searchParams['text'], 'text', 0)
    },
    async fetch() {// 数据获取
      this.loading = true
      let formData = new FormData()
      formData.append("num",1)
      await this.$http.post("/index.php/index/Landingpage/pagelist/",formData).then((res) => {
        res.data["data"].forEach(e=> {
          e["content"] = JSON.parse(e["content"])
          e["content"]["project"] = e["project"] 
          e["content"]["previewImg"] = `http://move.icethem01.xyz/${e["content"]["previewImg"]}`
          if(e['content']['description'] === null || e['content']['description'] === '') {
            e['content']['description'] = '无描述'
          }
          if(e['content']['title'] === null || e['content']['title'] === '') {
            e['content']['title'] = '无标题'
          }
        })
        this.tableData = res.data["data"];
        this.ShowTableData = this.tableData;
        // this.searchParams['project'] = 'fx'
        // this.utils_run()
        this.loading = false;
      });
    },
    edit(e) {
      this.edit_form = utils.deepClone(e)
      this.edit_form_dialogVisible = true
    },
    async edit_form_submit() {
      let formData = new FormData()
      this.edit_form["content"]["previewImg"] = this.edit_form["content"]["previewImg"].replace('http://move.icethem01.xyz/','')
      var data = JSON.stringify(this.edit_form)
      formData.append('data',data)
      this.edit_form_loading = true
      await this.$http.post('/index.php/index/Landingpage/editLanding/',formData).then((res) => {
        if (res.data["code"] === 200) {
          this.edit_form["content"]["previewImg"] = `http://move.icethem01.xyz/${this.edit_form["content"]["previewImg"]}`
          this.edit_form_dialogVisible = false
          this.fetch().then(()=> {
            this.utils_run()
          })
          this.$message.success(`${res.data["data"]}`)
        } else {
          this.$message.error(`${res.data["data"]}`)
        }
        this.edit_form_loading = false
      })
    },
    newPage() {
      let d = new Date()
      this.new_form["content"]["uptime"] = d.toLocaleDateString().replace(/\//g,'.')
      this.new_form_dialogVisible = true
    },
    async new_form_submit() {
      this.new_form_loading = true
      let formData = new FormData()
      var data = JSON.stringify(this.new_form)
      formData.append('data',data)
      await this.$http.post('/index.php/index/Landingpage/addLanding/',formData).then((res)=>{
        this.new_form_loading = false
        if (res.data["code"] === 200) {
          this.new_form_dialogVisible = false
          this.fetch()
          this.synchronism()
          this.$message.success(`${res.data["data"]}`)
        } else {
          this.$message.error(`${res.data["data"]}`)
        }
      })
    }
  },
};
</script>

<style scoped>
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
.el-button.is-disabled {
  color: #C0C4CC!important;
}
.el-button.is-disabled.el-button--text {
  color: #C0C4CC!important;
}
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    right: 0;
    bottom: 0;
    position: absolute;
  }

  .image {
    width: 250px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  
  .clearfix:after {
    clear: both
  }
  .card-div {
    min-height: 500px;
    width: 90%;
    display: flex;
    flex-wrap: wrap;
    margin: auto!important;
    justify-content: space-evenly;
  }
  .el-card {
    width: 250px;
    margin:30px 15px 50px 15px;
  }
  .des_div {
    text-align: left;
    line-height: 20px;
    margin-bottom: 10px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
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
</style>
