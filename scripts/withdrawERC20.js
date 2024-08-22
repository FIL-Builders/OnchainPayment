const { ethers } = require("hardhat")
require('dotenv').config();
const WalletPK = process.env.PRIVATE_KEY;
const paymentContractAddr = process.env.PAYMENT_CONTRACT_ADDRESS;

async function main() {
    //Get signer information
    const wallet = new ethers.Wallet(WalletPK, ethers.provider)
    console.log("Wallet Addresss is ", wallet.address);
    console.log("FIL balance:", ethers.formatEther(await ethers.provider.getBalance(wallet.address)));
   
    const factory = await ethers.getContractFactory("PaymentContract", wallet);
    const paymentContract = factory.attach(paymentContractAddr);

    //Check the wFIL balance of the payment contract
    const wFILBalance = await paymentContract.getErc20tBalance();
    console.log("wFIL balance is ", wFILBalance);

    var withdrawAmount = ethers.parseUnits('0.05', 18);
    if(withdrawAmount < wFILBalance){
      const tx = await paymentContract.withdrawErc20(withdrawAmount);
      console.log(tx.hash);
      await tx.wait();
    }else console.log("Not enought wFIL.");
    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });