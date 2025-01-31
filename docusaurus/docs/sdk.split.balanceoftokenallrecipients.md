---
slug: /sdk.split.balanceoftokenallrecipients
title: Split.balanceOfTokenAllRecipients() method
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[@thirdweb-dev/sdk](./sdk.md) &gt; [Split](./sdk.split.md) &gt; [balanceOfTokenAllRecipients](./sdk.split.balanceoftokenallrecipients.md)

## Split.balanceOfTokenAllRecipients() method

Returns all the recipients and their balances in a non-native currency.

**Signature:**

```typescript
balanceOfTokenAllRecipients(tokenAddress: string): Promise<{
        [key: string]: {
            symbol: string;
            value: BigNumber;
            name: string;
            decimals: number;
            displayValue: string;
        };
    }>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  tokenAddress | string | The address of the currency to check the balances in. |

**Returns:**

Promise&lt;{ \[key: string\]: { symbol: string; value: BigNumber; name: string; decimals: number; displayValue: string; }; }&gt;

A map of recipient addresses to their balances in the specified currency.
