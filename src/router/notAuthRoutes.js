const routes = [
      {
        path: '/recovery-password',
        name: 'recovery-password',
        component: () => import('../pages/RecoverPassword.vue'),
        meta: { requiresNotAuth: true }
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('../pages/Register.vue'),
        meta: { requiresNotAuth: true }
      },
      {
        path: '/guest',
        name: 'guest',
        component: () => import('../pages/Guest.vue'),
        meta: { requiresNotAuth: true }
      },
      {
        path: '/phone',
        name: 'phone',
        component: () => import('../pages/Phone.vue'),
        meta: { requiresNotAuth: true }
      },
]

export default routes;