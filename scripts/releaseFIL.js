const { ethers } = require("hardhat")
require('dotenv').config();
const WalletPK = process.env.PRIVATE_KEY;
const paymentContractAddr = process.env.PAYMENT_CONTRACT_ADDRESS;
const toAddress = "0x44061AA8Df5b33a997CE97d80c700d0C655Dc3f2";

async function main() {
    //Get signer information
    const wallet = new ethers.Wallet(WalletPK, ethers.provider)
    console.log("Wallet Addresss is ", wallet.address);
    console.log("FIL balance:", ethers.formatEther(await ethers.provider.getBalance(wallet.address)));
   
    const factory = await ethers.getContractFactory("PaymentContract", wallet);
    const paymentContract = factory.attach(paymentContractAddr);

    //Check the FIL balance of the payment contract
    const filBalance = await paymentContract.getFILBalance();
    console.log("Contract FIL balance is ", filBalance);

    var withdrawAmount = ethers.parseUnits('0.05', 18);
    if(withdrawAmount <= filBalance){
      const tx = await paymentContract.releaseFIL(toAddress,withdrawAmount);
      console.log(tx.hash);
      await tx.wait();
    }else console.log("Not enought FIL.");
    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });