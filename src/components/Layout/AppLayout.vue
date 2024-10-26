<template>
      <v-app-bar color="primary" density="compact">
        <router-link to="/">
          <v-app-bar-nav-icon color="white"></v-app-bar-nav-icon>
        </router-link>
        <v-spacer></v-spacer>
        
        <v-tabs>
          <v-tab v-for="Tab in Tabs" :value="Tab.id">
            <div>
            <v-icon color="white" class="me-2">{{Tab.icon}}</v-icon>
            {{Tab.name}}
          </div>
            <v-menu activator="parent" transition="scale-transition">
              <v-list :lines="false" density="compact">
                <router-link v-for="(item,i) in Tab.items" :to="item.url">
                  <v-list-item
                    :key="i"
                    :value="item"
                    color="primary"
                    variant="plain"
                    rounded="xl"
                  >
                    <v-list-item-title>
                      {{item.name}}
                    </v-list-item-title>
                  </v-list-item>
                </router-link>
              </v-list>
            </v-menu>
          </v-tab>
        </v-tabs>
      </v-app-bar>
</template>

<script setup lang="ts">
  import { ref } from "vue"
  import { useUser } from './../../stores'
  const user = useUser()
  let Tabs = ref([
    //@Receives Releated Information
    {id: 1, name: 'Transactions', icon: 'mdi-bank-plus', Status: true,
      items: [
      { name: 'Transactions', url: '/Ledgers', Status: true },
      ]
    },
    {
      id: 2, name: 'Receives', icon:'mdi-bank-plus', Status: true,
      items:[
      {id: 1, name: 'Sales', url:'/Sales', icon: 'mdi-view-dashboard',type: 'Receive', status: true },
      {id: 2, name: 'Investments', url:'/Investments', icon: 'mdi-forum',type: 'Receive', status: true },
      {id: 3, name: 'Loans', url:'/Loans', icon: 'mdi-forum',type: 'Receive', status: true },
      ],
    },
          //@Payments Releated Information
    {
      id: 3, name: 'Payments', icon: 'mdi-bank-minus', Status: true,
      items: [
      {name: 'Purchases', url:'/Purchases', icon: 'mdi-forum',type: 'Payment', status: true },
      {name: 'Expenses', url:'/Expenses', icon: 'mdi-forum',type: 'Payment', status: true },
      ],
     },
          // @All Reports Printing
    {
      id: 4, name: 'Reports', icon: 'mdi-view-list', Status: true,
      items: [
      {name: 'Stocks', url: '/Stocks', Status: true},
      {name: 'Sales', url:'/SalesReport', Status: true},
      {name: 'Purchases', url:'/PurchasesReport', Status: true},
      {name: 'Investments', url:'/InvestmentsReport', Status: true},
      {name: 'Loans', url:'/LoansReport', Status: true},
      {name: 'Expenses', url:'/ExpensesReport', Status: true}
      ]
    },

    {
      id: 5, name: 'Systems', icon: 'mdi-cogs', Status: true,
      items: [
      { name: 'Transactions', url: '/Ledgers', Status: true },
      { name: 'Unloads', url: '/PrdUnload', Status: true },
      { name: 'Company', url: '/Company', Status: true },
      { name: 'User List', url: '/Users', Status: true },
      { name: 'Item List', url: '/Items', Status: true },
      { name: 'Brand List', url: '/Brands', Status: true },
      { name: 'Product List', url: '/Products', Status: true },
      { name: 'Supplier List', url: '/Suppliers', Status: true },
      { name: 'Buyer List', url: '/Buyers', Status: true },
      { name: 'Account List', url: '/Accounts', Status: true },
      ]
     },

     {
      id: 6, name: user.Fullname?.name ? user.Fullname.name : user.getUser.name, icon: 'mdi-account', Status: true,
      items: [
      {name: user.getUser.name ? user.getUser.name : user.Fullname?.name, url: '/PasswordReset', icon: 'mdi-account', Status: true},
      { name: 'Logout', url: '/Signout', icon: 'mdi-account', Status: true },
      ]
     },
     {
      id: 7, name: '', icon: 'mdi-cart', Status: true,
     }

  ])
</script>