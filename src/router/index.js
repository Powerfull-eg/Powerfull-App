import { createRouter, createWebHistory } from '@ionic/vue-router';


import authRoutes from './authRoutes';
import notAuthRoutes from './notAuthRoutes.js';
import publicRoutes from './publicRoutes.js';

const routes = [
      {
        path: '/',
        redirect: '/home',
      },
      {
        path: '/index.html',
        redirect: '/phone',
      },
      {
        path: '/login',
        redirect: '/phone',
      },
      ...publicRoutes,
      ...notAuthRoutes,
      ...authRoutes,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const isAuthenticated = localStorage.isAuth == true ? true : false;

router.beforeEach((to, from, next) => {
  // prevent event action of going back when current page is home page
  if (to.name === 'home' && from.name === 'home') {
    next(false);
    return;
  }
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/phone'); // Redirect to login page if not authenticated
  } else if(to.meta.requiresNotAuth && isAuthenticated ){
    next('/home');
  } else {
    next(); // Proceed to the next route
  }
})
export default router;
