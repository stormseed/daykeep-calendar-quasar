
const routes = [
  {
    path: '/',
    component: () => import('layouts/LayoutDefault.vue'),
    children: [
      { path: '', component: () => import('pages/index.vue') }
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
