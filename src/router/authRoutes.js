const routes = [
  {
    path: '/scan',
    name: 'scan',
    component: () => import('../pages/Scan.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/payment',
    name: 'payment',
    component: () => import('../pages/Payment/Payment.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/payment/return-payment',
    name: 'ReturnPayment',
    component: () => import('../pages/Payment/ReturnPayement.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: () => import('../pages/Payment/Wallet.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/vouchers',
    name: 'Vouchers',
    component: () => import('../pages/Payment/Vouchers.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/gifts',
    name: 'gifts',
    component: () => import('../pages/Payment/Gifts.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('../pages/Notifications.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/vouchers/new',
    name: 'NewVoucher',
    component: () => import('../pages/Payment/NewVoucher.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../pages/Profile/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('../pages/Profile/Orders/Orders.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order/:id',
    name: 'Order',
    component: () => import('../pages/Profile/Orders/OrderDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../pages/Profile/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/language',
    name: 'Language',
    component: () => import('../pages/Profile/Language.vue'),
    meta: { requiresAuth: true }
  },
  // {
  //   path: '/notifications',
  //   name: 'Notification',
  //   component: () => import('../pages/Profile/Notification.vue'),
  //   meta: { requiresAuth: true }
  // },
  {
    path: '/account',
    name: 'Account',
    component: () => import('../pages/Profile/Account/Account.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/offers',
    name: 'Offers',
    component: () => import('../pages/Profile/Offers.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/help',
    name: 'Help',
    component: () => import('../pages/Help/Help.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/faqs',
    name: 'FAQs',
    component: () => import('../pages/Help/Faqs.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets',
    name: 'Tickets',
    component: () => import('../pages/Help/Tickets.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ticket/:id',
    name: 'Ticket',
    component: () => import('../pages/Help/TicketDetails.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tickets/new',
    name: 'NewTickets',
    component: () => import('../pages/Help/NewTicket.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import('../pages/Logout.vue'),
    meta: { requiresAuth: true }
  },
]

export default routes;