<template>
  <mappanel class="m_rain" datawidth="400" ref="map">
    <div class='title'>
        <div class="panel-title">
            {{module_name}}
        </div>
        <monitor @monitor = "getRainData"></monitor>
        <div class="pull-right" style="margin:0 30px 0 10px;">
            <el-checkbox v-model="showPieChart" style="margin-right: 10px;">图表</el-checkbox>
            <a class="full-screen-btn" @click.prevent="fullScreen">
                <i class="fa fa-arrows-alt"></i>
                <span>全屏</span>
            </a>
        </div>
    </div>
    <div class="quicksetbar pad8">
        <el-popover
                ref="datepopover"
                placement="bottom"
                trigger="click">
            <div>
                <label>开始：</label>
                <el-date-picker v-model="startTime"
                                type="datetime"
                                size="small"
                                placeholder="选择开始时间">
                </el-date-picker>
            </div>
            <div style="margin-top:5px;">
                <label>结束：</label>
                <el-date-picker v-model="endTime"
                                type="datetime"
                                size="small"
                                placeholder="选择结束时间">
                </el-date-picker>
            </div>
            <div style="margin-top:10px;text-align: center;">
                <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="getRainData">确定</el-button>
                <el-button size="small" icon="el-icon-close" @click="$refs.datepopover.showPopper=false;">取消</el-button>
            </div>
        </el-popover>
        <el-radio-group v-model="quick_time" size="mini" @change="onQuickSetChange">
            <el-radio-button label="1天"></el-radio-button>
            <el-radio-button label="3天"></el-radio-button>
            <el-radio-button label="7天"></el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="quick_time" size="mini" @change="onQuickSetChange">
            <el-radio-button label="1小时"></el-radio-button>
            <el-radio-button label="3小时"></el-radio-button>
            <el-radio-button label="6小时"></el-radio-button>
        </el-radio-group>
        <el-button size="mini"  v-popover:datepopover @click="quick_time = null;" :type="quick_time ? 'default' : 'primary'">自定义</el-button>
    </div>
    <div class="pad8">
        <el-select v-model="county" placeholder="选择区县" size="mini" style="width: 165px;" @change = "filterData">
            <el-option v-for="item in counties" :label="item.name" :value="item.value" :key="item.value"></el-option>
        </el-select>
        <el-select v-model="type" placeholder="选择类型" size="mini" style="width: 150px;" @change = "filterData">
            <el-option label="类型：不限" value=""></el-option>
            <el-option label="国家站" value="true"></el-option>
            <el-option label="非国家站" value="false"></el-option>
        </el-select>
    </div>
    <div class="pad8">
        <el-input placeholder="站点名称..."
                suffix-icon="el-icon-search"
                v-model="searchWord"
                size="mini"
                style="width:320px;"
                @input = "filterData">
        </el-input>
    </div>
    <el-table highlight-current-row border stripe style="width: 100%;min-height: 50px;" :height='tableHeight'
              :data="rainData" :loading="rainLoading" @row-dblclick="rainClick" :row-style="rowStyle">
        <el-table-column type="index" label="ID" align="center"></el-table-column>
        <el-table-column prop="STNM" label="站点" sortable align="center"></el-table-column>
        <el-table-column prop="VALUE" label="雨量(mm)" :formatter="rainFormat" sortable align="center"></el-table-column>
    </el-table>
    <div class="panel-footer" :style="{'display': showPieChart ? 'block' : 'none'}">
       <pie-chart :data="rainPieData" @changed="chartDataChange"></pie-chart>
    </div>
  </mappanel>
</template>

<script>
import Vue from "vue";
import mappanel from "@/components/Mappanel";
import Util from "@/js/util";
import myCounties from "@/js/counties";
import rainPieChart from "./RainPieChart";
import dotRainPopup from "./DotRainPopup";
import $ from "jquery";
import axios from "axios";

export default {
  name: "dotrain",
  data() {
    return {
      module_name: "点雨量",
      quick_time: "3天",
      rainLoading: true,
      rainData: null,
      allRainData: null,
      rainPieData: null,
      featureGroup: null,
      htMap: null,
      showPieChart: true,
      startTime: new Date(new Date() - 3 * 24 * 3600 * 1000),
      endTime: new Date(),
      counties: null,
      county: "",
      type: "",
      searchWord: ""
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.counties = myCounties;
      this.htMap = this.$refs.map.htMap;
      this.featureGroup = L.featureGroup({});
      this.getRainData();
      this.initLayers();
    });
  },
  computed: {
    tableHeight: function() {
      if (this.showPieChart) {
        return this.$store.getters.mainRegionBodyHeight - 356;
      }
      return this.$store.getters.mainRegionBodyHeight - 105;
    }
  },
  methods: {
    getRainData: function() {
      var vm = this;
      this.$refs.datepopover.showPopper = false;
      /* $.getJSON(
        "http://demo.htwater.net:8080/shanhong/Queryrian_hour!SYQ?callback=?",
        {
          TM1: this.startTime.format("yyyy-MM-dd hh:mm"),
          TM2: this.endTime.format("yyyy-MM-dd hh:mm")
        }
      ) */
      axios({
        method: "get",
        url: "shanhong/Queryrian_hour!SYQ",
        params: {
          TM1: this.startTime.format("yyyy-MM-dd hh:mm"),
          TM2: this.endTime.format("yyyy-MM-dd hh:mm")
        }
      }).then(function(json) {
        json = json.data;
        json.sort(function(a, b) {
          return b.VALUE - a.VALUE;
        });
        vm.allRainData = json;
        vm.filterData();
      });
    },
    filterData: function() {
      this.rainPieData = this.allRainData.filter(v => {
        return (
          (!this.county || v.CITY == this.county) &&
          (!this.type || v.ISSTATE.toString() == this.type) &&
          (!this.searchWord || v._s.indexOf(this.searchWord) > -1)
        );
      });
      this.rainData = this.rainPieData;
      this.addOnMap();
    },
    initLayers: function() {
      this.htMap.on("zoom", function(ev) {
        var level = ev.target.getZoom();
        if (level < 11) {
          $(".map-div-icon")
            .children(".rain-label")
            .hide();
        } else if (level < 12) {
          $(".map-div-icon")
            .children(".rain-label")
            .show()
            .children("span")
            .hide();
        } else {
          $(".map-div-icon")
            .children(".rain-label")
            .show()
            .children("span")
            .show();
        }
      });
    },
    addOnMap: function() {
      var vm = this;
      this.featureGroup.clearLayers();
      var level = this.htMap.getZoom();
      this.rainData.forEach((v, index) => {
        if (v.LGTD == null || v.LGTD == 0) return;
        var bgColor = this.getColorByValue(v.VALUE),
          fColor = bgColor == "#ffffff" ? "#000" : "#fff";
        var tmp = `<div class='rain-station' style="background: ${bgColor};"></div>
                                <div class='rain-label' style="display:${
                                  level >= 11 ? "block" : "none"
                                };background: ${bgColor};color:${fColor};">
                                <span style="display:${
                                  level >= 12 ? "inline-block" : "none"
                                }">${v.STNM}&nbsp;</span>${v.VALUE.toFixed(
          1
        )}</div>`;
        var myIcon = L.divIcon({
          html: tmp,
          className: "map-div-icon",
          iconSize: ["", 12],
          iconAnchor: [6, 6]
        });
        v.marker = L.marker([v.LATD, v.LGTD], { icon: myIcon })
          .bindPopup("<div id='popup' style='width:500px;'></div>", {
            maxWidth: 600,
            closeOnClick: false
          })
          .on("popupopen", ev => {
            this.clickMarker(ev, v);
          });
        this.featureGroup.addLayer(v.marker);
      });
      this.featureGroup.addTo(this.htMap);
    },
    onQuickSetChange: function(type) {
      switch (type) {
        case "1天":
          this.startTime = new Date(
            new Date().getTime() - 1 * 24 * 3600 * 1000
          );
          this.endTime = new Date();
          break;
        case "3天":
          this.startTime = new Date(
            new Date().getTime() - 3 * 24 * 3600 * 1000
          );
          this.endTime = new Date();
          break;
        case "7天":
          this.startTime = new Date(
            new Date().getTime() - 7 * 24 * 3600 * 1000
          );
          this.endTime = new Date();
          break;
        case "1小时":
          this.startTime = new Date(new Date().getTime() - 1 * 3600 * 1000);
          this.endTime = new Date();
          break;
        case "3小时":
          this.startTime = new Date(new Date().getTime() - 3 * 3600 * 1000);
          this.endTime = new Date();
          break;
        case "6小时":
          this.startTime = new Date(new Date().getTime() - 6 * 3600 * 1000);
          this.endTime = new Date();
          break;
      }
      this.getRainData();
    },
    rainFormat: function(row, column, val) {
      return val ? val.toFixed(1) : "0.0";
    },
    rainClick: function(row) {
      if (row.LGTD == null || row.LGTD == 0) return;
      this.$refs.map.centerAt(row.LGTD, row.LATD, row.marker);
    },
    fullScreen: function(event) {
      Util.toggleFullScreen($(event.target).parents(".divpanel")[0]);
    },
    getColorByValue: function(value) {
      var colorRamp = [
        "#ffffff",
        "#76c476",
        "#7676d6",
        "#f5bdc7",
        "#dfb260",
        "#e25a5a"
      ];
      if (value <= 0) {
        return colorRamp[0];
      } else if (value <= 30) {
        return colorRamp[1];
      } else if (value <= 50) {
        return colorRamp[2];
      } else if (value <= 100) {
        return colorRamp[3];
      } else if (value <= 200) {
        return colorRamp[4];
      } else {
        return colorRamp[5];
      }
    },
    chartDataChange: function(data) {
      this.rainData = data;
      this.addOnMap();
    },
    clickMarker: function(ev, row) {
      this.$refs.map.centerAt(row.LGTD, row.LATD, row.marker);
      var vm = this;
      new Vue({
        template:
          "<com :row='row' :ev='ev' :startTime='startTime' :endTime='endTime'></com>",
        data() {
          return {
            ev: ev,
            row: row,
            startTime: vm.startTime,
            endTime: vm.endTime
          };
        },
        components: { com: dotRainPopup }
      }).$mount("#popup");
    },
    rowStyle: function(table) {
      if (table.row.LGTD == null || table.row.LGTD == 0) {
        return { color: "silver" };
      } else {
        return {};
      }
    }
  },
  components: {
    pieChart: rainPieChart
  }
};
</script>

<style>
.m_rain .el-radio-button--mini .el-radio-button__inner {
  padding: 7px 5px;
}
.quicksetbar {
  border-bottom: 1px solid #ccc;
}

.htmap .map-div-icon .rain-station {
  width: 12px;
  height: 12px;
  /*margin: 0 auto;*/
  border-radius: 12px;
  cursor: pointer;
  -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
}
.htmap .map-div-icon .rain-label {
  margin-left: calc(-50% + 6px);
  width: calc(100% - 8px);
  display: none;
  padding: 2px 4px;
  margin-top: 2px;
  font-family: SimHei;
  font-size: 13px;
  border-radius: 3px;
  white-space: nowrap;
  cursor: pointer;
  -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.4);
}

.main .panel-footer {
  border-top: 1px solid #b7bdc5;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
  z-index: 3;
  position: relative;
  bottom: 0;
  background: #fff;
  width: 100%;
  height: 250px;
}
</style>
