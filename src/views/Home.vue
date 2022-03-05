<template>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="auto">
        <el-menu
          unique-opened
          :default-active="$route.path"
          router
          :collapse="isCollapse"
          class="el-menu-vertical-demo noselect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#fff"
        >
          <!-- 根据后端返回的菜单json动态渲染的菜单 -->
          <!-- || group.name === '首页'-->
          <!-- <template v-for="group in menuList">
            <el-submenu v-if="group.children && group.children.length > 0" :key="group.id" :index="group.id" :id="'b'+group.id">
              <template slot="title">
                <i :class="group.icon"></i>
                <span slot="title">{{group.name}}</span>
              </template>
              <el-menu-item v-for="menu in group.children" :key="menu.id" :index="menu.url">
                <i class="icon iconfont icon-pointer" style="vertical-align: baseline;"/>
                {{menu.name}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else :key="group.id" :index="group.url" :id="'a'+group.id">
              <i :class="group.icon"></i>
              <span slot="title">{{group.name}}</span>
            </el-menu-item>
          </template> -->
          <!-- 前端写死的菜单 -->
            <el-menu-item id="a0" index="/main">
            <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </el-menu-item>

          <el-submenu index="1" v-if="this.menuAuthrity.ad">
            <template slot="title">
              <i class="iconfont icon-qitaguanggaoshuju aliiconfont"></i>
              <span>广告</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-if="this.menuAuthrity.adlist" index="/adlist">广告站点列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="2" v-if="menuAuthrity.domainname">
            <template slot="title">
              <i class="el-icon-set-up"></i>
              <span>域名</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/realmnamelist" v-if="menuAuthrity.realmnamelist">域名列表</el-menu-item>
              <el-menu-item index="/codrealmnamelist" v-if="menuAuthrity.codrealmnamelist">COD域名列表</el-menu-item>
              <el-menu-item index="/stockcontrol" v-if="menuAuthrity.stockcontrol">库存管理</el-menu-item>
              <el-menu-item index="/applicationrestrictions" v-if="menuAuthrity.applicationrestrictions">申请限制</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="3" v-if="menuAuthrity.account">
            <template slot="title">
              <i class="iconfont icon-user aliiconfont"></i>
              <span>账号</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/accounttable" v-if="menuAuthrity.accounttable">账号总表</el-menu-item>
              <el-menu-item index="/myaccount" v-if="menuAuthrity.myaccount">我的账号</el-menu-item>
              <el-menu-item index="/accountrecharge" v-if="menuAuthrity.accountrecharge">账号充值</el-menu-item>
              <el-menu-item index="/rechargeapproval" v-if="menuAuthrity.rechargeapproval">充值审批</el-menu-item>
              <el-menu-item index="/recyclingapproval" v-if="menuAuthrity.recyclingapproval">回收审批</el-menu-item>
              <!-- <el-menu-item index="/consumptiondeclaration">消耗申报</el-menu-item> -->
              <el-menu-item index="/accountstatistics" v-if="menuAuthrity.accountstatistics">账号统计</el-menu-item>
              <el-menu-item index="/accountapplicationrestrictions" v-if="menuAuthrity.accountapplicationrestrictions">账号申请限制</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="4" v-if="menuAuthrity.finance">
            <template slot="title">
              <i class="el-icon-bank-card"></i>
              <span>财务</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/consumptionlist" v-if="menuAuthrity.consumptionlist">消耗列表</el-menu-item>
              <el-menu-item index="/rechargedetails" v-if="menuAuthrity.rechargedetails">充值明细</el-menu-item>
              <el-menu-item index="/consumptiondeclaration" v-if="menuAuthrity.consumptiondeclaration">消耗申报</el-menu-item>
              <el-menu-item index="/myconsumption" v-if="menuAuthrity.myconsumption">我的消耗</el-menu-item>
              <el-menu-item index="/datastatistics" v-if="menuAuthrity.datastatistics">加粉统计</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="5" v-if="menuAuthrity.service">
            <template slot="title">
              <i class="el-icon-service"></i>
              <span>客服</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/serviceList" v-if="menuAuthrity.serviceList">客服列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="6" v-if="menuAuthrity.landingpage">
            <template slot="title">
              <i class="el-icon-document"></i>
              <span>落地页</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/landingpagelist" v-if="menuAuthrity.landingpagelist">落地页列表</el-menu-item>
              <!-- <el-menu-item index="/tynimceeditor">页面制作</el-menu-item>
              <el-menu-item index="/404">数据展示</el-menu-item> -->
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="7" v-if="menuAuthrity.eventtracking">
            <template slot="title">
              <i class="el-icon-coordinate"></i>
              <span>埋点</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/eventtrackingdata" v-if="menuAuthrity.eventtrackingdata">埋点数据</el-menu-item>
              <!-- <el-menu-item index="/tynimceeditor">页面制作</el-menu-item>
              <el-menu-item index="/404">数据展示</el-menu-item> -->
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="8" v-if="menuAuthrity.examinedpage">
            <template slot="title">
              <i class="el-icon-document-remove"></i>
              <span>屏蔽页</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/examinedpagelist" v-if="menuAuthrity.examinedpagelist">屏蔽页列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

          <el-submenu index="9" v-if="menuAuthrity.user">
            <template slot="title">
              <i class="el-icon-user"></i>
              <span>用户</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/stafflist" v-if="menuAuthrity.stafflist">员工列表</el-menu-item>
              <el-menu-item index="/userlist" v-if="menuAuthrity.userlist">用户列表</el-menu-item>
              <el-menu-item index="/rolelist" v-if="menuAuthrity.rolelist">角色列表</el-menu-item>
            </el-menu-item-group>
          </el-submenu>

        </el-menu>
      </el-aside>

      <!-- 固定的顶部及主内容 -->
      <el-main style="padding: 0px;position:relative">
        <!-- 首行顶部(侧边栏展示效果及账号的管理) -->
        <el-header class="noselect" style="text-align: right;font-size: 12px;padding-right: 20px;box-shadow: rgb(0 21 41 / 8%) 0px 1px 4px;height: 46px;position: fixed; width: 100%;z-index: 5">
          <div style="font-size: 20px; color: rgb(144, 147, 153)">
            <!-- 侧边栏展示效果按钮 -->
            <i id="menuClose" :class="{ 'iconfont icon-zhankai': isCollapse, 'iconfont icon-shousuo': !isCollapse}" style="height: 55px;font-size: 20px;position: absolute; left: 15px; top: -9px;  color: white!important;" @click="openclose"></i>
          </div>

          <el-tabs v-model="activeIndex" type="card" editable @tab-click="tabClick" @tab-remove="tabRemove" style="margin-left:30px;position:relative;bottom:5px;margin-right:270px;">
            <!-- 单标签 -->
            <el-tab-pane :key="item.name" v-for="item in openTab" :label="item.name" :name="item.route">
            </el-tab-pane>
          </el-tabs>
          
          <!-- 右侧账户管理 -->
          <el-dropdown size="small" trigger="click" style="position: fixed;right: 15px;top:-10px;height:50px"  v-loading.fullscreen.lock="fullscreenLoading">
            <i class="el-icon-arrow-down" style="margin-right: 15px"></i>
            <el-dropdown-menu :visible-arrow="false" slot="dropdown">
              <el-dropdown-item id="logout" style="color:black;background-color:white" @click.native="logout_submit">退出登录</el-dropdown-item>
            </el-dropdown-menu>
              <!-- <el-avatar style="width:30px;height:30px;margin-right:10px;position:relative;top:10px;" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar> -->
            <span>{{zh_name}}</span>
          </el-dropdown>
          
        </el-header>
        
        
        <!-- 标签页标签的存放 实现类似于浏览器保留先前页面的功能 -->
        <!-- <el-header class="noselect" style="box-shadow: rgb(0 21 41 / 8%) 0px 1px 4px; padding-left: 10px;position: fixed; width: 100%;top: 50px;z-index: 4"> -->
          <!-- 标签行 -->
          <!-- <el-tabs v-model="activeIndex" type="card" editable @tab-click="tabClick" @tab-remove="tabRemove"> -->
            <!-- 单标签 -->
            <!-- <el-tab-pane :key="item.name" v-for="item in openTab" :label="item.name" :name="item.route">
            </el-tab-pane>
          </el-tabs> -->
        <!-- </el-header> -->
        
        <!-- 页面组件的插入位置 -->
        
          <transition name="el-fade-in-linear">
            <keep-alive>
            <router-view v-show="show" style="margin:40px 30px 0 30px;"></router-view>
            </keep-alive>
          </transition>
        
        
      </el-main>
    </el-container>
</template>

<script>
import utils from '../utils'
import crypto from '../crypto.js'
export default {
  data() {
    return {
      fullscreenLoading: false,
      menuAuthrity:{
        "ad":false,
        "adlist":false,
        "domainname":false,
        "realmnamelist":false,
        "codrealmnamelist":false,
        "stockcontrol":false,
        "applicationrestrictions":false,
        "account":false,
        "accounttable":false,
        "myaccount":false,
        "accountrecharge":false,
        "rechargeapproval":false,
        "recyclingapproval":false,
        "accountstatistics":false,
        "accountapplicationrestrictions":false,
        "finance":false,
        "consumptionlist":false,
        "consumptiondeclaration":false,
        "myconsumption":false,
        "service":false,
        "serviceList":false,
        "landingpage":false,
        "landingpagelist":false,
        "eventtracking":false,
        "eventtrackingdata":false,
        "examinedpage":false,
        "examinedpagelist":false,
        "user":false,
        "userlist":false,
        "rolelist":false,
        "stafflist":false,
        "rechargedetails":false,
        "datastatistics":false
      },
      uid:null,
      zh_name:null,
      authority:null,
      show: true,
      isCollapse: false,
      activeName: "second",
      menuList: [],
      role_name:null,
      showMsgArr: [],
      userIsCollapse: 0,
      standBy_w: 0
    };
  },

  methods: {
    async logout_submit() {
      this.fullscreenLoading = true
      let formData = new FormData()
      formData.append("uid",this.uid)
      try {
        await this.$http.post('/index.php/index/login/logout/',formData).then((res) => {
          if (res.data["code"] === 200) {
            localStorage.removeItem('token')
            localStorage.removeItem('uid')
            localStorage.removeItem('zh_name')
            localStorage.removeItem('authority')
            localStorage.removeItem('role')
            localStorage.removeItem('group_id')
            localStorage.removeItem('role_name')
            localStorage.removeItem('role_list')
            localStorage.removeItem('main_group')
            localStorage.removeItem('group_all')
            this.$message.success(`${res.data["data"]}`)
            this.$router.push('/')
            this.fullscreenLoading = false
          } else {
            this.$message.error(`${res.data["data"]}`)
            this.fullscreenLoading = false
          }
        })
      } catch (error) {
        this.fullscreenLoading = false
        this.$message.error(error)
      }
    },
    getUserInfo() {
      this.$store.commit("delete_all_tabs");// 清空所有标签避免回退时创建重复标签
      this.$store.commit("add_tabs", { route: this.$route.path, name: this.$route.name });
      this.$store.commit("set_active_index", this.$route.path);
      this.zh_name = localStorage.getItem('zh_name')
      this.authority = crypto.cryptoDecrypt_string(localStorage.getItem('authority'))
      this.uid = localStorage.getItem('uid')
      this.role_name = localStorage.getItem("role_name")
        // for (const key in this.menuAuthrity) {
        //   if (this.authority.indexOf(key) != -1 ) {
        //     this.menuAuthrity[`${key}`] = true
        //   }
        // }
        for (const key in this.menuAuthrity) {
          this.authority.split(',').forEach(e => {
            if (e == key) {
              this.menuAuthrity[`${key}`] = true
            }
          })
        }
    },
    openclose() {
      this.standBy_w = document.documentElement.clientWidth
      if (this.isCollapse === true) {
        this.isCollapse = false;
        this.userIsCollapse = 1
      } else {
        this.isCollapse = true;
        this.userIsCollapse = 1
      }
    },
    handleTabsEdit(targetName, action) {
      if (action === "add") {
        let newTabName = ++this.tabIndex + "";
        this.editableTabs.push({
          title: "New Tab",
          name: newTabName,
          content: "New Tab content",
        });
        this.editableTabsValue = newTabName;
      }
      if (action === "remove") {
        let tabs = this.editableTabs;
        let activeName = this.editableTabsValue;
        if (activeName === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.name === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                activeName = nextTab.name;
              }
            }
          });
        }

        this.editableTabsValue = activeName;
        this.editableTabs = tabs.filter((tab) => tab.name !== targetName);
      }
    },
    tabClick() {//点击标签时的路由跳转
      this.$router.push({ path: this.activeIndex });
    },
    tabRemove(targetName) {//移除标签
      // if (targetName == "/main") {//保留指定页面
      //   return;
      // }
      if (this.openTab.length === 1) {//保留一个
        return;
      }

      this.$store.commit("delete_tabs", targetName);
      if (this.activeIndex === targetName) {
      // 设置当前激活的路由
        if (this.openTab && this.openTab.length >= 1) {
          this.$store.commit(
            "set_active_index",
            this.openTab[this.openTab.length - 1].route
          );
          this.$router.push({ path: this.activeIndex });
        }
        else {
          this.$router.push({ path: "/main" });//修改首页
        }
      }
    },
    async log() {
      let formData = new FormData()
      formData.append("user",this.uid)
      if (this.role_name === "admin"|| this.role_name === "数据部组长" || this.role_name === "数据部管理员") {
        formData.append("role",'admin')
      } else {
        //
      }
      await this.$http.post('/index.php/index/account/showMsg/',formData).then((res) => {
        res.data["data"].forEach(e=> {
          if (this.showMsgArr.indexOf(e["id"]) === -1) {
            this.showMsgArr.push(e["id"])
            setTimeout(() => {
              var _this = this
                _this.$notify.info({
                  title: '新通知',
                  message: `${e["send_zh_name"]}${e["content"]}`,
                  duration: 0,
                  onClose() {
                    _this.pushClose(e["id"])
                    _this.delItems(_this.showMsgArr,e["id"])
                  }
                });
            }, 1000);
          }
        })
      })
    },
    delItems(arr,txt) {
      for (let i = 0; i < arr.length; i++) {
        if (txt === arr[i]) {
          arr.splice(i,1)
          return false
        }
      }
    },
    async pending() {
      if (this.role_name === "admin"|| this.role_name === "数据部组长" || this.role_name === "数据部管理员" ) {
        await this.$http.get('/index.php/index/account/pending/').then((res) => {
          if (res.data["sum"]>0) {
            setTimeout(() => {
              var _this = this
              _this.$notify.info({
                title: '新通知',
                message: `有${res.data["sum"]}个回收申请待审批`,
                duration: 0,
              });
            }, 1000);
          }
      })
      }
    },
    async pending_recharge() {
      if (this.role_name === "admin"|| this.role_name === "数据部组长" || this.role_name === "数据部管理员" ) {
        await this.$http.get('/index.php/index/account/paySum/').then((res) => {
          if (res.data["sum"]>0) {
            setTimeout(() => {
              var _this = this
              _this.$notify.info({
                title: '新通知',
                message: `有${res.data["sum"]}个充值申请待处理`,
                duration: 0,
              });
            }, 1000);
          }
      })
      }
    },
    connectWebsocket() {
      // console.log(this.role_name);
      if (this.role_name === "admin" || this.role_name === "数据部组长" || this.role_name === "数据部管理员") {
        this.$store.commit("initWebSocket",'admin');
      } else {
        this.$store.commit("initWebSocket",this.uid);
      }
    },
    pushClose(e) {
      let formData = new FormData()
      formData.append("id",e)
      this.$http.post('/index.php/index/account/hiddenMsg/',formData).then((res) => {
        //
      })
    },
  },

  computed: {
    monitor() {
      return this.$store.state.changeIf
    },
    monitor2() {
      return this.$store.state.connectFail
    },
    openTab() {
      return this.$store.state.openTab;
    },
    activeIndex: {
      get() {
        return this.$store.state.activeIndex;
      },
      set(val) {
        this.$store.commit("set_active_index", val);
      },
    },
  },

  watch: {
    monitor() {
      // console.log('changIf变化，发送网络请求');
      this.log()
    },
    monitor2() {
      this.connectWebsocket()
    },
    $route(to) {
      //判断路由是否已经打开
      //已经打开的 ，将其置为active
      //未打开的，将其放入队列里
      let flag = false;
      for (let item of this.openTab) {
        if (item.name === to.name) {
          this.$store.commit("set_active_index", to.path);
          flag = true;
          break;
        }
      }
      if (!flag) {
        this.$store.commit("add_tabs", { route: to.path, name: to.name });
        this.$store.commit("set_active_index", to.path);
      }
    },
  },
  mounted() {
    var _this = this;
    setInterval(() => {
      utils.setIsCollapse(_this)
    }, 1000);
  },
  created() {
    this.getUserInfo()
    this.pending()
    this.pending_recharge()
    this.connectWebsocket()
  },
};
</script>

<style>
.el-loading-spinner .path {
    stroke: rgba(41,42,45,0.4)!important;
}
.el-loading-spinner i {
    color: rgb(25,25,25)!important;
}
  .el-menu-vertical-demo:first-child {
    background-color: rgb(41,42,45)!important;
  }
  .el-submenu__title {
    text-align: left;
    color: #cecece!important;
    background-color: rgb(41,42,45)!important;
  }
  .el-menu-item {
    color: #cecece!important;
    background-color: rgb(53,54,57)!important;
    text-align: left;
    padding-left: 50px!important;
  }
  .el-menu-item:hover {
    color: white!important;
    background-color: rgb(64, 65, 68)!important;
    text-align: left;
    padding-left: 50px!important;
  }
  .el-input__inner:focus {
    border-color: #409EFF !important;
  }
  .el-range-editor.is-active, .el-range-editor.is-active:hover {
    border-color: #409EFF !important;
  }
  .el-pager li.active  {
    color: white;
  }
  .el-pagination.is-background .el-pager li:not(.disabled).active {
    background-color: rgb(77,77,77)!important;
    color: #FFF;
    border-color: rgb(77, 77, 77)!important;
    border: 1px solid;
  }
  .el-dialog {
    border-radius: 4px!important;
  }
  .el-message-box {
    word-wrap:break-word!important;
  }
  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -khtml-user-select: none; /* Konqueror */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently not supported by any browser */
  }
  .el-tabs__nav-scroll{
    height: 50px;
  }
  .is-top {
    height: 50px!important;
  }
  .el-tabs__nav-prev,.el-tabs__nav-next {
    top:10px;
  }
  .el-tabs__new-tab {
    display: none;
  }
  .el-tabs__header {
    border-bottom: none !important;
  }
  .el-tabs__item {
    color: #cecece!important;
    position: relative;
    top: 1px;
    height: 34px!important;
    line-height: 31px!important;
    border-left: none!important;
    background-color: rgb(25,25,25);
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .el-tabs__item:hover {
    color: #cecece!important;
    cursor: pointer;
  }
  .el-tabs__item.is-active {
    background-color: rgb(77, 77, 77) !important;
    color: white !important;
    box-shadow: none!important;
  }
  .el-tabs__nav {
    border: none !important;
  }
  .el-tabs__content {
    display: none;
  }
  .el-tabs__header {
    border: none;
    margin: 0;
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  #menuClose:hover {
    cursor: pointer;
  }
  .el-menu-item-group__title {
    display: none;
  }
  .is-active {
    background-color: rgb(77, 77, 77) !important;
    color: white!important;
    border-bottom-color:rgb(41,42,45)!important;
  }
  .el-header {
    background-color: rgb(25,25,25);
    color: #333;
    text-align: center;
    line-height: 65px;
  }
  .el-aside {
    margin-top: 46px;
    background-color: rgb(41,42,45)!important;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  .el-main {
    margin-top: 0;
    background-color: #fff;
    color: #333;
    text-align: center;
  }
  .el-container {
    position: absolute;
    width: 100%;
    top: 0px;
    left: 0;
    bottom: 0;
    background-color: rgb(25,25,25)!important;
  }
  .el-header .fr {
    float: right;
  }
  .el-header .el-menu {
    border-bottom: none;
  }
  .el-aside {
    background: #545c64;
  }
  .el-aside .el-menu {
    border-right: none;
  }
  .el-range-separator {
    padding: 0!important;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    left: -25px!important;
  }
  .avatar-uploader .el-upload:hover {
    border-color: rgb(64,158,255)!important;
  }
  .avatar-uploader-icon {
    margin-top: -2px;
    color: #8c939d;
    width: 136px;
    height: 45px;
    line-height: 45px;
    text-align: center;
    position: relative;
    left: -15px;
  }
  .avatar {
    margin-top: -2px;
    width: 136px;
    height: 45px;
    display: block;
    object-fit: cover;
  }
  .image-slot{
        line-height: 58px!important;
    }
  .el-dropdown {
    color: white!important;
  }
  .el-icon-close:hover {
    line-height: 14px!important;
  }
  .el-icon-close {
    line-height: 14px!important;
  }
  .aliiconfont {
    margin: 0 8px 0 4px;
  }
  .tox .tox-dialog--width-lg {
    height: 650px!important;
    max-width: 810px!important;
  }
    /* .tox .tox-dialog-wrap__backdrop {
      background-color: rgba(128,128,128, 0.8)!important;
    } */
  .cell {
    overflow: hidden!important;
  white-space: nowrap!important;
  text-overflow: ellipsis!important;
  }
  .el-tree-node {
    width: 220px;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: rgba(0,0,0,0)!important;
    border: none!important;
  }
  .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner {
    background-color: rgba(0,0,0,0)!important;
    border: none!important;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after{
    border-color: #606266!important;
  }
    .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner::before {
    background-color: #606266!important;  
    }
  #a0 {
    background-color: rgb(41,42,45)!important;
    padding-left: 20px!important;
    text-align: left;
  }
  #logout:hover {
    background-color: #606266!important;
    color: white!important;
  }
  .is-plain {
  background-color: white !important;
  color: #606266 !important;
}
.is-plain:hover {
  background-color: rgb(77, 77, 77) !important;
  border-color: rgb(77, 77, 77) !important;
  color: white !important;
}
.is-plain:disabled {
  background-color: white!important;
  border-color: #DCDFE6!important;
  color: #DCDFE6 !important;
}
.el-table td {
  padding: 10px 0!important;
}
.el-message-box {
      position: relative;
    top: -10%;
}
/* 级联选择器样式 */
/* .el-cascader-node.in-active-path {
    background-color: #4D4D4D !important;
    color: white!important;
    border-bottom-color:#4D4D4D!important;
  }
  .el-cascader-node:not(.is-disabled):focus, .el-cascader-node:not(.is-disabled):hover {
    background-color: #4D4D4D !important;
    color: white!important;
} */
.el-cascader-node.is-active {
  background-color: white!important;
  color: #409EFF!important;
}
  /* .el-select-dropdown__item.selected {
  color: rgb(41, 42, 45) !important;
      font-weight: 700;
  } */
.el-notification {
  border-radius: 5px!important;
}
.el-image__inner, .el-image__preview {
    object-fit:contain!important
}
  /* .el-upload-dragger {
    width: 136px!important;
    height: 45px!important;
  } */
  /* .el-loading-mask {
    border: 1px solid #F5F7FA!important;
  } */
/* loading */
/* .el-loading-spinner{
  background-image:url('../assets/loading.gif');
  background-repeat: no-repeat;
  background-size: 50px 50px;
  height:100px;
  width:100%;
  background-position:center;
  top:40%;
}
.el-loading-spinner .circular {
  display: none;
}

.el-loading-spinner .el-loading-text{
  margin:85px 0px; 
} */
</style>

