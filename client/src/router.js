import Vue from "vue"
import Router from "vue-router"
import Home from "./views/Home.vue"
import AnthonySucksWithHisShittyParticlesJS from "./views/AnthonySucksWithHisShittyParticlesJS.vue"
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
        path: "/aswhspj",
        name: "AnthonySucksWithHisShittyParticlesJS",
        component: AnthonySucksWithHisShittyParticlesJS
    }
    // { Lazy load example, don"t have to worry about this for now
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ "./views/About.vue")
    // }
  ],
  mode: "history"
})
export const toolbarRoutes = "Home,AnthonySucksWithHisShittyParticlesJS".split(",");