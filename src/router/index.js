import Vue from 'vue'
import Router from 'vue-router'
import Luck from '@/components/luck/luck'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Luck',
      component: Luck
    }
  ]
})
