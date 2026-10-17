import { createRouter, createWebHistory } from 'vue-router'
import { setupGuards } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/home').then((m) => m.HomePage),
      meta: { title: 'Home' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/about').then((m) => m.AboutPage),
      meta: { title: 'About author' },
    },
    {
      path: '/users',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'users',
          component: () => import('@/pages/users').then((m) => m.UsersPage),
          meta: { title: 'Users' },
        },
        {
          path: 'new',
          name: 'user-create',
          component: () => import('@/pages/user-create').then((m) => m.UserCreatePage),
          meta: { title: 'New user' },
        },
        {
          path: ':id(\\d+)',
          name: 'user-details',
          component: () => import('@/pages/user-details').then((m) => m.UserDetailsPage),
          props: true,
          meta: { title: 'User details' },
          children: [
            {
              path: 'edit',
              name: 'user-edit',
              component: () => import('@/pages/user-details').then((m) => m.UserEditPage),
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
      component: () => import('@/pages/login').then((m) => m.LoginPage),
      meta: { title: 'Login', guestOnly: true, layout: 'auth' },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/not-found').then((m) => m.NotFoundPage),
      meta: { title: 'Page not found' },
    },
  ],
})

setupGuards(router)

export default router
