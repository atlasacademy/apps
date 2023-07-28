import { useEffect } from "react";

import { Region } from "@atlasacademy/api-connector";

import { ClassBoardProvider } from "../Contexts/ClassBoard";
import Manager from "../Setting/Manager";
import ClassBoardBreakdown from "./ClassBoard/ClassBoardBreakdown";
import ClassBoardMap from "./ClassBoard/ClassBoardMap";
import ClassBoardNavigation from "./ClassBoard/ClassBoardNavigation";

interface Props {
    region: Region;
    id?: string;
}

const ClassBoardPage: React.FC<Props> = ({ region, id }) => {
    useEffect(() => {
        Manager.setRegion(region);
        document.title = `[${region}] Class Board - Atlas Academy DB`;
    }, [region]);

    return (
        <ClassBoardProvider id={id} region={region}>
            <ClassBoardNavigation />
            <ClassBoardMap />
            <ClassBoardBreakdown />
        </ClassBoardProvider>
    );
};

export default ClassBoardPage;
