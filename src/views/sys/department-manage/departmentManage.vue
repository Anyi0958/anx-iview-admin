<style lang="less">
@import "../../../styles/tree-common.less";
@import "./departmentManage.less";
</style>
<template>
  <div class="search">
    <Card>
      <Row class="operation">
        <Button v-show="showType == 'tree'" type="primary" icon="md-add" @click="add">
          添加子部门
        </Button>
        <Button icon="md-add" @click="addRoot">添加一级部门</Button>
        <Button icon="md-trash" @click="delAll">批量删除</Button>
        <Button icon="md-refresh" @click="getParentList">刷新</Button>
        <Input
          v-show="showType == 'list'"
          v-model="searchKey"
          suffix="ios-search"
          placeholder="输入部门名搜索"
          clearable
          style="width: 250px"
          @on-change="search"
        />
        <i-switch
          v-show="showType == 'tree'"
          v-model="strict"
          size="large"
          style="margin-left: 5px"
        >
          <span slot="open">级联</span>
          <span slot="close">单选</span>
        </i-switch>
        <div style="float: right">
          <RadioGroup v-model="showType" type="button">
            <Radio title="树结构" label="tree">
              <Icon type="md-list"></Icon>
            </Radio>
            <Radio title="列表" label="list">
              <Icon type="ios-apps"></Icon>
            </Radio>
          </RadioGroup>
        </div>
      </Row>
      <Row v-show="showType == 'tree'" type="flex" justify="start" :gutter="16">
        <Col :sm="8" :md="8" :lg="8" :xl="6">
          <Alert show-icon>
            当前选择编辑：
            <span class="select-title">{{ editTitle }}</span>
            <a v-show="form.id && editTitle" class="select-clear" @click="cancelEdit">取消选择</a>
          </Alert>
          <Input
            v-model="searchKey"
            suffix="ios-search"
            placeholder="输入部门名搜索"
            clearable
            @on-change="search"
          />
          <div style="position: relative">
            <div class="tree-bar" :style="{ maxHeight: maxHeight }">
              <Tree
                ref="tree"
                :data="data"
                :load-data="loadData"
                show-checkbox
                :check-strictly="!strict"
                @on-check-change="changeSelect"
                @on-select-change="selectTree"
              ></Tree>
            </div>
            <Spin v-if="loading" size="large" fix></Spin>
          </div>
        </Col>
        <Col :sm="16" :md="16" :lg="16" :xl="9">
          <Form ref="form" :model="form" :label-width="100" :rules="formValidate">
            <FormItem label="上级部门" prop="parentTitle">
              <div style="display: flex">
                <Input v-model="form.parentTitle" readonly style="margin-right: 10px" />
                <Poptip
                  transfer
                  trigger="click"
                  placement="right-start"
                  title="选择上级部门"
                  width="250"
                >
                  <Button icon="md-list">选择部门</Button>
                  <div slot="content" style="position: relative; min-height: 5vh">
                    <Tree
                      :data="dataEdit"
                      :load-data="loadData"
                      @on-select-change="selectTreeEdit"
                    ></Tree>
                    <Spin v-if="loadingEdit" size="large" fix></Spin>
                  </div>
                </Poptip>
              </div>
            </FormItem>
            <FormItem label="部门名称" prop="title">
              <Input v-model="form.title" />
            </FormItem>
            <FormItem label="部门负责人" prop="mainHeader">
              <Select
                v-model="form.mainHeader"
                :loading="userLoading"
                not-found-text="该部门暂无用户数据"
                multiple
                filterable
                placeholder="请选择或输入搜索用户"
              >
                <Option
                  v-for="item in users"
                  :key="item.id"
                  :value="item.id"
                  :label="item.nickname"
                >
                  <span style="margin-right: 10px">{{ item.nickname }}</span>
                  <span style="color: #ccc">{{ item.username }}</span>
                </Option>
              </Select>
            </FormItem>
            <FormItem label="副负责人" prop="viceHeader">
              <Select
                v-model="form.viceHeader"
                :loading="userLoading"
                not-found-text="该部门暂无用户数据"
                multiple
                filterable
                placeholder="请选择或输入搜索用户"
              >
                <Option
                  v-for="item in users"
                  :key="item.id"
                  :value="item.id"
                  :label="item.nickname"
                >
                  <span style="margin-right: 10px">{{ item.nickname }}</span>
                  <span style="color: #ccc">{{ item.username }}</span>
                </Option>
              </Select>
            </FormItem>
            <FormItem label="排序值" prop="sortOrder">
              <Tooltip trigger="hover" placement="right" content="值越小越靠前，支持小数">
                <InputNumber v-model="form.sortOrder" :max="1000" :min="0"></InputNumber>
              </Tooltip>
            </FormItem>
            <FormItem label="是否启用" prop="status">
              <i-switch v-model="form.status" size="large" :true-value="0" :false-value="-1">
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
              </i-switch>
            </FormItem>
            <FormItem class="br">
              <Button
                :loading="submitLoading"
                :disabled="!form.id || !editTitle"
                type="primary"
                icon="ios-create-outline"
                @click="submitEdit"
              >
                修改并保存
              </Button>
              <Button @click="handleReset">重置</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <Alert v-show="showType == 'list'" show-icon>
        已选择
        <span class="select-count">{{ selectList.length }}</span>
        项
        <a class="select-clear" @click="clearSelectAll">清空</a>
      </Alert>
      <Table
        v-if="showType == 'list'"
        ref="table"
        row-key="title"
        :load-data="loadData"
        :columns="columns"
        :data="data"
        :loading="loading"
        border
        :update-show-children="true"
        @on-selection-change="showSelect"
      ></Table>
    </Card>

    <Modal v-model="modalVisible" :title="modalTitle" :mask-closable="false" :width="500">
      <Form ref="formAdd" :model="formAdd" :label-width="85" :rules="formValidate">
        <div v-if="showParent">
          <FormItem label="上级部门：">{{ form.title }}</FormItem>
        </div>
        <FormItem label="部门名称" prop="title">
          <Input v-model="formAdd.title" />
        </FormItem>
        <FormItem label="排序值" prop="sortOrder">
          <Tooltip trigger="hover" placement="right" content="值越小越靠前，支持小数">
            <InputNumber v-model="formAdd.sortOrder" :max="1000" :min="0"></InputNumber>
          </Tooltip>
        </FormItem>
        <FormItem label="是否启用" prop="status">
          <i-switch v-model="formAdd.status" size="large" :true-value="0" :false-value="-1">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelAdd">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitAdd">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  initDepartment,
  loadDepartment,
  addDepartment,
  editDepartment,
  deleteDepartment,
  searchDepartment,
  getUserByDepartmentId,
} from "@/api/index";
export default {
  name: "DepartmentManage",
  data() {
    return {
      showType: "tree",
      loading: true,
      maxHeight: "500px",
      strict: true,
      userLoading: false,
      loadingEdit: true,
      modalVisible: false,
      selectList: [],
      showParent: false,
      modalTitle: "",
      editTitle: "",
      searchKey: "",
      form: {
        id: "",
        title: null,
        parentId: "",
        parentTitle: "",
        sortOrder: 0,
        status: 0,
      },
      formAdd: {},
      formValidate: {
        title: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        sortOrder: [
          {
            required: true,
            type: "number",
            message: "排序值不能为空",
            trigger: "change",
          },
        ],
      },
      submitLoading: false,
      data: [],
      dataEdit: [],
      users: [],
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center",
        },
        {
          type: "index",
          width: 60,
          align: "center",
        },
        {
          title: "部门名称",
          key: "title",
          minWidth: 120,
          sortable: true,
          tree: true,
        },
        {
          title: "排序",
          key: "sortOrder",
          width: 150,
          sortable: true,
          align: "center",
          sortType: "asc",
        },
        {
          title: "创建时间",
          key: "createTime",
          sortable: true,
          width: 200,
        },
        {
          title: "操作",
          key: "action",
          width: 300,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "a",
                {
                  on: {
                    click: () => {
                      this.tableAdd(params.row);
                    },
                  },
                },
                "添加子部门"
              ),
              h("Divider", {
                props: {
                  type: "vertical",
                },
              }),
              h(
                "a",
                {
                  on: {
                    click: () => {
                      this.remove(params.row);
                    },
                  },
                },
                "删除"
              ),
            ]);
          },
        },
      ],
    };
  },
  mounted() {
    // 计算高度
    let height = document.documentElement.clientHeight;
    this.maxHeight = Number(height - 287) + "px";
    this.init();
  },
  methods: {
    init() {
      this.getParentList();
      this.getParentListEdit();
    },
    getParentList() {
      this.loading = true;
      initDepartment().then(res => {
        this.loading = false;
        if (res.success) {
          res.result.forEach(function (e) {
            if (e.isParent) {
              e.loading = false;
              e.children = [];
              e._loading = false;
            }
          });
          this.data = res.result;
        }
      });
    },
    getParentListEdit() {
      this.loadingEdit = true;
      initDepartment().then(res => {
        this.loadingEdit = false;
        if (res.success) {
          res.result.forEach(function (e) {
            if (e.isParent) {
              e.loading = false;
              e.children = [];
            }
          });
          // 头部加入一级
          let first = {
            id: "0",
            title: "一级部门",
          };
          res.result.unshift(first);
          this.dataEdit = res.result;
        }
      });
    },
    loadData(item, callback) {
      loadDepartment(item.id).then(res => {
        if (res.success) {
          res.result.forEach(function (e) {
            if (e.isParent) {
              e.loading = false;
              e.children = [];
              e._loading = false;
            }
          });
          callback(res.result);
        }
      });
    },
    search() {
      if (this.searchKey) {
        this.loading = true;
        searchDepartment({ title: this.searchKey }).then(res => {
          this.loading = false;
          if (res.success) {
            res.result.forEach(function (e) {
              if (e.isParent) {
                e.loading = false;
                e.children = [];
                e._loading = false;
              }
            });
            this.data = res.result;
          }
        });
      } else {
        this.getParentList();
      }
    },
    selectTree(v) {
      if (v.length > 0) {
        // 转换null为""
        for (let attr in v[0]) {
          if (v[0][attr] == null) {
            v[0][attr] = "";
          }
        }
        let str = JSON.stringify(v[0]);
        let data = JSON.parse(str);
        this.editTitle = data.title;
        // 加载部门用户数据
        this.userLoading = true;
        getUserByDepartmentId(data.id).then(res => {
          this.userLoading = false;
          if (res.success) {
            this.users = res.result;
            // 回显
            this.form = data;
          }
        });
      } else {
        this.cancelEdit();
      }
    },
    cancelEdit() {
      let data = this.$refs.tree.getSelectedNodes()[0];
      if (data) {
        data.selected = false;
      }
      this.$refs.form.resetFields();
      delete this.form.id;
      this.editTitle = "";
    },
    selectTreeEdit(v) {
      if (v.length > 0) {
        // 转换null为""
        for (let attr in v[0]) {
          if (v[0][attr] == null) {
            v[0][attr] = "";
          }
        }
        let str = JSON.stringify(v[0]);
        let data = JSON.parse(str);
        if (this.form.id == data.id) {
          this.$Message.warning("请勿选择自己作为父节点");
          v[0].selected = false;
          return;
        }
        this.form.parentId = data.id;
        this.form.parentTitle = data.title;
      }
    },
    cancelAdd() {
      this.modalVisible = false;
    },
    handleReset() {
      this.$refs.form.resetFields();
      this.form.status = 0;
    },
    submitEdit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (!this.form.id) {
            this.$Message.warning("请先点击选择要修改的部门");
            return;
          }
          this.submitLoading = true;
          editDepartment(this.form).then(res => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("编辑成功");
              this.init();
              this.modalVisible = false;
            }
          });
        }
      });
    },
    submitAdd() {
      this.$refs.formAdd.validate(valid => {
        if (valid) {
          this.submitLoading = true;
          addDepartment(this.formAdd).then(res => {
            this.submitLoading = false;
            if (res.success) {
              this.$Message.success("添加成功");
              this.init();
              this.modalVisible = false;
            }
          });
        }
      });
    },
    add() {
      if (this.form.id == "" || this.form.id == null) {
        this.$Message.warning("请先点击选择一个部门");
        return;
      }
      this.modalTitle = "添加子部门";
      this.showParent = true;
      if (!this.form.children) {
        this.form.children = [];
      }
      this.formAdd = {
        parentId: this.form.id,
        sortOrder: this.form.children.length + 1,
        status: 0,
      };
      this.modalVisible = true;
    },
    addRoot() {
      this.modalTitle = "添加一级部门";
      this.showParent = false;
      this.formAdd = {
        parentId: 0,
        sortOrder: this.data.length + 1,
        status: 0,
      };
      this.modalVisible = true;
    },
    changeSelect(v) {
      this.selectList = v;
    },
    tableAdd(v) {
      this.form = v;
      this.add();
      this.editTitle = "";
      let data = this.$refs.tree.getSelectedNodes()[0];
      if (data) {
        data.selected = false;
      }
    },
    showSelect(e) {
      this.selectList = e;
    },
    clearSelectAll() {
      this.$refs.table.selectAll(false);
    },
    remove(v) {
      this.selectList = [];
      this.selectList.push(v);
      this.delAll();
    },
    delAll() {
      if (this.selectList.length <= 0) {
        this.$Message.warning("您还未勾选要删除的数据");
        return;
      }
      this.$Modal.confirm({
        title: "确认删除",
        content: "您确认要删除所选的 " + this.selectList.length + " 条数据及其下级所有数据?",
        loading: true,
        onOk: () => {
          let ids = "";
          this.selectList.forEach(function (e) {
            ids += e.id + ",";
          });
          ids = ids.substring(0, ids.length - 1);
          deleteDepartment({ ids: ids }).then(res => {
            this.$Modal.remove();
            if (res.success) {
              this.$Message.success("删除成功");
              this.selectList = [];
              this.cancelEdit();
              this.init();
            }
          });
        },
      });
    },
  },
};
</script>
