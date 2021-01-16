<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
.time {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}
.content {
  padding-left: 5px;
  font-size: 14px;
}
</style>

<template>
  <div>
    <div v-show="currNav == 'xboot'" class="home">
      <Row :gutter="10">
        <Col :lg="24" :xl="12">
          <Row :gutter="10">
            <Col :lg="12" :xl="12" :style="{ marginBottom: '10px' }">
              <Card>
                <Row type="flex" class="user-info">
                  <Col span="8">
                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                      <img class="avator-img" :src="avatarPath" />
                    </Row>
                  </Col>
                  <Col span="16" style="padding-left: 6px">
                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                      <div>
                        <b class="card-user-info-name">{{ username }}</b>
                        <p>您好，欢迎您的使用</p>
                      </div>
                    </Row>
                  </Col>
                </Row>
                <div class="line-gray"></div>
                <Row class="margin-top-20">
                  <Col span="8">
                    <p class="notwrap">本次登录地点:</p>
                  </Col>
                  <Col span="6">{{ city }}</Col>
                  <Col span="10">角色：{{ roles }}</Col>
                </Row>
              </Card>
            </Col>

            <Col :lg="12" :xl="12" :style="{ marginBottom: '10px' }">
              <Card>
                <div style="height: 180px">
                  随机背景图：
                  <br />
                  <a
                    style="display: inline-block; margin: 5px 0 0 20px"
                    target="_blnk"
                    href="http://api.neweb.top/bing.php?type=rand"
                  >
                    http://api.neweb.top/bing.php?type=rand
                  </a>
                  <br />
                  <br />
                  随机动漫图：
                  <br />
                  <a
                    style="display: inline-block; margin: 5px 0 0 20px"
                    target="_blnk"
                    href="http://api.jybkw.cn/dmimg"
                  >
                    http://api.jybkw.cn/dmimg
                  </a>
                  <br />
                  <br />
                  随机小姐姐图：
                  <br />
                  <a
                    style="display: inline-block; margin: 5px 0 0 20px"
                    target="_blnk"
                    href="http://api.jybkw.cn/img/"
                  >
                    http://api.jybkw.cn/img/
                  </a>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>

        <Col :lg="24" :xl="12">
          <Row :gutter="5">
            <Col :sm="24" :md="12" :style="{ marginBottom: '10px' }">
              <info-card
                id-name="user_created_count"
                :end-val="count.createUser"
                icon-type="md-person-add"
                color="#2d8cf0"
                intro-text="今日新增用户"
              ></info-card>
            </Col>
            <Col :sm="24" :md="12" :style="{ marginBottom: '10px' }">
              <info-card
                id-name="visit_count"
                :end-val="count.visit"
                icon-type="ios-eye"
                color="#64d572"
                :icon-size="50"
                intro-text="今日浏览量"
              ></info-card>
            </Col>
            <Col :sm="24" :md="12" :style="{ marginBottom: '10px' }">
              <info-card
                id-name="collection_count"
                :end-val="count.collection"
                icon-type="md-cloud-upload"
                color="#ffd572"
                intro-text="今日数据采集量"
              ></info-card>
            </Col>
            <Col :sm="24" :md="12" :style="{ marginBottom: '10px' }">
              <info-card
                id-name="transfer_count"
                :end-val="count.transfer"
                icon-type="md-shuffle"
                color="#f25e43"
                intro-text="今日服务调用量"
              ></info-card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row :gutter="10">
        <Col :lg="24" :xl="8" :style="{ marginBottom: '10px' }">
          <Card>
            <p slot="title">
              <Icon type="md-time" />
              时间轴
            </p>

            <Timeline>
              <TimelineItem v-hasRole="'ROLE_ADMIN'" color="red">
                <p class="time">2020.09.03 idea</p>
                <p class="content">
                  <Badge status="default" />
                  时光轴抽离为单独页面(做成日记)，点击每日标题可查看，详细内容。可在线添加编辑。
                </p>
              </TimelineItem>

              <TimelineItem color="red">
                <p class="time">2020.09.03</p>
                <p class="content">
                  <Badge status="default" />
                  增加个性化设置
                </p>
              </TimelineItem>

              <TimelineItem color="blue">
                <p class="time">2020.08.03</p>
                <p class="content">
                  <Badge status="default" />
                  注意：新窗口打开临时页面需要在 路由 /router/router.js中定义好
                </p>
              </TimelineItem>

              <TimelineItem color="blue">
                <p class="time">2020.08.03</p>
                <p class="content">
                  <Badge status="default" />
                  修改全屏组件，支持自定义DOM节点
                </p>
                <p class="content">
                  <Badge status="default" />
                  增加vxe-table基础表格示例，以及全局格式化方法
                </p>
              </TimelineItem>

              <TimelineItem color="blue">
                <p class="time">2020.07.31</p>
                <p class="content">
                  <Badge status="default" />
                  正式运行
                </p>
              </TimelineItem>
            </Timeline>
          </Card>
        </Col>
        <Col :lg="24" :xl="8" :style="{ marginBottom: '10px' }">
          <visit-volume />
        </Col>
        <Col :lg="24" :xl="8" :style="{ marginBottom: '10px' }">
          <visit-separation />
        </Col>
      </Row>
    </div>
    <div
      v-show="
        currNav == 'doc' || currNav == 'xboot-show' || currNav == 'xpay' || currNav == 'xmall'
      "
    >
      <show />
    </div>
    <div v-show="currNav == 'app'">
      <dashboard2 />
    </div>
  </div>
</template>

<script>
import { ipInfo, getNotice } from "@/api/index";
import visitVolume from "./components/visitVolume.vue";
import visitSeparation from "./components/visitSeparation.vue";
import infoCard from "./components/infoCard.vue";
import show from "./show.vue";
import dashboard2 from "../xboot-charts/dashboard2/dashboard2.vue";
import Cookies from "js-cookie";
import "gitalk/dist/gitalk.css";
import Gitalk from "gitalk";

export default {
  name: "Home",
  components: {
    visitVolume,
    visitSeparation,
    infoCard,
    show,
    dashboard2,
  },
  data() {
    return {
      roles: [],
      count: {
        createUser: 496,
        visit: 3264,
        collection: 24389305,
        transfer: 39503498,
      },
      city: "",
      username: "",
    };
  },
  computed: {
    currNav() {
      return this.$store.state.app.currNav;
    },
    avatarPath() {
      return localStorage.avatorImgPath;
    },
  },
  mounted() {
    this.init();
    // 通知
    let noticeFlag = "noticeShowed";
    let notice = Cookies.get(noticeFlag);
    if (notice != noticeFlag) {
      this.showNotice();
      Cookies.set(noticeFlag, noticeFlag);
    }
  },
  methods: {
    init() {
      this.roles = this.getStore("roles");
      let userInfo = JSON.parse(Cookies.get("userInfo"));
      this.username = userInfo.nickname;
      ipInfo().then(res => {
        if (res.success) {
          this.city = res.result;
        }
      });
    },
    showNotice() {
      getNotice().then(res => {
        if (res.success) {
          if (!res.result) {
            return;
          }
          let data = res.result;
          if (data.open && (data.title || data.content) && data.position == "HOME") {
            this.$Notice.info({
              title: data.title,
              desc: data.content,
              duration: data.duration,
            });
          }
        }
      });
    },
  },
};
</script>
