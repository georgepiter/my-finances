export interface DebtModel {
  debtId?: number;
  registerId: number;
  debtDescription: string;
  value: number;
  dueDate: string;
  paymentDate?: string;
  userId: number;
  categoryId: number;
  receiptPayment?: string;
}

export interface DebtPayModel {
  debtId?: number;
  registerId: number;
  receiptPayment: string;
}
