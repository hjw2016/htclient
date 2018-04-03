export default {
    title: '前端敏捷开发框架',
    logo: 'logo.png',
    logoWidth: 230,
    panelWidth: 400,
    apihost: 'http://172.16.35.50:8080/bus/',
    apiurl: function (method) {
        return SYSCONFIG.apihost + method + "?token=" + SYSCONFIG.token;
    },
    menu: {
        //菜单相关配置
        menuMode: "top",//默认: default 上左右, top 上方顶栏菜单, vertical 左右方式,
        menuLeft: "", // only when menuMode == top
        menuRight: "100px",// only when menuMode == top
        backgroundColor: "#20a0ff",
        textColor: "#fff",
        activeTextColor: "#ffd04b",
    },
    htMap: {
        //地图相关配置
        crs: 'L.CRS.EPSG3857',
        center: [29.866033, 121.619373],
        level: 10,
        minZoom: 9,
        maxZoom: 18,
        defaultLayer: "天地图道路图",
        mapList: [
            { name: "Arcgis", type: "arcgis", url: "https://services.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer" },
            { name: "天地图道路图", type: "tNormal" },
            { name: "天地图影像图", type: "tImage" },
            { name: "高德道路图", type: "gaodeMap" },
            { name: "高德影像图", type: "gaodeImg" },
            { name: "谷歌道路图", type: "googleMap" },
            { name: "谷歌影像图", type: "googleImg" },
            { name: "超图", type: "superMap", url: "http://support.supermap.com.cn:8090/iserver/services/map-china400/rest/maps/China" }
        ],
        showLatlng: true
    }
}