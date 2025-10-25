import { ConnectButton } from '@rainbow-me/rainbowkit';

export function ConnectWalletButton() {
  return (
    <ConnectButton
      label="Connect Wallet"
      chainStatus={{ smallScreen: 'icon', largeScreen: 'full' }}
      showBalance={{ smallScreen: false, largeScreen: true }}
      accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
    />
  );
}
