<template>
  <mappanel datawidth="400" ref="map">
    <div class='title'>
        <div class="panel-title">
            {{module_name}}
        </div>
        <monitor @monitor = "getRegionRainData"></monitor>
    </div>
    <div class="pad8" style="border-bottom: 1px solid #ccc;">
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
                <el-button type="primary" size="small" icon="el-icon-edit-outline" @click="getRegionRainData">确定</el-button>
                <el-button size="small" icon="el-icon-close" @click="$refs.datepopover.showPopper=false;">取消</el-button>
            </div>
        </el-popover>
        <el-radio-group v-model="quick_time" size="mini" @change="onQuickSetChange">
            <el-radio-button label="1天"></el-radio-button>
            <el-radio-button label="3天"></el-radio-button>
            <el-radio-button label="7天"></el-radio-button>
        </el-radio-group>
        <el-button size="mini"  v-popover:datepopover @click="quick_time = null;" :type="quick_time ? 'default' : 'primary'">自定义</el-button>
    </div>
    <el-tabs v-model="activeTab" type="card" @tab-click="handleClick" style="padding:8px 0 0 8px;">
        <el-tab-pane label="等值面" name="region">
            <el-table highlight-current-row border stripe style="width: 100%;min-height: 50px;" :height='$store.getters.mainRegionBodyHeight-105'
                      :data="regionRainData" @row-dblclick="clickTable">
                <el-table-column type="index" label="ID" align="center"></el-table-column>
                <el-table-column prop="STNM" label="站点" sortable align="center"></el-table-column>
                <el-table-column prop="VALUE" label="雨量(mm)" :formatter="rainFormat" sortable align="center"></el-table-column>
            </el-table>
        </el-tab-pane>
        <!--<el-tab-pane label="区县和水库" name="county">-->
            <!--区县和水库-->
        <!--</el-tab-pane>-->
    </el-tabs>
  </mappanel>
</template>

<script>
import $ from "jquery";
export default {
  name: "region-rain",
  data: function() {
    return {
      module_name: "面雨量",
      htMap: null,
      startTime: new Date(new Date() - 3 * 24 * 3600 * 1000),
      endTime: new Date(),
      quick_time: "3天",
      activeTab: "region",
      regionRainData: []
    };
  },
  mounted: function() {
    this.$nextTick(() => {
      this.htMap = this.$refs.map.htMap;
      this.getRegionRainData();
    });
  },
  methods: {
    getRegionRainData() {
      var vm = this;
      this.$refs.datepopover.showPopper = false;
      var day = this.quick_time[0];
      this.$http
        .get("shanhong/Queryrian_day!SYQ", {
          params: {
            TM1: this.startTime.format("yyyy-MM-dd 08:00"),
            TM2: this.endTime.format("yyyy-MM-dd 08:00"),
            realtime: true,
            day: day
          }
        })
        .then(function(json) {
          json = json.data;
          json.sort(function(a, b) {
            return b.VALUE - a.VALUE;
          });
          vm.regionRainData = json;
        });
      this.addImgLayer();
    },
    onQuickSetChange(type) {
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
      }
      this.getRegionRainData();
    },
    handleClick() {},
    addImgLayer() {
      $.getJSON("http://122.227.159.82:8087/ISO/dynamicISO!api?callback=?", {
        caseid: "b331a84a-78b3-11e6-a1d5-005056931899",
        tm1: this.startTime.format("yyyy-MM-dd 08:00"),
        tm2: this.endTime.format("yyyy-MM-dd 08:00")
      }).then(json => {
        var imageBounds = [
          [json.extend.ymax, json.extend.xmin],
          [json.extend.ymin, json.extend.xmax]
        ];
        L.imageOverlay(json.imgurl, imageBounds, { opacity: 0.75 }).addTo(
          this.htMap
        );
      });
    },
    rainFormat: function(row, column, val) {
      return val ? val.toFixed(1) : "0.0";
    },
    clickTable() {}
  }
};
</script>
