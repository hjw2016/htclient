<template>
  <mappanel panelWidth="450" ref="map">
    <div class='title'>
        <div class="panel-title">
            {{moudle_name}}
        </div>
    </div>
    <el-tabs v-model="tableType" type="border-card" @tab-click="changeType">
        <el-tab-pane label="水闸" name="gate">
            <el-table highlight-current-row border stripe style="width: 100%;" :height='this.$store.getters.mainRegionBodyHeight-70'
              :data="gateData" :loading="gateLoading" @row-dblclick="gateClick">
                <el-table-column type="index" label="ID" align="center"></el-table-column>
                <el-table-column prop="ZMNM" label="水闸名称" sortable align="center"></el-table-column>
                <el-table-column prop="LL" label="流量(m³/s)" :formatter="gateFormat" sortable align="center"></el-table-column>
                <el-table-column prop="ZQSW" label="闸上水位(m)" sortable align="center">
                    <template slot-scope="scope">
                        <span :style="{color:scope.row.ZQSW == '-9999' ? 'red' : ' '}">
                            {{scope.row.ZQSW =='-9999' ? '异常' : scope.row.ZQSW.toFixed(2)}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="ZHSW" label="闸下水位(m)" sortable align="center">
                    <template slot-scope="scope">
                        <span :style="{color:scope.row.ZHSW == '-9999' ? 'red' : ' '}">
                            {{scope.row.ZHSW =='-9999' ? '异常' : scope.row.ZHSW.toFixed(2)}}
                        </span>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="泵站" name="pump">
            <el-table highlight-current-row border stripe style="width: 100%;" :height='this.$store.getters.mainRegionBodyHeight-70'
              :data="pumpData" :loading="pumpLoading" @row-dblclick="pumpClick">
                <el-table-column type="index" label="ID" align="center"></el-table-column>
                <el-table-column prop="BZNM" label="翻水站" sortable align="center"></el-table-column>
                <el-table-column prop="LL" label="流量(m³/s)" :formatter="gateFormat" sortable align="center"></el-table-column>
                <el-table-column prop="OPENCNT" label="运行状态" :formatter="pumpFormat" sortable align="center"></el-table-column>
                <el-table-column prop="REGION" label="供水区域" sortable align="center"></el-table-column>
            </el-table>
        </el-tab-pane>
    </el-tabs>
  </mappanel>
</template>

<script>
import Vue from "vue";
import Util from "@/js/util";
import waterTpl from "./water";
import chartCom from "./DsPopup";
export default {
  name: "ds-realtime",
  data: function() {
    return {
      moudle_name: "调水实时监控",
      gateLoading: false,
      gateData: [],
      pumpLoading: false,
      pumpData: [],
      tableType: "gate",
      featureGroup: null
    };
  },
  mounted: function() {
    var vm = this;
    var filterStation = [
      "算山闸",
      "三山大闸",
      "碧兰嘴碶闸",
      "新毛焦大闸",
      "下三山大闸",
      "蜀山大闸",
      "陶家路新闸",
      "临海浦新闸"
    ];
    this.featureGroup = L.featureGroup({});
    this.$http
      .get("shanhong/Queryzmgq!GQ", {
        params: {
          tm: new Date().format("yyyy-MM-dd hh:mm")
        }
      })
      // $.getJSON("http://demo.htwater.net:8080/shanhong/Queryzmgq!GQ?callback=?", {
      //   tm: new Date().format("yyyy-MM-dd hh:mm")
      // })
      .then(function(json) {
        vm.gateData = json.data.filter(
          v => filterStation.indexOf(v.ZMNM) == -1
        );
        vm.addGateMap();
        // vm.testPath();
      });
    this.$http
      .get("http://172.16.35.51:3000/ds/bz", {
        params: {
          tm: new Date().format("yyyy-MM-dd hh:mm")
        }
      })
      .then(function(json) {
        vm.pumpData = json.data;
      });
  },
  methods: {
    testPath: function() {
      let route2 = [[29.866033, 121.619373], [29.4592895508, 122.735290527]];
      let path2 = L.polyline(route2, {
        delay: 1000,
        dashArray: [10, 20],
        weight: 5,
        color: "#0294e2",
        pulseColor: "#FFFFFF",
        paused: false
      }).addTo(this.$refs.map.htMap);
    },
    gateFormat: function(row, column, val) {
      return val ? val.toFixed(2) : "0.00";
    },
    pumpFormat: function(row, column, val) {
      return val ? "开启" : "关闭";
    },
    gateClick: function(row, event, column) {
      //定位当当前位置
      this.$refs.map.centerAt(row.LGTD, row.LATD, row.marker);
    },
    pumpClick: function(row, event, column) {
      this.$refs.map.centerAt(row.LGTD, row.LATD, row.marker);
    },
    addGateMap: function() {
      var vm = this;
      this.featureGroup.clearLayers();
      this.gateData.forEach((v, index) => {
        var imgUrl =
          v.LL > 0
            ? require("@/views/fx/dsrealtime/gate_b.png")
            : require("@/views/fx/dsrealtime/gate_b_closed.png");
        var gateKDs = v.KDs.replace(/,$/, "").split(",");
        var gatesCount = gateKDs.length;
        var tmp = `<div class="gate-run-monitor">
                                    <table border="1">
                                       <% for(let i=0; i < Math.ceil(data.gatesCount/12); i++){ %>
                                            <tr>
                                                <% for(let j=0; j < 12; j++){ %>
                                                    <% if(i*12+j < data.gatesCount){ %>
                                                        <% if(+data.gateKDs[i*12+j] <= 0){ %>
                                                            <td style="background:rgba(255, 255, 226, 255);">
                                                                <div style="background: rgba(255, 255, 226, 255);height:10px;width:5px;"></div>
                                                            </td>
                                                        <% }else{ %>
                                                            <td style="background:rgb(0,255,1);">
                                                                <div style="background:rgb(0,255,1);height:10px;width:5px;"></div>
                                                            </td>
                                                        <% } %>
                                                    <% } %>
                                                <% } %>
                                            </tr>
                                        <% } %>
                                    </table>
                                    <div class="gate-run-point">
                                        <img src=${imgUrl} width="22" height="13" style="vertical-align: top;">
                                    </div>
                                </div>`;
        tmp = Util.compile(tmp, { gatesCount: gatesCount, gateKDs: gateKDs });
        var tmp2 = Util.compile(waterTpl, v);
        // 这里给v赋值主要是为了给组件传参数，在共用组件时，把不一样的参数放在一个统一的对象中便于管理
        (v.id = "zmid"),
          (v.ID = v.ZMID),
          (v.name = v.ZMNM),
          (v.url = [
            "http://172.16.35.51:3000/ds/zm/llchart",
            "http://172.16.35.51:3000/ds/zm/daychart"
          ]);

        var w = 136,
          h = 13 + Math.ceil(gatesCount / 12) * 36;
        var myIcon = L.divIcon({
          html: tmp,
          className: "map-div-icon",
          iconSize: [w, h]
        });
        v.marker = L.marker([v.LATD, v.LGTD], { icon: myIcon })
          .bindPopup("<div id='popup' style='width:560px;'></div>", {
            maxWidth: 600,
            closeOnClick: false
          })
          .on("popupopen", ev => {
            this.clickMarker(ev, v);
          })
          .bindTooltip(tmp2, { direction: "bottom" });
        this.featureGroup.addLayer(v.marker);
      });
      this.featureGroup.addTo(this.$refs.map.htMap);
    },
    addPumpMap: function() {
      var vm = this;
      this.featureGroup.clearLayers();
      this.pumpData.forEach((v, index) => {
        var imgUrl =
          v.LL > 0
            ? require("@/views/fx/dsrealtime/pump-on.gif")
            : require("@/views/fx/dsrealtime/pump-off.png");
        var tmp = `<div style='width:100px;'><img src=${imgUrl} /></div>`;
        (v.id = "bzid"),
          (v.ID = v.BZID),
          (v.name = v.BZNM),
          (v.url = [
            "http://172.16.35.51:3000/ds/bz/llchart",
            "http://172.16.35.51:3000/ds/bz/daychart"
          ]);

        var myIcon = L.divIcon({
          html: tmp,
          className: "map-div-icon",
          iconSize: [28, 28]
        });
        v.marker = L.marker([v.LATD, v.LGTD], { icon: myIcon })
          .bindPopup("<div id='popup' style='width:560px;'></div>", {
            maxWidth: 600,
            closeOnClick: false
          })
          .on("popupopen", ev => {
            this.clickMarker(ev, v);
          })
          .bindTooltip(v.BZNM);
        this.featureGroup.addLayer(v.marker);
      });
      this.featureGroup.addTo(this.$refs.map.htMap);
    },
    clickMarker: function(ev, rowData) {
      this.$refs.map.centerAt(rowData.LGTD, rowData.LATD, rowData.marker);
      new Vue({
        template: "<chartcom :rowData='rowData' :ev='ev'></chartcom>",
        data: function() {
          return {
            ev: ev,
            rowData: rowData
          };
        },
        components: { chartcom: chartCom }
      }).$mount("#popup");
    },
    changeType: function(tab, event) {
      if (tab.name == "gate") {
        this.addGateMap();
      } else {
        this.addPumpMap();
      }
    }
  }
};
</script>

<style>
.gate-run-monitor {
  width: 136px;
  cursor: pointer;
}
.gate-run-monitor table {
  margin: auto;
  padding: 0px;
  background: #dae8ec;
  border-color: #7d7d7d;
  border-collapse: separate;
  border-spacing: 2px;
}
.gate-run-monitor .gate-run-point {
  height: 13px;
  text-align: center;
  line-height: 13px;
}

/*water css*/
.water-level-wrapper {
  position: absolute;
  z-index: 9999;
  padding: 2px;
  background: white;
  border: 1px solid #7d7d7d;
  border-radius: 5px;
  box-sizing: content-box;
  font-size: 13px;
  width: 260px;
  margin-left: -133px;
}
.water-level-wrapper .arrow,
.water-level-wrapper .arrow:after {
  position: absolute;
  display: block;
  width: 0;
  height: 0;
  border-color: transparent;
  border-style: solid;
}
/*.water-level-wrapper .arrow{
	border-width: 11px;
	top: -11px;
	left: 50%;
	margin-left: -11px;
	border-top-width: 0;
	border-bottom-color: #7d7d7d;
}
.water-level-wrapper .arrow:after{
	content: "";
	border-width: 10px;
	top: 1px;
	margin-left: -10px;
	border-top-width: 0;
	border-bottom-color: white;
}*/
.water-level-wrapper .water-header {
  height: 28px;
  line-height: 28px;
  text-align: center;
}
.water-level-wrapper .water-header .water-title {
  display: inline-block;
  font-weight: bold;
}
.water-level-wrapper .water-content {
  position: relative;
  height: 100px;
}
.water-level-wrapper .water-content > div {
  float: left;
  height: 100%;
}
.water-level-wrapper .water-content .water-upper,
.water-level-wrapper .water-content .water-down {
  position: relative;
  width: 120px;
}
.water-level-wrapper .water-content .water-level-z {
  position: absolute;
  top: 5px;
  width: 100%;
  z-index: 1;
  text-align: center;
}
.water-level-wrapper .red {
  color: red;
}
.water-level-wrapper .water-content .water-level-bg {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: #4cb6e9;
}
.water-level-wrapper .water-content .water-level-max {
  height: 50px;
}
.water-level-wrapper .water-content .water-level-min {
  height: 35px;
}
.water-level-wrapper .water-content .water-level-label {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 20px;
  line-height: 20px;
  text-align: center;
}
.water-level-wrapper .water-content .water-gate {
  background: #4cb6e9;
}
.water-level-wrapper .water-content .water-gate-off {
  width: 20px;
  height: 100px;
  background: url("./gate-off.png") no-repeat;
}
.water-level-wrapper .water-content .water-gate-on {
  width: 20px;
  height: 80px;
  background: url("./gate-on.png") no-repeat;
}
</style>
