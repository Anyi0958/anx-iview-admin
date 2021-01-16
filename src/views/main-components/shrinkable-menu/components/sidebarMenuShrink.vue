<template>
  <div>
    <template v-for="(item, index) in menuList">
      <div :key="index" style="text-align: center">
        <Dropdown
          v-if="item.children.length !== 1"
          :key="index"
          transfer
          placement="right-start"
          @on-click="changeMenu"
        >
          <Button style="width: 70px; height: 42px; margin-left: -5px; padding: 10px 0" type="text">
            <Icon :size="20" :color="iconColor" :type="item.icon"></Icon>
          </Button>
          <DropdownMenu slot="list" style="width: 200px">
            <template v-for="(child, i) in item.children">
              <DropdownItem :key="i" :name="child.name">
                <Icon :type="child.icon"></Icon>
                <span style="padding-left: 10px">{{ itemTitle(child) }}</span>
              </DropdownItem>
            </template>
          </DropdownMenu>
        </Dropdown>
        <Dropdown v-else :key="index" transfer placement="right-start" @on-click="changeMenu">
          <Button
            style="width: 70px; height: 42px; margin-left: -5px; padding: 10px 0"
            type="text"
            @click="changeMenu(item.children[0].name)"
          >
            <Icon :size="20" :color="iconColor" :type="item.children[0].icon || item.icon"></Icon>
          </Button>
          <DropdownMenu slot="list" style="width: 200px">
            <DropdownItem :key="'d' + index" :name="item.children[0].name">
              <Icon :type="item.children[0].icon || item.icon"></Icon>
              <span style="padding-left: 10px">{{ itemTitle(item.children[0]) }}</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "SidebarMenuShrink",
  props: {
    menuList: {
      type: Array,
    },
    iconColor: {
      type: String,
      default: "white",
    },
    menuTheme: {
      type: String,
      default: "dark",
    },
  },
  methods: {
    changeMenu(active) {
      this.$emit("on-change", active);
    },
    itemTitle(item) {
      if (typeof item.title == "object") {
        return this.$t(item.title.i18n);
      } else {
        return item.title;
      }
    },
  },
};
</script>
