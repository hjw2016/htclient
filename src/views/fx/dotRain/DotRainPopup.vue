<template>
  <div>
    <div class="title"><div class="panel-title">{{row.CITY}}-{{row.STNM}}站点雨量过程</div></div>
    <div style="padding-top:4px;">
        <label>开始：</label>
        <el-date-picker v-model="startTime"
                        type="datetime"
                        size="small"
                        placeholder="选择开始时间"
                        style="width:180px;">
        </el-date-picker>
        <label>结束：</label>
        <el-date-picker v-model="endTime"
                        type="datetime"
                        size="small"
                        placeholder="选择结束时间"
                        style="width:180px;">
        </el-date-picker>
        <el-button type="primary" size="small" @click="search">查询</el-button>
    </div>
    <div id="dot-rain-chart" style="height:200px;"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import Util from "@/js/util";
import $ from "jquery";
import axios from "axios";

export default {
  name: "dot-rain-popup",
  props: ["row", "ev", "startTime", "endTime"],
  data() {
    return {
      chart: null
    };
  },
  mounted: function() {
    this.initChart();
  },
  methods: {
    search: function() {},
    initChart: function() {
      var $content = $(this.ev.target.getPopup().getElement());
      var params = {
        TM1: this.startTime.format("yyyy-MM-dd hh:mm"),
        TM2: this.endTime.format("yyyy-MM-dd hh:mm"),
        stcd: this.row.STCD
      };
      //   $.getJSON(SYSCONFIG.jsonpUrl("Queryrian_hour_line!SYQ"), params)
      axios
        .get("/shanhong/Queryrian_hour_line!SYQ", { params: params })
        .then(json => {
          var xData = [],
            yData = [];
          json.data.forEach(v => {
            xData.push(v.TM);
            yData.push(v.VALUE);
          });
          if (json.data[0].length == 0) {
            $content.find("#dot-rain-chart").html("没有查询到数据！");
            return;
          }
          this.chart && this.chart.clear();
          this.chart = echarts.init($content.find("#dot-rain-chart")[0]);
          var options = {
            grid: {
              left: "3%",
              right: "4%",
              top: "5%"
            },
            tooltip: {
              trigger: "axis",
              formatter: "{b} 降雨 {c}mm",
              backgroundColor: "rgba(255,255,255,0.7)",
              borderColor: "#4da0a8",
              borderWidth: 1,
              textStyle: {
                color: "#000"
              }
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: xData
            },
            yAxis: {
              type: "value",
              name: "雨量(mm)",
              nameLocation: "center",
              nameGap: 30,
              scale: true
            },
            dataZoom: [
              {
                type: "inside",
                start: 0,
                end: 100
              },
              {
                start: 0,
                end: 10,
                handleIcon:
                  "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                handleSize: "80%",
                handleStyle: {
                  color: "#fff",
                  shadowBlur: 3,
                  shadowColor: "rgba(0, 0, 0, 0.6)",
                  shadowOffsetX: 2,
                  shadowOffsetY: 2
                }
              }
            ],
            series: [
              {
                type: "bar",
                symbol: "none",
                sampling: "max",
                itemStyle: {
                  normal: {
                    color: "#4da0a8"
                  }
                },
                data: yData
              }
            ]
          };
          this.chart.setOption(options);
        });
    }
  }
};
</script>
