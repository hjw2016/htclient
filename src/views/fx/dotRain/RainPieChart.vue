<template>
  <div id='rain-pie-chart' style='height:250px;'></div>
</template>

<script>
import echarts from "echarts";
import Util from "@/js/util";

export default {
  name:"rain-pie-chart",
  data: function() {
    return {
      chart: null,
      chartData: []
    };
  },
  props: {
    data: {
      required: true
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      this.initChart();
      this.initEvents();
    });
  },
  watch: {
    data: function(v) {
      this.chartData = this.getData(v);
      this.setData();
    }
  },
  methods: {
    initChart: function() {
      this.chart && this.chart.clear();
      this.chart = echarts.init(document.querySelector("#rain-pie-chart"));
      var options = {
        title: {
          text: "站点雨量分布图",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 60
        },
        series: [
          {
            name: "站点雨量",
            type: "pie",
            radius: "70%",
            center: ["30%", "50%"],
            stillShowZeroSum: false,
            data: this.chartData,
            labelLine: {
              show: false
            },
            label: {
              show: false
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      this.chart.setOption(options);
    },
    setData: function() {
      this.chart.setOption({
        legend: {
          selected: {
            "0mm": true,
            "0-30mm": true,
            "30-50mm": true,
            "50-100mm": true,
            "100-200mm": true,
            大于200mm: true
          }
        },
        series: [
          {
            data: this.chartData
          }
        ]
      });
    },
    initEvents: function() {
      this.chart.on("legendselectchanged", params => {
        var filterData = this.data.filter(v => {
          return (
            (params.selected["0mm"] && v.VALUE <= 0) ||
            (params.selected["0-30mm"] && v.VALUE > 0 && v.VALUE <= 30) ||
            (params.selected["30-50mm"] && v.VALUE > 30 && v.VALUE <= 50) ||
            (params.selected["50-100mm"] && v.VALUE > 50 && v.VALUE <= 100) ||
            (params.selected["100-200mm"] && v.VALUE > 100 && v.VALUE <= 200) ||
            (params.selected["大于200mm"] && v.VALUE > 200)
          );
        });
        this.$emit("changed", filterData);
      });
    },
    getData: function(data) {
      if (!data) {
        data = [];
      }
      var result = [
        { name: "0mm", value: 0, itemStyle: { color: "#46b8da" } },
        { name: "0-30mm", value: 0, itemStyle: { color: "#76c476" } },
        { name: "30-50mm", value: 0, itemStyle: { color: "#7676d6" } },
        { name: "50-100mm", value: 0, itemStyle: { color: "#f5bdc7" } },
        { name: "100-200mm", value: 0, itemStyle: { color: "#dfb260" } },
        { name: "大于200mm", value: 0, itemStyle: { color: "#e25a5a" } }
      ];
      data.forEach(v => {
        var i,
          value = v.VALUE;
        if (value <= 0) {
          i = 0;
        } else if (value <= 30) {
          i = 1;
        } else if (value <= 50) {
          i = 2;
        } else if (value <= 100) {
          i = 3;
        } else if (value <= 200) {
          i = 4;
        } else {
          i = 5;
        }
        result[i].value += 1;
      });
      return result;
    }
  }
};
</script>
