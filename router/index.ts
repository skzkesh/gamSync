// Add this new routes

{
    path: '/vouchers',
    name: 'Vouchers',
    component: () => import('../views/VouchersPage.vue'),
    meta: { statusBarColor: '#FFFBEE', hideTabBar: true }
}