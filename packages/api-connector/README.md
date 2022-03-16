# Atlas Academy API Connector

A library to interface with https://api.atlasacademy.io

## Example

```typescript
import { ApiConnector, Language, Region, ReverseData, Skill } from "@atlasacademy/api-connector";

const cacheDuration = 20 * 1000;
const apiConnector = new ApiConnector({
    host: "https://api.atlasacademy.io",
    region: Region.JP,
    language: Language.DEFAULT,
});

function getSkill(id: number, reverse = true): Promise<Skill.Skill> {
    const reverseConfig = {
        reverse: reverse,
        reverseData: ReverseData.BASIC,
    };
    return apiConnector.skill(id, reverseConfig, cacheDuration);
}
```
