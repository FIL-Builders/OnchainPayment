import "./Navbar.css";
import Logo from "./svg/Logo"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

const Navbar = () => {
  return (
    <div className="container">
      <Logo className="logo" />
      <div className="main">
        <ConnectButton.Custom>
          {({ account, chain, openConnectModal, openAccountModal }) => {
            const connected = account && chain;
            return (
              <div>
                {connected ? (
                  <div className="connectedContainer">
                    <button
                      className="connectButton"
                      onClick={openAccountModal}
                    >
                      Disconnect
                    </button>
                  </div>
                ) : (
                  <button className="connectButton" onClick={openConnectModal}>
                    Connect Wallet
                  </button>
                )}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>
    </div>
  );
};

export default Navbar;
