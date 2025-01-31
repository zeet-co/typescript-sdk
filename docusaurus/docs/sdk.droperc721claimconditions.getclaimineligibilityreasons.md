---
slug: /sdk.droperc721claimconditions.getclaimineligibilityreasons
title: DropErc721ClaimConditions.getClaimIneligibilityReasons() method
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[@thirdweb-dev/sdk](./sdk.md) &gt; [DropErc721ClaimConditions](./sdk.droperc721claimconditions.md) &gt; [getClaimIneligibilityReasons](./sdk.droperc721claimconditions.getclaimineligibilityreasons.md)

## DropErc721ClaimConditions.getClaimIneligibilityReasons() method

For any claim conditions that a particular wallet is violating, this function returns human readable information about the breaks in the condition that can be used to inform the user.

**Signature:**

```typescript
getClaimIneligibilityReasons(quantity: BigNumberish, addressToCheck?: string): Promise<ClaimEligibility[]>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  quantity | BigNumberish | The desired quantity that would be claimed. |
|  addressToCheck | string | The wallet address, defaults to the connected wallet. |

**Returns:**

Promise&lt;[ClaimEligibility](./sdk.claimeligibility.md)\[\]&gt;
