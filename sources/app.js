// library
import Vue from "vue";
import VueRouter from "vue-router";
// css
import "./common/reset.scss";
import "font-awesome/css/font-awesome.css";
import "./common/awesome-bootstrap-checkbox.css";
// ui
import ElementUI from "element-ui";
import "element-ui/lib/theme-default/index.css";
// util
import Http from "./common/http.js";
import Auth from "./common/auth.js";
// component
import Layout from "./layout/index.vue";

Vue.use(VueRouter);
Vue.use(ElementUI);

const Login = resolve => require(["./login/index.vue"], resolve);
const Register = resolve => require(["./register/index.vue"], resolve);
const Dashboard = resolve => require(["./dashboard/index.vue"], resolve);

const router = new VueRouter({
  routes: [{
    path: "/",
    redirect: "/layout/dashboard"
  }, {
    path: "/login",
    component: Login
  }, {
    path: "/layout",
    component: Layout,
    children: [{
      path: "/register",
      component: Register
    }, {
      path: "dashboard",
      component: resolve => require(["./dashboard/index.vue"], resolve)
    },{
      path: "searchPage",
      name:"searchPage",
      component: resolve => require(["./searchPage/index.vue"], resolve)
    }, {
      path: "developer",
      name: 'developer',
      component: resolve => require(["./developer/index.vue"], resolve)
    }, {
      path: "catalog",
      name: 'catalog',
      component: resolve => require(["./catalog/index.vue"], resolve),
      children: [{
        path: 'statistic',
        name: 'statistic',
        component: resolve => require(["./catalog/statistic/index.vue"], resolve),
      }, {
        path: 'resources',
        name: 'resources',
        component: resolve => require(["./catalog/resources/index.vue"], resolve),
      }, {
        path: 'details',
        name: 'details',
        component: resolve => require(["./catalog/details/index.vue"], resolve),
      }, {
        path: 'department',
        name: 'department',
        component: resolve => require(["./catalog/department/index.vue"], resolve),
      }, {
        path: 'department-resources',
        name: 'department-resources',
        component: resolve => require(["./catalog/department-resources/index.vue"], resolve),
      }, {
        path: 'list-resources',
        name: 'list-resources',
        component: resolve => require(["./catalog/list-resourses/index.vue"], resolve),
      }, {
        path: 'economy-extend-resourses',
        name: 'economy-extend-resourses',
        component: resolve => require(["./catalog/economy-extend-resourses/index.vue"], resolve),
      }, {
        path: 'business-details',
        name: 'business-details',
        component: resolve => require(["./catalog/business-details/index.vue"], resolve),
      },{
        path:'list-details',
        name: 'list-details',
        component: resolve => require(["./catalog/list-details/index.vue"], resolve),
      },{
        path:'demand-details',
        name: 'demand-details',
        component: resolve => require(["./catalog/demand-details/index.vue"], resolve),
      },{
        path:'shared-resources',
        name: 'shared-resources',
        component: resolve => require(["./catalog/shared-resources/index.vue"], resolve),
      },{
        path:'open-resources',
        name: 'open-resources',
        component: resolve => require(["./catalog/open-resources/index.vue"], resolve),
      },{
        path:'demand-resources',
        name: 'demand-resources',
        component: resolve => require(["./catalog/demand-resources/index.vue"], resolve),
      },{
        path:'economy-resources',
        name: 'economy-resources',
        component: resolve => require(["./catalog/economy-resources/index.vue"], resolve),
      },{
        path:'system-list-resourses',
        name: 'system-list-resourses',
        component: resolve => require(["./catalog/system-list-resourses/index.vue"], resolve),
      },{
        path:'system',
        name: 'system',
        component: resolve => require(["./catalog/system/index.vue"], resolve),
      }, {
        path: 'system-resources',
        name: 'system-resources',
        component: resolve => require(["./catalog/system-resources/index.vue"], resolve),
      }, {
        path: 'system-details',
        name: 'system-details',
        component: resolve => require(["./catalog/system-details/index.vue"], resolve),
      },{
        path:'system-dynamic-resources',
        name: 'system-dynamic-resources',
        component: resolve => require(["./catalog/system-dynamic-resources/index.vue"], resolve),
      },{
        path:'system-dynamic-details',
        name: 'system-dynamic-details',
        component: resolve => require(["./catalog/system-dynamic-details/index.vue"], resolve),
      },{
        path:'itemDetails',
        name:'itemDetails',
        component: resolve => require(["./catalog/details/item/index.vue"], resolve),
      }]
    }, {
      path: "subject",
      component: resolve => require(["./subject/index.vue"], resolve)
    }, {
      path: "interaction",
      component: resolve => require(["./interaction/index.vue"], resolve),
      children: [{
        path: "aboutUs",
        component: resolve => require(["./interaction/container/aboutUs/index.vue"], resolve),
      }, {
        path: "interactionAdvice",
        component: resolve => require(["./interaction/container/interactionAdvice/index.vue"], resolve),
      }, {
        path: "interactionRequireSurvey",
        component: resolve => require(["./interaction/container/interactionRequireSurvey/index.vue"], resolve),
      }, {
        path: "policyDetail/:id",
        name: "policyDetail",
        component: resolve => require(["./interaction/container/policyDetail/index.vue"], resolve),
      }, {
        path: "hotMessage",
        component: resolve => require(["./interaction/container/hotMessage/index.vue"], resolve),
      }, {
        path: "serviceRequest",
        component: resolve => require(["./interaction/container/serviceRequest/index.vue"], resolve),
      }]
    }, {
      path: "admin",
      component: resolve => require(["./admin/index.vue"], resolve),
      children: [{
        path: "applyList",
        component: resolve => require(["./admin/container/applyList/index.vue"], resolve),
      }, {
        path: "collect",
        component: resolve => require(["./admin/container/collect/index.vue"], resolve),
      }, {
        path: "score",
        component: resolve => require(["./admin/container/score/index.vue"], resolve),
      }, {
        path: "bug",
        component: resolve => require(["./admin/container/bug/index.vue"], resolve),
      }, {
        path: "need",
        component: resolve => require(["./admin/container/need/index.vue"], resolve),
      }]
    }]
  }]
});

router.beforeEach((to, from, next) => {
  Auth.accessibility(to, from, next);
  Auth.interceptor();
})

const app = new Vue({
  router
}).$mount("#app")
