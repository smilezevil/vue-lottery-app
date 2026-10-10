import { createRouter, createWebHistory } from 'vue-router'

const APP_NAME = 'Vue Lottery'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
      meta: { title: 'Home' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutView.vue'),
      meta: { title: 'About author' },
    },
    {
      path: '/users',
      children: [
        {
          path: '',
          name: 'users',
          component: () => import('@/views/UsersView.vue'),
          meta: { title: 'Users' },
        },
        {
          path: 'new',
          name: 'user-create',
          component: () => import('@/views/UserCreateView.vue'),
          meta: { title: 'New user' },
        },
        {
          path: ':id(\\d+)',
          name: 'user-details',
          component: () => import('@/views/UserDetailsView.vue'),
          props: true,
          meta: { title: 'User details' },
          children: [
            {
              path: 'edit',
              name: 'user-edit',
              component: () => import('@/views/UserEditView.vue'),
              props: true,
              meta: { title: 'Edit user' },
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { title: 'Login' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { title: 'Page not found' },
    },
  ],
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | ${APP_NAME}` : APP_NAME
})

export default router
