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
const region = function (): string {
    if (Manager.region() === RegionOption.NA)
        return 'NA';

    return 'JP';
}

class Connection {

    public static servant(id: number): Promise<ServantEntity> {
        let query = '?lore=true' + (
            Manager.language() === LanguageOption.ENGLISH ? '&lang=en' : ''
        );

        return fetch<ServantEntity>(`${host}/nice/${region()}/servant/${id}${query}`);
    }

    public static servantList(): Promise<ServantListEntity[]> {
        return fetch<ServantListEntity[]>(`${host}/export/${region()}/basic_servant.json`);
    }

}

export default Connection;
