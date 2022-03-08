---
slug: /sdk.marketplace.getlisting
title: Marketplace.getListing() method
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[@thirdweb-dev/sdk](./sdk.md) &gt; [Marketplace](./sdk.marketplace.md) &gt; [getListing](./sdk.marketplace.getlisting.md)

## Marketplace.getListing() method

Convenience function to get either a direct or auction listing

**Signature:**

```typescript
getListing(listingId: BigNumberish): Promise<AuctionListing | DirectListing>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  listingId | BigNumberish | the listing id |

**Returns:**

Promise&lt;[AuctionListing](./sdk.auctionlisting.md) \| [DirectListing](./sdk.directlisting.md)&gt;

either a direct or auction listing