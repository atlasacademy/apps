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
        squares: ClassBoard.ClassBoardSquare[]
        changeSquare: (square: ClassBoard.ClassBoardSquare) => void
    }

    missionData: {
        currentMissions: MasterMission.MasterMission[]
        loading: boolean
    }

    states: {
        showAllSkills: { show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>> }
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
        squares: [],
        currentSquare: undefined
    },
    missionData: {
        currentMissions: [],
        loading: false
    },
    states: {
        showAllSkills: { show: false, setShow: () => {} }
    }
})

export const ClassBoardProvider: React.FC<ClassBoardProviderProps> = ({ children, region }) => {
    const classBoardList = useApi("classBoardList")
    const masterMissions = useApi("masterMissionList")

    const [boardIndex, changeBoardIndexState] = useState(0)
    const [currentSquare, changeStateSquare] = useState<ClassBoard.ClassBoardSquare>()
    const [showAllSkills, setShowAllSkills] = useState(false)

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
        currentSquare,
        squares: classBoard?.squares || []
    }

    const missionData = {
        currentMissions: currentMissions,
        loading: masterMissions.loading
    }

    const states = {
        showAllSkills: { show: showAllSkills, setShow: setShowAllSkills }
    }

    return (
        <ClassBoardContext.Provider value={{ classBoardData, missionData, squareData, states }}>
            {children}
        </ClassBoardContext.Provider>
    )
}

