<template>
  <div class='mappanel'>
        <div class='divpanel' :style="'flex-basis:'+datawidth+'px;width:'+datawidth+'px;'">
            <slot>这是数据区域</slot>
            <!--<div class="resizeHandler"  v-on:mousedown="onMousedown"></div>-->
        </div>
        <htmap class='divmap' ref="htmap"></htmap>
  </div>
</template>

<script>
import htmap from "@/components/Htmap";
import SYSCONFIG from "@/config";
import FullScreen from "@/js/FullScreen";
import interact from "interactjs";
import $ from "jquery";

export default {
  name:"mappanel",
  data() {
    return {
      datawidth: this.panelWidth,
      htMap: null,
      currentMapCenter: null
    };
  },
  props: {
    panelWidth: {
      default: SYSCONFIG.panelWidth
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      this.htMap = this.$refs.htmap.map;
      this.initInteract();
      this.listenFullScreen();
    });
  },
  methods: {
    initInteract: function() {
      var vm = this;
      interact(".divpanel")
        .resizable({
          edges: {
            left: false,
            right: true,
            bottom: false,
            top: false
          },
          invert: "none"
        })
        .on("resizestart", function(event) {
          vm.currentMapCenter = vm.htMap.getCenter();
          $(event.target)
            .find(".el-table__body-wrapper")
            .css("overflow-y", "hidden");
        })
        .on(
          "resizemove",
          vm._throttle(function(event) {
            var width = event.rect.width;
            var miniWidth = vm.panelWidth;
            if (width < miniWidth) {
              width = miniWidth;
            }
            vm.datawidth = width;
          }, 200)
        )
        .on("resizeend", function(event) {
          $(event.target)
            .find(".el-table__body-wrapper")
            .css("overflow-y", "");
          vm.htMap.setView(vm.currentMapCenter);
          vm.htMap.invalidateSize(true);
        });
    },
    centerAt: function(lng, lat, marker, animation, zoom) {
      this.htMap.flyTo([lat, lng], zoom);
      marker && marker.openPopup();
      // 自定义动画
      if (typeof animation == "undefined" || animation) {
        this._animation(lng, lat);
      }
    },
    _animation: function(lng, lat) {
      var tmp = `<div id="flash-container">
                                <div class="el flash-tl"></div>
                                <div class="el flash-bl"></div>
                                <div class="el flash-tr"></div>
                                <div class="el flash-br"></div>
                            </div>`;
      var myIcon = L.divIcon({
        html: tmp,
        className: "map-div-icon",
        iconSize: [14, 14],
        iconAnchor: [0, 0]
      });
      var marker = L.marker([lat, lng], {
        icon: myIcon,
        zIndexOffset: -10
      }).addTo(this.htMap);
      setTimeout(function() {
        marker.remove();
      }, 2000);
    },
    listenFullScreen: function() {
      var vm = this;
      if (FullScreen.supportsFullScreen) {
        document.addEventListener(
          FullScreen.fullScreenEventName,
          function() {
            if (FullScreen.isFullScreen()) {
              $("#app").addClass("full-screen");
              $("#app .divpanel")
                .find(".full-screen-btn")
                .empty()
                .append("<i class='fa fa-reply'></i><span>退出全屏</span>");
            } else {
              $("#app").removeClass("full-screen");
              $("#app .divpanel")
                .find(".full-screen-btn")
                .empty()
                .append("<i class='fa fa-arrows-alt'></i><span>全屏</span>");
              vm.htMap.invalidateSize(true);
            }
          },
          false
        );
      }
    },
    _throttle: function(fn, threshhold) {
      // 记录上次执行的时间
      var last;

      // 定时器
      var timer;

      // 默认间隔为 250ms
      threshhold || (threshhold = 250);

      // 返回的函数，每过 threshhold 毫秒就执行一次 fn 函数
      return function() {
        // 保存函数调用时的上下文和参数，传递给 fn
        var context = this;
        var args = arguments;

        var now = +new Date();

        // 如果距离上次执行 fn 函数的时间小于 threshhold，那么就放弃
        // 执行 fn，并重新计时
        if (last && now < last + threshhold) {
          clearTimeout(timer);

          // 保证在当前时间区间结束后，再执行一次 fn
          timer = setTimeout(function() {
            last = now;
            fn.apply(context, args);
          }, threshhold);

          // 在时间区间的最开始和到达指定间隔的时候执行一次 fn
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    }
  },
  components: {
    htmap: htmap
  }
};
</script>

<style>
.mappanel {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute !important;
}

.mappanel .divpanel {
  flex: 0 1 350px;
  position: relative;
  border-right: 1px solid #b7bdc5;
}
.mappanel .divmap {
  flex: 1;
}

.mappanel .title {
  font-size: 16px;
  padding-left: 10px;
  line-height: 35px;
  border-bottom: 1px solid #e6e6e6;
}

.mappanel .title .panel-title {
  display: inline-block;
  color: #3981c0;
  letter-spacing: 2px;
}

.mappanel .resizeHandler {
  background: silver;
  width: 5px;
  cursor: e-resize;
  z-index: 2000;
  position: absolute;
  right: 0;
  height: 100%;
  top: 0;
  user-select: none;
}
.mappanel .resizeHandler:hover {
  background: silver;
}
</style>
