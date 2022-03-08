import { ContractRoles } from "../core/classes/contract-roles";
import { DropERC721, DropERC721__factory } from "@thirdweb-dev/contracts";
import { hexZeroPad } from "@ethersproject/bytes";
import { BigNumber, BigNumberish, BytesLike, ethers } from "ethers";
import { ContractMetadata } from "../core/classes/contract-metadata";
import { ContractRoyalty } from "../core/classes/contract-royalty";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import { IStorage } from "../core/interfaces/IStorage";
import {
  NetworkOrSignerOrProvider,
  TransactionResultWithId,
} from "../core/types";
import { DropErc721ContractSchema } from "../schema/contracts/drop-erc721";
import { SDKOptions } from "../schema/sdk-options";
import {
  CommonNFTInput,
  NFTMetadata,
  NFTMetadataInput,
  NFTMetadataOwner,
} from "../schema/tokens/common";
import { DEFAULT_QUERY_ALL_COUNT, QueryAllParams } from "../types/QueryParams";
import { DropErc721ClaimConditions } from "../core/classes/drop-erc721-claim-conditions";
import { Erc721 } from "../core/classes/erc-721";
import { ContractPrimarySale } from "../core/classes/contract-sales";
import { prepareClaim } from "../common/claim-conditions";
import { ContractEncoder } from "../core/classes/contract-encoder";
import { DelayedReveal } from "../core/classes/delayed-reveal";
import { GasCostEstimator } from "../core/classes";
import { ClaimVerification } from "../types";
import { TokensLazyMintedEvent } from "@thirdweb-dev/contracts/dist/DropERC1155";
import { TokensClaimedEvent } from "@thirdweb-dev/contracts/dist/DropERC721";

/**
 * Setup a collection of one-of-one NFTs that are minted as users claim them.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * // You can switch out this provider with any wallet or provider setup you like.
 * const provider = ethers.Wallet.createRandom();
 * const sdk = new ThirdwebSDK(provider);
 * const contract = sdk.getNFTDrop("{{contract_address}}");
 * ```
 *
 * @public
 */
export class NFTDrop extends Erc721<DropERC721> {
  static contractType = "nft-drop" as const;
  static contractRoles = ["admin", "minter", "transfer"] as const;
  static contractFactory = DropERC721__factory;
  /**
   * @internal
   */
  static schema = DropErc721ContractSchema;

  public encoder: ContractEncoder<DropERC721>;
  public estimator: GasCostEstimator<DropERC721>;
  public metadata: ContractMetadata<DropERC721, typeof NFTDrop.schema>;
  public primarySale: ContractPrimarySale<DropERC721>;
  public roles: ContractRoles<DropERC721, typeof NFTDrop.contractRoles[number]>;
  /**
   * Configure royalties
   * @remarks Set your own royalties for the entire contract or per token
   * @example
   * ```javascript
   * // royalties on the whole contract
   * contract.royalty.setDefaultRoyaltyInfo({
   *   seller_fee_basis_points: 100, // 1%
   *   fee_recipient: "0x..."
   * });
   * // override royalty for a particular token
   * contract.royalty.setTokenRoyaltyInfo(tokenId, {
   *   seller_fee_basis_points: 500, // 5%
   *   fee_recipient: "0x..."
   * });
   * ```
   */
  public royalty: ContractRoyalty<DropERC721, typeof NFTDrop.schema>;
  /**
   * Configure claim conditions
   * @remarks Define who can claim NFTs in the collection, when and how many.
   * @example
   * ```javascript
   * const presaleStartTime = new Date();
   * const publicSaleStartTime = new Date(Date.now() + 24_HOURS);
   * const claimConditions = [
   *   {
   *     startTime: presaleStartTime, // start the presale now
   *     maxQuantity: 2, // limit how many mints for this presale
   *     price: 0.01, // presale price
   *     snapshot: ['0x...', '0x...'], // limit minting to only certain addresses
   *   },
   *   {
   *     startTime: publicSaleStartTime, // 24h after presale, start public sale
   *     price: 0.08, // public sale price
   *   }
   * ]);
   * await dropContract.claimConditions.set(claimConditions);
   * ```
   */
  public claimConditions: DropErc721ClaimConditions;
  /**
   * Delayed reveal
   * @remarks Create a batch of encrypted NFTs that can be revealed at a later time.
   * @example
   * ```javascript
   * // the real NFTs, these will be encrypted until you reveal them
   * const realNFTs = [{
   *   name: "Common NFT #1",
   *   description: "Common NFT, one of many.",
   *   image: fs.readFileSync("path/to/image.png"),
   * }, {
   *   name: "Super Rare NFT #2",
   *   description: "You got a Super Rare NFT!",
   *   image: fs.readFileSync("path/to/image.png"),
   * }];
   * // A placeholder NFT that people will get immediately in their wallet, and will be converted to the real NFT at reveal time
   * const placeholderNFT = {
   *   name: "Hidden NFT",
   *   description: "Will be revealed next week!"
   * };
   * // Create and encrypt the NFTs
   * await contract.revealer.createDelayedRevealBatch(
   *   placeholderNFT,
   *   realNFTs,
   *   "my secret password",
   * );
   * // Whenever you're ready, reveal your NFTs at any time
   * const batchId = 0; // the batch to reveal
   * await contract.revealer.reveal(batchId, "my secret password");
   * ```
   */
  public revealer: DelayedReveal<DropERC721>;

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    storage: IStorage,
    options: SDKOptions = {},
    contractWrapper = new ContractWrapper<DropERC721>(
      network,
      address,
      NFTDrop.contractFactory.abi,
      options,
    ),
  ) {
    super(contractWrapper, storage, options);
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      NFTDrop.schema,
      this.storage,
    );
    this.roles = new ContractRoles(this.contractWrapper, NFTDrop.contractRoles);
    this.royalty = new ContractRoyalty(this.contractWrapper, this.metadata);
    this.primarySale = new ContractPrimarySale(this.contractWrapper);
    this.claimConditions = new DropErc721ClaimConditions(
      this.contractWrapper,
      this.metadata,
      this.storage,
    );
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.revealer = new DelayedReveal<DropERC721>(
      this.contractWrapper,
      this.storage,
    );
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get All Claimed NFTs
   *
   * @remarks Fetch all the NFTs (and their owners) that have been claimed in this Drop.
   *
   * * @example
   * ```javascript
   * const claimedNFTs = await contract.getAllClaimed();
   * const firstOwner = claimedNFTs[0].owner;
   * ```
   *
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata and their ownersfor all NFTs queried.
   */
  public async getAllClaimed(
    queryParams?: QueryAllParams,
  ): Promise<NFTMetadataOwner[]> {
    const start = BigNumber.from(queryParams?.start || 0).toNumber();
    const count = BigNumber.from(
      queryParams?.count || DEFAULT_QUERY_ALL_COUNT,
    ).toNumber();
    const maxId = Math.min(
      (await this.contractWrapper.readContract.nextTokenIdToClaim()).toNumber(),
      start + count,
    );
    return await Promise.all(
      Array.from(Array(maxId).keys()).map((i) => this.get(i.toString())),
    );
  }

  /**
   * Get All Unclaimed NFTs
   *
   * @remarks Fetch all the NFTs that have been not been claimed yet in this Drop.
   *
   * * @example
   * ```javascript
   * const unclaimedNFTs = await contract.getAllUnclaimed();
   * const firstUnclaimedNFT = unclaimedNFTs[0].name;
   * ```
   *
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The NFT metadata for all NFTs queried.
   */
  public async getAllUnclaimed(
    queryParams?: QueryAllParams,
  ): Promise<NFTMetadata[]> {
    const start = BigNumber.from(queryParams?.start || 0).toNumber();
    const count = BigNumber.from(
      queryParams?.count || DEFAULT_QUERY_ALL_COUNT,
    ).toNumber();
    const maxId = BigNumber.from(
      Math.min(
        (
          await this.contractWrapper.readContract.nextTokenIdToMint()
        ).toNumber(),
        start + count,
      ),
    );
    const unmintedId =
      await this.contractWrapper.readContract.nextTokenIdToClaim();
    return await Promise.all(
      Array.from(Array(maxId.sub(unmintedId).toNumber()).keys()).map((i) =>
        this.getTokenMetadata(unmintedId.add(i).toString()),
      ),
    );
  }

  /**
   * Get the claimed supply
   *
   * @remarks Get the number of claimed NFTs in this Drop.
   *
   * * @example
   * ```javascript
   * const claimedNFTCount = await contract.totalClaimedSupply();
   * console.log(`NFTs claimed so far: ${claimedNFTCount}`);
   * ```
   * @returns the unclaimed supply
   */
  public async totalClaimedSupply(): Promise<BigNumber> {
    return await this.contractWrapper.readContract.nextTokenIdToClaim();
  }

  /**
   * Get the unclaimed supply
   *
   * @remarks Get the number of unclaimed NFTs in this Drop.
   *
   * * @example
   * ```javascript
   * const unclaimedNFTCount = await contract.totalUnclaimedSupply();
   * console.log(`NFTs left to claim: ${unclaimedNFTCount}`);
   * ```
   * @returns the unclaimed supply
   */
  public async totalUnclaimedSupply(): Promise<BigNumber> {
    return (await this.contractWrapper.readContract.nextTokenIdToMint()).sub(
      await this.totalClaimedSupply(),
    );
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Create a batch of unique NFTs to be claimed in the future
   *
   * @remarks Create batch allows you to create a batch of many unique NFTs in one transaction.
   *
   * @example
   * ```javascript
   * // Custom metadata of the NFTs to create
   * const metadatas = [{
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * }, {
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"),
   * }];
   *
   * const results = await contract.createBatch(metadatas); // uploads and creates the NFTs on chain
   * const firstTokenId = results[0].id; // token id of the first created NFT
   * const firstNFT = await results[0].data(); // (optional) fetch details of the first created NFT
   * ```
   *
   * @param metadatas - The metadata to include in the batch.
   */
  public async createBatch(
    metadatas: NFTMetadataInput[],
  ): Promise<TransactionResultWithId<NFTMetadata>[]> {
    const startFileNumber =
      await this.contractWrapper.readContract.nextTokenIdToMint();
    const batch = await this.storage.uploadMetadataBatch(
      metadatas.map((m) => CommonNFTInput.parse(m)),
      startFileNumber.toNumber(),
      this.contractWrapper.readContract.address,
      await this.contractWrapper.getSigner()?.getAddress(),
    );
    const baseUri = batch.baseUri;
    const receipt = await this.contractWrapper.sendTransaction("lazyMint", [
      batch.metadataUris.length,
      baseUri.endsWith("/") ? baseUri : `${baseUri}/`,
      ethers.utils.toUtf8Bytes(""),
    ]);
    const event = this.contractWrapper.parseLogs<TokensLazyMintedEvent>(
      "TokensLazyMinted",
      receipt?.logs,
    );
    const startingIndex = event[0].args.startTokenId;
    const endingIndex = event[0].args.endTokenId;
    const results = [];
    for (let id = startingIndex; id.lte(endingIndex); id = id.add(1)) {
      results.push({
        id,
        receipt,
        data: () => this.getTokenMetadata(id),
      });
    }
    return results;
  }

  /**
   * Claim unique NFTs to a specific Wallet
   *
   * @remarks Let the specified wallet claim NFTs.
   *
   * @example
   * ```javascript
   * const address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs
   * const quantity = 1; // how many unique NFTs you want to claim
   *
   * const tx = await contract.claimTo(address, quantity);
   * const receipt = tx.receipt; // the transaction receipt
   * const claimedTokenId = tx.id; // the id of the NFT claimed
   * const claimedNFT = await tx.data(); // (optional) get the claimed NFT metadata
   * ```
   *
   * @param destinationAddress - Address you want to send the token to
   * @param quantity - Quantity of the tokens you want to claim
   * @param proofs - Array of proofs
   *
   * @returns - an array of results containing the id of the token claimed, the transaction receipt and a promise to optionally fetch the nft metadata
   */
  public async claimTo(
    destinationAddress: string,
    quantity: BigNumberish,
    proofs: BytesLike[] = [hexZeroPad([0], 32)],
  ): Promise<TransactionResultWithId<NFTMetadataOwner>[]> {
    const claimVerification = await this.prepareClaim(quantity, proofs);
    const receipt = await this.contractWrapper.sendTransaction(
      "claim",
      [
        destinationAddress,
        quantity,
        claimVerification.currencyAddress,
        claimVerification.price,
        claimVerification.proofs,
        claimVerification.maxQuantityPerTransaction,
      ],
      claimVerification.overrides,
    );
    const event = this.contractWrapper.parseLogs<TokensClaimedEvent>(
      "TokensClaimed",
      receipt?.logs,
    );
    const startingIndex: BigNumber = event[0].args.startTokenId;
    const endingIndex = startingIndex.add(quantity);
    const results = [];
    for (let id = startingIndex; id.lt(endingIndex); id = id.add(1)) {
      results.push({
        id,
        receipt,
        data: () => this.get(id),
      });
    }
    return results;
  }

  /**
   * Claim NFTs to the connected wallet.
   *
   * @remarks See {@link NFTDrop.claimTo}
   *
   * @returns - an array of results containing the id of the token claimed, the transaction receipt and a promise to optionally fetch the nft metadata
   */
  public async claim(
    quantity: BigNumberish,
    proofs: BytesLike[] = [hexZeroPad([0], 32)],
  ): Promise<TransactionResultWithId<NFTMetadataOwner>[]> {
    return this.claimTo(
      await this.contractWrapper.getSignerAddress(),
      quantity,
      proofs,
    );
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  /**
   * Returns proofs and the overrides required for the transaction.
   *
   * @returns - `overrides` and `proofs` as an object.
   */
  private async prepareClaim(
    quantity: BigNumberish,
    proofs: BytesLike[] = [hexZeroPad([0], 32)],
  ): Promise<ClaimVerification> {
    return prepareClaim(
      quantity,
      await this.claimConditions.getActive(),
      (await this.metadata.get()).merkle,
      this.contractWrapper,
      this.storage,
      proofs,
    );
  }
}