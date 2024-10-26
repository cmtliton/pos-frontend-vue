<template>
  <v-btn flat icon size="x-small" @click="PrintInvoice()">
    <v-icon color="teal" icon="mdi-printer"></v-icon>
  </v-btn>
</template>

<script setup lang="ts">
  import jsPDF from 'jspdf';
  import { usePurchase } from "../../../stores";
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { useCurrency } from "../../../composables/useCurrency";
  import autoTable from 'jspdf-autotable';

  dayjs.extend(relativeTime);

  const Purchase = usePurchase()

  const props = defineProps({
    item: {
      required: true,
      type: Object
    }
  })


  const doc = new jsPDF();
  

  function PrintInvoice () {
    Purchase.EmptyCart()
    Purchase.PurchasedInfoById(props.item)
  let Profile:any = {}
  for(let key in Purchase.getCartWithCmpNameAndUsername) {
    Profile = Purchase.getCartWithCmpNameAndUsername[key]
  }

  const Headers = [
  { header: 'Sl', dataKey: 'sl' },
  { header: 'Product Description', dataKey: 'title' },
  { header: 'Rate', dataKey: 'purchase_price' },
  { header: 'Quantity', dataKey: 'quantity' },
  { header: 'Amount', dataKey: 'unit_price',}
  ]
  let Data:any[] = Purchase.getCartItems.map((item, index) => {
    return {
    sl: (index+1).toString(),
    title: item.title?.toString(),
    purchase_price: useCurrency().currency(item.purchase_price).toLocaleString(),
    quantity: item.quantity?.toLocaleString(),
    unit_price: useCurrency().currency(item.unit_price).toLocaleString(),
    }
  })

  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight()
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth()

  var pageContent = function() {
  
  doc.setFontSize(20);
  doc.setFont('times', 'bold');
  doc.text(Profile.CmpName, pageWidth/2, pageHeight-(pageHeight-10), {align: 'center'});
  doc.setFontSize(14);
  doc.setFont('times', 'normal');
  doc.text(Profile.CmpAddr, pageWidth/2, pageHeight-(pageHeight-15),{align: 'center'});
   doc.setFontSize(12);
  doc.setFont('times', 'normal');
  doc.text('Mobile No: '+Profile.CmpMobile, pageWidth/2, pageHeight-(pageHeight-20),{align: 'center'});
  doc.setFontSize(12);
  doc.line(10, pageHeight-(pageHeight-22), pageWidth - 15, pageHeight-(pageHeight-22));
  doc.line(10, pageHeight-(pageHeight-22.5), pageWidth - 15, pageHeight-(pageHeight-22.5));
  doc.setFontSize(14);
  doc.setFont('times', 'normal');
  doc.text(Profile.SuppName, pageWidth/2, pageHeight-(pageHeight-28), {align: 'center'});
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.text(Profile.SuppAddr, pageWidth/2, pageHeight-(pageHeight-33),{align: 'center'});
  doc.text('Mobile No: ' +Profile.SuppMobile, pageWidth/2, pageHeight-(pageHeight-38),{align: 'center'});
  doc.text('Purchase Date: ' +dayjs(Profile.created_at).format('DD-MM-YYYY hh:mm A'), pageWidth/2, pageHeight-(pageHeight-42),{align: 'center'});
  doc.line(10, pageHeight-(pageHeight-44), pageWidth - 15, pageHeight-(pageHeight-44))
  doc.setFontSize(12);
  doc.setFont('times', 'normal');
  doc.text('Purchase No: ' +Profile.PRN, 10, pageHeight-(pageHeight-48),{align: 'left'});

  doc.line(10, pageHeight-(pageHeight-50), pageWidth - 15, pageHeight-(pageHeight-50))
  }



  autoTable(doc, {
    didDrawPage: pageContent,
    body: Data,
    columns: Headers,
    startY: 52,
    columnStyles: {
      title: { halign: 'left', cellWidth: 95},
      purchase_price: { halign: 'right'},
      quantity: { halign: 'right'},
      unit_price: { halign: 'right'},
    },
    styles: {fontSize: 9},
    margin: {left: 10, top: 55},
    didParseCell: (hookData) => {
        if (hookData.section === 'head') {
            if (hookData.column.dataKey !== 'sl' && hookData.column.dataKey !== 'title') {
                hookData.cell.styles.halign = 'right';
            }
        }
    }
  })
  
  let finalY = (doc as any).lastAutoTable.finalY + 5;

  doc.line(10, pageHeight-(pageHeight-finalY)-5, pageWidth - 15, pageHeight-(pageHeight-finalY)-5)
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.text('Purchase Total ', pageWidth/2-50, pageHeight-(pageHeight-finalY), {align: 'left'})
  doc.text(' '+Profile.cart_total_quantity+'            ' +useCurrency().currency(Profile.cart_total_amount), pageWidth-15, pageHeight-(pageHeight-finalY),{align: 'right'});
  doc.line(10, pageHeight-(pageHeight-finalY)+2, pageWidth - 15, pageHeight-(pageHeight-finalY)+2)
  doc.setFontSize(10);
  doc.text('Purchase Payment', pageWidth/2-50, pageHeight-(pageHeight-finalY)+6, {align: 'left'})
  doc.text(' ' +useCurrency().currency(Profile.purchase_payment), pageWidth - 15, pageHeight-(pageHeight-finalY)+6,{align: 'right'});
  doc.line(10, pageHeight-(pageHeight-finalY)+8, pageWidth - 15, pageHeight-(pageHeight-finalY)+8)
  doc.text('Purchase Dues', pageWidth/2-50, pageHeight-(pageHeight-finalY)+12, {align: 'left'})
  doc.text(' ' +useCurrency().currency(Profile.cart_total_amount - Profile.purchase_payment), pageWidth - 15, pageHeight-(pageHeight-finalY)+12,{align: 'right'});
  doc.line(pageWidth/2, pageHeight-(pageHeight-finalY)+25, pageWidth - 15, pageHeight-(pageHeight-finalY)+25)
  doc.text('Purchased by ' + Profile.Userfullname, pageWidth/2+45, pageHeight-(pageHeight-finalY)+29, {align: 'center'})
  doc.setFontSize(8);
  doc.text('Print Date ' +dayjs(new Date()).format('DD-MM-YYYY hh:mm A'), 10, pageHeight-(pageHeight-finalY)+29, {align: 'left'})
  //doc.save(Profile.PRN+".pdf");
  //doc.autoPrint();
  doc.output('dataurlnewwindow');
     }
</script>
