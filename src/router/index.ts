
import { createRouter, createWebHistory } from 'vue-router'
import { useUser } from '../stores'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./../components/Layout/Dashboard.vue'),
    meta: { auth: true }
  },
    /** ******************** Sale Router ************************** */
  {
    path: '/Sales',
    name: 'Sales',
    component: () => import('./../components/Sales/Forms/Sales.vue'),
    meta: { auth: true }
  },

  {
    path: '/CreateInvoice',
    name: 'CreateInvoice',
    component: () => import('./../components/Sales/Forms/CreateInvoice.vue'),
    meta: { auth: true }
  },

  {
    path: '/Stocks',
    name: 'Stocks',
    component: () => import('./../components/Sales/Forms/Stocks.vue'),
    meta: { auth: true }
  },

  /** ******************** Purchase Router ************************** */
  {
    path: '/Purchases',
    name: 'Purchases',
    component: () => import('./../components/Purchases/Forms/Purchases.vue'),
    meta: { auth: true }
  },

  {
    path: '/CreatePurchase',
    name: 'CreatePurchase',
    component: () => import('./../components/Purchases/Forms/CreatePurchase.vue'),
    meta: { auth: true }
  },

  {
    path: '/Loans',
    name: 'Loans',
    component: () => import('./../components/Loans/Forms/Loans.vue'),
    meta: { auth: true }
  },
  {
    path: '/Investments',
    name: 'Investments',
    component: () => import('./../components/Investments/Forms/Investments.vue'),
    meta: { auth: true }
  },
  {
    path: '/Expenses',
    name: 'Expenses',
    component: () => import('./../components/Expenses/Forms/Expenses.vue'),
    meta: { auth: true }
  },
  {
    path: '/ExpensesReport',
    name: 'ExpensesReport',
    component: () => import('./../components/Expenses/Reports/ExpensesReport.vue'),
    meta: { auth: true }
  },
  /** User Related Works start under here... */
  {
    path: '/SignIn',
    name: 'SignIn',
    component: () => import('./../components/User/Forms/SignIn.vue'),
    meta: { auth: false }
  },
  {
    path: '/Signout',
    name: 'Signout',
    component: () => import('./../components/User/Forms/Signout.vue'),
    meta: { auth: true }
  },
  {
    path: '/CreateProfile',
    name: 'CreateProfile',
    component: () => import('./../components/User/Forms/CreateProfile.vue'),
    meta: { auth: false }
  },
  {
    path: '/Users',
    name: 'Users',
    component: () => import('./../components/User/Guest/Users.vue'),
    meta: { auth: true }
  },
  {
    path: '/Company',
    name: 'Company',
    component: () => import('./../components/User/Forms/Company.vue'),
    meta: { auth: true }
  },

  /** End of User Related Works */

  /** Product Defines here... */
  {
    path: '/Items',
    name: 'Items',
    component: () => import('./../components/Items/Forms/Items.vue'),
    meta: { auth: true }
  },
  {
    path: '/Brands',
    name: 'Brands',
    component: () => import('./../components/Brands/Forms/Brands.vue'),
    meta: { auth: true }
  },
  {
    path: '/Products',
    name: 'Products',
    component: () => import('./../components/Products/Forms/Products.vue'),
    meta: { auth: true }
  },

  /** End of Product Define */
  {
    path: '/Suppliers',
    name: 'Suppliers',
    component: () => import('./../components/Suppliers/Forms/Suppliers.vue'),
    meta: { auth: true }
  },

  {
    path: '/Buyers',
    name: 'Buyers',
    component: () => import('./../components/Buyers/Forms/Buyers.vue'),
    meta: { auth: true }
  },

  {
    path: '/PrdUnload',
    name: 'PrdUnload',
    component: () => import('./../components/PrdUnloads/Forms/Unloads.vue'),
    meta: { auth: true }
  },

/** *********************Accounts ****************** */
{
  path: '/Accounts',
  name: 'Accounts',
  component: () => import('./../components/Accounts/Forms/Accounts.vue'),
  meta: { auth: true }
},

{
  path: '/Ledgers',
  name: 'Ledgers',
  component: () => import('./../components/Ledgers/Forms/Ledgers.vue'),
  meta: { auth: true }
},

{
  path: '/CreateLedger',
  name: 'CreateLedger',
  component: () => import('./../components/Ledgers/Forms/CreateLedger.vue'),
  meta: { auth: true }
},

  { 
    path: '/:pathMatch(.*)*', 
    name: 'not-found', 
    component: () => import('./../components/PrdUnloads/Forms/Unloads.vue'),
    meta: { auth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  const user = useUser()
  console.log(user.loggedIn)
if (to.meta.auth && !user.loggedIn) {
    next('/SignIn'); 
    console.log(from.fullPath)
}
    else if (!to.meta.auth && user.loggedIn) {
      next('/')
    } else {
      next()
    }

})

export default router
