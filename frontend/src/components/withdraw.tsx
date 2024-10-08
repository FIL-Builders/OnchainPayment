import { useState, useEffect } from "react";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
  useAccount,
} from "wagmi";
import paymentContract from "../contracts/PaymentContract.json";
import { ethers } from "ethers";
import { parseEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import LoadingBar from "./LoadingBar";
import TokenModal from "./Token";

import "./withdraw.css";

const PAYMENT_CONTRACT_ADDRESS = "0x12191e7F6D1CA2Ebb25b04B178F4EF0479CEb5F0";
const abi = paymentContract.abi;

const availableTokens = [
  {
    id: 1,
    name: "Wrapped FIL",
    symbol: "wFIL",
    address: "0xaC26a4Ab9cF2A8c5DBaB6fb4351ec0F4b07356c4",
  },
  {
    id: 2,
    name: "Wrapped ETH",
    symbol: "wETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
];

export function Withdraw() {
  const [amount, setAmount] = useState("1.25");
  const { address, isConnected } = useAccount();
  const { data: hash, writeContract } = useWriteContract();
  const [progress, setProgress] = useState(0);

  const [selectedToken, setSelectedToken] = useState(availableTokens[0]);

  const handleTokenChange = () => {
    console.log("handleTokenChange");
    setSelectedToken(availableTokens[0]);
  };

  const wagmiContractConfig = {
    address: PAYMENT_CONTRACT_ADDRESS,
    abi: abi,
  } as const;

  const { data: onwerAddress, isPending } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getOwner",
    args: [],
  });

  const { data: balance } = useReadContract({
    ...wagmiContractConfig,
    functionName: "getContractBalance",
    args: [],
    account: address,
  });

  const handleWithdraw = async () => {
    writeContract({
      address: PAYMENT_CONTRACT_ADDRESS,
      abi: abi,
      functionName: "withdraw",
      args: [parseEther(amount)],
    });
  };

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirming) {
      setProgress(50);
    }
    if (isConfirmed) {
      setProgress(100);
    }
  }, [isConfirming, isConfirmed]);

  if (isPending) return <div>Loading...</div>;

  if (isConnected && onwerAddress == address) {
    return (
      <div className="ctaContainer">
        <div className="withdrawTitle">Withdraw <br /> Token Payment</div>
        <div className="toAddress">Recipient: {address}</div>
        <div className="connectContainer">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div>
                  {(() => {
                    if (!connected) {
                      return (
                        <button onClick={openConnectModal} type="button">
                          Connect Wallet
                        </button>
                      );
                    }

                    return (
                      <div>
                        <button
                          onClick={openChainModal}
                          className="networkSelectButton"
                          type="button"
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? "Chain icon"}
                              src={chain.iconUrl}
                              style={{ width: 24, height: 24 }}
                            />
                          )}
                          {chain.name}
                        </button>
                        <div className="amountInputContainer">
                          <span className="amountLabel">
                            wFIL Withdraw Amount:{" "}
                          </span>
                          <input
                            type="text"
                            placeholder={amount}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="amountInput"
                          />
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== "loading";
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === "authenticated");

              return (
                <div>
                  {(() => {
                    if (!connected) {
                      return (
                        <button onClick={openConnectModal} type="button">
                          Connect Wallet
                        </button>
                      );
                    }

                    return (
                      <div className="chainButtonContainer">
                        <TokenModal selectedToken={selectedToken} />
                        <div className="balanceText">
                          Contract Balance:{" "}
                          {balance ? ethers.formatUnits(balance.toString(), 18) : "0"} wFIL
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
        <div className="withdrawContainer">
          <button
            onClick={handleWithdraw}
            disabled={isPending}
            className="withdrawButton"
          >
            Withdraw
          </button>
        </div>
        {isConfirming && <div className="withdrawStatus">Waiting for confirmation...</div>}
        {isConfirmed && <div className="withdrawStatus">Payment is withdrawn!</div>}
        {hash && <div className="txHash">Transaction Hash: {hash}</div>}
        {progress > 0 && progress < 100 && <LoadingBar progress={progress} />}
      </div>
    );
  }
}
