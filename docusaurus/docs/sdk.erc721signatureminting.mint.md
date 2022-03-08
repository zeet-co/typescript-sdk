---
slug: /sdk.erc721signatureminting.mint
title: Erc721SignatureMinting.mint() method
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[@thirdweb-dev/sdk](./sdk.md) &gt; [Erc721SignatureMinting](./sdk.erc721signatureminting.md) &gt; [mint](./sdk.erc721signatureminting.mint.md)

## Erc721SignatureMinting.mint() method

Mint a dynamically generated NFT

**Signature:**

```typescript
mint(signedPayload: SignedPayload): Promise<TransactionResultWithId>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  signedPayload | [SignedPayload](./sdk.signedpayload.md) | the previously generated payload and signature with [Erc721SignatureMinting.generate()](./sdk.erc721signatureminting.generate.md) |

**Returns:**

Promise&lt;[TransactionResultWithId](./sdk.transactionresultwithid.md)&gt;

## Remarks

Mint a dynamic NFT with a previously generated signature.

## Example


```javascript
// see how to craft a payload to sign in the `generate()` documentation
const signedPayload = contract.signature.generate(payload);

// now anyone can mint the NFT
const tx = contract.signature.mint(signedPayload);
const receipt = tx.receipt; // the mint transaction receipt
const mintedId = tx.id; // the id of the NFT minted
```