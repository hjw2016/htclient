<template>
  <div id="popup-chart-wrapper">
    <div class="title"><div class="panel-title">{{rowData.name}}-排水详情</div></div>
	<div class="wrap">
    <el-tabs v-model="type" type="card" @tab-click="drawPopupChart">
        <el-tab-pane label="日排水过程" name="drain">
          <div class="block">
            <el-date-picker
              v-model="datetime1"
              type="datetimerange"
              :picker-options="pickerOptions1"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              >
            </el-date-picker>
            <el-button type="primary" size="small" @click="setChartData">查询</el-button>
          </div>
          <div id="drain-chart" style="height:200px;"></div>
        </el-tab-pane>
        <el-tab-pane label="流量过程" name="flow">
          <div class="block">
            <el-date-picker
              v-model="datetime"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="small"
              >
            </el-date-picker>
            <el-button type="primary" size="small" @click="setChartData">查询</el-button>
          </div>
          <div id="flow-chart" style="height:200px;"></div>
        </el-tab-pane>
    </el-tabs>
	</div>
  </div>
</template>

<script>
import echarts from "echarts";
import Util from "@/js/util";
import $ from "jquery";
export default {
  name: "ds-popup",
  props: {
    rowData: {
      required: true
    },
    ev: {
      required: true
    }
  },
  data: function() {
    return {
      datetime: [new Date().getTime() - 3600 * 1000 * 24 * 1, new Date()],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      datetime1: [new Date().getTime() - 3600 * 1000 * 24 * 7, new Date()],
      pickerOptions1: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      chart: null,
      type: "drain"
    };
  },
  mounted: function() {
    this.drawPopupChart();
  },
  methods: {
    drawPopupChart: function() {
      this.type == "flow" ? this.drawFlowChart() : this.drawDrainChart();
    },
    setChartData: function() {
      var $content = $(this.ev.target.getPopup().getElement());
      if (this.type === "flow") {
        var params = {
          tm1: new Date(this.datetime[0]).format("yyyy-MM-dd hh:mm"),
          tm2: this.datetime[1].format("yyyy-MM-dd hh:mm")
        };
        params[this.rowData.id] = this.rowData.ID;
        $.getJSON(this.rowData.url[0], params).then(json => {
          if (json[0].length == 0) {
            $content.find("#flow-chart").html("没有查询到数据！");
            return;
          }
          this.chart.setOption({
            xAxis: {
              data: json[0],
              series: [
                {
                  data: json[1]
                }
              ]
            }
          });
        });
      } else {
        var params = {
          tm1: new Date(this.datetime1[0]).format("yyyy-MM-dd hh:mm"),
          tm2: this.datetime1[1].format("yyyy-MM-dd hh:mm")
        };
        params[this.rowData.id] = this.rowData.ID;
        $.getJSON(this.rowData.url[1], params).then(json => {
          if (json[0].length == 0) {
            $content.find("#drain-chart").html("没有查询到数据！");
            return;
          }
          json[1] = json[1].map(v => (v / 10000).toFixed(2));
          this.chart.setOption({
            xAxis: {
              data: json[0],
              series: [
                {
                  data: json[1]
                }
              ]
            }
          });
        });
      }
    },
    drawFlowChart: function() {
      var $content = $(this.ev.target.getPopup().getElement());
      var params = {
        tm1: new Date(this.datetime[0]).format("yyyy-MM-dd hh:mm"),
        tm2: this.datetime[1].format("yyyy-MM-dd hh:mm")
      };
      params[this.rowData.id] = this.rowData.ID;
      $.getJSON(this.rowData.url[0], params).then(json => {
        if (json[0].length == 0) {
          $content.find("#flow-chart").html("没有查询到数据！");
          return;
        }
        this.chart && this.chart.clear();
        this.chart = echarts.init($content.find("#flow-chart")[0]);
        var options = {
          grid: {
            left: "3%",
            right: "4%",
            top: "5%"
          },
          tooltip: {
            trigger: "axis",
            formatter: "{b} 流量 {c}m³/s",
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
            data: json[0]
          },
          yAxis: {
            type: "value",
            name: "流量(m³/s)",
            nameLocation: "center",
            nameGap: 30,
            scale: true,
            // boundaryGap: [0.2,0.2]
            min: function(value) {
              return value.min - 10;
            },
            max: function(value) {
              // var len = Math.ceil(value.max).toString().length,divisor=Math.pow(10,len-1);
              return value.max == 0 ? value.max + 10 : Util.getRound(value.max);
            }
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
              type: "line",
              symbol: "none",
              sampling: "max",
              itemStyle: {
                normal: {
                  color: "#4da0a8"
                }
              },
              data: json[1]
            }
          ]
        };
        this.chart.setOption(options);
      });
    },
    drawDrainChart: function() {
      var $content = $(this.ev.target.getPopup().getElement());
      var params = {
        tm1: new Date(this.datetime1[0]).format("yyyy-MM-dd hh:mm"),
        tm2: this.datetime1[1].format("yyyy-MM-dd hh:mm")
      };
      params[this.rowData.id] = this.rowData.ID;
      $.getJSON(this.rowData.url[1], params).then(json => {
        if (json[0].length == 0) {
          $content.find("#drain-chart").html("没有查询到数据！");
          return;
        }
        this.chart && this.chart.clear();
        this.chart = echarts.init($content.find("#drain-chart")[0]);
        json[1] = json[1].map(v => (v / 10000).toFixed(2));
        var options = {
          tooltip: {
            trigger: "axis",
            formatter: "{b} 日排水量过程 {c}万方",
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
            data: json[0]
          },
          yAxis: {
            type: "value",
            name: "日排水量过程(万方)",
            nameLocation: "center",
            nameGap: 30,
            scale: true,
            min: function(value) {
              return value.min - 10;
            },
            max: function(value) {
              return value.max == 0 ? value.max + 10 : Util.getRound(value.max);
            }
          },
          series: [
            {
              type: "line",
              itemStyle: {
                normal: {
                  color: "#4da0a8"
                }
              },
              data: json[1]
            }
          ]
        };
        this.chart.setOption(options);
      });
    }
  }
};
</script>
