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

This will deploy the contracts to the local node and places the contract's ABI and address into the "api" directory
```bash
npx hardhat --network localhost run ./scripts/deploy.js
```
> The `deploy` script will automatically place the artifacts and the contract address in the `api` directory so that the web server can consume the smart contract interface directly.

### Run the web server
```bash
node api/index.js
```

#### Notes
- I did not implement off-chain signing (meta-transactions) as I feel it is out of the scope of this task, instead I added `signerId` in the requests that actually matter like `approve` and `execute` to choose which signer should be used for the transaction

- Owner is `signerId: 0`, and there are two authorized signers `{signerId: 1, 2}`, if another signer IDs are provided the request for approvals and execution will fail because these are not in the authorized signer list.

- Call `/test/sampleData` to get an abi-encoded call data for the `increment` and `decrement` functions on the `Test` contract.

sample output from `/test/sampleData`

```json
{
    "increment": {
        "to": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        "data": "0xd09de08a"
    },
    "decrement": {
        "to": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        "data": "0x2baeceb7"
    }
}
```

- call the `/test/counter` to get the current counter value from the `Test` contract
```json
{
    "counter": "1"
}
```

- Use the `to` address and `data` in the `POST /transactions`
```json
{
    "destination": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    "value": 0,
    "data": "0xd09de08a"
}
```

- You get list all the transactions through `GET /transactions`

```json
{
    "transactions": [
        {
            "id": 0,
            "destination": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            "value": "0",
            "data": "0xd09de08a",
            "executed": true,
            "quorum": "2"
        },
        {
            "id": 1,
            "destination": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
            "value": "0",
            "data": "0xd09de08a",
            "executed": false,
            "quorum": "0"
        }
    ]
}
```

### API 

|Name|Description|Path|Method|Payload|
|-|-|-|-|-|
|List Transactions|Lists all the transactions on the contract|`/transactions`|GET| N/A|
|Propose Transaction|Send a transaction proposal to the contract|`/transactions`|POST|`{"destination": string, "value": int, "data": "string" }`|
|Approve Transaction|Send an approval on a submitted transaction|`/transactions/approve`|POST|`{"trxnId": int, "signerId": int}`|
|Execute Transaction|Execute a submitted transaction|`/transactions/execute`|POST|`{"trxnId": int, "signerId": int}`|
---

### Test API

|Name|Description|Path|Method|Payload|
|-|-|-|-|-|
|Get Sample Data|Gets sample call data for the transaction on the `Test` contract|`/test/sampleData`|GET|N/A|
|Get Counter Value|Gets the current value from the `Test` contract|`/test/counter`|GET|N/A|

