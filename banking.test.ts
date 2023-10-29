import {
  createUserAccount,
  deposit,
  withdrawal,
  transferFund,
  getAccountBalance,
  getTotalBankBalance,
} from "./banking";
import { Accounts, Transaction } from "./types";

describe("Banking System", () => {
  let accountsLedger: Accounts[];
  let transactionList: Transaction[];
  beforeAll(() => {
    accountsLedger = [
      { accountNumber: "1", accountName: "John Doe ", balance: 100 },
      { accountNumber: "2", accountName: "Elton John", balance: 1500 },
    ];

    transactionList = [
      {
        accountNumber: "1",
        transactionType: "deposit",
        amount: 100,
      },
      {
        accountNumber: "2",
        transactionType: "deposit",
        amount: 1500,
      },
    ];
  });

  afterAll(() => {
    console.log(accountsLedger);
    console.log(transactionList);
    accountsLedger = [];
    transactionList = [];
  });

  test("Account Creation with normal params", () => {
    const accountNumber = createUserAccount(
      accountsLedger,
      transactionList,
      "Johnny Depp",
      500,
      "customer",
    );
    //    console.log(transactionList);
    expect(accountNumber).toBe("3");
  });

  test("Account Creation with negative amount", () => {
    const accountNumber = createUserAccount(
      accountsLedger,
      transactionList,
      "Johnny Depp",
      -500,
      "customer",
    );
    //    console.log(transactionList);
    expect(accountNumber).toBe("failed");
  });

  test("Account Creation with inappropriate role", () => {
    const accountNumber = createUserAccount(
      accountsLedger,
      transactionList,
      "Johnny Depp",
      500,
      "bank manager",
    );
    //    console.log(transactionList);
    expect(accountNumber).toBe("failed");
  });

  test("Check Account Balance with normal params", () => {
    const accountBalance = getAccountBalance(accountsLedger, "2", "customer");
    expect(accountBalance).toEqual({ status: "success", balance: 1500 });
  });

  test("Check Account Balance with non-existing account ", () => {
    const accountBalance = getAccountBalance(accountsLedger, "20", "customer");
    expect(accountBalance).toEqual({ status: "failed" });
  });

  test("Deposit with normal params", () => {
    const updatedAccountBalanceDeposit = deposit(
      accountsLedger,
      transactionList,
      "2",
      500,
      "customer",
    );
    expect(updatedAccountBalanceDeposit).toEqual({
      status: "success",
      balance: 2000,
    });
  });

  test("Deposit with non-existing account", () => {
    const updatedAccountBalanceDeposit = deposit(
      accountsLedger,
      transactionList,
      "20",
      500,
      "customer",
    );
    expect(updatedAccountBalanceDeposit).toEqual({ status: "failed" });
  });

  test("Deposit with negative amount", () => {
    const updatedAccountBalanceDeposit = deposit(
      accountsLedger,
      transactionList,
      "2",
      -500,
      "customer",
    );
    expect(updatedAccountBalanceDeposit).toEqual({ status: "failed" });
  });

  test("Deposit with role mismatch", () => {
    const updatedAccountBalanceDeposit = deposit(
      accountsLedger,
      transactionList,
      "2",
      -500,
      "bank manager",
    );
    expect(updatedAccountBalanceDeposit).toEqual({ status: "failed" });
  });

  test("Withdrawal with normal params", () => {
    const updatedAccountBalanceWithdrawal = withdrawal(
      accountsLedger,
      transactionList,
      "1",
      50,
      "customer",
    );
    expect(updatedAccountBalanceWithdrawal).toEqual({
      status: "success",
      balance: 50,
    });
  });

  test("Withdrawal with non-existent account", () => {
    const updatedAccountBalanceWithdrawal = withdrawal(
      accountsLedger,
      transactionList,
      "20",
      50,
      "customer",
    );
    expect(updatedAccountBalanceWithdrawal).toEqual({ status: "failed" });
  });

  test("Withdrawal with withdrawal amount less than current balance", () => {
    const updatedAccountBalanceWithdrawal = withdrawal(
      accountsLedger,
      transactionList,
      "2",
      2500,
      "customer",
    );
    expect(updatedAccountBalanceWithdrawal).toEqual({ status: "failed" });
  });

  test("Withdrawal with negative amount", () => {
    const updatedAccountBalanceWithdrawal = withdrawal(
      accountsLedger,
      transactionList,
      "2",
      -50,
      "customer",
    );
    expect(updatedAccountBalanceWithdrawal).toEqual({ status: "failed" });
  });

  test("Withdrawal with role mismatch", () => {
    const updatedAccountBalanceWithdrawal = withdrawal(
      accountsLedger,
      transactionList,
      "2",
      50,
      "bank manager",
    );
    expect(updatedAccountBalanceWithdrawal).toEqual({ status: "failed" });
  });

  test("Fundtransfer with normal params", () => {
    const transferFundResults = transferFund(
      accountsLedger,
      transactionList,
      "1",
      "2",
      50,
      "customer",
    );
    expect(transferFundResults).toEqual({
      status: "success",
      fromBalance: 0,
      toBalance: 2050,
    });
  });

  test("Fundtransfer with non-existent source account ", () => {
    const transferFundResults = transferFund(
      accountsLedger,
      transactionList,
      "20",
      "2",
      50,
      "customer",
    );
    expect(transferFundResults).toEqual({ status: "failed" });
  });

  test("Fundtransfer with non-existent destination account ", () => {
    const transferFundResults = transferFund(
      accountsLedger,
      transactionList,
      "2",
      "20",
      50,
      "customer",
    );
    expect(transferFundResults).toEqual({ status: "failed" });
  });

  test("Fundtransfer with fundtransfer amount less than current source balance ", () => {
    const transferFundResults = transferFund(
      accountsLedger,
      transactionList,
      "2",
      "20",
      5000,
      "customer",
    );
    expect(transferFundResults).toEqual({ status: "failed" });
  });

  test("Fundtransfer with negative amount", () => {
    const transferFundResults = transferFund(
      accountsLedger,
      transactionList,
      "2",
      "20",
      -50,
      "customer",
    );
    expect(transferFundResults).toEqual({ status: "failed" });
  });

  test("Fundtransfer with role mismatch", () => {
    const transferFundResults = transferFund(
      accountsLedger,
      transactionList,
      "2",
      "20",
      -50,
      "customer",
    );
    expect(transferFundResults).toEqual({ status: "failed" });
  });

  test("Total Bank Balance with normal params", () => {
    const totalBankBalance = getTotalBankBalance(
      accountsLedger,
      transactionList,
      "bank manager",
    );
    expect(totalBankBalance).toEqual({ status: "success", balance: 2550 });
  });

  test("Total Bank Balance with role mismatch", () => {
    const totalBankBalance = getTotalBankBalance(
      accountsLedger,
      transactionList,
      "customer",
    );
    expect(totalBankBalance).toEqual({ status: "failed" });
  });
});
