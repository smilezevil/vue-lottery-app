import 'vue-router'

export {}

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    layout?: 'default' | 'auth'
  }
}
