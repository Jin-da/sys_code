<template>
  <div >
    <el-table
      highlight-current-row
      :height="tableHeight"
      :key="key"
      stripe
      :header-cell-style="cellStyle2"
      v-loading="loading"
      element-loading-background="rgba(255,255,255,0.5)"
      ref="multipleTable"
      :data="ShowTableData"
      tooltip-effect="dark"
      style="width:calc(100%-60px);line-height:30px;margin:80px 0 25px 0;min-width:1025px;"
      >
      <el-table-column prop="text" label="落地页" min-width="200px"></el-table-column>
      <el-table-column prop="time" label="停留时间(s)" min-width="200px">
        <template slot-scope="scope">
          <div style="display:inline-block">{{scope.row['time']}}</div>
          <el-tooltip v-if="scope.row['time'] > 100" :visible-arrow="false" class="item" effect="dark" content="个别停留时间过长的记录会拉高整体平均停留时间,具体看导出数据" placement="top">
            <el-button
                type="text" icon="el-icon-info"
                size="small"
                style="color:#909399;font-size:15px;display:inline-block;padding:0px!important;position:relative;top:1px;left:2px"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="deep" label="浏览深度" min-width="200px">
      </el-table-column>
      <el-table-column prop="count" label="浏览总数" min-width="200px"></el-table-column>
      <!-- <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button  @click="search(scope.row['landing'])" type="text" size="small">数据导出</el-button>
        </template>
      </el-table-column> -->
      <el-table-column fixed="right" label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-tooltip content="数据导出" placement="top" :visible-arrow="false">
            <el-button @click="search(scope.row['landing'])" icon="el-icon-download" style="font-size:13px;color:grey;padding:0" type="text"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { export_json_to_excel } from '../Export2Excel.js'
import utils from '../utils'
export default {
  data() {
    return {
      key: 0,
      loading: false,
      ShowTableData: [],
      ShowTableData_search:[],
      searchParams: {
        id: null,
      },
      landingPageList: [],
      tableHeight:120
    };
  },

  created() {
    this.fetchLangPage()
    this.fetch()
  },

  methods: {
    getTimeData (timeStamp){
      var date = new Date();
      date.setTime(timeStamp * 1000);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      var h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      var minute = date.getMinutes();
      minute = minute < 10 ? ('0' + minute) : minute;
      var second = date.getSeconds();
      second = second < 10 ? ('0' + second) : second;
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    },
    async fetchLangPage() {
      await this.$http.get('/index.php/index/Point/pageName').then((res) => {
        this.landingPageList = res.data["data"]
      })
    },
    async search(i) {
      this.loading = true;
      let formData = new FormData()
      formData.append('id',i)
      await this.$http.post('/index.php/index/Point/dataList',formData).then((res) => {
        if (res.data.length != 0) {
          res.data["data"].forEach(e => {
            e["content"] = JSON.parse(e["content"])
            e["deep"] = Number(e["content"]["deep"])*100 + '%'
            e["stand"] = e["content"]["stand"]
            e["enterDate"] = this.getTimeData(Number(e["content"]["enterDate"]))
            e["date"] = this.getTimeData(Number(e["content"]["leaveDate"]))
            var showclickArr = []
            if (e["content"]["clickArr"].length != 0) {
              e["content"]["clickArr"].forEach(i=> {
                showclickArr.push(`${i["location"]}:${i["innerHTML"]}`)
              })
            }
            e["showclickArr"] = showclickArr.join(',').replace(/\s+/g,"")
          });
          this.ShowTableData_search = res.data["data"].reverse()
          this.exportExcel()
        } else {
          this.ShowTableData_search = []
        }
        this.loading = false
      })
      this.tableHeight = utils.setClientHight(this,118,56,44)
    },
    async fetch() {
      this.loading = true
      await this.$http.get('/index.php/index/Point/sumList').then((res) => {
        this.loading = false
        this.ShowTableData = res.data["data"].filter(e=> {
          return e["landing"] != null && e["landing"] != 'null'
        })
        this.tableHeight = utils.setClientHight(this,118,56,44)
      })
    },
    exportExcel() {
      var tHeader = ['域名','进入时间','离开时间','停留时间','浏览深度','触发按钮']
      var filterVal = ['domain','enterDate','date','stand','deep','showclickArr']
      var filename = `落地页埋点数据`
      var data = this.formatJson(filterVal, this.ShowTableData_search)
      export_json_to_excel({
        header: tHeader,
        data,
        filename
      })
    },
    cellStyle2({row, column, rowIndex, columnIndex}){
      if (rowIndex === 0) {
        return 'border-top:1px solid #EBEEF5;'
      }
    },
    formatJson(filterVal, delList) {
      return delList.map(v => {
        return filterVal.map(j => {
            return v[j]
          })
        }
      )
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
      _this.tableHeight = utils.setClientHight(_this,118,56,44)
    }
  },
};
</script>

<style scoped>
.el-button--text {
  padding: 0!important;
}
</style>
