# OnChain Token Payment Example

This project demonstrates a basic example of paying with ERC20 token using the smart contract on Filecoin. This project includes a tokenPayment contract and a frontend to interact with the tokenPayment Contract. 

### Installation

```sh
pnpm install
```


### tokenPayment

The first version of tokenPayment contract will accept the wFIL ERC20 token as payment. Going forward, we are going to add more examples of accepting multiple erc20 tokens as payment or even token payments crossed from other chains.

In order to test the PoC, you will need to:
1. clone this project and install all dependencies.
1. add a `.env` file in the project to store the wallet key and contract address for hardhat to use.
    - add the following lines in `.env `
        ```
        PRIVATE_KEY=
        WFIL_CONTRACT_ADDRESSS=
        PAYMENT_CONTRACT_ADDRESS=
        ```
1. compile & deployed the tokenPayment contract and update the `.env` file with the token payment contract address.

### frontEnd
There are two main features of the app.
1. Pay for service using wFIl.

   <img width="530" alt="image" src="https://github.com/FIL-Builders/OnchainPayment/assets/34025001/22993cb1-f064-440e-8b87-398e654b50c6">

   
1. For the admin(contract owner) to withdraw payments received in the smart contract.

   <img width="501" alt="image" src="https://github.com/FIL-Builders/OnchainPayment/assets/34025001/f9af3ead-3476-4871-9486-9827ca5be15e">



UI codes are all in the `frontend` folder, we need to install all the dependencies in the `frontend` folder before we start the react app.

1. Update the deployed `PAYMENT_CONTRACT_ADDRESS` in `frontend/src/components/payToken.tsx` and `frontend/src/components/withdraw.tsx`.
1. If you changed the contract code, you also need to copy the generated `PaymentContract.json` over into the `frontend/src/contracts/` folder.
1. You can start to react app using `npm start`
1. Open http://localhost:3000 to view it in the browser. 

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

## What is next?
This is the v0 of token payment PoC. We will add more features including:
- Improve the UI/UX
- Accept multiple Filecoin-native ERC20 tokens as payment on Filecoin
- Link the payment to the service (e.g. storage service) and track the payment history in the smart contract
- Accept cross-chain token payment for storage service provided in other L1, supporting [client-contract](https://github.com/filecoin-project/fvm-starter-kit-deal-making) or [data onramp (wip)](https://github.com/ZenGround0/onramp-contracts/tree/main).
- ......
