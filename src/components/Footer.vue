<template>
    <div class="page-footer" ref="footer">
        <div class="page-footer-inner">
            2017&copy; Hong Tai Water Conservancy  All rights reserved    版权所有 
            <a target="_blank" href="http://www.htwater.net">宁波弘泰水利信息科技有限公司</a> 
        </div>
        <div class="scroll-to-top">
            <i class="icon-arrow-up"></i>
        </div>
    </div>
</template>

export default {
  name: "foot"
};

<style scoped>
.page-footer {
    margin-bottom: 20px;
    position: absolute;
    left: 50%;
    bottom: 10px;
    margin-left: -270px
}
.page-footer .page-footer-inner {
  display: inline-block;
  text-align: center;
    color: white;
    margin: 0 0 2px
}
.page-footer .page-footer-inner {
  display: inline-block;
  margin-bottom: 15px;
}
a:link , a:visited  {color: white; text-decoration: none} 
a:hover {color: #FF00FF; text-decoration: underline} /* 鼠标在链接上，紫色，下划线 */
a:active {color: #0000FF; text-decoration: underline} /* 激活链接，兰色，下划线 */
</style>
