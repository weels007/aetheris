import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { createClient } from "genlayer-js";
import { studionet } from "genlayer-js/chains";

const STUDIONET_CHAIN_ID_HEX = "0xF22F";
const STUDIONET_CHAIN_ID = 61999;
const NATIVE_CURRENCY = { name: "GEN", symbol: "GEN", decimals: 18 };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GenLayerClient = any;

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  client: GenLayerClient | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  error: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

async function switchToStudionet() {
  if (!window.ethereum) return;
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: STUDIONET_CHAIN_ID_HEX }],
    });
  } catch (err: unknown) {
    const switchErr = err as { code?: number };
    if (switchErr.code === 4902) {
      await window.ethereum!.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: STUDIONET_CHAIN_ID_HEX,
            chainName: "GenLayer Studio",
            nativeCurrency: NATIVE_CURRENCY,
            rpcUrls: ["https://studio.genlayer.com/api"],
            blockExplorerUrls: ["https://studio.genlayer.com/explorer"],
          },
        ],
      });
    }
  }
}

function createClientForAccount(address: string) {
  return createClient({
    chain: studionet,
    account: address as `0x${string}`,
    provider: window.ethereum,
  });
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [client, setClient] = useState<GenLayerClient | null>(null);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask not installed. Please install MetaMask to continue.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];

      const userAddress = accounts[0] as string;

      await switchToStudionet();

      setAddress(userAddress);
      setClient(createClientForAccount(userAddress));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect wallet");
      setAddress(null);
      setClient(null);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "wallet_revokePermissions", params: [{ eth_accounts: null }] })
        .catch(() => {});
    }
    localStorage.removeItem("aetheris_playerName");
    setAddress(null);
    setClient(null);
    setError(null);
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;

    const eth = window.ethereum;

    eth
      .request({ method: "eth_accounts" })
      .then((result: unknown) => {
        const accounts = result as string[];
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setClient(createClientForAccount(accounts[0]));
        }
      })
      .catch(console.error);

    const onAccountsChanged = (accounts: unknown) => {
      const acc = accounts as string[];
      if (!acc.length) {
        setAddress(null);
        setClient(null);
      } else {
        setAddress(acc[0]);
        setClient(createClientForAccount(acc[0]));
      }
    };

    const onChainChanged = () => {
      if (address) {
        setClient(createClientForAccount(address));
      }
    };

    eth.on("accountsChanged", onAccountsChanged);
    eth.on("chainChanged", onChainChanged);

    return () => {
      eth.removeListener("accountsChanged", onAccountsChanged);
      eth.removeListener("chainChanged", onChainChanged);
    };
  }, [address]);

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected: !!address,
        isConnecting,
        client,
        connect,
        disconnect,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void;
    };
  }
}
