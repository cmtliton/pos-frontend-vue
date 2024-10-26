<template>
  <v-row justify="center">
    <v-dialog v-model="SlNoDialog" persistent max-width="350px">
      <template v-slot:activator="{ props }">
        <v-btn
          icon="mdi-plus"
          size="x-small"
          class="ma-2 pa-2"
          flat
          v-bind="props"
          @click="CommingFromCart()"
        ></v-btn>
      </template>
      <v-card>
        <v-form v-model="formSlNo" @submit.prevent="addSlNo()">
          <v-card-subtitle class="ma-3">{{ product.title}}... </v-card-subtitle>
          <v-divider></v-divider>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Taking SLNo."
                    required
                    v-model.trim="itemSlinfo.slno"
                    :rules="[useItem().rules.required]"
                    variant="outlined"
                    density="compact"
                    placeholder="Taking SLNo..."
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue-darken-1"
              variant="text"
              @click="SlNoDialog = false"
            >
              Close
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import { usePurchase, useItem } from '../../../stores';
  import { slnoType } from '../../Types/productTypes';

  const Purchase = usePurchase()
  const SlNoDialog = ref(false)

  const itemSlinfo = ref<slnoType>({})
  const formSlNo = ref(false)

  const props = defineProps({
    product: {
      required: true,
      type: Object
    }
  })

  function addSlNo() {
    if(Number(itemSlinfo.value.slno?.trim().length) >= 8) {
      if(Purchase.filteredSlNos(itemSlinfo.value).length === itemSlinfo.value.quantity) {
        SlNoDialog.value = false
        itemSlinfo.value.slno = ''
      } else {
        const isDuplicateSl = Purchase.SlNos.find((sl) => {
          return sl.slno === itemSlinfo.value.slno
        })
        if(isDuplicateSl === undefined) {

          let slinfo = {
            purchasedetail_id: itemSlinfo.value.id,
            product_id: itemSlinfo.value.product_id,
            slno: itemSlinfo.value.slno,
            status: false,
            company_id:itemSlinfo.value.company_id
          }
          let isHas = Purchase.SlNos.find((sl)=> sl.purchasedetail_id === itemSlinfo.value.purchasedetail_id && sl.product_id === itemSlinfo.value.product_id)
          if ( isHas) {
            Purchase.editedIndex = Purchase.SlNos.indexOf(isHas)
            //update
            Purchase.SlNos[Purchase.editedIndex].slno = itemSlinfo.value.slno
            itemSlinfo.value.slno = ''
          } else {
            Purchase.SlNos.push({
            id: 0,
            ...slinfo
          })
          itemSlinfo.value.slno = ''
          }
        } else {
          alert('Duplicate Serial No?')
          itemSlinfo.value.slno = ''
          SlNoDialog.value = true
        }
      }
    } else {
      alert('Must be greater than 8 digit!')
      itemSlinfo.value.slno = ''
      SlNoDialog.value = true
    }
  }

  function CommingFromCart() {
    itemSlinfo.value = props.product
  }
</script>
