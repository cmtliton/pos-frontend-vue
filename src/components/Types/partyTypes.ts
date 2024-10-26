export interface supplierType {     // Table Name: suppliers
    id?: string,
    code?: string,
    name?: string,
    mobileno?:string,
    addr?: string,
    type?: string,
    status?: Boolean,
    company_id?: string,
    user_id?: string,
    updator_id?: string,
    created_at?: Date | string,
    updated_at?: Date | string
}

export interface buyerType {  // Table Name: buyers
    id?: string,
    code?: string,
    name?: string,
    mobileno?: string,
    addr?: string,
    type?: string,
    status?: Boolean,
    company_id?: string,
    user_id?: string,
    updator_id?: string,
    created_at?: Date | string,
    updated_at?: Date | string
}

export interface type {
    id: Number,
    name: string,
    type: string
}
