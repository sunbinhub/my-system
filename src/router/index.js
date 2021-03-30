import Vue from "vue";
import Router from "vue-router";
import store from "../vuex/store";
import createRoutes from "./createRoutes";
import axios from "axios";

Vue.use(Router);

//获取原型对象上的push函数
const originalPush = Router.prototype.push;
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

// 导出路由
const router = new Router({
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/view/common/login")
    },
    {
      path: "/404",
      name: "404",
      component: () => import("@/view/common/404")
    }
  ]
});

//全局路由守卫
let hasMenus = false; //是否已经添加动态菜单
router.beforeEach((to, from, next) => {
  // to: Route: 即将要进入的目标 路由对象
  // from: Route: 当前导航正要离开的路由对象
  //如果next为空则路由正常进行跳转，如果next不为空，则进行跳转时，会中断
  if (sessionStorage.getItem("tokenInfo")) {
    if (to.path === "/login") {
      next();
    } else if (hasMenus) {
      next();
    } else {
      try {
        //获取菜单数据
        axios
          .get("http://192.168.0.40:9900/uc/sys/menu/nav", {
            params: { parentId: 0 },
            headers: { authorization: store.getters.tokenValue }
          })
          .then(res => {
            if (res.data && res.data.code === 0) {
              console.log("菜单数据：" + res.data.data);
              //把当前用户菜单权限数据存入state
              store.commit("SAVE_MENUINFO", res.data.data);
              const routes = createRoutes(res.data.data);
              // 动态添加路由
              //router.addrroutes()已弃用，已在vue-router：4中移除 使用router.addRoute()
              //目前是vue-router：3.0.1版本
              router.addRoutes(routes);
              hasMenus = true;
              next({ path: to.path || "/PlatformOrganizationManagement" }); //默认跳转页面
            } else {
              sessionStorage.setItem("tokenInfo", "[]");
              next();
            }
          });
      } catch (err) {
        console.log(
          `%c${e} 请求菜单列表和权限失败，跳转至登录页！！`,
          "color:blue"
        );
        router.push({ name: "login" });
      }
    }
  } else {
    hasMenus = false;
    if (to.path === "/login") {
      next();
    } else {
      next("/login");
    }
  }
});

export default router;
