// config/index.tsx

import { cookieStorage, createStorage, http } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { bsc, bscTestnet } from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = "b2c4308bf8e3c0049ff035efdcd530f1";

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [
  process.env.NEXT_PUBLIC_CHAIN_ID === "97" ? bscTestnet : bsc,
];

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
