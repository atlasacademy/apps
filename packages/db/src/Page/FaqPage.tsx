import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { Region } from "@atlasacademy/api-connector";

import Manager from "../Setting/Manager";
import warFaq from "./Faq/War";

import "./FaqPage.css";

const FaqItem = ({ id, title, children }: { id: string; title: string; children?: React.ReactNode }) => {
    return (
        <li id={id}>
            <b className="faq-link-hover-target">
                {title}{" "}
                <a href={`#${id}`} className="faq-link-icon">
                    <FontAwesomeIcon icon={faLink} />
                </a>
            </b>
            <br />
            {children}
        </li>
    );
};

const FaqPage = ({ region }: { region: Region }) => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash !== "") {
            setTimeout(() => {
                const element = document.getElementById(hash.replace("#", ""));
                if (element !== null) {
                    element.scrollIntoView();
                }
            }, 0);
        }
    }, [pathname, hash]);

    useEffect(() => {
        Manager.setRegion(region);
    }, [region]);

    document.title = "FAQ - Atlas Academy DB";

    const faqContent = [warFaq(region)];

    return (
        <>
            <h1>Frequently Asked Questions</h1>
            <hr />
            <ol type="I" className="faq-toc">
                {faqContent.map((faq) => (
                    <li key={faq.id}>
                        <a href={`#${faq.id}`}>{faq.title}</a>
                        <ol>
                            {faq.subSections.map((subSection) => (
                                <li key={subSection.id}>
                                    <a href={`#${subSection.id}`}>{subSection.title}</a>
                                </li>
                            ))}
                        </ol>
                    </li>
                ))}
            </ol>
            <hr />
            <ol type="I" className="faq-list">
                {faqContent.map((faq) => (
                    <li key={faq.id} id={faq.id}>
                        <span className="faq-link-hover-target">
                            {faq.title}{" "}
                            <a href={`#${faq.id}`} className="faq-link-icon">
                                <FontAwesomeIcon icon={faLink} />
                            </a>
                        </span>
                        <ol>
                            {faq.subSections.map((subSection) => (
                                <FaqItem key={subSection.id} id={subSection.id} title={subSection.title}>
                                    {subSection.content}
                                </FaqItem>
                            ))}
                        </ol>
                    </li>
                ))}
            </ol>
        </>
    );
};

export default FaqPage;
