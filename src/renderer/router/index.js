import Vue from 'vue'
import Router from 'vue-router'

const indexView = () => import('@/components/index.vue')
const page1View = () => import('@/components/page1.vue')
const page2View = () => import('@/components/page2.vue')
const page3View = () => import('@/components/page3.vue')
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: indexView,
      children: [
        {
          path: 'page1',
          name: 'page1',
          component: page1View
        },
        {
          path: 'page2',
          name: 'page2',
          component: page2View
        },
        {
          path: 'page3',
          name: 'page3',
          component: page3View
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
