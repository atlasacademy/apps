import axios from "axios";
import Manager from "../Setting/Manager";
import {LanguageOption, RegionOption} from "../Setting/Option";
import ServantEntity from "./Data/ServantEntity";
import ServantListEntity from "./Data/ServantListEntity";

const host = 'https://api.atlasacademy.io';
const fetch = async function <T>(endpoint: string): Promise<T> {
    const response = await axios.get<T>(endpoint);

    return response.data;
}
const region = function (option?: RegionOption): string {
    option = option ?? Manager.region();

    if (option === RegionOption.NA)
        return 'NA';

    return 'JP';
}
const servantListCache = new Map<RegionOption, ServantListEntity[]>();

class Connection {

    public static servant(id: number): Promise<ServantEntity> {
        let query = '?lore=true' + (
            Manager.language() === LanguageOption.ENGLISH ? '&lang=en' : ''
        );

        return fetch<ServantEntity>(`${host}/nice/${region()}/servant/${id}${query}`);
    }

    public static async servantList(): Promise<ServantListEntity[]> {
        if (Manager.region() === RegionOption.NA) {
            return Connection.getCacheableServantList(RegionOption.NA);
        } else if (Manager.region() === RegionOption.JP && Manager.language() === LanguageOption.DEFAULT) {
            return Connection.getCacheableServantList(RegionOption.JP);
        }

        const jp = await Connection.getCacheableServantList(RegionOption.JP),
            na = await Connection.getCacheableServantList(RegionOption.NA),
            names = new Map<number, string>(na.map(entity => [entity.id, entity.name]));

        return jp.map<ServantListEntity>(entity => {
            return {
                ...entity,
                name: names.get(entity.id) ?? entity.name,
            };
        });
    }

    private static async getCacheableServantList(option: RegionOption): Promise<ServantListEntity[]> {
        let list = servantListCache.get(option);
        if (list !== undefined)
            return list;

        list = await fetch<ServantListEntity[]>(`${host}/export/${region(option)}/basic_servant.json`);
        servantListCache.set(option, list);

        return list;
    }

}

export default Connection;
