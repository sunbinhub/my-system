<template>
  <div id="index">
    <el-container>
      <!-- 首页头部 -->
      <el-header class="index-header">
        <div class="fl bmdm-style bmdm-title">
          <span>业务中台管理</span>
        </div>
        <div class="fr bmdm-style">
          <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              {{ userInfo.username }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="updatePasswordHandle()"
                size="mini"
              >
                修改密码
              </el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()" size="mini">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 弹窗, 修改密码 -->
        <UpdatePassword v-if="updatePassowrdVisible" ref="updatePassowrd">
        </UpdatePassword>
      </el-header>
      <el-container>
        <!--左侧动态菜单-->
        <el-aside :style="getAsideHeight" class="index-aside">
          <el-menu
            router
            :default-active="defaultActive"
            class="el-menu-vertical-demo index-menu"
            background-color="rgba(41, 42, 42, 1)"
            text-color="#ccc"
            active-text-color="#ffd04b"
          >
            <NavMenu :navMenus="leftMenus"></NavMenu>
          </el-menu>
        </el-aside>
        <!-- 主入口标签页 s -->
        <el-main style="padding: 0; padding-left: 10px;">
          <el-tabs
            v-model="defaultActive"
            :closable="true"
            @tab-click="selectedTabHandle"
            @tab-remove="removeTabHandle"
          >
            <el-tab-pane
              v-for="item in mainTabs"
              :key="item.path"
              :label="item.name"
              :name="item.path"
            >
              <el-card>
                <!-- 路由出口 -->
                <keep-alive>
                  <router-view v-if="item.path === defaultActive">
                  </router-view>
                </keep-alive>
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
      <el-footer class="index-footer">
        <div>
          <span class="fr"
            >©2013 - 2018 上海柯林布瑞信息技术有限公司All Rights</span
          >
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import NavMenu from "./NavMenu";
import clearLoginInfo from "@/router/logOff";
import UpdatePassword from "./UpdatePassword";
export default {
  // import引入的组件需要注入到对象中才能使用
  components: { NavMenu, UpdatePassword },
  data() {
    // 这里存放数据
    return {
      getAsideHeight: {
        //左侧导航的高度
        height: ""
      },
      leftMenus: [], //左侧菜单数据
      defaultActive: "PlatformRoleManagement", //当前激活菜单
      dynamicMenuRoutes: [], //动态路由表
      mainTabs: [], //顶部导航标签页数据
      updatePassowrdVisible: false //修改密码弹窗
    };
  },
  // 生命周期 - 销毁完成
  destroyed() {
    window.removeEventListener("resize", this.getHeight);
  },
  created() {
    //组件挂载完成，获取路由并赋值给当前激活菜单
    this.defaultActive = this.$route.path.slice(1);
    //组件创建完成（可以访问当前this实例）
    window.addEventListener("resize", this.getHeight); // 注册监听器
    this.getHeight(); // 页面创建时先调用一次
    this.leftMenus = this.menuInfo; //导航菜单数据
    //获取动态路由表
    this.dynamicMenuRoutes = JSON.parse(
      sessionStorage.getItem("dynamicMenuRoutes") || "[]"
    );
    this.routeHandle(this.$route); //设置标签页的路由操作
  },
  watch: {
    //监听顶部导航栏变化
    $route: ["routeHandle", "getPath"]
  },
  methods: {
    // 获取浏览器高度，减去顶部导航栏的值66（可动态获取）
    getHeight() {
      this.getAsideHeight.height = window.innerHeight - 66 + "px";
    },
    // 顶部导航标签页：选中tab
    selectedTabHandle(tab) {
      tab = this.mainTabs.filter(item => item.path === tab.name);
      if (tab.length >= 1) {
        this.$router.push({
          path: "/" + tab[0].path
        });
      }
    },
    // 顶部导航标签页：删除tab
    removeTabHandle(tabName) {
      this.mainTabs = this.mainTabs.filter(item => item.path !== tabName);
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.defaultActive) {
          var tab = this.mainTabs[this.mainTabs.length - 1];
          this.$router.push({ path: tab.path }, () => {
            this.defaultActive = this.$route.path;
          });
        }
      } else {
        this.defaultActive = "";
        this.$router.push({ name: "login" });
      }
    },
    // 设置标签页的路由操作
    routeHandle(route) {
      if (route.meta.isTab) {
        // tab选中, 不存在先添加
        let tab = this.mainTabs.filter(
          item => item.path === route.path.slice(1)
        )[0];
        if (!tab) {
          if (route.meta.isDynamic) {
            route = this.dynamicMenuRoutes.filter(
              item => item.path === route.path.slice(1)
            )[0];
            if (!route) {
              return console.error("未能找到可用标签页!");
            }
          }
          tab = {
            path: route.path,
            name: route.name
          };
          this.mainTabs = this.mainTabs.concat(tab);
        }
      }
    },
    //获取当前路由
    getPath() {
      this.defaultActive = this.$route.path.slice(1);
    },
    //退出登录
    logoutHandle() {
      this.$confirm(`确定进行[退出]操作?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.axios({
            method: "post",
            url: "http://192.168.0.40:9900/ac/token/logout",
            headers: { authorization: this.tokenValue }
          }).then(res => {
            if (res.data && res.data.code === 0) {
              clearLoginInfo();
              this.$router.push({ name: "login" });
            }
          });
        })
        .catch(() => {});
    },
    // 修改密码
    updatePasswordHandle() {
      this.updatePassowrdVisible = true;
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init();
      });
    }
  },
  computed: {
    ...mapState({
      menuInfo: state => state.menuInfo,
      userInfo: state => state.userInfo
    }),
    ...mapGetters({
      tokenValue: "tokenValue"
    })
  }
};
</script>

<style>
html,
body,
div {
  margin: 0;
  padding: 0;
}

#index .index-header {
  height: 45px !important;
  min-width: 800px;
  background-color: rgba(40, 50, 63, 1);
}
#index .index-footer {
  padding-right: 15px;
  font-size: 14px;
  height: 20px !important;
  min-width: 800px;
  color: #ccc;
  background-color: rgba(41, 42, 42, 1);
}
#index .index-aside {
  width: 220px !important;
  background-color: rgba(41, 42, 42, 1);
}

#index .index-menu {
  border-right: 0;
}

#index .el-submenu__title:hover,
#index .el-menu-item:hover {
  background-color: rgba(69, 69, 68, 1) !important;
}

#index .bmdm-style {
  height: 45px;
  line-height: 45px;
  color: #fff;
  font-family: "Arial Negreta", "Arial Normal", "Arial";
  font-weight: 700;
  font-style: normal;
  font-size: 14px;
  text-align: left;
}

#index .el-card__body {
  padding: 0;
  padding-left: 10px;
}

#index .bmdm-title {
  margin-left: 8px;
}

#index .fl {
  float: left;
}

#index .fr {
  float: right;
}
</style>
