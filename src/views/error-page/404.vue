<style lang="less">
@import "./404.less";
</style>

<template>
  <div class="error404">
    <div class="error404-body-con">
      <Card>
        <div class="error404-body-con-title">
          4
          <span><Icon type="ios-navigate-outline"></Icon></span>
          4
        </div>
        <p class="error404-body-con-message">YOU&nbsp;&nbsp;LOOK&nbsp;&nbsp;LOST</p>
        <div class="error404-btn-con">
          <Button size="large" style="width: 200px" type="text" @click="goHome">返回首页</Button>
          <Button
            size="large"
            style="width: 200px; margin-left: 40px"
            type="primary"
            @click="backPage"
          >
            返回上一页
          </Button>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
export default {
  name: "Error404",
  methods: {
    backPage() {
      this.$router.go(-1);
    },
    goHome() {
      this.$router.push({
        name: "home_index",
      });
    },
  },
};
</script>
