<template>
  <mappanel></mappanel>
</template>

<script>
import mappanel from "@/components/Mappanel";
import {getRound} from "@/js/util"
export default {
  name :"test",
  data() {
    return {
      datawidth: 350
    };
  },
  mounted() {
      
  },
  methods: {
    
  },
  components: {
    mappanel: mappanel
  }
};
</script>

<style>
.mappanel {
  display: flex;
  width: 100%;
  height: 100%;
  position: absolute !important;
}

.mappanel .divpanel {
  flex: 0 1 350px;
  position: relative;
  border-right: 1px solid #b7bdc5;
}
.mappanel .divmap {
  flex: 1;
}

.mappanel .title {
  font-size: 16px;
  padding-left: 10px;
  line-height: 35px;
  border-bottom: 1px solid #e6e6e6;
}

.mappanel .title .panel-title {
  display: inline-block;
  color: #3981c0;
  letter-spacing: 2px;
}

.mappanel .resizeHandler {
  background: silver;
  width: 5px;
  cursor: e-resize;
  z-index: 2000;
  position: absolute;
  right: 0;
  height: 100%;
  top: 0;
  user-select: none;
}
.mappanel .resizeHandler:hover {
  background: silver;
}
</style>
