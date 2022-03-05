<template>
  <div >
    <!-- 表格 -->
    <el-table
      highlight-current-row
      :cell-style="{padding:'10px 0!important'}"
      :header-cell-style="cellStyle2"
      :height="tableHeight"
      v-loading="loading"
      element-loading-background="rgba(255,255,255,0.5)"
      ref="multipleTable"
      :data="ShowTableData"
      tooltip-effect="dark"
      style="width:calc(100%-60px);line-height:30px;margin:80px 0px 0px 0px;min-width:1035px;">
      <el-table-column prop="uid" label="ID"></el-table-column>
      <el-table-column prop="zh_name" label="用户"></el-table-column>
      <el-table-column prop="domain_today_limit" label="今日申请数量"></el-table-column>
      <el-table-column prop="domain_limit" label="总申请数量"></el-table-column>
      <el-table-column prop="site_today_limit" label="每天申请限制数"></el-table-column>
      <el-table-column prop="site_limit" label="总申请限制数"></el-table-column>
      <!-- <el-table-column label="操作" width="300px">
        <template slot-scope="scope">
          <el-button style="padding:0 0 0 9px;" @click="changeLimit(scope.row)" type="text" size="small">修改限制</el-button>
        </template>
      </el-table-column> -->
            <el-table-column fixed="right" label="操作" align="center" width="120px">
        <template slot-scope="scope">
          <el-tooltip content="修改限制" placement="top" :visible-arrow="false">
            <el-button  @click="changeLimit(scope.row)" icon="el-icon-edit" style="font-size:13px;color:grey;padding:0" type="text"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改限制" :visible.sync="changeLimit_dialogVisible" width="400px" :close-on-click-modal="false">
      <el-form label-width="120px" label-position="right" v-loading="edit_loading">
        <el-row>
          <el-col :span="24">
            <el-form-item label="每日申请限制数" class="noselect" style="margin-right: 40px">
              <el-input-number style="width:220px;" v-model="changeLimit_submit_params.site_today_limit" :min="0" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item label="总申请限制数" class="noselect" style="margin-right: 40px">
              <el-input-number style="width:220px;" v-model="changeLimit_submit_params.site_limit" :min="0" :max="100"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button @click="changeLimit_submit" size="small" type="primary" class="formSubmitBtn" style="margin-right:-220px">确 定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import utils from '../utils'
export default {
  data() {
    return {
      tableHeight:620,
      edit_loading:false,
      loading: true,
      // 过滤后数据
      ShowTableData: [],
      // 原始数据
      tableData: [],
      //表单
      changeLimit_dialogVisible:false,
      changeLimit_submit_params: {
        user:null,
        site_today_limit:null,
        site_limit:null
      }
    };
  },

  created() {
    this.fetch();
  },

  methods: {
    async fetch() {// 数据获取
      this.loading = true
      let formData = new FormData()
      formData.append("user",1000)
      await this.$http.get("/index.php/index/domain/userList/",formData).then((res) => {
        this.ShowTableData = res.data
        this.loading = false;
      });
      this.tableHeight = utils.setClientHight(this,118,56,44)
    },
    changeLimit(e) {
      this.changeLimit_submit_params.user = e.uid
      this.changeLimit_submit_params.site_today_limit = e.site_today_limit
      this.changeLimit_submit_params.site_limit = e.site_limit
      this.changeLimit_dialogVisible = true
    },
    cellStyle2({row, column, rowIndex, columnIndex}){
      if (rowIndex === 0) {
        return 'border-top:1px solid #EBEEF5;'
      }
    },
    async changeLimit_submit() {
      this.edit_loading = true
      let formData = new FormData()
      formData.append('user',this.changeLimit_submit_params.user)
      formData.append('site_today_limit',this.changeLimit_submit_params.site_today_limit)
      formData.append('site_limit',this.changeLimit_submit_params.site_limit)
      await this.$http.post('/index.php/index/domain/changelimit/',formData).then((res)=> {
        if (res.data > 0) {
          this.$message({
            type: "success",
            message: "修改成功",
          });
          this.fetch()
          this.changeLimit_dialogVisible = false
        } else {
            this.$message({
              type: "error",
              message: "修改失败",
          });
        }
        this.edit_loading = false
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
    _this.tableHeight = utils.setClientHight(_this,118,56,44)
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
.el-cascader-node>.is-active {
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
</style>
