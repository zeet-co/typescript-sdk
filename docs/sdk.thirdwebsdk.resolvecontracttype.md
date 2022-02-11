<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@3rdweb/sdk](./sdk.md) &gt; [ThirdwebSDK](./sdk.thirdwebsdk.md) &gt; [resolveContractType](./sdk.thirdwebsdk.resolvecontracttype.md)

## ThirdwebSDK.resolveContractType() method

<b>Signature:</b>

```typescript
resolveContractType<TContractType extends ContractType>(contractAddress: string): Promise<TContractType>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  contractAddress | string | the address of the contract to attempt to resolve the contract type for |

<b>Returns:</b>

Promise&lt;TContractType&gt;

the [ContractType](./sdk.contracttype.md) for the given contract address

## Exceptions

if the contract type cannot be determined (is not a valid thirdweb contract)
