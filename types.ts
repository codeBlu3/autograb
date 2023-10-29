export type Accounts = {
  accountNumber: string;
  accountName: string;
  balance: number;
};

export type AccountsLedger = Accounts[];

export type Transaction = {
  accountNumber: string;
  transactionType:
    | "account opening"
    | "deposit"
    | "withdrawal"
    | "fundtransfer";
  amount: number;
};
export type TransactionList = Transaction[];

export type Roles = "customer" | "bank manager";

export type TransactionStatus = {
  status: "failed" | "success";
  balance?: number;
};

export type FundTransferStatus = {
  status: "failed" | "success";
  fromBalance?: number;
  toBalance?: number;
};
