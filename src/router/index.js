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

//?????????????????????????????????????????????NavigationDuplicated: Avoided redundant navigation to current location
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
    // ?????????????????????
    // redirect: '/main',
    children: [
      //??????
      { path: '/main', component: Main, name: '??????'},
      //????????????
      { path: '/adlist', component: AdList, name: '????????????'},
      // ????????????
      { path: '/realmnamelist', component: RealmNameList, name: '????????????'},
      { path: '/codrealmnamelist', component: codRealmNameList, name: 'COD????????????'},
      { path: '/stockcontrol', component: StockControl, name: '????????????'},
      { path: '/applicationrestrictions', component: ApplicationRestrictions, name: '????????????'},
      // ??????
      { path: '/accounttable', component: AccountTable, name: '????????????'},
      { path: '/myaccount', component: MyAccount, name: '????????????'},
      { path: '/accountrecharge', component: AccountRecharge, name: '????????????'},
      { path: '/rechargeapproval', component: RechargeApproval, name: '????????????'},
      { path: '/recyclingapproval', component: RecyclingApproval, name: '????????????'},
      // { path: '/consumptiondeclaration', component: ConsumptionDeclaration, name: '????????????'},
      { path: '/accountstatistics', component: AccountStatistics, name: '????????????'},
      { path: '/accountapplicationrestrictions', component: AccountApplicationRestrictions, name: '??????????????????'},
      // ??????
      { path: '/consumptionlist', component: ConsumptionList, name: '????????????'},
      { path: '/rechargedetails', component: RechargeDetails, name: '????????????'},
      { path: '/consumptiondeclaration', component: ConsumptionDeclaration, name: '????????????'},
      { path: '/myconsumption', component: MyConsumption, name: '????????????'},
      { path: '/datastatistics', component: DataStatistics, name: '????????????'},
      // ??????
      { path: '/serviceList', component: ServiceList, name: '????????????'},
      // ?????????
      { path: '/landingpagelist', component: LandingPageList, name: '???????????????'},
      { path: '/tynimceeditor', component: TynimceEditor, name: '????????????'},
      // ??????
      { path: '/eventtrackingdata', component: EventTrackingData, name: '????????????'},
      // ?????????
      { path: '/examinedpagelist', component: ExaminedPageList, name: '???????????????'},
      // ??????
      { path: '/stafflist', component: StaffList, name: '????????????'},
      { path: '/rolelist', component: RoleList, name: '????????????'},
      { path: '/userlist', component: UserList, name: '????????????'},
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
if (to.path === '/') {//????????????
  if (localStorage.getItem('token') && localStorage.getItem('token') !='' ) {
    next({ path: '/main' })
  } else {
    next()
  }
} else {//??????????????????
  // ?????????if??????else
  if (localStorage.getItem('token') !='' && localStorage.getItem('token')) {
  var authority = crypto.cryptoDecrypt_string(localStorage.getItem('authority'))
  authority = authority +',main,404'
  var check = to.path.replace('/','')
  if (authority.indexOf(check) === -1 ) {//?????????????????????????????????to.path????????????(pageA)????????????
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
