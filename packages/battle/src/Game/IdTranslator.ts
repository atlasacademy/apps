import {ClassName} from "@atlasacademy/api-connector";

export default class IdTranslator {

    static className(id: number): ClassName | undefined {
        switch (id) {
            case 1:
                return ClassName.SABER;
            case 2:
                return ClassName.ARCHER;
            case 3:
                return ClassName.LANCER;
            case 4:
                return ClassName.RIDER;
            case 5:
                return ClassName.CASTER;
            case 6:
                return ClassName.ASSASSIN;
            case 7:
                return ClassName.BERSERKER;
            case 8:
                return ClassName.SHIELDER;
            case 9:
                return ClassName.RULER;
            case 10:
                return ClassName.ALTER_EGO;
            case 11:
                return ClassName.AVENGER;
            case 23:
                return ClassName.MOON_CANCER;
            case 25:
                return ClassName.FOREIGNER;
        }

        return undefined;
    }

}
