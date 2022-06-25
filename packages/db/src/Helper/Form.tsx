import { FormEvent } from "react";

export const preventDefault = (e: FormEvent) => {
    e.preventDefault();
};
