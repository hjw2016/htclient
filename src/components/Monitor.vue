<template>
  <div class="monitor" @click="monitor" :class="{off:off}" :title="off ? '已关闭监控,点击开启' : '已开启监控,点击关闭'">
    <div :class="[color == 'green' ? 'shineGreen' : 'shineRed']"></div>
  </div>
</template>

<script>
export default {
  name:"monitor",
  data: function() {
    return {
      off: false,
      interID: null
    };
  },
  props: {
    color: {
      default: "green"
    },
    interval: {
      default: 5 * 60 * 1000
    }
  },
  mounted: function() {
    this.$nextTick(() => {
      if (!this.off) {
        this.interID = setInterval(() => {
          this.$emit("monitor");
        }, this.interval);
      }
    });
  },
  watch: {
    off: function(val) {
      if (val) {
        clearInterval(this.interID);
      } else {
        this.interID = setInterval(() => {
          this.$emit("monitor");
        }, this.interval);
      }
    }
  },
  methods: {
    monitor: function() {
      this.off = !this.off;
    }
  }
};
</script>
