<template>
  <div>
    <!-- 遍历子组件 -->
    <div v-for="navItem in navMenus" :key="navItem.id">
      <!-- 如果当前有子菜单，则显示 el-submenu ，在el-subment里调用 递归组件 -->
      <el-submenu
        v-if="navItem.hasChildren"
        :index="navItem.path"
        :key="navItem.id"
      >
        <template slot="title">
          <i :class="navItem.icon"></i>
          <span>{{ navItem.name }}</span>
        </template>
        <!-- 调用自身  此处是重点-->
        <NavMenu :navMenus="navItem.children"></NavMenu>
      </el-submenu>
      <!-- 如果没有子菜单，则显示当前内容 -->
      <el-menu-item
        v-else
        :index="navItem.path"
        :key="navItem.id"
      >
        <i :class="navItem.icon"></i>
        <span slot="title">{{ navItem.name }}</span>
      </el-menu-item>
    </div>
  </div>
</template>

<script>
export default {
  name: "NavMenu",
  props: {
    navMenus: {
      type: Array,
      default() {
        return [
          {
            id: 1,
            parentId: 0,
            children: [
              {
                id: 100,
                parentId: 1,
                children: [
                  {
                    id: 10000,
                    parentId: 100,
                    children: [],
                    hasChildren: false,
                    name: "用户管理",
                    permission: null,
                    path: "PlatformUserManagement",
                    icon: null,
                    component: null,
                    sort: 1,
                    disableFlag: null,
                    type: 0
                  },
                  {
                    id: 20000,
                    parentId: 100,
                    children: [],
                    hasChildren: false,
                    name: "菜单管理",
                    permission: null,
                    path: "MenuManagement",
                    icon: null,
                    component: null,
                    sort: 2,
                    disableFlag: null,
                    type: 0
                  },
                  {
                    id: 30000,
                    parentId: 100,
                    children: [],
                    hasChildren: false,
                    name: "角色管理",
                    permission: null,
                    path: "PlatformRoleManagement",
                    icon: null,
                    component: null,
                    sort: 3,
                    disableFlag: null,
                    type: 0
                  },
                  {
                    id: 50000,
                    parentId: 100,
                    children: [],
                    hasChildren: false,
                    name: "平台机构管理",
                    permission: null,
                    path: "PlatformOrganizationManagement",
                    icon: null,
                    component: null,
                    sort: 4,
                    disableFlag: null,
                    type: 0
                  }
                ],
                hasChildren: true,
                name: "平台基础管理",
                permission: null,
                path: "1-1",
                icon: null,
                component: null,
                sort: 1,
                disableFlag: null,
                type: 0
              },
              {
                id: 200,
                parentId: 1,
                children: [
                  {
                    id: 70000,
                    parentId: 200,
                    children: [],
                    hasChildren: false,
                    name: "应用管理",
                    permission: null,
                    path: "SystemApplicationManagement",
                    icon: null,
                    component: null,
                    sort: 1,
                    disableFlag: null,
                    type: 0
                  },
                  {
                    id: 60000,
                    parentId: 200,
                    children: [],
                    hasChildren: false,
                    name: "应用类别管理",
                    permission: null,
                    path: "ApplicationCategoryManagement",
                    icon: null,
                    component: null,
                    sort: 1,
                    disableFlag: null,
                    type: 0
                  },
                  {
                    id: 80000,
                    parentId: 200,
                    children: [],
                    hasChildren: false,
                    name: "应用提供商管理",
                    permission: null,
                    path: "ApplicationProviderManagement",
                    icon: null,
                    component: null,
                    sort: 1,
                    disableFlag: null,
                    type: 0
                  }
                ],
                hasChildren: true,
                name: "应用管理",
                permission: null,
                path: "1-2",
                icon: null,
                component: null,
                sort: 1,
                disableFlag: null,
                type: 0
              }
            ],
            hasChildren: true,
            name: "平台管理",
            permission: null,
            path: "1",
            icon: null,
            component: null,
            sort: 1,
            disableFlag: null,
            type: 0
          }
        ];
      }
    }
  }
};
</script>

<style scoped></style>
