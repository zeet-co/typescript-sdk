import { AddressZero } from "@ethersproject/constants";
import { ChainId, SUPPORTED_CHAIN_ID } from "./chains";

/**
 * @internal
 */
export const FORWARDER_ADDRESS = "0xc82BbE41f2cF04e3a8efA18F7032BDD7f6d98a81";

/**
 * @internal
 */
export const CONTRACT_ADDRESSES: Record<
  SUPPORTED_CHAIN_ID,
  {
    biconomyForwarder: string;
    twFactory: string;
    twRegistry: string;
  }
> = {
  [ChainId.Mainnet]: {
    biconomyForwarder: "0x84a0856b038eaAd1cC7E297cF34A7e72685A8693",
    twFactory: AddressZero,
    twRegistry: AddressZero,
  },
  [ChainId.Rinkeby]: {
    biconomyForwarder: "0xFD4973FeB2031D4409fB57afEE5dF2051b171104",
    twFactory: AddressZero,
    twRegistry: AddressZero,
  },
  [ChainId.Goerli]: {
    biconomyForwarder: AddressZero,
    twFactory: "0xC966c8E15c104515A49F91C58DCcc65CC5a2CBA5",
    twRegistry: "0xC6642e134E61A1888B9ff1f61E8003b9160c4e01",
  },
  [ChainId.Polygon]: {
    biconomyForwarder: "0x86C80a8aa58e0A4fa09A69624c31Ab2a6CAD56b8",
    twFactory: AddressZero,
    twRegistry: AddressZero,
  },
  [ChainId.Mumbai]: {
    biconomyForwarder: "0x9399BB24DBB5C4b782C70c2969F58716Ebbd6a3b",
    twFactory: "0xc82BbE41f2cF04e3a8efA18F7032BDD7f6d98a81",
    twRegistry: "0x968d263f329c4f6b91c50349976a544B475320ed",
  },
  [ChainId.Avalanche]: {
    biconomyForwarder: "0x64CD353384109423a966dCd3Aa30D884C9b2E057",
    twFactory: AddressZero,
    twRegistry: AddressZero,
  },
  [ChainId.AvalancheFujiTestnet]: {
    biconomyForwarder: "0x6271Ca63D30507f2Dcbf99B52787032506D75BBF",
    twFactory: AddressZero,
    twRegistry: AddressZero,
  },
  [ChainId.Fantom]: {
    biconomyForwarder: AddressZero,
    twFactory: AddressZero,
    twRegistry: AddressZero,
  },
  [ChainId.FantomTestnet]: {
    biconomyForwarder: AddressZero,
    twFactory: AddressZero,
    twRegistry: AddressZero,
  },
};

/**
 * @internal
 */
export function getContractAddressByChainId(
  chainId: SUPPORTED_CHAIN_ID | ChainId.Hardhat,
  contractName: keyof typeof CONTRACT_ADDRESSES[SUPPORTED_CHAIN_ID],
): string {
  // for testing only
  if (chainId === ChainId.Hardhat) {
    if (contractName === "twFactory") {
      return process.env.factoryAddress as string;
    } else if (contractName === "twRegistry") {
      return process.env.registryAddress as string;
    } else {
      return AddressZero;
    }
  }
  // real output here
  return CONTRACT_ADDRESSES[chainId][contractName];
}