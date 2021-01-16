<style lang="less">
@import "../styles/menu.less";
</style>
<template>
  <Menu
    ref="sideMenu"
    accordion
    :active-name="$route.name"
    :open-names="singleOpenName"
    :theme="menuTheme"
    width="auto"
    @on-select="changeMenu"
  >
    <template v-for="item in menuList">
      <!-- 如果是一级菜单并设置了不一直显示 -->
      <template v-if="item.level == '1' && !item.showAlways">
        <MenuItem
          v-if="item.children.length <= 1"
          :key="'menuitem' + item.name"
          :name="item.children[0].name"
        >
          <Icon
            :key="'menuicon' + item.name"
            :type="item.children[0].icon || item.icon"
            :size="iconSize"
          ></Icon>
          <span :key="'title' + item.name" class="layout-text">
            {{ itemTitle(item.children[0]) }}
          </span>
        </MenuItem>
        <Submenu v-if="item.children.length > 1" :key="item.name" :name="item.name">
          <template slot="title">
            <Icon :type="item.icon" :size="iconSize"></Icon>
            <span class="layout-text">{{ itemTitle(item) }}</span>
          </template>
          <template v-for="child in item.children">
            <MenuItem :key="'menuitem' + child.name" :name="child.name">
              <Icon :key="'icon' + child.name" :type="child.icon" :size="iconSize"></Icon>
              <span :key="'title' + child.name" class="layout-text">{{ itemTitle(child) }}</span>
            </MenuItem>
          </template>
        </Submenu>
      </template>
      <template v-else>
        <Submenu :key="item.name" :name="item.name">
          <template slot="title">
            <Icon :type="item.icon" :size="iconSize"></Icon>
            <span class="layout-text">{{ itemTitle(item) }}</span>
          </template>
          <template v-for="child in item.children">
            <MenuItem :key="'menuitem' + child.name" :name="child.name">
              <Icon :key="'icon' + child.name" :type="child.icon" :size="iconSize"></Icon>
              <span :key="'title' + child.name" class="layout-text">{{ itemTitle(child) }}</span>
            </MenuItem>
          </template>
        </Submenu>
      </template>
    </template>
  </Menu>
</template>

<script>
export default {
  name: "SidebarMenu",
  props: {
    menuList: Array,
    iconSize: Number,
    menuTheme: {
      type: String,
      default: "dark",
    },
    openNames: {
      type: Array,
    },
  },
  data() {
    return {
      singleOpenName: [],
    };
  },
  watch: {
    // 监听路由变化
    $route(to, from) {
      this.singleOpenName = [this.$route.matched[0].name];
    },
  },
  updated() {
    this.$nextTick(() => {
      if (this.$refs.sideMenu) {
        this.$refs.sideMenu.updateOpened();
      }
    });
  },
  mounted() {
    this.singleOpenName = [this.$route.matched[0].name];
  },
  methods: {
    changeMenu(active) {
      this.$emit("on-change", active);
    },
    handleSelect(name) {
      this.$emit("on-select", name);
    },
    itemTitle(item) {
      if (typeof item.title == "object") {
        return this.$t(item.title.i18n);
      } else {
        return item.title;
      }
    },
    getOpenedNamesByActiveName(name) {
      return this.$route.matched.map(item => item.name).filter(item => item !== name);
    },
  },
};
</script>
