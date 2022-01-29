<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@3rdweb/sdk](./sdk.md) &gt; [ModuleWithRoles](./sdk.modulewithroles.md) &gt; [getAllRoleMembers](./sdk.modulewithroles.getallrolemembers.md)

## ModuleWithRoles.getAllRoleMembers() method

Call this to get get a list of addresses for all supported roles on the module.

<b>Signature:</b>

```typescript
getAllRoleMembers(): Promise<Partial<Record<Role, string[]>>>;
```
<b>Returns:</b>

Promise&lt;Partial&lt;Record&lt;[Role](./sdk.role.md)<!-- -->, string\[\]&gt;&gt;&gt;

A record of [Role](./sdk.role.md)<!-- -->s to lists of addresses that are members of the given role.

## Exceptions

If the module does not support roles this will throw an [InvariantError](./sdk.invarianterror.md)<!-- -->.
