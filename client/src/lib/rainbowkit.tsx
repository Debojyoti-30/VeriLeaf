// // src/lib/rainbowkit.tsx (no WalletConnect)
// import '@rainbow-me/rainbowkit/styles.css';
// import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
// import { createConfig, http, WagmiProvider } from 'wagmi';
// import { injected } from 'wagmi/connectors';
// import { coinbaseWallet } from 'wagmi/connectors';
// import { mainnet, polygon, sepolia } from 'wagmi/chains';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// const config = createConfig({
//   chains: [mainnet, polygon, sepolia],
//   transports: {
//     [mainnet.id]: http(), [polygon.id]: http(), [sepolia.id]: http(),
//   },
//   connectors: [
//     injected({ shimDisconnect: true }),        // MetaMask/Brave/OKX in browser
//     coinbaseWallet({ appName: 'VeriLeaf' }),   // Coinbase Wallet SDK
//   ],
//   ssr: false,
// });

// const queryClient = new QueryClient();
// export function RainbowKitWrapper({ children }: { children: React.ReactNode }) {
//   return (
//     <WagmiProvider config={config}>
//       <QueryClientProvider client={queryClient}>
//         <RainbowKitProvider>{children}</RainbowKitProvider>
//       </QueryClientProvider>
//     </WagmiProvider>
//   );
// }


// rainbowkit.tsx
import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { coinbaseWallet } from 'wagmi/connectors';
import { mainnet, polygon, sepolia, celo, celoAlfajores } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// If you have Alchemy/QuickNode URLs, put them here for reliability:
const config = createConfig({
  chains: [celo, celoAlfajores, 
    // mainnet, 
    // polygon, 
    sepolia],
  transports: {
    [celo.id]: http('https://forno.celo-sepolia.celo-testnet.org'),            // replace with your RPC if you have one
    [celoAlfajores.id]: http(),
    // [mainnet.id]: http(),
    // [polygon.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({ appName: 'VeriLeaf' }),
  ],
  ssr: false,
});

const queryClient = new QueryClient();

export function RainbowKitWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
