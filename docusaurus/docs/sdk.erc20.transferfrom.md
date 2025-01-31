---
slug: /sdk.erc20.transferfrom
title: Erc20.transferFrom() method
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[@thirdweb-dev/sdk](./sdk.md) &gt; [Erc20](./sdk.erc20.md) &gt; [transferFrom](./sdk.erc20.transferfrom.md)

## Erc20.transferFrom() method

Transfer Tokens From Address

**Signature:**

```typescript
transferFrom(from: string, to: string, amount: BigNumberish): Promise<TransactionResult>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  from | string |  |
|  to | string |  |
|  amount | BigNumberish |  |

**Returns:**

Promise&lt;[TransactionResult](./sdk.transactionresult.md)&gt;

## Remarks

Transfer tokens from one wallet to another

## Example


```javascript
// Address of the wallet sending the tokens
const fromAddress = "{{wallet_address}}";

// Address of the wallet you want to send the tokens to
const toAddress = "0x...";

// The number of tokens you want to send
const amount = 100

// Note that the connected wallet must have approval to transfer the tokens of the fromAddress
await contract.transferFrom(fromAddress, toAddress, amount);
```
