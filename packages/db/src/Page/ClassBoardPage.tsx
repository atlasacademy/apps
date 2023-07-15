import { Region } from "@atlasacademy/api-connector";
import ClassBoardMap from "./ClassBoard/ClassBoardMap";
import { ClassBoardProvider } from "../Contexts/ClassBoard";
import ClassBoardNavigation from "./ClassBoard/ClassBoardNavigation";
import ClassBoardBreakdown from "./ClassBoard/ClassBoardBreakdown";
import { useEffect } from "react";
import Manager from "../Setting/Manager";

interface Props {
    region: Region
}

const ClassBoardPage: React.FC<Props> = ({ region }) => {
    useEffect(() => {
        Manager.setRegion(region)
    }, [region])

    return (
        <ClassBoardProvider region={region}>
            <ClassBoardNavigation />
            <ClassBoardMap />
            <ClassBoardBreakdown />
        </ClassBoardProvider>
    )
}

export default ClassBoardPage