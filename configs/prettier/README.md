# Prettier Atlas Academy Config

A prettier config for atlasacademy apps

## Usage

In packages.json specify the package @atlasacademy/prettier-config in field the prettier such as

```json
{
    "prettier": "@atlasacademy/prettier-config"
}
```

## Extends

to extends you need create `.prettierrc.js` in root of the packages.
This method override config from @atlasacademy/prettier-config

```js
module.exports = {
    ...require("@atlasacademy/prettier-config"),
    // Others configs you need
};
```
