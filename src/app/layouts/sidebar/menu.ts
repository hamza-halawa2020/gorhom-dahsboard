import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    id: 3,
    label: 'E-commerce',
    isTitle: true,
  },
  {
    id: 4,
    label: 'MENUITEMS.APPS.LIST.PRODUCTS',
    icon: 'bi bi-basket2',
    subItems: [
      {
        id: 5,
        label: 'MENUITEMS.APPS.LIST.PRODUCTS',
        link: '/apps/products',
        parentId: 4,
        icon: 'ti ti-shopping-cart',
      },

      {
        id: 6,
        label: 'MENUITEMS.APPS.LIST.PRODUCT_REVIEW',
        link: '/apps/reviews',
        parentId: 4,
        icon: 'ri-message-2-line',
      },
    ],
  },
  {
    id: 7,
    label: 'MENUITEMS.APPS.LIST.ORDERS',
    icon: 'ti ti-shopping-cart',
    link: '/apps/orders',
    parentId: 4,
  },
  {
    id: 8,
    label: 'MENUITEMS.APPS.LIST.PAYMENTS',
    icon: 'ti ti-credit-card',
    link: '/apps/payments',
    parentId: 4,
  },
  {
    id: 9,
    label: 'MENUITEMS.APPS.LIST.COUPONS',
    icon: 'ti ti-tag',
    link: '/apps/coupons',
    parentId: 4,
  },
  {
    id: 30,
    label: 'MENUITEMS.APPS.LIST.USERS',
    icon: 'ti ti-user',
    link: '/apps/users',
    parentId: 10,
  },
  {
    id: 18,
    label: 'MENUITEMS.APPS.LIST.CLIENTS',
    icon: 'ti ti-users',
    link: '/apps/clients',
    parentId: 10,
  },
  {
    id: 16,
    label: 'MENUITEMS.APPS.LIST.CATEGORIES',
    icon: 'ti ti-list-check',
    link: '/apps/categories',
    parentId: 10,
  },
  {
    id: 11,
    label: 'MENUITEMS.APPS.LIST.ADDRESS',
    icon: 'ti ti-map-pin',
    subItems: [
      {
        id: 12,
        label: 'MENUITEMS.APPS.LIST.COUNTRIES',
        link: '/apps/countries',
        parentId: 11,
        icon: 'ti ti-world',
      },
      {
        id: 13,
        label: 'MENUITEMS.APPS.LIST.CITIES',
        link: '/apps/cities',
        parentId: 11,
        icon: 'ti ti-building',
      },
      {
        id: 14,
        label: 'MENUITEMS.APPS.LIST.SHIPMENTS',
        link: '/apps/shipments',
        parentId: 11,
        icon: 'ti ti-truck',
      },

    ],
  },
  

];
