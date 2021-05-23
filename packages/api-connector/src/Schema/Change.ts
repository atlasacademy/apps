interface mstSvt {
    id: number;
    type: number;
    collectionNo: number;
    name: number;
}

interface mstObject {
    id: number;
    name: string;
}

export interface Change {
    /** Hash of the commit producing this change. */
    commit: string;
    /** Commit timestamp, represented in seconds since UNIX epoch. */
    timestamp: string;

    changes: {
        svt: mstSvt[];
        ce: mstSvt[];
        skill: mstObject[];
        buff: mstObject[];
        np: mstObject[];
        func: mstObject[];
    };
}
