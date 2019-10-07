import Vue from 'vue'
import VueRouter from 'vue-router'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function ({ store, ssrContext }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })
  /**
   * Verifyc if one user is login
   */
  Router.beforeEach((to, from, next) => {
    let autorization = to.matched.some(record => record.meta.authenticate)
    let usuario = store.state.login.token
    if (autorization && !usuario) {
      next('login')
    } else if (!autorization && usuario) {
      next()
    } else {
      next()
    }
  })
  return Router
}