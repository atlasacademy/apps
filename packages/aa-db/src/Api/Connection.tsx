import Language from "./Data/Language";
import ServantEntity from "./Data/ServantEntity";
import ServantListEntity from "./Data/ServantListEntity";

import axios from "axios";

const host = 'https://api.atlasacademy.io';
const fetch = async function <T>(endpoint: string): Promise<T>
{
    const response = await axios.get<T>(endpoint);

    return response.data;
}

class Connection {

    public static servant(id: number, language?: Language): Promise<ServantEntity>
    {
        let query = 'lore=true' + (language ? `&lang=${language}` : '');

        return fetch<ServantEntity>(`${host}/nice/NA/servant/${id}?${query}`);
    }

    public static servantList(): Promise<ServantListEntity[]>
    {
        return fetch<ServantListEntity[]>(`${host}/export/NA/basic_servant.json`);
    }

}

export default Connection;
