import { faLanguage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Region } from "@atlasacademy/api-connector";
import { UILanguage } from "@atlasacademy/api-descriptor";

import { mergeElements } from "../../Helper/OutputHelper";
import Manager from "../../Setting/Manager";
import { UILanguageDescriptor } from "../../Setting/SettingForm";
import { WeblateStat } from "./weblate";

const UILanguageLink = ({ uiLang }: { uiLang: UILanguage }) => {
    return (
        <Button
            className="p-0 user-select-auto align-baseline"
            variant="link"
            lang={uiLang}
            onClick={() => {
                Manager.setUiLanguage(uiLang);
            }}
        >
            {UILanguageDescriptor.get(uiLang)?.langName}
        </Button>
    );
};

export default function home(region?: Region, translationStats?: Map<UILanguage, WeblateStat>) {
    return (
        <div>
            <h1>Atlas Academy DB</h1>

            <p>
                <i>FGO Game Data Navigator — without any of the fluff.</i>
            </p>

            <hr />

            <p>
                This tools lets you accurately navigate the raw data the game is using in the back. None of the data
                that is being displayed on this tool is manually entered. Everything is accurately reflecting exactly
                the raw data available from the most recent version of the game.
            </p>

            <p>
                Please note that the skill/NP/effect descriptions are generated automatically and if there is an unknown
                interaction or new function, there is a possibility that it is displayed incorrectly.
            </p>

            <p>
                All the data that is being used to render this DB is publicly available at{" "}
                <a href="https://api.atlasacademy.io" target="_blank" rel="noopener noreferrer">
                    https://api.atlasacademy.io
                </a>
                . The data at api.atlasacademy.io is automatically maintained and will be refreshed within an hour of a
                new release of the game.
            </p>

            <p>
                The website is also available in{" "}
                {mergeElements(
                    Object.values(UILanguage).map((uiLang) => <UILanguageLink key={uiLang} uiLang={uiLang} />),
                    ", "
                )}
                . You can change the UI Language using the{" "}
                <Button variant="info">
                    <FontAwesomeIcon icon={faLanguage} title="UI Language" />
                </Button>{" "}
                button.
            </p>

            <p>
                Any translation help is greatly appreciated. The translations are available and can be edited at our{" "}
                <a href="https://weblate.atlasacademy.io/" target="_blank" rel="noreferrer">
                    Weblate instance
                </a>
                . Translation progress:
                <ul>
                    {translationStats !== undefined &&
                        Object.values(UILanguage)
                            .filter((uiLang) => uiLang !== UILanguage.EN_US && translationStats.has(uiLang))
                            .map((uiLang) => {
                                const stats = translationStats.get(uiLang);
                                if (stats === undefined) return <></>;
                                return (
                                    <li key={uiLang}>
                                        <a href={stats.url} target="_blank" rel="noopener noreferrer">
                                            {UILanguageDescriptor.get(uiLang)?.langName}
                                        </a>
                                        : {Math.floor(100 - stats.failing_percent)}%{" "}
                                        {stats.failing_percent < 1 ? "✔️" : ""}
                                    </li>
                                );
                            })}
                </ul>
            </p>

            <p>
                <Link to={`${region ?? "NA"}/faq`}>
                    <b>Frequently Asked Questions / How to navigate the DB</b>
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
