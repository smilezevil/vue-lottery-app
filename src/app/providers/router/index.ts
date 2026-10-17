import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home/ui/HomePage.vue'),
      meta: { title: 'Home' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/about/ui/AboutPage.vue'),
      meta: { title: 'About author' },
    },
    {
      path: '/users',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'users',
          component: () => import('@/pages/users/ui/UsersPage.vue'),
          meta: { title: 'Users' },
        },
        {
          path: 'new',
          name: 'user-create',
          component: () => import('@/pages/user-create/ui/UserCreatePage.vue'),
          meta: { title: 'New user' },
        },
        {
          path: ':id(\\d+)',
          name: 'user-details',
          component: () => import('@/pages/user-details/ui/UserDetailsPage.vue'),
          props: true,
          meta: { title: 'User details' },
          children: [
            {
              path: 'edit',
              name: 'user-edit',
              component: () => import('@/pages/user-details/ui/UserEditPage.vue'),
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
      component: () => import('@/pages/login/ui/LoginPage.vue'),
      meta: { title: 'Login', guestOnly: true, layout: 'auth' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found/ui/NotFoundPage.vue'),
      meta: { title: 'Page not found' },
    },
  ],
})

setupGuards(router)

export default router
