# multisig-wallet-eth
Multi Signature Wallet Smart Contract in Solidity using Hardhat for EVM-Compatible blockchains.

### Install NPM Dependencies
```shell
npm i
```

### Run The Tests

```shell
npx hardhat test
```

All the tests should be passing
```shell
  MultiSig Contract
    Deployment
      ✔ Should set the right owner
      ✔ Should set the right number of quorum
      ✔ Should set the right signers
    Transactions
      ✔ Should propose a new valid transaction
      ✔ Should approve a valid transactions
      ✔ Should fail to approve transaction if sender is not a valid signer
      ✔ Should fail to approve more than once for the same signer
      ✔ Should confirm the transaction after required quorum number
      ✔ Should fail to execute transaction if sender is not a valid signer
      ✔ Should fail to execute transaction if does not have enough quorum
      ✔ Should execute if reached enough quorum
      ✔ Should fail to execute the transaction more than once

  12 passing (1s)
```

### Initialize the Hardhat EVM node

This command initializes a local development node
```shell
npx hardhat node
```

### Run the "deploy.js" Script

This will deploy the contracts to the local node
```bash
npx hardhat --network localhost run ./scripts/deploy.js
```