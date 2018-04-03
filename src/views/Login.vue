<template>
<div>
  <div class="logindiv">
    <div class="header">水利工程建设全过程动态管理系统</div>
    <el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="demo-ruleForm login-container">
      <h3 class="title">系统登录</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm2.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
        <!--<el-button @click.native.prevent="handleReset2">重置</el-button>-->
      </el-form-item>
    </el-form>
  </div>
  <Footer></Footer>
</div>
</template>

<script>
import Footer from "@/components/Footer.vue";
export default {
  data() {
    return {
      logining: false,
      ruleForm2: {
        account: "",
        checkPass: ""
      },
      rules2: {
        account: [
          { required: true, message: "请输入账号", trigger: "blur" }
          //{ validator: validaePass }
        ],
        checkPass: [
          { required: true, message: "请输入密码", trigger: "blur" }
          //{ validator: validaePass2 }
        ]
      },
      checked: true
    };
  },
  methods: {
    handleReset2() {
      this.$refs.ruleForm2.resetFields();
    },
    handleSubmit2(ev) {
      //记住密码
      if (this.checked == true) {
        localStorage.setItem("account", JSON.stringify(this.ruleForm2));
      } else {
        localStorage.removeItem("account");
      }

      this.$refs.ruleForm2.validate(valid => {
        if (valid) {
          this.logining = true;
          var userName = this.ruleForm2.account;
          var password = this.ruleForm2.checkPass;

          //演示不进行后台
          this.$cookies.set("token", "myToken");
          this.$cookies.set("userName", userName);
          this.$router.push({ path: "/" });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  },
  mounted: function() {
    let account = localStorage.getItem("account");
    if (account) {
      this.ruleForm2 = JSON.parse(account);
    }
  },
  components: {
    Footer
  }
};
</script>

<style scoped>
.login-container {
  /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;

  background-clip: padding-box;
  margin: 10px auto 180px;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
.login-container .title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
.login-container .remember {
  margin: 0px 0px 35px 0px;
}
.header {
  text-align: center;
  margin: 100px auto 20px;
  font-size: 50px;
  background: none;
}
.logindiv {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  position: absolute;
  background-size: 100% 100%;
  background-image: url("../assets/background.png");
}
</style>
