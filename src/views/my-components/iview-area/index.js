import alCascader from "./al-cascader.vue";
import alSelector from "./al-selector.vue";
// 这里是重点
const iviewArea = {
  install: function (Vue) {
    Vue.component("AlCascader", alCascader);
    Vue.component("AlSelector", alSelector);
  },
};

// 导出组件
export default iviewArea;
