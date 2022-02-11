import { TWFactory, TWFactory__factory } from "@3rdweb/contracts";
import { BigNumber, ethers } from "ethers";
import { z } from "zod";
import {
  DropErc1155Contract,
  DropErc721Contract,
  MarketplaceContract,
  CONTRACTS_MAP,
  PacksContract,
  SplitsContract,
  TokenErc1155Contract,
  TokenErc20Contract,
  VoteContract,
  TokenErc721Contract,
} from "../../contracts";
import { SDKOptions } from "../../schema/sdk-options";
import { IStorage } from "../interfaces/IStorage";
import { NetworkOrSignerOrProvider, ValidContractClass } from "../types";
import { ContractWrapper } from "./contract-wrapper";
import { ProxyDeployedEvent } from "@3rdweb/contracts/dist/TWFactory";

import { ChainlinkVrf } from "../../constants/chainlink";

/**
 * @internal
 */
export class ContractFactory extends ContractWrapper<TWFactory> {
  private storage: IStorage;

  constructor(
    factoryAddr: string,
    network: NetworkOrSignerOrProvider,
    storage: IStorage,
    options?: SDKOptions,
  ) {
    super(network, factoryAddr, TWFactory__factory.abi, options);
    this.storage = storage;
  }

  public async deploy<TContract extends ValidContractClass>(
    contractType: TContract["contractType"],
    contractMetadata: z.input<TContract["schema"]["deploy"]>,
  ) {
    const contract = CONTRACTS_MAP[contractType];
    const metadata = contract.schema.deploy.parse(contractMetadata);
    const contractFactory = contract.contractFactory;
    // TODO: is there any special pre-processing we need to do before uploading?
    const contractURI = await this.storage.uploadMetadata(
      metadata,
      this.readContract.address,
      await this.getSigner()?.getAddress(),
    );

    const encodedFunc = contractFactory
      .getInterface(contractFactory.abi)
      .encodeFunctionData(
        "initialize",
        await this.getDeployArguments(contractType, metadata, contractURI),
      );

    const encodedType = ethers.utils.formatBytes32String(contractType);
    console.log(`Deploying ${contractType} proxy`);
    const receipt = await this.sendTransaction("deployProxy", [
      encodedType,
      encodedFunc,
    ]);
    console.log(`${contractType} proxy deployed successfully`);
    const events = this.parseLogs<ProxyDeployedEvent>(
      "ProxyDeployed",
      receipt.logs,
    );
    if (events.length < 1) {
      throw new Error("No ProxyDeployed event found");
    }

    return events[0].args.proxy;
  }

  // TODO generic function to generate deploy initialize arguments
  private async getDeployArguments<TContract extends ValidContractClass>(
    contractType: TContract["contractType"],
    metadata: z.input<TContract["schema"]["deploy"]>,
    contractURI: string,
  ): Promise<any[]> {
    switch (contractType) {
      case DropErc721Contract.contractType:
      case TokenErc721Contract.contractType:
        const erc721metadata = DropErc721Contract.schema.deploy.parse(metadata);
        return [
          await this.getSignerAddress(),
          erc721metadata.name,
          erc721metadata.symbol,
          contractURI,
          erc721metadata.trusted_forwarder,
          erc721metadata.primary_sale_recipient,
          erc721metadata.fee_recipient,
          erc721metadata.seller_fee_basis_points,
          erc721metadata.platform_fee_basis_points,
          erc721metadata.platform_fee_recipient,
        ];
      case DropErc1155Contract.contractType:
      case TokenErc1155Contract.contractType:
        const erc1155metadata =
          DropErc1155Contract.schema.deploy.parse(metadata);
        return [
          await this.getSignerAddress(),
          erc1155metadata.name,
          erc1155metadata.symbol,
          contractURI,
          erc1155metadata.trusted_forwarder,
          erc1155metadata.primary_sale_recipient,
          erc1155metadata.fee_recipient,
          erc1155metadata.seller_fee_basis_points,
          erc1155metadata.platform_fee_basis_points,
          erc1155metadata.platform_fee_recipient,
        ];
      case TokenErc20Contract.contractType:
        const erc20metadata = TokenErc20Contract.schema.deploy.parse(metadata);
        return [
          await this.getSignerAddress(),
          erc20metadata.name,
          erc20metadata.symbol,
          contractURI,
          erc20metadata.trusted_forwarder,
        ];
      case VoteContract.contractType:
        const voteMetadata = VoteContract.schema.deploy.parse(metadata);
        return [
          voteMetadata.name,
          contractURI,
          voteMetadata.trusted_forwarder,
          voteMetadata.voting_token_address,
          voteMetadata.voting_delay_in_blocks,
          voteMetadata.voting_period_in_blocks,
          BigNumber.from(voteMetadata.proposal_token_threshold),
          voteMetadata.voting_quorum_fraction,
        ];
      case SplitsContract.contractType:
        const splitsMetadata = SplitsContract.schema.deploy.parse(metadata);
        return [
          await this.getSignerAddress(),
          contractURI,
          splitsMetadata.trusted_forwarder,
          splitsMetadata.recipientSplits.map((s) => s.address),
          splitsMetadata.recipientSplits.map((s) => s.shares),
        ];
      case MarketplaceContract.contractType:
        const marketplaceMetadata =
          MarketplaceContract.schema.deploy.parse(metadata);
        return [
          await this.getSignerAddress(),
          contractURI,
          marketplaceMetadata.trusted_forwarder,
          marketplaceMetadata.platform_fee_recipient,
          marketplaceMetadata.platform_fee_basis_points,
        ];
      case PacksContract.contractType:
        const packsMetadata = PacksContract.schema.deploy.parse(metadata);
        const vrf = ChainlinkVrf[await this.getChainID()];
        return [
          await this.getSignerAddress(),
          packsMetadata.name,
          packsMetadata.symbol,
          contractURI,
          packsMetadata.trusted_forwarder,
          packsMetadata.fee_recipient,
          packsMetadata.seller_fee_basis_points,
          vrf.fees,
          vrf.keyHash,
        ];
      default:
        return [];
    }
  }
}