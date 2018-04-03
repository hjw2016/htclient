// by hjw 一些辅助方法
// 2018/02/28
// 
import FullScreen from "@/js/FullScreen";

Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

var getRound = function (num) {
  var len = Math.ceil(num).toString().length, divisor = Math.pow(10, len - 1);
  return Math.ceil(num / divisor) * divisor;
};

var toggleFullScreen = function (el) {
  if (FullScreen.supportsFullScreen && el.nodeType) {
    if (!FullScreen.isFullScreen()) {
      FullScreen.requestFullScreen(el);
    } else {
      FullScreen.cancelFullScreen(el);
    }
  }
};
var compile = function (template, data) {
  const evalExpr = /<%=(.+?)%>/g;
  const expr = /<%([\s\S]+?)%>/g;
  data = data || {};

  template = template
    .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
    .replace(expr, '`); \n $1 \n  echo(`');

  template = 'echo(`' + template + '`);';

  let script =
    `(function parse(data){
            let output = "";

            function echo(html){
              output += html;
            }

            ${ template}

            return output;
          })`;

  return eval(script)(data);
}

export default {
  getRound: getRound,
  toggleFullScreen: toggleFullScreen,
  compile: compile
};

export { getRound, toggleFullScreen, compile }