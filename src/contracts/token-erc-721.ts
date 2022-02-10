import { BigNumber } from "ethers";
import {
  MintRequest,
  NewSignaturePayload,
  SignaturePayload,
} from "../schema/contracts/common/signature";
import {
  CommonNFTInput,
  NFTMetadataInput,
  NFTMetadataOwner,
} from "../schema/tokens/common";
import type {
  IStorage,
  NetworkOrSignerOrProvider,
  TransactionResultPromise,
  TransactionResultWithId,
} from "../core";
import { TokenErc721ContractSchema } from "../schema/contracts/token-erc721";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import {
  ITokenERC721,
  TokenERC721,
  TokenERC721__factory,
} from "@3rdweb/contracts";
import { SDKOptions } from "../schema/sdk-options";
import { ContractMetadata } from "../core/classes/contract-metadata";
import { ContractRoles } from "../core/classes/contract-roles";
import { ContractRoyalty } from "../core/classes/contract-royalty";
import { Erc721 } from "../core/classes/erc-721";
import { ContractPrimarySale } from "../core/classes/contract-sales";
import {
  MintWithSignatureEvent,
  TokenMintedEvent,
} from "@3rdweb/contracts/dist/TokenERC721";
import { hexlify, toUtf8Bytes } from "ethers/lib/utils";
import { Signer } from "@ethersproject/abstract-signer";
import { v4 as uuidv4 } from "uuid";
import { ContractEncoder } from "../core/classes/contract-encoder";
import { setErc20Allowance } from "../common/currency";

/**
 * Create a collection of one-of-one NFTs.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@3rdweb/sdk";
 *
 * // You can switch out this provider with any wallet or provider setup you like.
 * const provider = ethers.Wallet.createRandom();
 * const sdk = new ThirdwebSDK(provider);
 * const contract = sdk.getNFTContract("{{contract_address}}");
 * ```
 *
 * @public
 */
export class TokenErc721Contract extends Erc721<TokenERC721> {
  static contractType = "TokenERC721" as const;
  static schema = TokenErc721ContractSchema;
  static contractRoles = ["admin", "minter", "transfer"] as const;
  static contractFactory = TokenERC721__factory;

  public metadata: ContractMetadata<
    TokenERC721,
    typeof TokenErc721Contract.schema
  >;
  public roles: ContractRoles<
    TokenERC721,
    typeof TokenErc721Contract.contractRoles[number]
  >;
  public royalty: ContractRoyalty<
    TokenERC721,
    typeof TokenErc721Contract.schema
  >;
  public primarySale: ContractPrimarySale<TokenERC721>;
  public encoder: ContractEncoder<TokenERC721>;

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    storage: IStorage,
    options: SDKOptions = {},
    contractWrapper = new ContractWrapper<TokenERC721>(
      network,
      address,
      TokenErc721Contract.contractFactory.abi,
      options,
    ),
  ) {
    super(contractWrapper, storage, options);
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      TokenErc721Contract.schema,
      this.storage,
    );
    this.roles = new ContractRoles(
      this.contractWrapper,
      TokenErc721Contract.contractRoles,
    );
    this.royalty = new ContractRoyalty(this.contractWrapper, this.metadata);
    this.primarySale = new ContractPrimarySale(this.contractWrapper);
    this.encoder = new ContractEncoder(this.contractWrapper);
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Mint NFT
   *
   * @remarks Mint an NFT to the connected wallet.
   *
   * @example
   * ```javascript
   * // Custom metadata of the NFT, note that you can fully customize this metadata with other properties.
   * const metadata = {
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * }
   *
   * await contract.mint(metadata);
   * ```
   */
  public async mint(
    metadata: NFTMetadataInput,
  ): Promise<TransactionResultWithId<NFTMetadataOwner>> {
    return this.mintTo(await this.contractWrapper.getSignerAddress(), metadata);
  }

  /**
   * Mint NFT
   *
   * @remarks Mint an NFT to a specified wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to mint the NFT to
   * const toAddress = "{{wallet_address}}"
   *
   * // Custom metadata of the NFT, note that you can fully customize this metadata with other properties.
   * const metadata = {
   *   name: "Cool NFT",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * }
   *
   * await contract.mintTo(toAddress, metadata);
   * ```
   */
  public async mintTo(
    to: string,
    metadata: NFTMetadataInput,
  ): Promise<TransactionResultWithId<NFTMetadataOwner>> {
    const uri = await this.storage.uploadMetadata(
      CommonNFTInput.parse(metadata),
    );
    const receipt = await this.contractWrapper.sendTransaction("mintTo", [
      to,
      uri,
    ]);
    const event = this.contractWrapper.parseLogs<TokenMintedEvent>(
      "TokenMinted",
      receipt?.logs,
    );
    if (event.length === 0) {
      throw new Error("TokenMinted event not found");
    }
    const id = event[0].args.tokenIdMinted;
    return {
      id,
      receipt,
      data: () => this.get(id.toString()),
    };
  }

  /**
   * Mint Many NFTs
   *
   * @remarks Mint many NFTs at once to the connected wallet
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to mint the NFT to
   * const toAddress = "{{wallet_address}}"
   *
   * // Custom metadata of the NFTs you want to mint.
   * const metadatas = [{
   *   name: "Cool NFT #1",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * }, {
   *   name: "Cool NFT #2",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/other/image.png"),
   * }];
   *
   * await contract.mintBatch(metadatas);
   * ```
   */
  public async mintBatch(
    metadatas: NFTMetadataInput[],
  ): Promise<TransactionResultWithId<NFTMetadataOwner>[]> {
    return this.mintBatchTo(
      await this.contractWrapper.getSignerAddress(),
      metadatas,
    );
  }

  /**
   * Mint Many NFTs
   *
   * @remarks Mint many NFTs at once to a specified wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet you want to mint the NFT to
   * const toAddress = "{{wallet_address}}"
   *
   * // Custom metadata of the NFTs you want to mint.
   * const metadatas = [{
   *   name: "Cool NFT #1",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/image.png"), // This can be an image url or file
   * }, {
   *   name: "Cool NFT #2",
   *   description: "This is a cool NFT",
   *   image: fs.readFileSync("path/to/other/image.png"),
   * }];
   *
   * await contract.mintBatchTo(toAddress, metadatas);
   * ```
   */
  public async mintBatchTo(
    to: string,
    metadatas: NFTMetadataInput[],
  ): Promise<TransactionResultWithId<NFTMetadataOwner>[]> {
    const { metadataUris: uris } = await this.storage.uploadMetadataBatch(
      metadatas.map((m) => CommonNFTInput.parse(m)),
    );
    const encoded = uris.map((uri) =>
      this.contractWrapper.readContract.interface.encodeFunctionData("mintTo", [
        to,
        uri,
      ]),
    );
    const receipt = await this.contractWrapper.multiCall(encoded);
    const events = this.contractWrapper.parseLogs<TokenMintedEvent>(
      "TokenMinted",
      receipt.logs,
    );
    if (events.length === 0 || events.length < metadatas.length) {
      throw new Error("TokenMinted event not found, minting failed");
    }
    return events.map((e) => {
      const id = e.args.tokenIdMinted;
      return {
        id,
        receipt,
        data: () => this.get(id),
      };
    });
  }

  /** ******************************
   * SIGNATURE FUNCTIONS
   * // TODO signature logic should be extracted out to be re-used
   *******************************/

  /**
   * Mint an NFT with a signature (gasless)
   * @param mintRequest - the JSON payload corresponding to the NFT to mint
   * @param signature - the user's signature
   */
  public async mintWithSignature(
    mintRequest: SignaturePayload,
    signature: string,
  ): TransactionResultPromise<NFTMetadataOwner> {
    const message = { ...this.mapPayload(mintRequest), uri: mintRequest.uri };
    const overrides = await this.contractWrapper.getCallOverrides();
    await setErc20Allowance(
      this.contractWrapper,
      BigNumber.from(message.price),
      mintRequest.currencyAddress,
      overrides,
    );
    const receipt = await this.contractWrapper.sendTransaction(
      "mintWithSignature",
      [message, signature],
      overrides,
    );
    const t = this.contractWrapper.parseLogs<MintWithSignatureEvent>(
      "MintWithSignature",
      receipt.logs,
    );
    if (t.length === 0) {
      throw new Error("No MintWithSignature event found");
    }
    return {
      receipt,
      data: () => this.get(t[0].args.tokenIdMinted),
    };
  }

  public async verify(
    mintRequest: SignaturePayload,
    signature: string,
  ): Promise<boolean> {
    const message = this.mapPayload(mintRequest);
    const v = await this.contractWrapper.readContract.verify(
      { ...message, uri: mintRequest.uri },
      signature,
    );
    return v[0];
  }

  public async generateSignature(
    mintRequest: NewSignaturePayload,
  ): Promise<{ payload: SignaturePayload; signature: string }> {
    return (await this.generateSignatureBatch([mintRequest]))[0];
  }

  public async generateSignatureBatch(
    mintRequests: NewSignaturePayload[],
  ): Promise<{ payload: SignaturePayload; signature: string }[]> {
    const resolveId = (mintRequest: NewSignaturePayload): string => {
      if (mintRequest.id === undefined) {
        const buffer = Buffer.alloc(16);
        uuidv4({}, buffer);
        return hexlify(toUtf8Bytes(buffer.toString("hex")));
      } else {
        return hexlify(mintRequest.id as string);
      }
    };

    await this.roles.onlyRoles(
      ["minter"],
      await this.contractWrapper.getSignerAddress(),
    );

    const { metadataUris: uris } = await this.storage.uploadMetadataBatch(
      mintRequests.map((r) => r.metadata),
    );

    const chainId = await this.contractWrapper.getChainID();
    const signer = this.contractWrapper.getSigner() as Signer;

    return await Promise.all(
      mintRequests.map(async (m, i) => {
        const id = resolveId(m);
        const uri = uris[i];
        return {
          payload: {
            ...m,
            id,
            uri,
          },
          signature: (
            await this.contractWrapper.signTypedData(
              signer,
              {
                name: "SignatureMint721",
                version: "1",
                chainId,
                verifyingContract: this.contractWrapper.readContract.address,
              },
              { MintRequest },
              {
                uri,
                ...(this.mapPayload(m) as any),
                uid: id,
              },
            )
          ).toString(),
        };
      }),
    );
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  /**
   * Maps a payload to the format expected by the contract
   *
   * @internal
   *
   * @param mintRequest - The payload to map.
   * @returns - The mapped payload.
   */
  private mapPayload(
    mintRequest: SignaturePayload | NewSignaturePayload,
  ): ITokenERC721.MintRequestStructOutput {
    return {
      to: mintRequest.to,
      price: mintRequest.price,
      currency: mintRequest.currencyAddress,
      validityEndTimestamp: mintRequest.mintEndTimeEpochSeconds,
      validityStartTimestamp: mintRequest.mintStartTimeEpochSeconds,
      uid: mintRequest.id,
    } as ITokenERC721.MintRequestStructOutput;
  }
}
