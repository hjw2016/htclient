<template>
  <div class="legend-animate open" id="legend-wrapper" :style="{bottom:bottom}">
    <div class="legend-title" @click="showContent = !showContent;">
        <i :class="showContent ? 'fa fa-chevron-circle-down' : 'fa fa-chevron-circle-up'"></i>
        <span>图例</span>
    </div>
    <div class="legend-content">
        <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name:"legned",
  data() {
    return {
      showContent: true,
      bottom: "5px"
    };
  },
  watch: {
    showContent: function(val) {
      if (val) {
        this.bottom = "5px";
      } else {
        var h = document.getElementById("legend-wrapper").offsetHeight - 30;
        this.bottom = -h + "px";
      }
    }
  }
};
</script>

