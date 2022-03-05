import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import crypto from '../crypto.js'
// const ChangePassword = () => import( '../components/ChangePassword.vue')
const AccountTable = () => import( '../components/AccountTable.vue')
const MyAccount = () => import( '../components/MyAccount.vue')
const RecyclingApproval = () => import( '../components/RecyclingApproval.vue')
const AccountStatistics = () => import( '../components/AccountStatistics.vue')
const Login = () => import( '../components/Login.vue')
const To404 = () => import( '../components/404.vue')
const Main = () => import( '../components/Main.vue')
const ConsumptionDeclaration = () => import( '../components/ConsumptionDeclaration.vue')
import AdList from '../components/AdList.vue'
const TynimceEditor = () =>import( '../components/TynimceEditor.vue')
const LandingPageList= () => import( '../components/LandingPageList.vue')
const StockControl= () => import( '../components/StockControl.vue')
const RealmNameList= () => import( '../components/RealmNameList.vue')
const ApplicationRestrictions= () => import( '../components/ApplicationRestrictions.vue')
const AccountApplicationRestrictions= () => import( '../components/AccountApplicationRestrictions.vue')
const RoleList= () => import( '../components/RoleList.vue')
const UserList= () => import( '../components/UserList.vue')
const ServiceList= () => import( '../components/ServiceList.vue')
const ExaminedPageList= () => import( '../components/ExaminedPageList.vue')
const codRealmNameList= () => import( '../components/codRealmNameList.vue')
const AccountRecharge= () => import( '../components/AccountRecharge.vue')
const RechargeApproval= () => import( '../components/RechargeApproval.vue')
const ConsumptionList= () => import( '../components/ConsumptionList.vue')
const MyConsumption= () => import( '../components/MyConsumption.vue')
const StaffList= () => import( '../components/StaffList.vue')
const RechargeDetails= () => import( '../components/RechargeDetails.vue')
const DataStatistics= () => import( '../components/DataStatistics.vue')
const EventTrackingData= () => import( '../components/EventTrackingData.vue')
Vue.use(VueRouter)

//用于避免有冗余路由操作时报错：NavigationDuplicated: Avoided redundant navigation to current location
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      keepAlive: true,
      roles: ['admin', 'user']
    },
    // 默认的显示标签
    // redirect: '/main',
    children: [
      //首页
      { path: '/main', component: Main, name: '首页'},
      //广告列表
      { path: '/adlist', component: AdList, name: '广告列表'},
      // 域名列表
      { path: '/realmnamelist', component: RealmNameList, name: '域名列表'},
      { path: '/codrealmnamelist', component: codRealmNameList, name: 'COD域名列表'},
      { path: '/stockcontrol', component: StockControl, name: '库存管理'},
      { path: '/applicationrestrictions', component: ApplicationRestrictions, name: '申请限制'},
      // 账号
      { path: '/accounttable', component: AccountTable, name: '账号总表'},
      { path: '/myaccount', component: MyAccount, name: '我的账号'},
      { path: '/accountrecharge', component: AccountRecharge, name: '账号充值'},
      { path: '/rechargeapproval', component: RechargeApproval, name: '充值审批'},
      { path: '/recyclingapproval', component: RecyclingApproval, name: '回收审批'},
      // { path: '/consumptiondeclaration', component: ConsumptionDeclaration, name: '消耗申报'},
      { path: '/accountstatistics', component: AccountStatistics, name: '账号统计'},
      { path: '/accountapplicationrestrictions', component: AccountApplicationRestrictions, name: '账号申请限制'},
      // 财务
      { path: '/consumptionlist', component: ConsumptionList, name: '消耗列表'},
      { path: '/rechargedetails', component: RechargeDetails, name: '充值明细'},
      { path: '/consumptiondeclaration', component: ConsumptionDeclaration, name: '消耗申报'},
      { path: '/myconsumption', component: MyConsumption, name: '我的消耗'},
      { path: '/datastatistics', component: DataStatistics, name: '加粉统计'},
      // 客服
      { path: '/serviceList', component: ServiceList, name: '客服列表'},
      // 落地页
      { path: '/landingpagelist', component: LandingPageList, name: '落地页列表'},
      { path: '/tynimceeditor', component: TynimceEditor, name: '页面制作'},
      // 埋点
      { path: '/eventtrackingdata', component: EventTrackingData, name: '埋点数据'},
      // 屏蔽页
      { path: '/examinedpagelist', component: ExaminedPageList, name: '屏蔽页列表'},
      // 用户
      { path: '/stafflist', component: StaffList, name: '员工列表'},
      { path: '/rolelist', component: RoleList, name: '角色列表'},
      { path: '/userlist', component: UserList, name: '用户列表'},
    ],

  },
  {
    path: '/',
    name: 'Login',
    component: Login,
    meta: {
      roles: ['admin', 'user']
    },
  },
  {
    path: '/404',
    name: 'To404',
    component: To404,
    meta: {
      roles: ['user', 'admin']
    }
  },
  {path:'*',redirect: "/404"},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
if (to.path === '/') {//快捷登陆
  if (localStorage.getItem('token') && localStorage.getItem('token') !='' ) {
    next({ path: '/main' })
  } else {
    next()
  }
} else {//进入其他页面
  // ↑插入if中写else
  if (localStorage.getItem('token') !='' && localStorage.getItem('token')) {
  var authority = crypto.cryptoDecrypt_string(localStorage.getItem('authority'))
  authority = authority +',main,404'
  var check = to.path.replace('/','')
  if (authority.indexOf(check) === -1 ) {//权限列表及变量确定后，to.path动态获取(pageA)进行比对
    next({ path: '/404' })
  } else {
    next()
    }
  } else {
    next({ path: '/' })
  }
}
})
export default router
