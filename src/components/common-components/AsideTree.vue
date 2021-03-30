<template>
  <div>
    <div style="border-bottom: 1px solid #ccc; padding: 5px;">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText"
        size="mini"
      >
      </el-input>
    </div>
    <el-tree
      class="filter-tree"
      :data="dataTree"
      :props="defaultProps"
      :filter-node-method="filterNode"
      ref="tree"
      node-key="id"
      @node-click="nodeClick"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>
          <i :class="data.icon"></i>
          {{ node.label }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  name: "AsideTree",
  props: {
    dataTree: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      //树形控件
      filterText: "",
      //树形结构默认树形
      defaultProps: {
        children: "children",
        label: "name"
      }
    };
  },
  created() {
    //获取树形结构数据
    this.getDataTree();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    //获取树形结构数据
    getDataTree() {
      this.$emit("dateTree", "获取树形结构");
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    //树形控件点击事件
    nodeClick(row) {
      this.$emit("handleClick", row.id);
    }
  }
};
</script>

<style></style>
