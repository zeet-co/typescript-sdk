<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@3rdweb/sdk](./sdk.md) &gt; [NFTStackDrop](./sdk.nftstackdrop.md) &gt; [claim](./sdk.nftstackdrop.claim.md)

## NFTStackDrop.claim() method

Claim a token to the connected wallet

<b>Signature:</b>

```typescript
claim(tokenId: BigNumberish, quantity: BigNumberish, proofs?: BytesLike[]): Promise<TransactionResult>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  tokenId | BigNumberish | Id of the token you want to claim |
|  quantity | BigNumberish | Quantity of the tokens you want to claim |
|  proofs | BytesLike\[\] | Array of proofs |

<b>Returns:</b>

Promise&lt;TransactionResult&gt;

- Receipt for the transaction

## Remarks

See [NFTStackDrop.claimTo()](./sdk.nftstackdrop.claimto.md)
