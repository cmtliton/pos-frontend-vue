<template>
  <v-btn flat icon size="x-small" @click="PrintInvoice()">
    <v-icon color="teal" icon="mdi-printer"></v-icon>
  </v-btn>
</template>

<script setup lang="ts">
  import jsPDF from 'jspdf';
  import { useLedger } from "../../../stores";
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';
  import { useCurrency } from "../../../composables/useCurrency";
  import autoTable from 'jspdf-autotable';

  dayjs.extend(relativeTime);

  const Ledger = useLedger()

  const props = defineProps({
    item: {
      required: true,
      type: Object
    }
  })


  const doc = new jsPDF();
  

  function PrintInvoice () {
    Ledger.EmptyCart()
    const Profile = {
      CmpName:props.item.CmpName,
      CmpAddr: props.item.CmpAddr,
      CmpMobile: props.item.CmpMobile,
      SuppName: props.item.party_name,
      SuppAddr: props.item.party_addr,
      SuppMobile: props.item.party_mobile,
      created_at: props.item.created_at,
      PRN: props.item.TRN,

    }
  const Headers = [
  { header: 'Sl', dataKey: 'sl' },
  { header: 'Account Name', dataKey: 'account' },
  { header: 'Description', dataKey: 'description' },
  { header: 'Amount', dataKey: 'amount'}
  ]
  let Data:any[] = [{
    sl: '1',
    account: props.item.type_name.toString()+' '+props.item.account_name.toString(),
    description: props.item.description.toString(),
    amount: useCurrency().currency(props.item.amount).toLocaleString()
  }]

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
  doc.text('Ledger Date: ' +dayjs(Profile.created_at).format('DD-MM-YYYY hh:mm A'), pageWidth/2, pageHeight-(pageHeight-42),{align: 'center'});
  doc.line(10, pageHeight-(pageHeight-44), pageWidth - 15, pageHeight-(pageHeight-44))
  doc.setFontSize(12);
  doc.setFont('times', 'normal');
  doc.text('Ledger No: ' +Profile.PRN, 10, pageHeight-(pageHeight-48),{align: 'left'});

  doc.line(10, pageHeight-(pageHeight-50), pageWidth - 15, pageHeight-(pageHeight-50))
  }

  autoTable(doc, {
    didDrawPage: pageContent,
    body: Data,
    columns: Headers,
    startY: 52,
    columnStyles: {
      account: { halign: 'left'},
      description: { halign: 'left'},
      amount: { halign: 'right'},
    },
    styles: {fontSize: 9},
    margin: {left: 10, top: 55},
    didParseCell: (hookData) => {
        if (hookData.section === 'head') {
            if (hookData.column.dataKey !== 'sl' && hookData.column.dataKey === 'amount') {
                hookData.cell.styles.halign = 'right';
            }
        }
    }
  })
  
  let finalY = (doc as any).lastAutoTable.finalY + 5;

  doc.line(10, pageHeight-(pageHeight-finalY)-5, pageWidth - 15, pageHeight-(pageHeight-finalY)-5)
  doc.setFontSize(10);
  doc.setFont('times', 'normal');
  doc.text('Ledger Total ', pageWidth/2-50, pageHeight-(pageHeight-finalY), {align: 'left'})
  doc.text('' +useCurrency().currency(props.item.amount), pageWidth-15, pageHeight-(pageHeight-finalY),{align: 'right'});
  doc.line(10, pageHeight-(pageHeight-finalY)+2, pageWidth - 15, pageHeight-(pageHeight-finalY)+2)
  doc.setFontSize(10);
  doc.text('Ledger '+ props.item.type, pageWidth/2-50, pageHeight-(pageHeight-finalY)+6, {align: 'left'})
  doc.text(' ' +useCurrency().currency(props.item.payment), pageWidth - 15, pageHeight-(pageHeight-finalY)+6,{align: 'right'});
  doc.line(10, pageHeight-(pageHeight-finalY)+8, pageWidth - 15, pageHeight-(pageHeight-finalY)+8)
  doc.text('Ledger Dues', pageWidth/2-50, pageHeight-(pageHeight-finalY)+12, {align: 'left'})
  doc.text(' ' +useCurrency().currency(props.item.amount - props.item.payment), pageWidth - 15, pageHeight-(pageHeight-finalY)+12,{align: 'right'});
  doc.line(pageWidth/2, pageHeight-(pageHeight-finalY)+25, pageWidth - 15, pageHeight-(pageHeight-finalY)+25)
  doc.text(props.item.type +' by ' + props.item.username, pageWidth/2+45, pageHeight-(pageHeight-finalY)+29, {align: 'center'})
  doc.setFontSize(8);
  doc.text('Print Date ' +dayjs(new Date()).format('DD-MM-YYYY hh:mm A'), 10, pageHeight-(pageHeight-finalY)+29, {align: 'left'})
  //doc.save(Profile.PRN+".pdf");
  //doc.autoPrint();
  doc.output('dataurlnewwindow');
     }
</script>
