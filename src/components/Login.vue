<template>
  <div class="login-container">
    <el-card class="login-card">
      <div slot="header" class="clearfix">
        <span style="font-size:17px">登陆</span>
      </div>
      <el-form v-loading="loading" :rules="rules" ref="model" :model="model" @submit.native.prevent="submitForm('model')">
        <el-form-item label="账号" prop="uid" style="width:320px;margin-left:18px">
          <el-input v-model="model.uid"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" style="width:320px;margin-left:18px;position:relative;top:-15px">
          <el-input type="password" v-model="model.password"></el-input>
        </el-form-item>
        <el-form-item style="position: relative;top: -10px;">
          <el-button class="loginBtn" type="primary" native-type="submit">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
  var reg = new RegExp(/^[a-zA-Z0-9]{1,20}$/)
  var validatePass = (rule, value, callback) => {
    if (!reg.test(value)) {
      callback(new Error('输入字母或数字'));
    }  else {
      callback();
    }
  };
  import crypto from '../crypto.js'
  export default {
    data() {
      return {
        loading:false,
        rules: {
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          uid: [
            { validator: validatePass, trigger: 'blur' }
          ]
        },
        model: {
          password:null,
          uid:null
        },
        group_all:[]
      };
    },
    methods: {
      async login() {
        this.loading = true
        let formData = new FormData()
        formData.append("name",this.model.uid)
        formData.append("password",this.model.password)
        try {
                  await this.$http.post('/index.php/index/login/index/',formData).then((res) => {// 获取数据
        if (res.data["code"] === 200) {
          localStorage.setItem('token', res.data["token"])
          this.loading = false
          this.$message.success('登陆成功');
          localStorage.setItem('uid',res.data["data"]["uid"])
          localStorage.setItem('role',res.data["data"]["role"])
          localStorage.setItem('role_name',res.data["data"]["role_name"])
          var zh_name = res.data["data"]["zh_name"]
          localStorage.setItem('zh_name',zh_name)
          var authority = crypto.cryptoEncrypt_string(res.data["data"]["content"])
          localStorage.setItem('authority',authority)
          this.$router.push('/main')
        } else {
          this.loading = false
          this.$message.error('登陆失败');
          }
        }).then(async ()=>{
          let formData = new FormData()
          formData.append("user",localStorage.getItem('uid'))
          await this.$http.post("/index.php/index/Role/roleList",formData).then((res) => {
            res.data[0].forEach(e=> {
              if (e["id"] == localStorage.getItem("role")) {
                e["group"] = crypto.cryptoEncrypt_string(e["group"])
                localStorage.setItem("group_id",e["group"])
              }
            })
          });
        }).then(async () => {
          await this.$http.get('/index.php/index/Role/groupList').then((res)=> {
            localStorage.setItem('role_list',crypto.cryptoEncrypt_string(res.data["group"]))
            this.traversal_findGroup_options(JSON.parse(res.data["group"]),crypto.cryptoDecrypt_string(localStorage.getItem('group_id')).split(',')[0])
            crypto.cryptoDecrypt_string(localStorage.getItem('group_id')).split(',').forEach(e=> {
              this.traversal_findGroup_options_all(JSON.parse(res.data["group"]),e)
            })
            localStorage.setItem('group_all',crypto.cryptoEncrypt_string(this.group_all.join(',')))
          })
        })
        } catch (error) {
          this.$message.error(error)
          this.loading = false
        }

      },
      traversal_findGroup_options(obj,targetId){//获取分组信息
        var t = targetId
        obj.forEach(e=> {
          if(e["id"] == targetId){
            localStorage.setItem("main_group",crypto.cryptoEncrypt_string(e["group"]))
            return e["group"]
          }
          var _this = this
          for (var a in e) {
            if (a== "children") {
              _this.traversal_findGroup_options(e[a],t)
            }
          }
        })
      },
      traversal_findGroup_options_all(obj,targetId){//获取分组信息
        var t = targetId
        obj.forEach(e=> {
          if(e["id"] == targetId){
            this.group_all.push(e["group"])
            return e["group"]
          }
          var _this = this
          for (var a in e) {
            if (a== "children") {
              _this.traversal_findGroup_options_all(e[a],t)
            }
          }
        })
      },
      submitForm(formName) {//表单提交
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.login()
          } else {
            return false;
          }
        });
      },
    },
  };
</script>

<style scoped>
  .el-button--primary {
    color: white;
    background-color: rgb(53, 54, 57);
    border-color: rgb(53, 54, 57);
  }
  .login-card {
    position: absolute;
    width: 400px;
    height: 340px;
    top: 20%;
    left: 0;
    right: 0;
    margin: auto;
  }
  .loginBtn:hover {
    background-color: #4D4D4D!important;
    color: white!important;
  }
  .el-card__header {
    font-size: 30px!important ;
  }
</style>
