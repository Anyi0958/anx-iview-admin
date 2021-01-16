<style lang="less">
@import "./main.less";
</style>

<template>
  <div class="main" :class="{ 'main-hide-text': shrink }">
    <!--  顶部logo + 侧边菜单栏 -->
    <div
      class="sidebar-menu-con menu-bar"
      :style="{ width: shrink ? '60px' : '220px', overflow: shrink ? 'visible' : 'auto' }"
    >
      <shrinkable-menu
        :shrink="shrink"
        :theme="leftTheme"
        :before-push="beforePush"
        :open-names="openedSubmenuArr"
        :menu-list="menuList"
        @on-change="handleSubmenuChange"
      >
        <div v-show="logoStatus && logoType == 1" slot="top" class="logo-con">
          <template v-if="leftTheme == 'dark'">
            <img v-show="!shrink" key="max-logo" src="../assets/logo.png" />
          </template>

          <template v-else>
            <img v-show="!shrink" key="max-logo" src="../assets/xboot.png" />
          </template>

          <img v-show="shrink" key="min-logo" src="../assets/logo-min.png" />
        </div>
      </shrinkable-menu>
    </div>

    <div class="main-header-con" :style="{ paddingLeft: shrink ? '60px' : '220px' }">
      <div
        class="main-header"
        :style="{
          background:
            navTheme == 'light'
              ? '#fff'
              : navTheme == 'dark'
              ? '#191a23'
              : navTheme == 'primary'
              ? '#2d8cf0'
              : '#fff',
        }"
      >
        <!--  顶部logo -->
        <div
          v-show="logoStatus && logoType == 2"
          :style="{ width: shrink ? '60px' : '180px', overflow: shrink ? 'visible' : 'auto' }"
        >
          <div v-show="logoStatus" class="logo-con" @click="$router.replace('/home')">
            <template v-if="navTheme == 'dark'">
              <img v-show="!shrink" key="max-logo" src="../assets/logo.png" />
            </template>

            <template v-else>
              <img v-show="!shrink" key="max-logo" src="../assets/xboot.png" />
            </template>

            <img v-show="shrink" key="min-logo" src="../assets/logo-min.png" />
          </div>
        </div>

        <!--  顶部导航栏折叠按钮 -->
        <div
          class="navicon-con"
          :style="{
            position: logoType == 2 ? 'absolute' : 'absolute',
            left:
              logoType == 2 && logoStatus && shrink
                ? '40px'
                : logoType == 2 && logoStatus
                ? '180px'
                : '',
            top: logoType == 2 ? '0' : '',
          }"
        >
          <Button
            :style="{
              transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)',
              height: '48px',
            }"
            type="text"
            @click="toggleClick"
          >
            <Icon
              type="md-menu"
              :style="{
                color:
                  navTheme == 'light'
                    ? '#515a6e'
                    : navTheme == 'dark'
                    ? '#babbbd'
                    : navTheme == 'primary'
                    ? '#fff'
                    : '#fff',
              }"
              size="30"
            ></Icon>
          </Button>
        </div>

        <!-- 顶部导航栏菜单  -->
        <div
          class="header-middle-con"
          :style="{
            left:
              logoType == 2 && logoStatus && !shrink
                ? '254px'
                : logoType == 2 && logoStatus
                ? '90px'
                : '60px',
          }"
        >
          <div v-if="navType == 4" class="main-breadcrumb">
            <breadcrumb-nav :current-path="currentPath"></breadcrumb-nav>
          </div>

          <div v-if="navType == 1 || navType == 2" class="main-nav-menu">
            <Menu mode="horizontal" :theme="navTheme" :active-name="currNav" @on-select="selectNav">
              <MenuItem v-for="(item, i) in navList.slice(0, sliceNum)" :key="i" :name="item.name">
                <Icon v-if="navType == 1" :type="item.icon" />
                {{ item.title }}
              </MenuItem>
              <Submenu v-if="navList.length > sliceNum" name="sub">
                <template slot="title">更多</template>
                <MenuItem
                  v-for="(item, i) in navList.slice(sliceNum, navList.length)"
                  :key="i"
                  :name="item.name"
                >
                  <Icon v-if="navType == 1" :type="item.icon" />
                  {{ item.title }}
                </MenuItem>
              </Submenu>
            </Menu>
          </div>

          <!-- navType==3  开始-->
          <div
            v-if="navType == 3"
            style="margin-top: 11px"
            :class="{
              'main-nav-light': navTheme == 'light',
              'main-nav-dark': navTheme == 'dark',
              'main-nav-primary': navTheme == 'primary',
            }"
            :style="{
              color:
                navTheme == 'dark' ? 'rgb(186, 187, 189)' : navTheme == 'primary' ? '#fff' : '',
            }"
          >
            <Dropdown transfer @on-click="selectNav">
              <div style="cursor: pointer">
                {{ currNavTitle }}
                <Icon type="ios-arrow-down"></Icon>
              </div>
              <DropdownMenu slot="list">
                <DropdownItem
                  v-for="(item, i) in navList"
                  :key="i"
                  :name="item.name"
                  :selected="currNav == item.name"
                >
                  <div class="nav-item">
                    <Icon :type="item.icon" :size="16" style="margin: 0 10px 3px 0"></Icon>
                    {{ item.title }}
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <!-- navType==3  结束-->
        </div>

        <!--  顶部导航栏右侧图标 -->
        <div
          :class="{ 'header-avator-con': navType != 4, 'header-avator-con nav4': navType == 4 }"
          :style="{
            color:
              navTheme == 'light'
                ? '#515a6e'
                : navTheme == 'dark'
                ? '#babbbd'
                : navTheme == 'primary'
                ? '#fff'
                : '#fff',
          }"
        >
          <!--  navType==4  开始-->
          <Dropdown v-if="navType == 4" class="options" @on-click="selectNav">
            <Icon type="ios-apps" :size="24" class="language"></Icon>
            <DropdownMenu slot="list">
              <DropdownItem
                v-for="(item, i) in navList"
                :key="i"
                :name="item.name"
                :selected="currNav == item.name"
              >
                <div>
                  <Icon :type="item.icon" :size="14" style="margin: 0 10px 2px 0"></Icon>
                  {{ item.title }}
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <!--  navType==4  结束-->

          <!-- 全屏   开始 -->
          <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
          <!-- 全屏  结束 -->

          <!-- 个性化设置  开始 -->
          <div class="lock-screen-btn-con" @click="layout = true">
            <Tooltip content="个性化设置" placement="bottom">
              <Icon type="md-switch" :size="26"></Icon>
            </Tooltip>
          </div>

          <Drawer v-model="layout" title="" width="280" :closable="false">
            <Divider>显示设置</Divider>
            <br />

            <List item-layout="horizontal" size="small">
              <ListItem>
                <ListItemMeta title="显示LOGO" />
                <i-switch slot="action" v-model="logoStatus" @on-change="handleLogoStatus" />
              </ListItem>

              <ListItem v-show="logoStatus">
                <ListItemMeta title="LOGO位置" />
                <Select
                  slot="action"
                  v-model="logoType"
                  size="small"
                  style="width: 80px"
                  @on-change="handleLogoType"
                >
                  <Option :value="1">样式一</Option>
                  <Option :value="2">样式二</Option>
                </Select>
              </ListItem>

              <ListItem>
                <ListItemMeta title="导航栏主题" />
                <Select
                  slot="action"
                  v-model="navTheme"
                  size="small"
                  style="width: 80px"
                  @on-change="handleNavTheme"
                >
                  <Option value="light">白色</Option>
                  <Option value="dark">黑色</Option>
                  <Option value="primary">蓝色</Option>
                </Select>
              </ListItem>

              <ListItem>
                <ListItemMeta title="侧边栏主题" />
                <Select
                  slot="action"
                  v-model="leftTheme"
                  size="small"
                  style="width: 80px"
                  @on-change="handleLeftTheme"
                >
                  <Option value="light">白色</Option>
                  <Option value="dark">黑色</Option>
                </Select>
              </ListItem>

              <ListItem>
                <ListItemMeta title="顶部菜单" />
                <Select
                  slot="action"
                  v-model="navType"
                  size="small"
                  style="width: 80px"
                  @on-change="handleNavType"
                >
                  <Option :value="1">默认</Option>
                  <Option :value="2">无图标</Option>
                  <Option :value="3">合并</Option>
                  <Option :value="4">面包屑</Option>
                </Select>
              </ListItem>
            </List>

            <br />
            <Divider>表格设置</Divider>
            <br />

            <List item-layout="horizontal" size="small">
              <ListItem v-if="false">
                <ListItemMeta title="表格单页面条数" />
                <InputNumber
                  slot="action"
                  v-model="tableSize"
                  :max="100"
                  :step="1"
                  :min="0"
                  :formatter="value => `${value.toFixed(0)}`"
                  @on-blur="handleTableSize"
                ></InputNumber>
              </ListItem>

              <ListItem>
                <ListItemMeta title="表格搜索" />
                <i-switch slot="action" v-model="tableSearch" @on-change="handleTableSearch" />
              </ListItem>
              <ListItem>
                <ListItemMeta title="表格提示" />
                <i-switch slot="action" v-model="tableTip" @on-change="handleTableTip" />
              </ListItem>

              <ListItem>
                <ListItemMeta title="表格纵向边框" />
                <i-switch slot="action" v-model="tableBorder" @on-change="handleTableBorder" />
              </ListItem>

              <ListItem>
                <ListItemMeta title="表格间隔斑马纹" />
                <i-switch slot="action" v-model="tableBstripe" @on-change="handleTableBstripe" />
              </ListItem>
            </List>
          </Drawer>
          <!-- 个性化设置  结束 -->

          <!-- 语言设置   开始 -->
          <Dropdown class="options" @on-click="handleLanDropdown">
            <Icon type="md-globe" :size="24" class="language"></Icon>
            <DropdownMenu slot="list">
              <DropdownItem name="zh-CN">中文</DropdownItem>
              <DropdownItem name="en-US">English</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <!-- 语言设置  结束 -->

          <!-- 锁屏   开始 -->
          <lock-screen></lock-screen>
          <!-- 锁屏   开始 -->

          <!-- 消息提示   开始 -->
          <message-tip v-model="mesCount"></message-tip>
          <!-- 消息提示   结束 -->

          <!-- 头像   开始 -->
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="hover" @on-click="handleClickUserDropdown">
                <a>
                  <span class="main-user-name">{{ username }}</span>
                  <Icon type="md-arrow-dropdown" />
                  <Avatar :src="avatarPath" style="margin-left: 10px; background: #619fe7"></Avatar>
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="ownSpace">{{ $t("userCenter") }}</DropdownItem>
                  <DropdownItem name="changePass">{{ $t("changePass") }}</DropdownItem>
                  <DropdownItem name="loginout" divided>{{ $t("logout") }}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Row>
          </div>
          <!-- 头像   结束 -->
        </div>
      </div>

      <!-- 页面标签栏 -->
      <div class="tags-con">
        <tags-page-opened :page-tags-list="pageTagsList"></tags-page-opened>
      </div>
    </div>

    <!-- 内容 -->
    <div class="single-page-con" :style="{ left: shrink ? '60px' : '220px' }">
      <div class="single-page">
        <keep-alive :include="cachePage">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>

    <!-- 全局加载动画 -->
    <circleLoading v-show="loading" class="loading-position" />
  </div>
</template>

<script>
import shrinkableMenu from "./main-components/shrinkable-menu/shrinkable-menu.vue";
import tagsPageOpened from "./main-components/tags-page-opened.vue";
import breadcrumbNav from "./main-components/breadcrumb-nav.vue";
import fullScreen from "./main-components/fullscreen.vue";
import lockScreen from "./main-components/lockscreen/lockscreen.vue";
import messageTip from "./main-components/message-tip.vue";
import circleLoading from "@/views/my-components/xboot/circle-loading.vue";
import Cookies from "js-cookie";
import util from "@/libs/util.js";
import { ws, getMessageSendData, getOtherSet } from "@/api/index";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
var client;
export default {
  components: {
    shrinkableMenu,
    tagsPageOpened,
    breadcrumbNav,
    fullScreen,
    lockScreen,
    messageTip,
    circleLoading,
  },
  data() {
    return {
      sliceNum: 3,
      shrink: false,
      layout: false,
      username: "",
      userId: "",
      isFullScreen: false,
      openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
      firstThreeNav: [],
      lastNav: [],
    };
  },
  computed: {
    loading() {
      return this.$store.state.app.loading;
    },
    navList() {
      return this.$store.state.app.navList;
    },
    currNav() {
      return this.$store.state.app.currNav;
    },
    currNavTitle() {
      return this.$store.state.app.currNavTitle;
    },
    menuList() {
      return this.$store.state.app.menuList;
    },
    pageTagsList() {
      return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
    },
    currentPath() {
      return this.$store.state.app.currentPath; // 当前面包屑数组
    },
    avatarPath() {
      return localStorage.avatorImgPath;
    },
    cachePage() {
      return this.$store.state.app.cachePage;
    },
    lang() {
      return this.$store.state.app.lang;
    },
    mesCount() {
      return this.$store.state.app.messageCount;
    },
    leftTheme() {
      return this.$store.state.app.leftTheme;
    },
    navTheme() {
      return this.$store.state.app.navTheme;
    },
    navType() {
      return this.$store.state.app.navType;
    },
    logoType() {
      return this.$store.state.app.logoType;
    },
    logoStatus() {
      return this.$store.state.app.logoStatus;
    },
    tableSize() {
      return this.$store.state.app.tableSize;
    },
    tableSearch() {
      return this.$store.state.app.tableSearch;
    },
    tableTip() {
      return this.$store.state.app.tableTip;
    },
    tableBorder() {
      return this.$store.state.app.tableBorder;
    },
    tableBstripe() {
      return this.$store.state.app.tableBstripe;
    },
  },
  stompClient: {
    monitorIntervalTime: 100,
    stompReconnect: true,
    timeout(orgCmd) {},
  },
  watch: {
    $route(to) {
      this.$store.commit("setCurrentPageName", to.name);
      let pathArr = util.setCurrentPath(this, to.name);
      if (pathArr.length > 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      this.checkTag(to.name);
      localStorage.currentPageName = to.name;
    },
    lang() {
      util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
    },
  },
  mounted() {
    this.init();
    let that = this;
    this.resize();
    window.addEventListener("resize", function () {
      that.resize();
    });
  },
  created() {
    // 显示打开的页面的列表
    this.$store.commit("setOpenedList");
  },
  methods: {
    init() {
      // 菜单
      let pathArr = util.setCurrentPath(this, this.$route.name);
      // this.$store.commit("updateMenulist");
      if (pathArr.length >= 2) {
        this.$store.commit("addOpenSubmenu", pathArr[1].name);
      }
      let userInfo = JSON.parse(Cookies.get("userInfo"));
      this.username = userInfo.username;
      this.userId = userInfo.id;
      this.checkTag(this.$route.name);
      let currWidth = document.body.clientWidth;
      if (currWidth <= 1200) {
        this.sliceNum = 3;
      }
      // 读取未读消息数
      getMessageSendData({
        userId: userInfo.id,
        status: 0,
      }).then(res => {
        if (res.success) {
          this.$store.commit("setMessageCount", res.result.totalElements);
        }
      });
      // 消息开关 websocket
      let messageOpen = this.getStore("messageOpen");
      if (messageOpen != "0") {
        this.connect();
      }
    },
    connect() {
      var headers = {};
      client = Stomp.over(new SockJS(ws));
      client.connect(headers, this.onConnected, this.onFailed);
    },
    onConnected(frame) {
      console.log("连接ws成功: " + frame);
      var topicSubscription = client.subscribe("/topic/subscribe", this.responseCallback);
      var queueSubscription = client.subscribe(
        "/user/" + this.userId + "/queue/subscribe",
        this.responseCallback
      );
    },
    onFailed(frame) {
      console.log("连接ws失败： " + JSON.stringify(frame));
    },
    responseCallback(frame) {
      console.log("收到消息：" + frame.body);
      this.$store.commit("setMessageCount", this.mesCount + 1);
    },
    selectNav(name) {
      this.$store.commit("setCurrNav", name);
      this.setStore("currNav", name);
      // 清空所有已打开标签
      // this.$store.commit("clearAllTags");
      // if (this.$route.name != "home_index") {
      //   this.$router.push({
      //     name: "home_index"
      //   });
      // }
      util.initRouter(this);
    },
    toggleClick() {
      this.shrink = !this.shrink;
    },
    handleLanDropdown(name) {
      this.$i18n.locale = name;
      this.$store.commit("switchLang", name);
    },
    handleNavTheme(name) {
      var data = JSON.parse(this.getStore("pageSetting"));
      data.navTheme = name;
      this.setStore("pageSetting", JSON.stringify(data));
      this.$store.commit("switchNavTheme", name);
    },
    handleNavType(name) {
      var data = JSON.parse(this.getStore("pageSetting"));
      data.navType = name;
      this.setStore("pageSetting", JSON.stringify(data));
      this.$store.commit("switchNavType", name);
    },
    handleLeftTheme(name) {
      var data = JSON.parse(this.getStore("pageSetting"));
      data.leftTheme = name;
      this.setStore("pageSetting", JSON.stringify(data));
      this.$store.commit("switchLeftTheme", name);
    },
    handleLogoType(name) {
      if (this.logoStatus && name == 2) {
        this.sliceNum = 3;
      } else {
        this.sliceNum = 5;
      }
      var data = JSON.parse(this.getStore("pageSetting"));
      data.logoType = name;
      this.setStore("pageSetting", JSON.stringify(data));
      this.$store.commit("switchLogoType", name);
    },
    handleLogoStatus(name) {
      var data = JSON.parse(this.getStore("pageSetting"));
      data.logoStatus = name;
      this.setStore("pageSetting", JSON.stringify(data));
      this.$store.commit("switchLogoStatus", name);
    },
    handleTableSize(name) {
      var data = JSON.parse(this.getStore("pageSetting"));
      data.tableSize = name;
      this.setStore("pageSetting", JSON.stringify(data));
      this.$store.commit("switchTableSize", name);
    },
    handleTableSearch(name) {
      var data = JSON.parse(this.getStore("pageSetting"));
      data.tableSearch = name;
      this.setStore("pageSetting", JSON.stringify(data));
      this.$store.commit("switchTableSearch", name);
    },
    handleTableTip(name) {
      var data = JSON.parse(this.getStore("pageSetting"));
      data.tableTip = name;
      this.setStore("pageSetting", JSON.stringify(data));
      this.$store.commit("switchTableTip", name);
    },
    handleTableBorder(name) {
      var data = JSON.parse(this.getStore("pageSetting"));
      data.tableBorder = name;
      this.setStore("pageSetting", JSON.stringify(data));
      this.$store.commit("switchTableBorder", name);
    },
    handleTableBstripe(name) {
      var data = JSON.parse(this.getStore("pageSetting"));
      data.tableBstripe = name;
      this.setStore("pageSetting", JSON.stringify(data));
      this.$store.commit("switchTableBstrip", name);
    },

    handleClickUserDropdown(name) {
      if (name == "ownSpace") {
        util.openNewPage(this, "ownspace_index");
        this.$router.push({
          name: "ownspace_index",
        });
      } else if (name == "changePass") {
        util.openNewPage(this, "change_pass");
        this.$router.push({
          name: "change_pass",
        });
      } else if (name == "loginout") {
        // 退出登录
        this.$store.commit("setLoading", true);
        getOtherSet().then(res => {
          this.$store.commit("setLoading", false);
          if (res.result) {
            let domain = res.result.ssoDomain;
            Cookies.set("accessToken", "", {
              domain: domain,
              expires: 7,
            });
          }
          this.$store.commit("logout", this);
          this.$store.commit("clearOpenedSubmenu");
          this.setStore("accessToken", "");
          this.removeStore("pageSetting");
          this.removeStore("pageOpenedList");
          this.removeStore("cachePage");
          // 强制刷新页面 重新加载router
          location.reload();
        });
      }
    },
    checkTag(name) {
      let openpageHasTag = this.pageTagsList.some(item => {
        if (item.name == name) {
          return true;
        }
      });
      if (!openpageHasTag) {
        //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
        util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
      }
    },
    handleSubmenuChange(val) {
      // console.log(val)
    },
    beforePush(name) {
      // console.log(name)
      return true;
    },
    fullscreenChange(isFullScreen) {
      // console.log(isFullScreen);
    },
    resize() {
      let currWidth = document.body.clientWidth;
      if (currWidth <= 1200 && currWidth > 900) {
        this.sliceNum = 3;
        this.shrink = true;
      } else if (currWidth <= 900) {
        this.sliceNum = 1;
        this.shrink = true;
      } else {
        this.sliceNum = 5;
      }
    },
  },
};
</script>
