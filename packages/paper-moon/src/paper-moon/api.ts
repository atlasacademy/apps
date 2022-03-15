import { ApiConnector, Language, Region } from "@atlasacademy/api-connector";

const apiConnector = new ApiConnector({
    language: Language.ENGLISH,
    region: Region.NA,
});

export default apiConnector;
