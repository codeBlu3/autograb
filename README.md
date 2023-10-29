# Installation 
- npm install 
# Running the test script 
- npm test
# File structure
- banking.ts - functionality 
- banking.test.ts - Test suite 
- types.ts - types 

# Architecture and Design Choices
- A ledger for account balances and a list of transaction are maintained. A user is created by providing a name and an auto incremented account number is returned. 
- Total bank balance may be obtained either by summing up the running account balances or the list of transactions. 

