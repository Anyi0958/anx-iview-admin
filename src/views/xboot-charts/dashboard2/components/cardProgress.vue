<template>
  <div>
    <Card class="card-progress-count">
      <div class="card-header">
        <span class="title">新增用户</span>
        <Dropdown trigger="click">
          <Icon type="ios-more" size="22" style="cursor: pointer" />
          <DropdownMenu slot="list">
            <DropdownItem>查看详情</DropdownItem>
            <DropdownItem>更多操作</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div class="value">
        <span id="countup4"></span>
      </div>
      <Progress :percent="65" status="success" hide-info style="margin: 20px 0 7px 0" />
      <div class="today">
        <span class="t">总用用户量</span>
        <span class="v">31,235</span>
      </div>
    </Card>
  </div>
</template>

<script>
import { CountUp } from "countup.js";
export default {
  name: "CardProgress",
  components: {},
  props: {},
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      new CountUp("countup4", 560).start();
    },
  },
};
</script>
<style lang="less" scoped>
.card-progress-count {
  height: 182px;
  .card-header {
    display: flex;
    height: 22px;
    align-items: center;
    justify-content: space-between;
    color: rgba(0, 0, 0, 0.45);
  }
  .value {
    height: 38px;
    margin-top: 4px;
    margin-bottom: 6px;
    overflow: hidden;
    color: rgba(0, 0, 0, 0.85);
    font-size: 30px;
    line-height: 38px;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
  }
  .today {
    margin-top: 8px;
    padding-top: 9px;
    border-top: 1px solid #e8e8e8;
    .v {
      margin-left: 8px;
      color: rgba(0, 0, 0, 0.85);
    }
  }
}
</style>
