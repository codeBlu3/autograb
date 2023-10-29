import {
  Accounts,
  AccountsLedger,
  Transaction,
  TransactionList,
  TransactionStatus,
  FundTransferStatus,
  Roles,
} from "./types";

export function createUserAccount(
  accountsLedger: AccountsLedger,
  transactionList: TransactionList,
  fullname: string,
  initialDepositAmount: number,
  role: Roles,
): string {
  let newAccountNumber;
  if (initialDepositAmount > 0 && role === "customer") {
    const latestAccount = accountsLedger.reduce(
      (max, current) =>
        parseInt(current.accountNumber) > parseInt(max.accountNumber)
          ? current
          : max,
      accountsLedger[0],
    );
    newAccountNumber = (parseInt(latestAccount.accountNumber) + 1).toString();
    accountsLedger.push({
      accountNumber: newAccountNumber,
      accountName: fullname,
      balance: initialDepositAmount,
    });
    transactionList.push({
      accountNumber: newAccountNumber,
      transactionType: "account opening",
      amount: initialDepositAmount,
    });
  } else {
    newAccountNumber = "failed";
  }

  return newAccountNumber;
}

export function getAccountBalance(
  accountsLedger: AccountsLedger,
  accountNumber: string,
  role: Roles,
): TransactionStatus {
  let accountBalanceStatus: TransactionStatus;
  const accountBalance = accountsLedger.find(
    (element) => element.accountNumber === accountNumber,
  );
  if (accountBalance !== undefined) {
    accountBalanceStatus = {
      status: "success",
      balance: accountBalance.balance,
    };
  } else {
    accountBalanceStatus = { status: "failed" };
  }

  return accountBalanceStatus;
}

export function deposit(
  accountsLedger: AccountsLedger,
  transactionList: TransactionList,
  accountNumber: string,
  amount: number,
  role: Roles,
): TransactionStatus {
  let transactionResult: TransactionStatus;

  const account = accountsLedger.find(
    (element) => element.accountNumber === accountNumber,
  );
  if (account !== undefined && amount > 0 && role === "customer") {
    account.balance += amount;

    transactionList.push({
      accountNumber: accountNumber,
      transactionType: "deposit",
      amount: amount,
    });

    transactionResult = { status: "success", balance: account.balance };
  } else {
    transactionResult = { status: "failed" };
  }
  return transactionResult;
}

export function withdrawal(
  accountsLedger: AccountsLedger,
  transactionList: TransactionList,
  accountNumber: string,
  amount: number,
  role: Roles,
): TransactionStatus {
  let transactionResult: TransactionStatus;

  const account = accountsLedger.find(
    (element) => element.accountNumber === accountNumber,
  );
  if (
    account !== undefined &&
    account.balance >= amount &&
    amount > 0 &&
    role === "customer"
  ) {
    account.balance -= amount;

    transactionList.push({
      accountNumber: accountNumber,
      transactionType: "withdrawal",
      amount: -amount,
    });

    transactionResult = { status: "success", balance: account.balance };
  } else {
    transactionResult = { status: "failed" };
  }
  return transactionResult;
}

export function transferFund(
  accountsLedger: AccountsLedger,
  transactionList: TransactionList,
  fromAccountNumber: string,
  toAccountNumber: string,
  amount: number,
  role: Roles,
): FundTransferStatus {
  let transactionResult: FundTransferStatus;

  const fromAccount = accountsLedger.find(
    (element) => element.accountNumber === fromAccountNumber,
  );
  const toAccount = accountsLedger.find(
    (element) => element.accountNumber === toAccountNumber,
  );

  if (
    fromAccount !== undefined &&
    toAccount !== undefined &&
    fromAccount.balance >= amount &&
    amount > 0 &&
    role === "customer"
  ) {
    fromAccount.balance -= amount;
    toAccount.balance += amount;
    transactionList.push({
      accountNumber: fromAccountNumber,
      transactionType: "fundtransfer",
      amount: -amount,
    });

    transactionList.push({
      accountNumber: toAccountNumber,
      transactionType: "fundtransfer",
      amount: amount,
    });

    transactionResult = {
      status: "success",
      fromBalance: fromAccount.balance,
      toBalance: toAccount.balance,
    };
  } else {
    transactionResult = { status: "failed" };
  }
  return transactionResult;
}

export function getTotalBankBalance(
  accountsLedger: AccountsLedger,
  transactionList: TransactionList,
  role: Roles,
): TransactionStatus {
  let transactionResult: TransactionStatus;
  if (role === "bank manager") {
    const totalBankBalance = accountsLedger.reduce(
      (n, { balance }) => n + balance,
      0,
    );
    const transactionSum = transactionList.reduce(
      (n, { amount }) => n + amount,
      0,
    );

    transactionResult = { status: "success", balance: totalBankBalance };
  } else {
    transactionResult = { status: "failed" };
  }
  //console.log(transactionSum)

  return transactionResult;
}
