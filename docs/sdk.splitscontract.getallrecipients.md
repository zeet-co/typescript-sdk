<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@3rdweb/sdk](./sdk.md) &gt; [SplitsContract](./sdk.splitscontract.md) &gt; [getAllRecipients](./sdk.splitscontract.getallrecipients.md)

## SplitsContract.getAllRecipients() method

Get Recipients of this splits contract

<b>Signature:</b>

```typescript
getAllRecipients(): Promise<SplitRecipient[]>;
```
<b>Returns:</b>

Promise&lt;SplitRecipient\[\]&gt;

## Remarks

Get the data about the shares of every split recipient on the contract

## Example


```javascript
const recipients = await contract.getAllRecipients();
console.log(recipients);
```
