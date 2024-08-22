import "./Hero.css";
import "@rainbow-me/rainbowkit/styles.css";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import PayTokenPage from "./PayTokenPage";
import WithdrawPage from "./WithdrawPage";
import { useState } from "react";

type Tab = "token" | "withdraw";

const Hero = () => {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>("token");
  return (
    <div className="heroContainer">
      {!isConnected && (
        <div>
          <h1 className="heroTitle">OnChain Payment</h1>
          <div className="connectHero">
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button className="connectButton" onClick={openConnectModal}>Connect Wallet</button>
              )}
            </ConnectButton.Custom>
          </div>
        </div>
      )}
      {isConnected && (
        <>
          <div className="tabs flex">
            <button
              className={`px-4 py-2 ${
                activeTab === "token"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setActiveTab("token")}
            >
              Token Payment
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === "withdraw"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
              onClick={() => setActiveTab("withdraw")}
            >
              Withdraw (Admin)
            </button>
          </div>
          <div className="hero">
            <div className="content mt-4">
              {activeTab === "token" && <PayTokenPage />}
              {activeTab === "withdraw" && <WithdrawPage />}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Hero;
