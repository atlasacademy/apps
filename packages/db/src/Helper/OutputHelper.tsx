import React from "react";

export type Renderable = JSX.Element | string | number | undefined;

export function asPercent(value: number | string | undefined, pow: number): string {
    if (typeof value === "string") return asPercent(parseInt(value), pow);

    const decimal = (value ?? 0) / Math.pow(10, pow);

    return `${decimal}%`;
}

export function formatNumber(value: number): string {
    return String(value).replace(/(.)(?=(\d{3})+$)/g, "$1,");
}

export function handleNewLine(text?: string): Renderable {
    if (!text) return "";

    return <span>{mergeElements(text.split("\n"), <br />)}</span>;
}

export function joinElements(elements: Renderable[], separator: Renderable): Renderable[] {
    const parts: Renderable[] = [],
        pushElement = function (element: Renderable) {
            if (element === undefined) return;

            if (typeof element === "object") {
                parts.push(element);
                return;
            }

            if (parts.length === 0) {
                parts.push(element.toString());
                return;
            }

            const previous = parts[parts.length - 1];
            if (typeof previous !== "string") {
                parts.push(element.toString());
                return;
            }

            parts[parts.length - 1] = previous + element.toString();
        };

    elements.forEach((element, index) => {
        if (index > 0) pushElement(separator);

        pushElement(element);
    });

    return parts;
}

export function mergeElements(elements: Renderable[], seperator: Renderable): Renderable {
    return (
        <React.Fragment>
            {joinElements(elements, seperator).map((element, index) => {
                return <React.Fragment key={index}>{element}</React.Fragment>;
            })}
        </React.Fragment>
    );
}
