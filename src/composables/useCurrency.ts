export function useCurrency() {
   function currency(value:any) {
    return new Intl.NumberFormat("hi", {
        style: 'currency',
        currency: 'bdt',
    }).format(value)
   }
    return { currency };
}