
export interface itemType {     // Table Name: items
    id?: string,
    name?: string,
    description?: string,
    type?: string,
    status?: Boolean,
    company_id?: string,
    user_id?: string,
    created_at?: Date | string,
    updated_at?: Date | string
}

export interface brandType {  // Table Name: brands
    id?: string,
    name?: string,
    status?: Boolean,
    company_id?: string,
    user_id?: string,
    created_at?: Date | string,
    updated_at?: Date | string
}

export interface productType {          //Table: products
    id?: string,
    item_id?: string,
    brand_id?: string,
    name?: string,
    code?: string,
    purchase_price?: Number,
    mrp?: Number,
    quantity?: Number,
    images?: string,
    warranty?: Number,
    measuring_unit?: string,
    status?: boolean,
    isPublished?: boolean,
    company_id?: string,
    user_id?: string,
    updator_id?: string,
    created_at?: Date | string,
    updated_at?: Date | string
}

export interface purchaseType {         /** Table: purchases, purchase_details, slnos */
    id?: string,
    PRN?: string,
    cart_total_quantity?: Number,
    cart_total_amount?: Number,
    status?: boolean,
    purchase_payment?: Number,
    Purchases?: purchase_detailType,
    supplier_code?: string,
    company_id?: string,
    user_id?: string,
    updator_id?: string,
    created_at?: Date | string,
    updated_at?: Date | string
}

export interface purchase_detailType {         /** Table: purchase_details */
    id?: string,
    PRN?: string,
    purchase_id?: string,
    product_id?: string,
    title?: string,
    purchase_price?: Number,
    mrp?: Number,
    quantity?: Number,
    company_id?: string,
}

export interface slnoType {        /** Table: slnos */
    id?: Number,
    purchase_id?: Number,
    purchasedetail_id?: Number,
    product_id?: string,
    slno?: string,
    quantity?: Number,
    status?: Boolean,
    company_id?: string
}

export interface stockType {            /** Table: stocks */
    id?: string,
    purchase_id?: string,
    product_id?: string,
    quantity?: Number,
    purchase_price?: Number,
    mrp?: Number,
}

export interface payableType {      /** Table: payables */
    id?: string,
    description_id?: string,    /** purchase_id */
    payee_id?: string,          /** Relation with Suppliers */
    description?: string,
    amount?: Number,
    company_id?: string,
    user_id?: string,
    updator_id?: string,
    created_at?: Date | string,
    updated_at?: Date | string
}

export interface receivableType {           /** receivables */
    id?: string,
    description_id?: string,    /** sale_id*/
    debtor_id?: string,         /** Relation with Buyers */
    description?: string,
    amount?: Number,
    company_id?: string,
    user_id?: string,
    updator_id?: string,
    created_at?: Date | string,
    updated_at?: Date | string
}

export interface investmentType {       /** Table: investments (Invest(+)/withdraw(-)*/ 
    id?: string,
    investor_id?: string,
    description?: string,
    amount?: number,
    status?: boolean,
    company_id?: string,
    user_id?: string,
    updator_id?: string,
    created_at?: Date | string,
    updated_at?: Date | string
}

export interface loanType {       /** Table: loans (Disburse(-)/Installment(+)/settlement(+))**/
    id?: string,
    lender_id?: string,
    description?: string,
    amount?: number,
    status?: boolean,
    company_id?: string,
    user_id?: string,
    updator_id?: string,
    created_at?: Date | string,
    updated_at?: Date | string
}

export interface receivepaymentType {       /** receivespayments */
    id?: string,
    description_id?: string,    /** Purchase_id, Sale_id */
    description?: string,
    amount?: number,
    company_id?: string,
    user_id?: string,
    created_at?: Date | string,
    updated_at?: Date | string

}

export interface ledgerType {           /** ledgers */
    id?: Number,
    TRN?: string,
    type?: string,
    account_id?: Number,
    type_code?: string,
    description?: string,
    amount?: Number,
    payment?: Number,
    party_code?: string,          /** Buyer, supplier, Investor, employee, labor */
    company_id?: string,
    user_id?: string,
    updator_id?: string,
    created_at?: Date | string,
    updated_at?: Date | string
}

export interface accountType {          /** accounts */
    id?: Number,
    name?: string,
    description?: string,
    account_type_id?: Number,
    status?: boolean,
    company_id?: string,
    user_id?: string,
    updator_id?: string,
    created_at?: Date | string,
    updated_at?: Date | string
}

export interface account_typeType {         /** account_types */
    id?: Number,
    name?: string,
    code?: string,
    description?: string
}

export interface saleType {                 /** sales */
    id?: Number,
    inv?: string,
    cart_total_quantity?: Number,
    cart_total_amount?: Number,
    discount?: Number,
    shipping?: Number,
    vat?: Number,
    tax?: Number,
    collection?: Number,
    status?: boolean,
    buyer_code?: string,
    company_id?: string,
    user_id?: string,
    updator_id?: string,
    created_at?: Date | string,
    updated_at?: Date | string
}

export interface sale_detailType {          /** sale_details */
    id?: string,
    sale_id?: string | Number,
    sale_inv?: string,
    product_id?: Number,
    title?: string,
    purchase_price?: Number,
    mrp?: Number,
    quantity?: Number,
    stock_qty?: Number,
    delivery_qty?: Number,
    vat?: Number,
    tax?: Number,
    discount?: Number,
    vat_type?: string,
    tax_type?: string,
    disc_type?: string,
    company_id?: string
}