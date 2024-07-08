import { useState } from 'react'
import { useWaitForTransactionReceipt,useWriteContract } from 'wagmi'
import paymentContract from "../contracts/PaymentContract.json"
import { erc20Abi } from '../contracts/erc20_abi'
import { parseEther } from 'viem'

const PAYMENT_CONTRACT_ADDRESS = "0x52E47557508Dea5bdE04E2e9a308b138ECEe0BBC";
const WFIL_CONTRACT_ADDRESS = "0xaC26a4Ab9cF2A8c5DBaB6fb4351ec0F4b07356c4"
const abi = paymentContract.abi;
 
export function PayToken() {
    const [amount, setAmount] = useState('')
    const { 
        data: hash, 
        isPending,
        writeContract 
      } = useWriteContract()

    const handleApprove = async () =>{
        writeContract({
            address: WFIL_CONTRACT_ADDRESS,
            abi:erc20Abi,
            functionName: 'approve',
            args: [PAYMENT_CONTRACT_ADDRESS,parseEther(amount)]
        });  
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({hash,
    })

    if(isConfirmed){
        writeContract({
            address: PAYMENT_CONTRACT_ADDRESS,
            abi,
            functionName: 'pay',
            args: [parseEther(amount)],
        })
    }

    return (
        <div>
            <h3 className="text-4xl font-bold mb-20">{"Pay the service with wFIL token"}</h3>
            <input
                type="text"
                placeholder="0.05"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            /> wFIL
            <div style={{paddingTop: 12}}>
                <button onClick={handleApprove} disabled={isPending}>Pay</button>
            </div>
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed &&  <div>Payment is confirmed...</div>}
            {hash && <div>Transaction Hash: {hash}</div>}
        </div>
    )
}