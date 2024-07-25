import "./Hero.css";
import "@rainbow-me/rainbowkit/styles.css";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PayToken } from "./components/payToken";
import { Withdraw } from "./components/withdraw";

const Hero = () => {
  return (
    <div className="container1">
      <div className="hero">
        <div className="title">OnChain Payment</div>
        <div className="connectHero">
          <ConnectButton />
        </div>
        <PayToken />
        <Withdraw />
      </div>
    </div>
  );
};

export default Hero;
