

export interface CmpType {    //Table Name: companies
  id?: string,
  created_at?: Date | string,
  updated_at?: Date | string
}

export interface userType {     //Table Name: users
  id?: string,
  company_id?: string,
  name?: string,
  username?: string,
  password?: string,
  password_confirmation?: string,
  mobileno?: string,
  addr?: string,
  role?: string,
  status?: Boolean,
  created_at?: Date | string,
  updated_at?: Date | string
}

