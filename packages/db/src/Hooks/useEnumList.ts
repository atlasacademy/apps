import { useEffect, useState } from "react";

import { EnumList } from "@atlasacademy/api-connector";

import Api from "../Api";

export default function useEnumList() {
    const [enumList, setEnumList] = useState<EnumList | undefined>(undefined);
    useEffect(() => {
        Api.enumList().then((enumList) => setEnumList(enumList));
    });
    return enumList;
}
