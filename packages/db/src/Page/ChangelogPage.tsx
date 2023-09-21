import { AxiosError } from "axios";
import React from "react";
import { Pagination } from "react-bootstrap";
import { WithTranslation, withTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Change, CraftEssence, Region, Servant } from "@atlasacademy/api-connector";

import Api from "../Api";
import renderCollapsibleContent from "../Component/CollapsibleContent";
import ErrorStatus from "../Component/ErrorStatus";
import Loading from "../Component/Loading";
import { BasicCraftEssenceDescriptor } from "../Descriptor/CraftEssenceDescriptor";
import { BasicServantDescriptor } from "../Descriptor/ServantDescriptor";
import { Renderable } from "../Helper/OutputHelper";
import Manager from "../Setting/Manager";
import Settings from "./Changelog/Settings";

import "./ChangelogPage.css";

const ITEM_PER_PAGE = 50;

interface IProps extends WithTranslation {
    region: Region;
    visibleOnly?: boolean;
    localTime?: boolean;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    changes: Change.Change[];
    servantList: Servant.ServantBasic[];
    ceList: CraftEssence.CraftEssenceBasic[];
    page: number;
}

const ChangelogPagination = (props: {
    page: number;
    setPage: (page: number) => void;
    pageCount: number;
    maxShownPagesEachSide?: number;
}) => {
    const { page, setPage, pageCount } = props,
        maxShownPagesEachSide = props.maxShownPagesEachSide ?? 2,
        showLeftEllipsis = page >= maxShownPagesEachSide + 1,
        showRightEllipsis = page <= pageCount - maxShownPagesEachSide * 2,
        leftEllipsisPage = showRightEllipsis
            ? Math.max(page - maxShownPagesEachSide, 0)
            : pageCount - (maxShownPagesEachSide + 1) * 2,
        rightEllipsisPage = showLeftEllipsis
            ? Math.min(page + maxShownPagesEachSide, pageCount - 1)
            : showRightEllipsis
            ? maxShownPagesEachSide * 2 + 1
            : pageCount,
        pages = Array.from({ length: pageCount }, (_, i) => i),
        shownPages = pages.slice(leftEllipsisPage, rightEllipsisPage + 1);

    return (
        <Pagination>
            <Pagination.First onClick={() => setPage(0)} />
            <Pagination.Prev onClick={() => setPage(page + -1)} />
            {showLeftEllipsis && <Pagination.Ellipsis className="pagination-item" />}
            {shownPages.map((page) => (
                <Pagination.Item
                    key={page}
                    active={page === props.page}
                    onClick={() => setPage(page)}
                    className="pagination-item"
                >
                    {page + 1}
                </Pagination.Item>
            ))}
            {showRightEllipsis && <Pagination.Ellipsis className="pagination-item" />}
            <Pagination.Next onClick={() => setPage(page + 1)} />
            <Pagination.Last onClick={() => setPage(pageCount - 1)} />
        </Pagination>
    );
};

class ChangelogPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            page: 0,
            loading: true,
            changes: [],
            servantList: [],
            ceList: [],
        };
    }

    async componentDidMount() {
        Manager.setRegion(this.props.region);
        document.title = `[${this.props.region}] Changelog - Atlas Academy DB`;
        Promise.all([Api.changelog(), Api.servantList(), Api.craftEssenceList()])
            .then(([changes, servantList, ceList]) =>
                this.setState({
                    changes: changes.sort(
                        (firstChange, secondChange) => +secondChange.timestamp - +firstChange.timestamp
                    ),
                    servantList,
                    ceList,
                    loading: false,
                })
            )
            .catch((error) => this.setState({ error }));
    }

    render() {
        const t = this.props.t;
        const { changes, error, loading, servantList, ceList } = this.state;
        const { localTime, region, visibleOnly } = this.props;
        if (error) return <ErrorStatus error={this.state.error} />;

        if (loading) return <Loading />;

        let openedChange = true;

        var content = changes
            .slice(this.state.page * ITEM_PER_PAGE, (this.state.page + 1) * ITEM_PER_PAGE)
            .map((change) => {
                let renderedChanges = Object.entries(change.changes)
                    .filter((changeEntry) => changeEntry[1].length)
                    .map((changeEntry) => {
                        let title = "",
                            content: Renderable[] = [],
                            path = "";
                        let key = changeEntry[0] as keyof (typeof change)["changes"];
                        switch (key) {
                            case "svt":
                                title = t("Servant");
                                path = "servant";
                                break;
                            case "ce":
                                title = t("Craft Essence");
                                path = "craft-essence";
                                break;
                            case "buff":
                                title = t("Buff");
                                path = "buff";
                                break;
                            case "func":
                                title = t("Function");
                                path = "func";
                                break;
                            case "skill":
                                title = t("Skill");
                                path = "skill";
                                break;
                            case "np":
                                title = t("Noble Phantasm");
                                path = "noble-phantasm";
                                break;
                        }

                        switch (key) {
                            case "svt":
                            case "ce":
                                content = change.changes[key]
                                    .sort((a, b) => a.collectionNo - b.collectionNo)
                                    .map((svt) => {
                                        var descriptor: Renderable = "";
                                        if (key === "svt") {
                                            let record = servantList.find((s) => s.collectionNo === svt.collectionNo);
                                            record &&
                                                (descriptor = (
                                                    <BasicServantDescriptor region={region} servant={record} />
                                                ));
                                        } else {
                                            let record = ceList.find((s) => s.collectionNo === svt.collectionNo);
                                            record &&
                                                (descriptor = (
                                                    <BasicCraftEssenceDescriptor
                                                        region={region}
                                                        craftEssence={record}
                                                    />
                                                ));
                                        }
                                        return (
                                            <li key={svt.id}>
                                                {descriptor || (
                                                    <Link to={`/${region}/${path}/${svt.id}`}>{svt.name}</Link>
                                                )}
                                                <br />
                                            </li>
                                        );
                                    });
                                break;
                            default:
                                content = change.changes[key]
                                    .sort((a, b) => a.id - b.id)
                                    .map((obj) => (
                                        <li key={obj.id}>
                                            {obj.id} -&nbsp;
                                            <Link to={`/${region}/${path}/${obj.id}`}>
                                                {obj.name || `[${title} ${obj.id}]`}
                                            </Link>
                                        </li>
                                    ));
                        }

                        return (
                            <>
                                <h4>{title}</h4>
                                {content}
                                <br />
                            </>
                        );
                    });

                var hasChanges = !!renderedChanges.length;
                if (!hasChanges && visibleOnly) return "";

                let initialOpen = openedChange;
                if (openedChange && hasChanges) {
                    // Only open up to the first one that has changes
                    openedChange = false;
                }

                let timestamp = new Date(+change.timestamp * 1000);
                return renderCollapsibleContent({
                    title: (
                        <>
                            <span style={{ fontFamily: "monospace" }}>{change.commit.slice(0, 6)}</span>
                            &nbsp;- {localTime ? timestamp.toString() : timestamp.toUTCString()}
                        </>
                    ),
                    content: <>{hasChanges ? renderedChanges : t("No visible changes found")}</>,
                    subheader: true,
                    initialOpen: initialOpen,
                });
            });

        if (visibleOnly) content = content.filter(Boolean);

        return (
            <>
                <Settings
                    visibleOnly={Manager.changelogVisibleOnly()}
                    updateVisibleOnly={Manager.setChangelogVisibleOnly}
                    localTime={Manager.changelogLocalTimestamp()}
                    updateLocalTime={Manager.setChangelogLocalTimestamp}
                />
                <ChangelogPagination
                    page={this.state.page}
                    setPage={(page) => this.setState({ page })}
                    pageCount={Math.ceil(this.state.changes.length / ITEM_PER_PAGE)}
                />
                {content.length ? content : t("No changes found on the server.")}
            </>
        );
    }
}

export default withTranslation()(ChangelogPage);
