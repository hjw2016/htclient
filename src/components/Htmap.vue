<template>
  <div class="htmap">
    <div style='position: absolute;left:10px;bottom:10px;font-size:16px;z-index:999' id="latlng"></div>
  </div>
</template>

<script>
import "leaflet";
import $ from "jquery";
import SYSCONFIG from "@/config";
import { tiledMapLayer as esriMap } from "esri-leaflet";
import chinaProvider from "@/vendors/chineseProvider";
import { tiledMapLayer as superMap } from "@supermap/iclient-leaflet";


import "leaflet/dist/leaflet.css";

export default {
  name: "htmap",
  data() {
    return {
      map: null
    };
  },
  props: {
    config: {
      type: Object,
      default: () => {
        return {
          center: [29.866033, 121.619373],
          level: 10,
          baseLayers: []
        };
      }
    }
  },
  mounted() {
    this.map = this.initMap();
    this.initMapEvents();
  },
  methods: {
    initMap: function() {
      var normalm = chinaProvider("TianDiTu.Normal.Map", {}),
        normala = chinaProvider("TianDiTu.Normal.Annotion", {}),
        imgm = chinaProvider("TianDiTu.Satellite.Map", {}),
        imga = chinaProvider("TianDiTu.Satellite.Annotion", {});
      var normal = L.layerGroup([normalm, normala]),
        image = L.layerGroup([imgm, imga]);

      var gaodemap = chinaProvider("GaoDe.Normal.Map", {});
      var gaodeimg = chinaProvider("GaoDe.Satellite.Map", {});
      var gaodeimga = chinaProvider("GaoDe.Satellite.Annotion", {});
      var gaodemap_group = L.layerGroup([gaodemap]),
        gaodeimg_group = L.layerGroup([gaodeimg, gaodeimga]);

      var googlemap = chinaProvider("Google.Normal.Map", {}),
        googleimg = chinaProvider("Google.Satellite.Map", {});

      var baseLayers = {};
      SYSCONFIG.htMap.mapList.forEach(v => {
        switch (v.type) {
          case "tNormal":
            baseLayers[v.name] = normal;
            break;
          case "tImage":
            baseLayers[v.name] = image;
            break;
          case "gaodeMap":
            baseLayers[v.name] = gaodemap_group;
            break;
          case "gaodeImg":
            baseLayers[v.name] = gaodeimg_group;
            break;
          case "googleMap":
            baseLayers[v.name] = googlemap;
            break;
          case "googleImg":
            baseLayers[v.name] = googleimg;
            break;
          case "arcgis":
            baseLayers[v.name] = esriMap({ url: v.url });
            break;
          case "superMap":
            baseLayers[v.name] = superMap(v.url);
            break;
        }
      });
      var mymap = L.map(this.$el, {
        crs: eval(SYSCONFIG.htMap.crs),
        center: SYSCONFIG.htMap.center,
        zoom: SYSCONFIG.htMap.level,
        layers: baseLayers[SYSCONFIG.htMap.defaultLayer],
        minZoom: 9,
        maxZoom: 18
        // maxBounds:bounds
      });
      L.control.layers(baseLayers).addTo(mymap);

      return mymap;
    },
    initMapEvents: function() {
      var vm = this;
      //删除水印
      $(".leaflet-right.leaflet-bottom")
        .find("a")
        .remove();

      SYSCONFIG.htMap.showLatlng && showLatlng(); //鼠标移动显示经纬度

      function showLatlng() {
        vm.map.on("mousemove", function(ev) {
          var lat = ev.latlng.lat.toFixed(4),
            lng = ev.latlng.lng.toFixed(4);
          document.querySelector("#latlng").innerHTML = lng + " , " + lat;
        });
      }
    }
  }
};
</script>

<style>
.htmap {
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
