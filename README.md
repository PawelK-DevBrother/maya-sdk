## Maya SDK 

---

## Installation

```npm
npm i maya-sdk
```

## Usage


### Custom headers

```ts
// auth headers
Sdk_Instance.setAuthToken('auth_token')

console.log(Sdk_Instance.getHeaders());

// custom headers
Sdk_Instance.setCustomHeader('custom_header', 'custom_value');

console.log(Sdk_Instance.getHeaders());
```
