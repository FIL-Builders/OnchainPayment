import { useState, useEffect } from "react";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useAccount,
} from "wagmi";
import paymentContract from "../contracts/PaymentContract.json";
import { erc20Abi } from "../contracts/erc20_abi";
import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import LoadingBar from "./LoadingBar";
import TokenModal from "./Token";

import "./payToken.css";

const PAYMENT_CONTRACT_ADDRESS = "0x12191e7F6D1CA2Ebb25b04B178F4EF0479CEb5F0";
const WFIL_CONTRACT_ADDRESS = "0xaC26a4Ab9cF2A8c5DBaB6fb4351ec0F4b07356c4";
const abi = paymentContract.abi;

const availableTokens = [
  {
    id: 1,
    name: "Wrapped FIL",
    symbol: "wFIL",
    address: "0xaC26a4Ab9cF2A8c5DBaB6fb4351ec0F4b07356c4"
  },
  {
    id: 2,
    name: "Wrapped ETH",
    symbol: "wETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  }
]

export function PayToken() {
  const [amount, setAmount] = useState("1.25");
  const [isApproveConfirmed, setIsApproveConfirmed] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [isPaymentSent, setIsPaymentSent] = useState(false);
  const { isConnected, address: payerAddress } = useAccount();
  const { data: hash, writeContract } = useWriteContract();
  const [progress, setProgress] = useState(0);
  const [selectedToken, setSelectedToken] = useState(availableTokens[0]);

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const handleTokenChange = () => {
    console.log("handleTokenChange");
    setSelectedToken(availableTokens[0]);
  };

  const handlePayment = async () => {
    setIsApproveConfirmed(false);
    setIsPaymentConfirmed(false);
    setProgress(0);
    writeContract({
      address: selectedToken.address as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [PAYMENT_CONTRACT_ADDRESS, ethers.parseEther(amount)],
    });
  };

  useEffect(() => {
    if (isConfirming) {
      setProgress(50);
    }
    if (isConfirmed) {
      if (!isApproveConfirmed) {
        setIsApproveConfirmed(isConfirmed);

        if (!isPaymentSent) {
          writeContract({
            address: PAYMENT_CONTRACT_ADDRESS,
            abi,
            functionName: "pay",
            args: [ethers.parseUnits(amount, 18)],
          });
          setIsPaymentSent(true);
        }
      } else if (!isPaymentConfirmed) {
        setIsPaymentConfirmed(isConfirmed);
        setProgress(100);
      }
    }
  }, [isConfirming, isConfirmed]);

  if (isConnected) {
    return (
      <div className="ctaContainer">
          <div className="titleContainer">
            <div className="title">Token Payment for Filecoin Storage Service</div>
            {payerAddress && (
              <div className="payerAddress">Payer Address: {payerAddress}</div>
            )}
          </div>
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
                              wFIL Deposit Amount:{" "}
                            </span>
                            <input
                              type="text"
                              placeholder="1.25"
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
                          <TokenModal
                            selectedToken={selectedToken}
                          />
                          <div className="balanceText">
                            Balance:{" "}
                            {parseFloat(
                              account.balanceFormatted ?? "0"
                            ).toFixed(2)}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
          </div>
          <div className="paymentContainer">
            <button
              onClick={handlePayment}
              disabled={isConfirming}
              className="payButton"
            >
              Send Payment
            </button>
          </div>
          {hash && <div>Transaction Hash: {hash}</div>}
          {isConfirming && <div>Waiting for confirmation...</div>}
          {isApproveConfirmed && <div>Approve is confirmed...</div>}
          {isPaymentConfirmed && <div>Payment is received...</div>}
          {progress > 0 && <LoadingBar progress={progress} />}
      </div>
    );
  }
}
