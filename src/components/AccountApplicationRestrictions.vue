<template>
  <div>
    <!-- 搜索框 -->
    <div style="display: flex;position:relative;min-width:915px;margin-top:80px">
      <el-form size="mini" :inline="true" class="demo-form-inline" style="display: flex; flex-wrap: wrap" :disabled="loading">
        <el-form-item>
          <div style="text-align: left; margin-bottom: 5px">筛选</div>
          <el-cascader
            v-model="showChoose"
            :options="options"
            @change="handleChange">
          </el-cascader>
        </el-form-item>
        <!-- <el-form-item class="noselect">
          <el-button disabled class="info_btn" type="info" style="height: 30px; position: relative; margin-top: 32px">操作按钮</el-button>
        </el-form-item> -->
      </el-form>
    </div>

    <!-- 表格 -->
    <el-table
      :key="key"
      stripe
      v-loading="loading"
      element-loading-background="rgba(255,255,255,0.5)"
      :data="ShowTableData"
      :row-style="{height: '50px'}"
      tooltip-effect="dark"
      style="width:1001px;line-height:30px;margin:25px 0px;min-width:750px"
      border>
      <el-table-column label="限额" width="250px">
        <template slot-scope="scope">
          <div style="color:#909399;font-size:14px;font-family: Avenir, Helvetica, Arial, sans-serif;font-weight:bolder">{{scope.row["limit"]}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="member_limit" label="组员每日最大领取数量" width="250px">
        <template slot-scope="scope">
          <el-input v-on:click.native="handleClick(scope.row['member_limit'])" @blur="onInputBlur(scope.row['member_limit'])" style="width:150px" v-model="scope.row['member_limit']"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="leader_limit" label="组长最大分配数量" width="250px">
        <template slot-scope="scope">
          <el-input v-on:click.native="handleClick(scope.row['leader_limit'])" @blur="onInputBlur(scope.row['leader_limit'])" style="width:150px" v-model="scope.row['leader_limit']"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="可用数量" width="250px">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
var reg = new RegExp(/^[0-9]{1,4}$/)
export default {
  data() {
    return {
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
      options:[],
      showChoose:[],
      standBy_input:null,
      standBy_id:null,
      standBy_sum:null,
    };
  },

  created() {
    this.getUid()
    this.fetch();
  },

  methods: {
    handleClick(v) {
      this.standBy_input = v
    },
    async onInputBlur(v) {
      if (this.standBy_input === v) {
        //
      } else if (!reg.test(v)) {
        this.$message.error('输入格式错误')
      } else {
        var data = {}
        data["id"] = this.standBy_id
        data["leader_other"] = this.ShowTableData[0]["leader_limit"]
        data["other"] = this.ShowTableData[0]["member_limit"]
        data["leader_limit25"] = this.ShowTableData[1]["leader_limit"]
        data["limit25"] = this.ShowTableData[1]["member_limit"]
        data["leader_limit50"] = this.ShowTableData[2]["leader_limit"]
        data["limit50"] = this.ShowTableData[2]["member_limit"]
        data["leader_limit250"] = this.ShowTableData[3]["leader_limit"]
        data["limit250"] = this.ShowTableData[3]["member_limit"]
        data["leader_not_limit"] = this.ShowTableData[4]["leader_limit"]
        data["not_limit"] = this.ShowTableData[4]["member_limit"]
        data["card_type"] = this.showChoose[0]
        data["group_type"] = this.showChoose[1]
        let formData = new FormData()
        formData.append('data',JSON.stringify(data))
        await this.$http.post('/index.php/index/Account/editLImit/',formData).then((res) => {
          if (res.data["code"] === 200) {
            this.$message.success(`${res.data["data"]}`)
          } else {
            this.$message.error(`${res.data["data"]}`)
          }
          var stand = this.showChoose
          this.fetch().then(()=> {
            this.handleChange(stand)
          })
        })
      }
    },
    handleChange(e) {
      this.showChoose = e
      this.tableData.forEach(i=> {
        if (i["card_type"] === e[0] && i["group_type"] === e[1]) {
          this.ShowTableData = this.changeShowWay(i)
        }
      })
    },
    getUid() { // 获取用户uid
      this.uid = localStorage.getItem("uid")
    },
    async fetch() {// 数据获取
      this.loading = true
      await this.$http.get("/index.php/index/Account/apportion/").then((res) => {
        this.standBy_sum = res.data["sum"]
        var getOptions = []
        var getFatherOptions = []
        res.data["data"].forEach(e => {
          if (getOptions.indexOf(e["card_type"]) === -1) {
            getOptions.push(e["card_type"])
          }
        });
        for (let i = 0; i < getOptions.length; i++) {
          var fatherOptions = {}
          fatherOptions["value"] = getOptions[i]
          fatherOptions["label"] = getOptions[i]
          fatherOptions["children"] = []
          getFatherOptions.push(fatherOptions)
        }
        getFatherOptions.forEach(e=> {
          res.data["data"].forEach(i=> {
            if (i["card_type"] === e["value"]) {
              var childrenOptions = {}
              childrenOptions["value"] = i["group_type"]
              childrenOptions["label"] = i["group_type"]
              e["children"].push(childrenOptions)
            }
          })
        })
        this.options = getFatherOptions
        this.tableData = res.data["data"]
        this.ShowTableData = this.changeShowWay(this.tableData[0])
        this.showChoose =[]
        this.showChoose.push(this.tableData[0]["card_type"],this.tableData[0]["group_type"])
        this.loading = false
      });
    },
    changeShowWay(e) {
      var arr = []
      // 其他
      this.standBy_id = e["id"]
      var obj_other = {"limit":"其他","leader_limit":e["leader_other"],"member_limit":e["limit_other"],"num_characteristic":"其他","num":0}
      var obj_25 = {"limit":"限额25","leader_limit":e["leader_25"],"member_limit":e["limit_25"],"num_characteristic":"25","num":0}
      var obj_50 = {"limit":"限额50","leader_limit":e["leader_50"],"member_limit":e["limit_50"],"num_characteristic":"50","num":0}
      var obj_250 = {"limit":"半限额","leader_limit":e["leader_250"],"member_limit":e["limit_250"],"num_characteristic":"半限额","num":0}
      var obj_notLimit = {"limit":"不限额","leader_limit":e["leader_not"],"member_limit":e["limit_not"],"num_characteristic":"不限额","num":0}
      arr.push(obj_other,obj_25,obj_50,obj_250,obj_notLimit)
      for (const key in this.standBy_sum) {
        if (e["card_type"] == key) {
          for (const key1 in this.standBy_sum[key]) {
            arr.forEach(e=> {
              if (e["num_characteristic"] === key1) {
                e["num"] = this.standBy_sum[key][key1]
              }
            })
          }
        }
      }
      return arr
    },
  },
};
</script>

<style scoped>
  .el-dropdown-menu__item {
    text-align: center;
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
