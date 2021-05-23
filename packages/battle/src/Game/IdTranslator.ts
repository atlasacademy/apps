import {ClassName} from "@atlasacademy/api-connector";
import GameConstantManager from "./GameConstantManager";

export default class IdTranslator {

    static className(id: number): ClassName | undefined {
        return GameConstantManager.className(id);
    }

}
