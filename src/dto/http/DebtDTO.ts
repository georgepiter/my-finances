export interface DebtDTO {
  debtId?: number;
  registerId: number;
  debtDescription: string;
  value: string | undefined;
  categoryId: string | undefined;
  paymentDate: string;
  receiptPayment: string;
  dueDate: string;
  status: string;
}


export interface DebtValuesDTO {
  totalDebt: number;
  totalEntryValue: number;
  currentTotalValue: number;
}


