import {
  personAdd,
  power,
  enter,
  call,
  locationOutline,
  informationCircleOutline,
  alertCircle,
  card,
  timeOutline,
  chatboxEllipsesOutline,
  settingsOutline
} from 'ionicons/icons';

import UserTypes from '../../../enums/UserTypes';

export default {
  /**
   * These items will be shown all the time, whether the user is logged in
   * or not
  */
  publicItems: [
    {
      title: 'Map',
      url: '/home',
      icon: 'maps',
    },

    {
      title: 'About',
      url: '/about',
      icon: 'about',
    },
    {
      title: 'Division',
      type: 2,
    },
  ],
  /**
   * These items will only be shown when the user is not logged in
   */
  withoutAuth: [
    {
      title: 'Map',
      url: '/home',
      icon: 'maps',
    },
    {
      title: 'Login',
      url: '/phone',
      icon: 'exit',
    },
  ],
  /**
   * These items will only be shown when the user is logged in
   */
  needAuth: [
    {
      title: 'Map',
      url: '/home',
      icon: 'maps',
    },
    {
      title: 'Usage History',
      url: '/orders',
      icon: 'history',
    },
    {
      title: 'Wallet',
      url: '/wallet',
      icon: 'payment',
    },
    {
      title: 'Vouchers',
      url: '/vouchers',
      icon: 'ticket-icon',
    },
    {
      title: 'Support',
      url: '/help',
      icon: 'support',
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings',
    },
  ],
  /**
   * These items will be shown according to the type of user
   */
};
