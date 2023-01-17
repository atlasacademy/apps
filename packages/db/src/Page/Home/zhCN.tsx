import { Link } from "react-router-dom";

import { Region } from "@atlasacademy/api-connector";

export default function home(region?: Region) {
    return (
        <div>
            <h1>Atlas Academy DB</h1>

            <p>
                <i>FGO游戏数据导航 - 准确无误</i>
            </p>

            <hr />

            <p>
                这个工具可以让你准确的浏览游戏所使用的原始数据。除翻译外，几乎没有任何一项显示的数据是手动输入，
                能够精确得反映游戏最新版本的原始数据。
            </p>

            <p>
                请注意技能/宝具/效果等描述是自动生成的（只支持英文）。若存在未知的或新增加的效果，可能存在描述不准确的情况。
            </p>

            <p>
                所有用于展示本站点的数据均可通过以下网址公开访问：
                <a href="https://api.atlasacademy.io" target="_blank" rel="noopener noreferrer">
                    https://api.atlasacademy.io
                </a>
                。api.atlasacademy.io的数据由服务器自动维护并更新，通常可在游戏更新的一个小时内刷新新数据。
            </p>

            <p>
                <Link to={`${region ?? "NA"}/faq`}>
                    <b>常见问题(FAQ)/如何使用AA DB</b>
                </Link>
            </p>

            <br />

            <div>Credits:</div>
            <ul>
                <li>
                    <a href="https://atlasacademy.io">Atlas Academy</a>
                    &nbsp; (
                    <a href="https://atlasacademy.io/discord" target="_blank" rel="noopener noreferrer">
                        Discord
                    </a>
                    )
                </li>
                <li>solution (solution#0286)</li>
                <li>Cereal</li>
                <li>
                    Cipher (<a href="https://github.com/minhducsun2002">minhducsun2002</a>)
                </li>
                <li>
                    <a href="https://github.com/Mitsunee">Mitsunee</a>
                </li>
                <li>
                    <a href="https://rayshift.io/" target="_blank" rel="noreferrer">
                        Neo
                    </a>
                </li>
                <li>
                    <a href="https://github.com/MaxAkito" target="_blank" rel="noreferrer">
                        Max
                    </a>{" "}
                    (MaxAkito#0096)
                </li>
                <li>
                    <a href="https://twitter.com/gakiloroth" target="_blank" rel="noreferrer">
                        gakiloroth
                    </a>
                </li>
                <li>
                    VladtheImpala (
                    <a href="https://github.com/boyonthebeach2k" target="_blank" rel="noreferrer">
                        boyonthebeach2k
                    </a>
                    )
                </li>
                <li>
                    <a href="https://github.com/narumi147" target="_blank" rel="noreferrer">
                        narumi
                    </a>
                </li>
            </ul>
        </div>
    );
}
