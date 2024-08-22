import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  mainnet,
  polygon,
  sepolia,
  filecoin,
  filecoinCalibration,
} from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "68e46f11ac0e92ab8d79adb90fdc12eb", // Replace with your own project ID
  chains: [
    mainnet,
    polygon,
    arbitrum,
    filecoin,
    filecoinCalibration,
    ...(process.env.REACT_APP_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
});
