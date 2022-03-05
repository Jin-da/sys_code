import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    clientHeight: 0,
    openTab:[],//所有打开的路由
    activeIndex:'/', //激活状态
    menu: [],//用户权限菜单
    data:{
      content:null,
      filename:null,
      pageName:null,
      pageType:null
    },
    authority:null,
    zh_name:null,
    changeIf:0,
    connectFail:0
  },
  mutations: {
    resizeWidth(state, clientHeight) {
      state.clientHeight = clientHeight;
    },
    //初始化weosocket
    initWebSocket(state,data) {
      var _this = this
      if (typeof WebSocket === "undefined") {
        return false;
      }
      // console.log('WebSocket-tryConnect');
      const wsuri = 'ws://ws.icethem02.xyz'
      this.websock = new WebSocket(wsuri);
      this.websock.onopen = function() {
        // console.log("WebSocket-connectionSucceeded");
        _this.websock.send(data)
      };
      this.websock.onmessage = async function() {
        // console.log('接收到webSocket数据;改变changeIf值');
        _this.state.changeIf = _this.state.changeIf + 1;
        // console.log(_this.state.changeIf);
      },
      this.websock.onerror = function() {
        // console.log('Error: WebSocket-connectionFailed');
      }
      this.websock.onclose = function() {
        // if (localStorage.getItem("role_name") === "admin" || localStorage.getItem("role_name") === "数据部组长" || localStorage.getItem("role_name") === "数据部管理员") {
        //   _this.websock.send('close:admin')
        //   console.log('断开连接 发送数据','close:admin');
        // } else {
        //   _this.websock.send(`close:${localStorage.getItem('uid')}`)
        //   console.log('断开连接 发送数据',`close:${localStorage.getItem('uid')}`);
        // }
        _this.state.connectFail = _this.state.connectFail + 1;
        // console.log('Error: WebSocket-disconnect');
      }
    },
    send(state,data) {
      this.websock.send(data)
      // console.log("发送的数据",data);
    },
        //连接成功
    // websocketonopen() {
    //   console.log("WebSocket连接成功");
    //   if (this.role_name === "admin") {
    //     this.websock.send('admin')
    //     console.log('sendAdmin');
    //   } else {
    //     this.websock.send(this.uid)
    //     console.log('sendUid');
    //   }
    // },
    // 添加tabs
    add_tabs (state, data) {
      this.state.openTab.push(data);
    },
    // 删除tabs
    delete_tabs (state, route) {
      let index = 0;
      for (let option of state.openTab) {
        if (option.route === route) {
          break;
        }
        index++;
      }
      this.state.openTab.splice(index, 1);
    },
    // 设置当前激活的tab
    set_active_index (state, index) {
      this.state.activeIndex = index;
    },
    //将获取到的用户权限菜单json数据存储到vuex里
    storeMenu(state, menu) {
      this.state.menu = menu;
    },
    //存储落地页内容
    storePageContent(state, data) {
      this.state.data = data;
    },
    
    delete_all_tabs(state) {
      state.openTab = []
      // this.state.activeIndex = '/'
    },
    //authority
    storeAuthority(state, data) {
      this.state.authority = data;
    },
    //zh_name
    storeZhname(state, data) {
      this.state.zh_name = data;
    },
  }, 

  actions: {
  },
  modules: {
  }
})
