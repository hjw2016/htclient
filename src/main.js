// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import menu from './js/menu'
import store from "./store";
import './css/main.css';
import VueCookies from 'vue-cookies'
import monitor from "@/components/Monitor"
import mappanel from "@/components/Mappanel"
import axios from "axios"
import 'font-awesome/css/font-awesome.css'

Vue.use(Router)
Vue.use(ElementUI)
Vue.use(VueCookies)
Vue.config.productionTip = false

Vue.component('monitor', monitor);
Vue.component('mappanel', mappanel);

Vue.prototype.$http = axios;

axios({
	method: "post",
	url: "shanhong/login!login",
	params: { loginname: "admin", password: "5E5DFD72CA27F335498A27B9F924020E" }
})
/* eslint-disable no-new */

menu().then(data => {
	var router = new Router({
		hashbang: true,
		history: false,
		routes: data
	});

	new Vue({
		el: '#app',
		router,
		store,
		template: '<div id="app"><router-view></router-view></div>'
	})

})

