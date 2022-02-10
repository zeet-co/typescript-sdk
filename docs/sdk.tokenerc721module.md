<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@3rdweb/sdk](./sdk.md) &gt; [TokenErc721Module](./sdk.tokenerc721module.md)

## TokenErc721Module class

Create a collection of one-of-one NFTs.

<b>Signature:</b>

```typescript
declare class TokenErc721Module extends Erc721<TokenERC721> 
```
<b>Extends:</b> Erc721&lt;TokenERC721&gt;

## Example


```javascript
import { ThirdwebSDK } from "@3rdweb/sdk";

// You can switch out this provider with any wallet or provider setup you like.
const provider = ethers.Wallet.createRandom();
const sdk = new ThirdwebSDK(provider);
const module = sdk.getNFTModule("{{module_address}}");
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(network, address, storage, options, contractWrapper)](./sdk.tokenerc721module._constructor_.md) |  | Constructs a new instance of the <code>TokenErc721Module</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [contractFactory](./sdk.tokenerc721module.contractfactory.md) | <code>static</code> | typeof TokenERC721\_\_factory |  |
|  [encoder](./sdk.tokenerc721module.encoder.md) |  | ContractEncoder&lt;TokenERC721&gt; |  |
|  [metadata](./sdk.tokenerc721module.metadata.md) |  | ContractMetadata&lt;TokenERC721, typeof TokenErc721Module.schema&gt; |  |
|  [moduleRoles](./sdk.tokenerc721module.moduleroles.md) | <code>static</code> | readonly \["admin", "minter", "transfer"\] |  |
|  [moduleType](./sdk.tokenerc721module.moduletype.md) | <code>static</code> | "TokenERC721" |  |
|  [primarySale](./sdk.tokenerc721module.primarysale.md) |  | ContractPrimarySale&lt;TokenERC721&gt; |  |
|  [roles](./sdk.tokenerc721module.roles.md) |  | ContractRoles&lt;TokenERC721, typeof TokenErc721Module.moduleRoles\[number\]&gt; |  |
|  [royalty](./sdk.tokenerc721module.royalty.md) |  | ContractRoyalty&lt;TokenERC721, typeof TokenErc721Module.schema&gt; |  |
|  [schema](./sdk.tokenerc721module.schema.md) | <code>static</code> | { deploy: zod.ZodObject&lt;zod.extendShape&lt;zod.extendShape&lt;zod.extendShape&lt;zod.extendShape&lt;zod.extendShape&lt;{ name: zod.ZodString; description: zod.ZodOptional&lt;zod.ZodString&gt;; image: zod.ZodOptional&lt;zod.ZodUnion&lt;\[zod.ZodTypeAny, zod.ZodString\]&gt;&gt;; external\_link: zod.ZodOptional&lt;zod.ZodString&gt;; }, { seller\_fee\_basis\_points: zod.ZodDefault&lt;zod.ZodNumber&gt;; fee\_recipient: zod.ZodDefault&lt;zod.ZodString&gt;; }&gt;, { symbol: zod.ZodDefault&lt;zod.ZodOptional&lt;zod.ZodString&gt;&gt;; }&gt;, { platform\_fee\_basis\_points: zod.ZodDefault&lt;zod.ZodNumber&gt;; platform\_fee\_recipient: zod.ZodDefault&lt;zod.ZodString&gt;; }&gt;, { primary\_sale\_recipient: zod.ZodString; }&gt;, { trusted\_forwarder: zod.ZodDefault&lt;zod.ZodString&gt;; }&gt;, "strip", zod.ZodTypeAny, { description?: string \| undefined; image?: any; external\_link?: string \| undefined; symbol: string; name: string; seller\_fee\_basis\_points: number; fee\_recipient: string; primary\_sale\_recipient: string; platform\_fee\_basis\_points: number; platform\_fee\_recipient: string; trusted\_forwarder: string; }, { symbol?: string \| undefined; description?: string \| undefined; image?: any; external\_link?: string \| undefined; seller\_fee\_basis\_points?: number \| undefined; fee\_recipient?: string \| undefined; platform\_fee\_basis\_points?: number \| undefined; platform\_fee\_recipient?: string \| undefined; trusted\_forwarder?: string \| undefined; name: string; primary\_sale\_recipient: string; }&gt;; output: zod.ZodObject&lt;zod.extendShape&lt;zod.extendShape&lt;zod.extendShape&lt;{ name: zod.ZodString; description: zod.ZodOptional&lt;zod.ZodString&gt;; image: zod.ZodOptional&lt;zod.ZodUnion&lt;\[zod.ZodTypeAny, zod.ZodString\]&gt;&gt;; external\_link: zod.ZodOptional&lt;zod.ZodString&gt;; }, { image: zod.ZodOptional&lt;zod.ZodString&gt;; }&gt;, { seller\_fee\_basis\_points: zod.ZodDefault&lt;zod.ZodNumber&gt;; fee\_recipient: zod.ZodDefault&lt;zod.ZodString&gt;; }&gt;, { symbol: zod.ZodDefault&lt;zod.ZodOptional&lt;zod.ZodString&gt;&gt;; }&gt;, "strip", zod.ZodLazy&lt;zod.ZodType&lt;Json, zod.ZodTypeDef, Json&gt;&gt;, { \[x: string\]: Json; description?: string \| undefined; image?: string \| undefined; external\_link?: string \| undefined; symbol: string; name: string; seller\_fee\_basis\_points: number; fee\_recipient: string; }, { \[x: string\]: Json; symbol?: string \| undefined; description?: string \| undefined; image?: string \| undefined; external\_link?: string \| undefined; seller\_fee\_basis\_points?: number \| undefined; fee\_recipient?: string \| undefined; name: string; }&gt;; input: zod.ZodObject&lt;zod.extendShape&lt;zod.extendShape&lt;{ name: zod.ZodString; description: zod.ZodOptional&lt;zod.ZodString&gt;; image: zod.ZodOptional&lt;zod.ZodUnion&lt;\[zod.ZodTypeAny, zod.ZodString\]&gt;&gt;; external\_link: zod.ZodOptional&lt;zod.ZodString&gt;; }, { seller\_fee\_basis\_points: zod.ZodDefault&lt;zod.ZodNumber&gt;; fee\_recipient: zod.ZodDefault&lt;zod.ZodString&gt;; }&gt;, { symbol: zod.ZodDefault&lt;zod.ZodOptional&lt;zod.ZodString&gt;&gt;; }&gt;, "strip", zod.ZodTypeAny, { description?: string \| undefined; image?: any; external\_link?: string \| undefined; symbol: string; name: string; seller\_fee\_basis\_points: number; fee\_recipient: string; }, { symbol?: string \| undefined; description?: string \| undefined; image?: any; external\_link?: string \| undefined; seller\_fee\_basis\_points?: number \| undefined; fee\_recipient?: string \| undefined; name: string; }&gt;; } |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [generateSignature(mintRequest)](./sdk.tokenerc721module.generatesignature.md) |  |  |
|  [generateSignatureBatch(mintRequests)](./sdk.tokenerc721module.generatesignaturebatch.md) |  |  |
|  [mint(metadata)](./sdk.tokenerc721module.mint.md) |  | Mint NFT |
|  [mintBatch(metadatas)](./sdk.tokenerc721module.mintbatch.md) |  | Mint Many NFTs |
|  [mintBatchTo(to, metadatas)](./sdk.tokenerc721module.mintbatchto.md) |  | Mint Many NFTs |
|  [mintTo(to, metadata)](./sdk.tokenerc721module.mintto.md) |  | Mint NFT |
|  [mintWithSignature(mintRequest, signature)](./sdk.tokenerc721module.mintwithsignature.md) |  | Mint an NFT with a signature (gasless) |
|  [verify(mintRequest, signature)](./sdk.tokenerc721module.verify.md) |  |  |
