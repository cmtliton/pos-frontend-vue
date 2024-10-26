<template>
  <v-card class="mx-auto">
    <v-navigation-drawer
      :location="$vuetify.display.mobile ? 'bottom' : undefined"
      permanent
      v-model="drawer"
      width="320"
    >
      <v-list density="compact" :lines="false">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          density="compact"
          label="My Items"
          single-line
          flat
          hide-details
          variant="solo-filled"
        ></v-text-field>
        <v-divider></v-divider>
        <v-list-item
          link
          :subtitle="Product.title"
          v-for="(Product,i) in filteredItems"
          :key="i"
          @click="SendToCart(Product)"
          rounded="xl"
        ></v-list-item>
      </v-list>
      <div v-if="isTransaction === true"><account-create-in></account-create-in></div>
      <div v-else>
        <product-create-in></product-create-in>
      </div>
    </v-navigation-drawer>
  </v-card>
  </template>
  
  <script setup lang="ts">
    import { ref, onMounted, computed } from 'vue';
    import { useProduct, useAccount, useUser } from '../../../stores';
    import { productType } from '../../Types/productTypes';
    import ProductCreateIn from './ProductCreateIn.vue';
    import AccountCreateIn from '../../Accounts/Forms/AccountCreateIn.vue';
  
    const props = defineProps({
        products: {
            type: Array,
            required: true,
        },
        isTransaction: {
          type: Boolean,
          required: true,
          default: false
        }
    })
  
    //const emit = defineEmits(["InsertInCart"]);

   // const emit = defineEmits<{InsertInCart: [product: productType]}>()
    const emit = defineEmits<{
      (e: 'InsertInCart', product: productType):void
    }>()

    const drawer = ref(true)
  
    /** ********************************** Searching from Product List **************************** */
    const search = ref('')
    const filteredItems:any = computed(() =>
        props.products.filter((item:any) =>
        item.title.toLowerCase().includes(search.value.toLowerCase()) ||
        item.name.toLowerCase().includes(search.value.toLowerCase())
      )
    )
    const SendToCart = (product: productType) => {
      emit('InsertInCart', product)
    }
    /** *******************************Loading Product List **************************************  */
    onMounted(()=> {
            const cmpid: string | undefined = useUser().getUser.company_id? useUser().getUser.company_id : useUser().user.company_id
           if(cmpid !== undefined && useProduct().getProducts.length<1) {
            useProduct().loadingProducts(cmpid)
            }
            if(cmpid !== undefined && useAccount().getAccounts.length<1) {
            useAccount().loadingAccounts(cmpid)
            }
          })
  </script>
  