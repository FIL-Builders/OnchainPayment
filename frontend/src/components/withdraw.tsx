import { useState } from 'react';
import { type BaseError,useWaitForTransactionReceipt,useWriteContract,useReadContract,useAccount } from 'wagmi'
import paymentContract from "../contracts/PaymentContract.json"
import { parseEther } from 'viem'
import { ethers } from 'ethers'

const PAYMENT_CONTRACT_ADDRESS = "0x12191e7F6D1CA2Ebb25b04B178F4EF0479CEb5F0";
const abi = paymentContract.abi;
 
export function Withdraw() {
    const [amount, setAmount] = useState('')
    const {address,isConnected } = useAccount()
    const { 
        data: hash, 
        writeContract 
      } = useWriteContract()

    const wagmiContractConfig = {
        address: PAYMENT_CONTRACT_ADDRESS,
        abi: abi,
    } as const

    const { 
        data:onwerAddress,
        isPending
      } = useReadContract({
          ...wagmiContractConfig,
          functionName: 'getOwner',
          args: [],
    })
    
    const { 
        data:balance
      } = useReadContract({
          ...wagmiContractConfig,
          functionName: 'getContractBalance',
          args: [],
          account:address,
      })

    const handleWithdraw = async () =>{
        writeContract({
            address: PAYMENT_CONTRACT_ADDRESS,
            abi:abi,
            functionName: 'withdraw',
            args: [parseEther(amount)]
        });  
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({hash,
    })

    if (isPending) return <div>Loading...</div> 

    if(isConnected && onwerAddress==address){
        return (
            <div style={{paddingTop:30}}>
                <h2 >ADMIN Page </h2>
                <h3 >Withdraw received wFIL</h3>
                <p>
                    <div>Contract Balance: {ethers.formatUnits(balance?.toString()!,18)} wFIL</div> 
                </p>
                <input
                    type="text"
                    placeholder="0.05"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                /> wFIL 
                <div style={{paddingTop: 12}}>
                    <button onClick={handleWithdraw} disabled={isPending}>Withdraw</button>
                </div> 
                {isConfirming && <div>Waiting for confirmation...</div>}
                {isConfirmed &&  <div>Payment is withdrawed...</div>}
                {hash && <div>Transaction Hash: {hash}</div>}
            </div>
        )
    }
}
