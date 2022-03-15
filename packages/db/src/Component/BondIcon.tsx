import img_bondsgage_1 from "../Assets/img_bondsgage_1.png";
import img_bondsgage_2 from "../Assets/img_bondsgage_2.png";
import img_bondsgage_3 from "../Assets/img_bondsgage_3.png";
import img_bondsgage_4 from "../Assets/img_bondsgage_4.png";
import img_bondsgage_5 from "../Assets/img_bondsgage_5.png";
import img_bondsgage_6 from "../Assets/img_bondsgage_6.png";
import img_bondsgage_7 from "../Assets/img_bondsgage_7.png";
import img_bondsgage_8 from "../Assets/img_bondsgage_8.png";
import img_bondsgage_9 from "../Assets/img_bondsgage_9.png";
import img_bondsgage_10 from "../Assets/img_bondsgage_10.png";

const bondIconImage = new Map([
    [1, img_bondsgage_1],
    [2, img_bondsgage_2],
    [3, img_bondsgage_3],
    [4, img_bondsgage_4],
    [5, img_bondsgage_5],
    [6, img_bondsgage_6],
    [7, img_bondsgage_7],
    [8, img_bondsgage_8],
    [9, img_bondsgage_9],
    [10, img_bondsgage_10],
]);

let BondIcon = (props: { level: number }) => {
    let { level } = props;
    if (1 <= level && level <= 10) return <img alt={`Bond level ${level}`} src={bondIconImage.get(level)} />;
    else return null;
};

export default BondIcon;
