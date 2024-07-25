import "./Navbar.css";
import logo from "./logo.jpg";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { PayToken } from "./components/payToken";
import { Withdraw } from "./components/withdraw";
import { FaGithub } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="container">
      <img src={logo} alt="logo" className="logo" />
      <div className="main">
        <div className="connectButton">
          <ConnectButton />
        </div>
        
      </div>
    </div>
  );
};

export default Navbar;
