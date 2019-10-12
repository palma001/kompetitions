const routes = [
  {
    path: '/login',
    component: () => import('layouts/login.vue'),
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },
  {
    path: '/scoreKeeper',
    name: 'scoreKeeper',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/ScoreKeeperComponent.vue'),
        meta: {
          authenticate: true,
          rols: 'scoreKeeper'
        }
      }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/dashboardComponent.vue') }
    ]
  },
  {
    path: '/moderator',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/ModeratorComponent.vue') }
    ]
  },
  {
    path: '/timeKeeper',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/TimeKeeperComponent.vue') }
    ]
  },
  {
    path: '/generalScreen',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/GeneralScreenComponent.vue') }
    ]
  }
]
// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
