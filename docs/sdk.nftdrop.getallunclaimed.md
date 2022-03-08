<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@thirdweb-dev/sdk](./sdk.md) &gt; [NFTDrop](./sdk.nftdrop.md) &gt; [getAllUnclaimed](./sdk.nftdrop.getallunclaimed.md)

## NFTDrop.getAllUnclaimed() method

Get All Unclaimed NFTs

<b>Signature:</b>

```typescript
getAllUnclaimed(queryParams?: QueryAllParams): Promise<NFTMetadata[]>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  queryParams | [QueryAllParams](./sdk.queryallparams.md) | optional filtering to only fetch a subset of results. |

<b>Returns:</b>

Promise&lt;[NFTMetadata](./sdk.nftmetadata.md)<!-- -->\[\]&gt;

The NFT metadata for all NFTs queried.

## Remarks

Fetch all the NFTs that have been not been claimed yet in this Drop.

\*

## Example


```javascript
const unclaimedNFTs = await contract.getAllUnclaimed();
const firstUnclaimedNFT = unclaimedNFTs[0].name;
```
