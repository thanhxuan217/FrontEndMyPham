import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductsView from '../views/ProductsView.vue'
import SearchView from '../views/SearchView.vue'
import CartView from '../views/CartView.vue'
import ManagerUserView from '../views/ManageUserView.vue'
import PaymentView from '../views/PaymentView.vue'
import DetailProduct from '../views/ProductDetailView.vue'
import ActiveAccount from '../views/ActiveAccountView.vue'
import OrderHistoriesView from '../views/OrderHistoriesView.vue'
import AdminLayout from '../layout/AdminLayout.vue'
import ClientLayout from '../layout/ClientLayout.vue'
import ListProduct from '../views/AdminView/ListProductView.vue'
import ApproveOrder from '../views/AdminView/ApproveOrderView.vue'
import Statictis from '../views/AdminView/StatictisView.vue'
import PopularProductView from '../views/AdminView/PopularProductView.vue'
import ListAccountView from '../views/AdminView/ListAccountView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ClientLayout,
      children: [
        {
          path: '',
          name: 'home',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: HomeView,
        },
        {
          path: 'login',
          name: 'login',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/LoginView.vue'),
          meta: { layout: "client" },
        },
        {
          path: 'products',
          name: 'products',
          component: ProductsView,
          meta: { layout: "client" },
        },
        {
          path: 'search',
          name: 'search',
          component: SearchView,
          meta: { layout: "client" },
        },
        {
          path: 'cart',
          name: 'cart',
          component: CartView,
          meta: { layout: "client" },
        },
        {
          path: 'address',
          name: 'address',
          component: ManagerUserView,
          meta: { layout: "client" },
        },
        {
          path: 'payment',
          name: 'payment',
          component: PaymentView,
          meta: { layout: "client" },
        },
        {
          path: 'product-detail/:id',
          name: 'product-detail',
          component: DetailProduct,
          meta: { layout: "client" },
        },
        {
          path: 'active-account/:token',
          name: 'active-account',
          component: ActiveAccount,
          meta: { layout: "client" },
        },
        {
          path: 'orders',
          name: 'orders',
          component: OrderHistoriesView,
          meta: { layout: "client" },
        },
      ],
      meta: { layout: "client" },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminLayout,
      children: [
        {
          path: '',// root path
          name: 'home-admin',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: ListProduct,
        },
        {
          path: 'order',// root path
          name: 'order-approve',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: ApproveOrder,
        },
        {
          path: 'statictis',// root path
          name: 'statictis',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: Statictis,
        },
        {
          path: 'popular-product',// root path
          name: 'popular-product',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: PopularProductView,
        },
        {
          path: 'account',// root path
          name: 'account',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: ListAccountView,
        },
      ],
      meta: { layout: "admin" },
    },
  ]
})
export default router
