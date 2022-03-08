<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@thirdweb-dev/sdk](./sdk.md) &gt; [ThirdwebSDK](./sdk.thirdwebsdk.md) &gt; [getContractList](./sdk.thirdwebsdk.getcontractlist.md)

## ThirdwebSDK.getContractList() method

Return all the contracts deployed by the specified address

<b>Signature:</b>

```typescript
getContractList(walletAddress: string): Promise<{
        address: string;
        contractType: "split" | "edition-drop" | "edition" | "token" | "vote" | "marketplace" | "pack" | "nft-drop" | "nft-collection";
        metadata: () => Promise<{
            [x: string]: import("./types").Json;
            description?: string | undefined;
            image?: string | undefined;
            external_link?: string | undefined;
            name: string;
        }>;
    }[]>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  walletAddress | string | the deployed address |

<b>Returns:</b>

Promise&lt;{ address: string; contractType: "split" \| "edition-drop" \| "edition" \| "token" \| "vote" \| "marketplace" \| "pack" \| "nft-drop" \| "nft-collection"; metadata: () =&gt; Promise&lt;{ \[x: string\]: import("./types").[Json](./sdk.json.md)<!-- -->; description?: string \| undefined; image?: string \| undefined; external\_link?: string \| undefined; name: string; }&gt;; }\[\]&gt;
