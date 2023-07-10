import { createContext, useState } from "react"
import { ClassBoard, MasterMission, Region } from "@atlasacademy/api-connector"

import useApi from "../Hooks/useApi"

interface ClassBoardContextProps {
    classBoardData: {
        classBoards: ClassBoard.ClassBoard[],
        classBoard?: ClassBoard.ClassBoard,
        loading: boolean
        changeBoard: (id: number) => void
    }

    squareData: {
        currentSquare?: ClassBoard.ClassBoardSquare
        changeSquare: (square: ClassBoard.ClassBoardSquare) => void
    }

    missionData: {
        currentMissions: MasterMission.MasterMission[]
        loading: boolean
    }
}

interface ClassBoardProviderProps {
    children: React.ReactNode,
    region: Region
}

export const ClassBoardContext = createContext<ClassBoardContextProps>({
    classBoardData: {
        changeBoard: () => {},
        classBoards: [],
        loading: false,
        classBoard: undefined
    },
    squareData: {
        changeSquare: () => {},
        currentSquare: undefined
    },
    missionData: {
        currentMissions: [],
        loading: false
    }
})

export const ClassBoardProvider: React.FC<ClassBoardProviderProps> = ({ children, region }) => {
    const classBoardList = useApi("classBoardList")
    const masterMissions = useApi("masterMissionList")

    const [boardIndex, changeBoardIndexState] = useState(0)
    const [currentSquare, changeStateSquare] = useState<ClassBoard.ClassBoardSquare>()

    const classBoards = classBoardList.data || []
    const classBoard = classBoards[boardIndex] || undefined
    const currentMissions = masterMissions.data || []

    const changeBoard = (id: number) => changeBoardIndexState(id)
    const changeSquare = (square: ClassBoard.ClassBoardSquare) => changeStateSquare(square)

    const classBoardData = {
        changeBoard,
        classBoards,
        loading: classBoardList.loading,
        classBoard
    }

    const squareData = {
        changeSquare,
        currentSquare
    }

    const missionData = {
        currentMissions: currentMissions,
        loading: masterMissions.loading
    }

    return (
        <ClassBoardContext.Provider value={{ classBoardData, missionData, squareData }}>
            {children}
        </ClassBoardContext.Provider>
    )
}

