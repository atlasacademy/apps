import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import copy from "copy-to-clipboard";
import { useState } from "react";

import { t } from "../i18n";

const CopyToClipboard = ({ text, title }: { text: string; title?: string }) => {
    const [copied, setCopied] = useState(false);

    const buttonTitle = title ? title : t("Copy text to clipboard", { text });

    if (copied) return <FontAwesomeIcon icon={faCheck} title={buttonTitle} />;

    return (
        <FontAwesomeIcon
            style={{ cursor: "pointer" }}
            title={buttonTitle}
            icon={faCopy}
            onClick={() => {
                copy(text);
                setCopied(true);
                setTimeout(() => {
                    setCopied(false);
                }, 1000);
            }}
        />
    );
};

export default CopyToClipboard;
