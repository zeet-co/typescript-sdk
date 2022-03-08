<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@thirdweb-dev/sdk](./sdk.md) &gt; [Erc1155SignatureMinting](./sdk.erc1155signatureminting.md) &gt; [mint](./sdk.erc1155signatureminting.mint.md)

## Erc1155SignatureMinting.mint() method

Mint a dynamically generated NFT

<b>Signature:</b>

```typescript
mint(signedPayload: SignedPayload1155): Promise<TransactionResultWithId>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  signedPayload | [SignedPayload1155](./sdk.signedpayload1155.md) | the previously generated payload and signature with [Erc721SignatureMinting.generate()](./sdk.erc721signatureminting.generate.md) |

<b>Returns:</b>

Promise&lt;[TransactionResultWithId](./sdk.transactionresultwithid.md)<!-- -->&gt;

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
