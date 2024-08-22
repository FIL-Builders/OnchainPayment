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

    var paymentAmount = ethers.parseEther('0.1');
    const tx = await paymentContract.payWithFIL({value: paymentAmount});
    console.log(tx.hash);
    await tx.wait();
    
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });