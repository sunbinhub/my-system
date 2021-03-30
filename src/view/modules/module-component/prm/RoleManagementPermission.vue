<template>
  <div>
    <el-col :span="5" style="border: 1px solid #ddd;height:400px;">
      <div style="border-bottom: 1px solid #ccc; padding: 5px;">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="organizationFilterText"
          size="mini"
        >
        </el-input>
      </div>
      <el-tree
        class="filter-tree"
        :data="organizationData"
        :props="organizationDefaultProps"
        :filter-node-method="organizationFilterNode"
        highlight-current
        ref="organizationTree"
        node-key="id"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>
            <i :class="data.icon"></i>
            {{ node.label }}
          </span>
        </span>
      </el-tree>
    </el-col>
    <el-col :span="1">&nbsp;</el-col>
    <el-col :span="18" style="border: 1px solid #ddd;height:400px;">
      <div style="border-bottom: 1px solid #ccc; padding: 5px;">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="applicationPermissionFilterText"
          size="mini"
        >
        </el-input>
      </div>
      <el-tree
        :data="applicationPermissionData"
        show-checkbox
        node-key="id"
        ref="applicationPermissionTree"
        highlight-current
        :props="applicationPermissionDefaultProps"
        :filter-node-method="applicationPermissionFilterNode"
      >
      </el-tree>
    </el-col>
  </div>
</template>

<script>
export default {
  name: "RoleManagementPermission",
  data() {
    return {
      //应用树形结构搜索
      organizationFilterText: "",
      //应用树形结构数据
      organizationData: [
        {
          id: 1,
          label: "一级 1",
          icon: "el-icon-folder",
          children: [
            {
              id: 4,
              label: "二级 你好",
              icon: "el-icon-folder",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1",
                  icon: "el-icon-folder"
                },
                {
                  id: 10,
                  label: "三级 1-1-2",
                  icon: "el-icon-folder"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          icon: "el-icon-folder",
          children: [
            {
              id: 5,
              label: "二级 2-1",
              icon: "el-icon-folder"
            },
            {
              id: 6,
              label: "二级 2-2",
              icon: "el-icon-folder"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          icon: "el-icon-folder",
          children: [
            {
              id: 7,
              label: "二级 3-1",
              icon: "el-icon-folder"
            },
            {
              id: 8,
              label: "二级 3-2",
              icon: "el-icon-folder"
            }
          ]
        }
      ],
      //应用树形结构默认树形
      organizationDefaultProps: {
        children: "children",
        label: "label"
      },

      //权限树形结构搜索
      applicationPermissionFilterText: "",
      //权限树形结构数据
      applicationPermissionData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "三级 1-1-1"
                },
                {
                  id: 10,
                  label: "三级 1-1-2"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "二级 2-1"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      //权限树形结构默认树形
      applicationPermissionDefaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  watch: {
    //树形结构搜索方法
    organizationFilterText(val) {
      this.$refs.organizationTree.filter(val);
    },
    //树形结构搜索方法
    applicationPermissionFilterText(val) {
      this.$refs.applicationPermissionTree.filter(val);
    }
  },
  methods: {
    //树形结构事件
    organizationFilterNode(value, organizationData) {
      if (!value) return true;
      return organizationData.label.indexOf(value) !== -1;
    },
    //树形结构事件
    applicationPermissionFilterNode(value, applicationPermissionData) {
      if (!value) return true;
      return applicationPermissionData.label.indexOf(value) !== -1;
    }
  }
};
</script>

<style></style>
