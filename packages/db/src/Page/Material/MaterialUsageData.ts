import {ClassName} from "@atlasacademy/api-connector";

export interface MaterialUsageData {
    id: number;
    className: ClassName;
    ascensions: number;
    skills: number;
    costumes: number;
    total: number;
}
