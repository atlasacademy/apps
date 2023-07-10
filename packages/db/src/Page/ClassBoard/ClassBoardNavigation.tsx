import { useContext } from "react"
import { Button } from "react-bootstrap"
import { classFilters } from "../ServantsPage"
import { ClassBoardContext } from "../../Contexts/ClassBoard"
import ClassIcon from "../../Component/ClassIcon"

const ClassBoardNavigation: React.FC = () => {
    const { classBoardData } = useContext(ClassBoardContext)
    const { changeBoard, classBoard, classBoards } = classBoardData
    
    return (
        <>
        <ul style={{ listStyle: "none", display: "flex", flexWrap: "wrap", gap: "1rem", padding: 0 }}>
            {classFilters.map((val, index) => {
                const id = classBoards.findIndex((classBoard) => {
                    return classBoard.classes.some((classElement) => classElement.className === val)
                })

                if (id < 0) {
                    return null
                }
                
                return (
                    <li key={"nav-" + index} >
                        <Button onClick={() => changeBoard(id)}>
                            <ClassIcon className={val} height={35} />
                        </Button>
                    </li>
                )
            })}
        </ul>
        <h1>{classBoard?.name}</h1>
        </>
    )
}

export default ClassBoardNavigation