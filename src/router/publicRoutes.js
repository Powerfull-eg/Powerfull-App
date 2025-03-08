const routes = [
      {
        path: '/home',
        name: 'home',
        component: () => import('../pages/home/Index.vue'),
      },
      {
        path: '/intro',
        name: 'Intro',
        component: () => import('../pages/intro/Intro.vue'),
      },
      {
        path: '/terms-conditions',
        name: 'TermsConditons',
        component: () => import('../pages/Help/TermsConditions.vue'),
      },
      {
        path: '/terms',
        name: 'terms',
        component: () => import('../pages/Help/Terms.vue'),
      },
      {
        path: '/privacy',
        name: 'Privacy',
        component: () => import('../pages/Help/Privacy.vue'),
      },
      {
        path: '/contact',
        name: 'contact',
        component: () => import('../pages/Contact.vue'),
      },
      {
        path: '/about',
        name: 'about',
        component: () => import('../pages/Help/About.vue'),
      },
      {
        path: '/locations',
        name: 'locations',
        component: () => import('../pages/Locations.vue'),
      },
      {
        path: '/maintenance',
        name: 'Maintenance',
        component: () => import('../pages/Maintenance.vue'),
      },
      {
        path: '/update',
        name: 'NewUpdate',
        component: () => import('../pages/NewUpdate.vue'),
      },
      {
        path: '/not-authorized',
        name: 'not-authorized',
        component: () => import('../pages/NotAuthorized.vue'),
      },
      {
        path: '/:catchAll(.*)',
        name: 'not-found',
        component: () => import('../pages/Error404.vue'),
      },
]

export default routes;