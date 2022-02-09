<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@3rdweb/sdk](./sdk.md) &gt; [PacksModule](./sdk.packsmodule.md) &gt; [transfer](./sdk.packsmodule.transfer.md)

## PacksModule.transfer() method

Transfer Pack

<b>Signature:</b>

```typescript
transfer(to: string, tokenId: string, amount: BigNumber): TransactionResultPromise;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  to | string |  |
|  tokenId | string |  |
|  amount | BigNumber |  |

<b>Returns:</b>

TransactionResultPromise

## Remarks

Transfer a pack from the connected wallet to another wallet.

## Example


```javascript
// Address of the wallet you want to send the pack to
const toAddress = "0x...";

// The token ID of the pack you want to send
const tokenId = "0";

// The number of packs you want to send
const amount = 1;

await module.transfer(toAddress, tokenId, amount);
```
