export enum type {
    expense = "EXPENSE",
    income = "INCOME",
    transfer = "TRANSFER"
}
export interface Transaction {
   id: number,
   amount: string,
   type: type,
   description?: string,
   date: string,
   categoryID: number,
   imageUrl?: string,
}

export interface Item {
    title: string
    action: string
    route: string
}