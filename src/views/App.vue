<template>
  <el-row class="container">
		<el-col :span="24" class="header" v-if="mode != 'vertical'">
			<transition v-on:enter="enter" v-on:leave="leave" v-on:after-leave="afterLeave">
				<el-col :span="4" class="logo" v-show="!collapsed" :style="{ width: logoWidth + 'px' , border:mode == 'top' ? 'none' : null }">{{sysName}}</el-col>
			</transition>
			<el-col :span="16">
				<div class="tools" @click.prevent="collapse" v-if="mode != 'top'">
					<i class="fa fa-align-justify"></i>
				</div>
				<aside v-if="mode == 'top'" class="top-menu" :style="{left:menuLeft,right:menuRight}">
					<!--导航菜单-->
					<el-menu :default-active="$route.path" class="el-menu-vertical-demo"
							 unique-opened router :collapse="collapsed" mode="horizontal"
							 :background-color="bgColor"
							 :text-color="textColor"
							 :active-text-color="atColor">
						<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
							<el-submenu :index="index+''" v-if="!item.leaf" :key="item.id">
								<template slot="title"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>
								<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden" :disabled="child.disabled">
									<div @click="clickMenu($event,child)">{{child.name}}</div>
								</el-menu-item>
							</el-submenu>
							<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path" :key="item.id" :disabled="item.children[0].disabled">
								<i :class="item.iconCls"></i>
								<span style="display: inline-block;width: 100%;" @click="clickMenu($event,item.children[0])">{{item.children[0].name}}</span>
							</el-menu-item>
						</template>
					</el-menu>
				</aside>
			</el-col>
			<el-col :span="4" class="userinfo">
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside v-if="mode != 'top'" :style="{background:bgColor}">
				<!--导航菜单-->
				<el-menu :default-active="$route.path" class="el-menu-vertical-demo"
					 unique-opened router :collapse="collapsed"
					:background-color="bgColor"
					:text-color="textColor"
					:active-text-color="atColor">
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<el-submenu :index="index+''" v-if="!item.leaf" :key="item.id">
							<template slot="title"><i :class="item.iconCls"></i><span slot="title">{{item.name}}</span></template>
							<el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" v-if="!child.hidden" :disabled="child.disabled">
								<div @click="clickMenu($event,child)">{{child.name}}</div>
							</el-menu-item>
						</el-submenu>
						<el-menu-item v-if="item.leaf&&item.children.length>0" :key="item.id" :index="item.children[0].path" :disabled="item.children[0].disabled">
							<i :class="item.iconCls"></i>
							<span style="display: inline-block;width: 100%;" @click="clickMenu($event,item.children[0])">{{item.children[0].name}}</span>
						</el-menu-item>
					</template>
				</el-menu>
			</aside>
			<section class="content-container" id="mainRegionContainer">
					<div class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</div>
			</section>
		</el-col>
	</el-row>
</template>

<script>
import { MenuData } from "@/js/menu";
import SYSCONFIG from "@/config";
import $ from "jquery";

export default {
  name: "app",
  data() {
    return {
      sysName: SYSCONFIG.title,
      sysLogo: SYSCONFIG.logo,
      mode: SYSCONFIG.menu.menuMode,
      bgColor: SYSCONFIG.menu.backgroundColor,
      textColor: SYSCONFIG.menu.textColor,
      atColor: SYSCONFIG.menu.activeTextColor,
      logoWidth: SYSCONFIG.logoWidth,
      menuLeft: SYSCONFIG.menu.menuLeft,
      menuRight: SYSCONFIG.menu.menuRight,
      collapsed: false,
      sysUserName: "",
      sysUserAvatar: ""
    };
  },
  mounted: function() {
    var vm = this;
    if (this.$cookies.get("token")) {
      this.$store.commit("setUserName", this.$cookies.get("userName")); //设置用户名示例
    } else {
      this.$router.push({ path: "/login" });
    }

    if (this.mode == "vertical") {
      $(".main").css({ top: "0px" });
    }
    this.reHeight();
    window.onresize = function() {
      vm.reHeight();
    };
    this.sysUserName = this.$store.getters.getUserName;
  },
  methods: {
    reHeight: function() {
      var el = document.getElementById("mainRegionContainer");
      if (el)
        this.$store.dispatch(
          "reMainRegionHeight",
          document.getElementById("mainRegionContainer").offsetHeight
        );
    },
    //退出登录
    logout: function(event) {
      event.preventDefault();
      this.$cookies.remove("token");
      this.$router.push({ path: "/login" });
    },
    //折叠导航栏
    collapse: function() {
      this.collapsed = !this.collapsed;
    },
    enter: function(el) {
      $(el).animate({ width: this.logoWidth + "px" }, 300);
      $(el).html(this.sysName);
    },
    leave: function(el) {
      $(el).animate({ width: "64px" }, 300);
    },
    afterLeave: function(el) {
      var vm = this;
      $(el).show();
      setTimeout(function(){
        $(el).html(`<img src=${require("@/assets/" + vm.sysLogo)} />`);
      }, 300);
    },
    clickMenu: function(event, item) {
      if (item.type == "300") {
        event.stopPropagation();
        window.open(item.component.template);
      }
    }
  }
};
</script>

<style>
#app .top-menu {
  position: absolute;
  right: 100px;
}
#app i {
  color: inherit;
}
.title-enter-active,
.title-leave-active {
  transition: width 2s;
}
.title-enter,
.title-leave-to {
  width: 60px;
}
</style>
