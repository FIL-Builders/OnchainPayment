const { ethers } = require("hardhat")
require('dotenv').config();
const WalletPK = process.env.PRIVATE_KEY;
const paymentContractAddr = process.env.PAYMENT_CONTRACT_ADDRESS;
const wfilAddress = process.env.WFIL_CONTRACT_ADDRESSS;

async function main() {
    //Get signer information
    const wallet = new ethers.Wallet(WalletPK, ethers.provider)
    console.log("Wallet Addresss is ", wallet.address);
    console.log("FIL balance:", ethers.formatEther(await ethers.provider.getBalance(wallet.address)));

    //Approve paymentContract to spend wFIL
    var amount = ethers.parseUnits('0.1', 18); 
    await approveWFIL(wallet, paymentContractAddr, amount);
   
    //Invoking payment contract to pay with wFIL token
    const factory = await ethers.getContractFactory("PaymentContract", wallet);
    const paymentContract = factory.attach(paymentContractAddr);

    const tx = await paymentContract.payWithErc20(amount);
    console.log(tx.hash);
    await tx.wait();
}

async function approveWFIL(wallet, spenderAddress, amount){
    // The ERC20 Contract interface
    var abi = [
      "function balanceOf(address owner) view returns (uint)",
      "function approve(address spender, uint amount)"
    ];
    const wFILContract = new ethers.Contract(wfilAddress, abi, wallet);
    
    const balance = await wFILContract.balanceOf(wallet.address);
    console.log("wFIL Balance:", ethers.formatEther(balance));
    console.log("approving amount:", amount);

    if(amount < balance){
        const tx = await wFILContract.approve(spenderAddress, amount);
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