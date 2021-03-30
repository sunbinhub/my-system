//路由表
const asyncRoutes = {
  //   CosManagement: {
  //     path: "/CosManagement",
  //     name: "服务类别管理",
  //     component: () => import("@/components/CosManagement")
  //   },
  //   SoaServiceLifecycleManagement: {
  //     path: "/SoaServiceLifecycleManagement",
  //     name: "服务生命周期管理",
  //     component: () => import("@/components/SoaServiceLifecycleManagement")
  //   },
  //   MicroserviceGatewayAdministration: {
  //     path: "/MicroserviceGatewayAdministration",
  //     name: "微服务网关管理",
  //     component: () => import("@/components/MicroserviceGatewayAdministration")
  //   },
  //   ThirdPartySubscriptionManagement: {
  //     path: "/ThirdPartySubscriptionManagement",
  //     name: "第三方订阅管理",
  //     component: () => import("@/components/ThirdPartySubscriptionManagement")
  //   },
  //   ServiceRegistry: {
  //     path: "/ServiceRegistry",
  //     name: "服务注册中心",
  //     component: () => import("@/components/ServiceRegistry")
  //   },
  //   ServiceApplication: {
  //     path: "/ServiceApplication",
  //     name: "服务申请",
  //     component: () => import("@/components/ServiceApplication")
  //   },
  //   ServiceMatchingTest: {
  //     path: "/ServiceMatchingTest",
  //     name: "服务对接测试",
  //     component: () => import("@/components/ServiceMatchingTest")
  //   },
  //   ServeControl: {
  //     path: "/ServeControl",
  //     name: "服务监控",
  //     component: () => import("@/components/ServeControl")
  //   },
  //   ServiceInteractionLog: {
  //     path: "/ServiceInteractionLog",
  //     name: "服务交互日志",
  //     component: () => import("@/components/ServiceInteractionLog")
  //   },
  //   ApplicationConfigurationManagement: {
  //     path: "/ApplicationConfigurationManagement",
  //     name: "应用配置管理",
  //     component: () => import("@/components/ApplicationConfigurationManagement")
  //   },
  //   GlobalConfigurationManagement: {
  //     path: "/GlobalConfigurationManagement",
  //     name: "全局配置管理",
  //     component: () => import("@/components/GlobalConfigurationManagement")
  //   },
  //   ConfigurationTemplateManagement: {
  //     path: "/ConfigurationTemplateManagement",
  //     name: "配置模板管理",
  //     component: () => import("@/components/ConfigurationTemplateManagement")
  //   },
  //   PlatformOrganizationManagement: {
  //     path: "/PlatformOrganizationManagement",
  //     name: "平台机构管理",
  //     component: () => import("@/components/PlatformOrganizationManagement")
  //   },
  //   PlatformUserManagement: {
  //     path: "/PlatformUserManagement",
  //     name: "平台用户管理",
  //     component: () => import("@/components/PlatformUserManagement")
  //   },
  //   PlatformRoleManagement: {
  //     path: "/PlatformRoleManagement",
  //     name: "平台角色管理",
  //     component: () => import("@/components/PlatformRoleManagement")
  //   },
  //   PlatformStrategyManagement: {
  //     path: "/PlatformStrategyManagement",
  //     name: "平台策略管理",
  //     component: () => import("@/components/PlatformStrategyManagement")
  //   },
  //   SystemApplicationManagement: {
  //     path: "/SystemApplicationManagement",
  //     name: "系统应用管理",
  //     component: () => import("@/components/SystemApplicationManagement")
  //   },
  //   ApplicationCategoryManagement: {
  //     path: "/ApplicationCategoryManagement",
  //     name: "应用类别管理",
  //     component: () => import("@/components/ApplicationCategoryManagement")
  //   }
};

// 将菜单信息转成对应的路由信息 动态添加
export default function createRoutes(data) {
  const result = [];
  const children = [];

  result.push({
    path: "/",
    component: () => import("@/view/index"),
    children
  });

  data.forEach(item => {
    generateRoutes(children, item);
  });
  // 最后添加404页面 否则会在登陆成功后跳到404页面
  result.push({ path: "*", redirect: "/404" });
  //动态路由表存入sessionStorage
  sessionStorage.setItem("dynamicMenuRoutes", JSON.stringify(children || "[]"));
  return result;
}

function generateRoutes(children, item) {
  if (item.hasChildren) {
    item.children.forEach(item => {
      if (item.hasChildren) {
        generateRoutes(children, item);
      } else {
        children.push({
          path: item.path,
          name: item.name,
          meta: { isTab: true, isDynamic: true },
          component: () => import(`@/view/modules/${item.path}`)
        });
      }
    });
  }
}
