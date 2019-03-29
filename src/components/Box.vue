<template>
  <div class="box-container">
    <div class="box" :class="color">
      <div class="box-title">{{title}}</div>
    </div>
    <div class="bg">
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box-container {
  position: relative;
}
.box {
  border-top: 47px solid;
  border-right: 28px solid;
  border-bottom: 1px solid;
  border-left: 17px solid;
  // border-image: url(../assets/img/box-blue.png) 50% 10% 0% 10% stretch;
  border-image: url(../assets/img/box-blue.png) 94 56 1 34 stretch;
  position: relative;
  &.yellow {
    border-image-source: url(../assets/img/box-yellow.png);
  }
  &.blue {
    border-image-source: url(../assets/img/box-blue.png);
  }
  &.violet {
    border-image-source: url(../assets/img/box-violet.png);
  }
  &.turquoise {
    border-image-source: url(../assets/img/box-turquoise.png);
  }
}
.bg {
  position: absolute;
  top: 47px;
  bottom: 0px;
  left: 0;
  right: 0;
  background-color: #aaa;
  overflow: auto;
  padding: 0.7em;
}
.box-title {
  position: absolute;
  top: -27px;
  left: 5px;
  right: -20px;
  height: 33px;
  overflow: hidden;

  font-family: Orbitron;
  font-size: 18px;
  font-weight: bold;
  text-transform: uppercase;
  color: #000;
}
</style>

<script>
export default {
  props: {
    title: String,
    color: String,
  },
};
</script>


