import Vue from 'vue'
import axios from 'axios'
import { toHierarchy } from '@/js/hierarchy'

var router = function(){
	return new Promise((resolve,reject) => {
		axios.get("static/data/menu.json").then( data => {
			data.data.forEach(v => {
				toComponent(v);
			});
			let menu = toHierarchy(data.data);
			resolve(menu);
		});
	});
}
var toComponent = function (item) {
	var componentPath = item.component,
		COMPONENT_TYPE = "100",
		IFRAME_TYPE = "200",
		WINDOW_TYPE = "300";
	if (item.disabled && item.disabled == "true"){
		item.disabled = true;
	}
	if (item.component && item.type === COMPONENT_TYPE) {
		item.component = require('@/views/' + componentPath + '.vue');
	} else if (item.component && item.type === IFRAME_TYPE) {
		item.component = {
			template: "<div style='overflow: hidden;height:100%;'><iframe width='100%' height='100%' frameBorder='0' src='" + componentPath + "'></iframe></div>"
		}
	} else if (item.component && item.type === WINDOW_TYPE) {
		item.component = {
			template: componentPath
		}
	} else {
		item.component = {
			template: "<div>Unknown type or not set component property</div>"
		}
	};
};

export default router;