<template>
  <div>
    <div :id="id"></div>

    <Modal
      v-model="showHTMLModal"
      title="编辑html代码"
      :mask-closable="false"
      :width="900"
      :fullscreen="full"
      :z-index="10001"
    >
      <Input
        v-if="!full"
        v-model="dataEdit"
        :rows="15"
        type="textarea"
        style="max-height: 60vh; overflow: auto"
      />
      <Input v-if="full" v-model="dataEdit" :rows="32" type="textarea" />
      <div slot="footer">
        <Button icon="md-expand" @click="full = !full">全屏开/关</Button>
        <Button type="primary" icon="md-checkmark-circle-outline" @click="editHTMLOk">
          确定保存
        </Button>
      </div>
    </Modal>
    <Modal
      v-model="showClearModal"
      :closable="false"
      :mask-closable="false"
      :width="416"
      :footer-hide="true"
      :z-index="10001"
    >
      <div class="ivu-modal-confirm">
        <div class="ivu-modal-confirm-head">
          <div class="ivu-modal-confirm-head-icon ivu-modal-confirm-head-icon-confirm">
            <i class="ivu-icon ivu-icon-ios-help-circle"></i>
          </div>
          <div class="ivu-modal-confirm-head-title">确认清空</div>
        </div>
        <div class="ivu-modal-confirm-body">确认要清空编辑器内容？</div>
        <div class="ivu-modal-confirm-footer">
          <Button type="text" @click="showClearModal = false">取消</Button>
          <Button type="primary" @click="clear">确定</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { uploadFile } from "@/api/index";
import E from "wangeditor";
import xss from "xss";
import hljs from "highlight.js";
// 表情包配置 自定义表情可在该js文件中统一修改
import { sina } from "@/libs/emoji";
export default {
  name: "Editor",
  props: {
    id: {
      type: String,
      default: "editor",
    },
    value: String,
    base64: {
      type: Boolean,
      default: false,
    },
    expandHtml: {
      type: Boolean,
      default: true,
    },
    expandClear: {
      type: Boolean,
      default: true,
    },
    showFullScreen: {
      type: Boolean,
      default: true,
    },
    openXss: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editor: null,
      data: this.value, // 富文本数据
      dataEdit: "", // 编辑数据
      showHTMLModal: false, // 显示html
      full: false, // html全屏开关
      showClearModal: false,
    };
  },
  watch: {
    value(val) {
      this.setData(val);
    },
  },
  beforeDestroy() {
    // 调用销毁 API 对当前编辑器实例进行销毁
    if (this.editor != null) {
      this.editor.destroy();
    }
  },
  mounted() {
    this.initEditor();
  },
  methods: {
    initEditor() {
      let that = this;
      this.editor = new E(`#${this.id}`);
      const { $, BtnMenu, DropListMenu, PanelMenu, DropList, Panel, Tooltip } = E;
      // 扩展菜单
      class EditHTMLMenu extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(
            `<div class="w-e-menu"><i class="ivu-icon ivu-icon-md-code-working" style="font-size: 22px;"></i></div>`
          );
          super($elem, editor);
        }
        // 菜单点击事件
        clickHandler() {
          that.editHTML();
        }
        // 菜单激活状态
        tryChangeActive() {}
      }
      class ClearMenu extends BtnMenu {
        constructor(editor) {
          const $elem = E.$(
            `<div class="w-e-menu"><i class="ivu-icon ivu-icon-md-trash" style="font-size: 18px;"></i></div>`
          );
          super($elem, editor);
        }
        // 菜单点击事件
        clickHandler() {
          that.showClearModal = true;
        }
        // 菜单激活状态
        tryChangeActive() {}
      }
      if (this.expandHtml) {
        // 扩展注册菜单 将菜单加入到 editor.config.menus 中
        this.editor.menus.extend("editHTMLMenu", EditHTMLMenu);
        this.editor.config.menus = this.editor.config.menus.concat("editHTMLMenu");
      }
      if (this.expandClear) {
        this.editor.menus.extend("clearMenu", ClearMenu);
        this.editor.config.menus = this.editor.config.menus.concat("clearMenu");
      }
      // 全屏
      this.editor.config.showFullScreen = this.showFullScreen;
      // 编辑内容绑定数据
      this.editor.config.onchange = html => {
        if (this.openXss) {
          this.data = xss(html);
        } else {
          this.data = html;
        }
        this.$emit("input", this.data);
        this.$emit("on-change", this.data);
      };
      // z-index
      this.editor.config.zIndex = 100;
      if (this.base64) {
        // 使用 base64 保存图片
        this.editor.config.uploadImgShowBase64 = true;
      } else {
        // 配置上传图片服务器端地址
        this.editor.config.uploadImgServer = uploadFile;
        // xboot如要header中传入token鉴权
        this.editor.config.uploadImgHeaders = {
          accessToken: that.getStore("accessToken"),
        };
        this.editor.config.uploadFileName = "file";
        this.editor.config.uploadImgHooks = {
          before: function (xhr, editor, files) {
            // 图片上传之前触发
          },
          success: function (xhr, editor, result) {
            // 图片上传并返回结果，图片插入成功之后触发
          },
          fail: function (xhr, editor, result) {
            // 图片上传并返回结果，但图片插入错误时触发
            that.$Message.error("上传图片失败");
          },
          error: function (xhr, editor) {
            // 图片上传出错时触发
            that.$Message.error("上传图片出错");
          },
          timeout: function (xhr, editor) {
            // 图片上传超时时触发
            that.$Message.error("上传图片超时");
          },
          // 如果服务器端返回的不是 {errno:0, data: [...]} 这种格式，可使用该配置
          customInsert: function (insertImg, result, editor) {
            if (result.success == true) {
              let url = result.result;
              insertImg(url);
              that.$Message.success("上传图片成功");
            } else {
              that.$Message.error(result.message);
            }
          },
        };
      }
      this.editor.config.customAlert = function (info) {
        // info 是需要提示的内容
        // that.$Message.info(info);
      };
      // 表情面板可以有多个 tab ，因此要配置成一个数组。数组每个元素代表一个 tab 的配置
      this.editor.config.emotions = [
        {
          // tab 的标题
          title: "新浪",
          // type -> 'emoji' / 'image'
          type: "image",
          // content -> 数组
          content: sina,
        },
      ];
      this.editor.create();
      if (this.value) {
        if (this.openXss) {
          this.editor.txt.html(xss(this.value));
        } else {
          this.editor.txt.html(this.value);
        }
      }
    },
    editHTML() {
      this.dataEdit = this.data;
      this.showHTMLModal = true;
    },
    editHTMLOk() {
      this.editor.txt.html(this.dataEdit);
      this.$emit("input", this.dataEdit);
      this.$emit("on-change", this.dataEdit);
      this.showHTMLModal = false;
    },
    clear() {
      this.data = "";
      this.editor.txt.html(this.data);
      this.$emit("input", this.data);
      this.$emit("on-change", this.data);
      this.showClearModal = false;
    },
    setData(value) {
      if (!this.editor) {
        this.initEditor();
      }
      if (value && value != this.data) {
        this.data = value;
        this.editor.txt.html(this.data);
        this.$emit("input", this.data);
        this.$emit("on-change", this.data);
      }
    },
  },
};
</script>

<style lang="less"></style>
