import ServantListEntity from "./Data/ServantListEntity";

import axios from "axios";

const host = 'https://api.atlasacademy.io';
const fetch = async function <T>(endpoint: string): Promise<T>
{
    const response = await axios.get<T>(endpoint);

    return response.data;
}

class Connection {

    public static async servantList(): Promise<ServantListEntity[]>
    {
        return fetch<ServantListEntity[]>(`${host}/export/NA/basic_servant.json`);
    }

}

export default Connection;
