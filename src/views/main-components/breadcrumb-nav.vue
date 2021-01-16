<template>
  <Breadcrumb>
    <BreadcrumbItem v-for="item in currentPath" :key="item.name" :to="item.path">
      {{ itemTitle(item) }}
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
export default {
  name: "BreadcrumbNav",
  props: {
    currentPath: Array,
  },
  methods: {
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
