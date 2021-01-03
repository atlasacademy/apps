import Api from "../Api";
import {AxiosError} from "axios";
import {BasicServantDescriptor} from "../Descriptor/ServantDescriptor";
import {BasicCraftEssenceDescriptor} from "../Descriptor/CraftEssenceDescriptor";
import {Change, CraftEssence, Region, Servant} from '@atlasacademy/api-connector';
import ErrorStatus from "../Component/ErrorStatus";
import {Link} from "react-router-dom";
import Loading from "../Component/Loading";
import Manager from "../Setting/Manager";
import React from 'react';
import renderCollapsibleContent from '../Component/CollapsibleContent';
import { Renderable } from "../Helper/OutputHelper";
import Settings from "./Changelog/Settings";

import './ChangelogPage.css';
interface IProps {
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
}

export default class extends React.Component<IProps, IState> {
    constructor(props : IProps) {
        super(props);

        this.state = {
            loading: true,
            changes: [],
            servantList: [],
            ceList: []
        }
    }

    async componentDidMount() {
        try {
            Manager.setRegion(this.props.region);
            let [changes, servantList, ceList] = await Promise.all([Api.changelog(), Api.servantList(), Api.craftEssenceList()]);
            this.setState({
                loading: false,
                changes, servantList, ceList
            });

            document.title = `[${this.props.region}] Changelog - Atlas Academy DB`;
        } catch (e) {
            this.setState({ error: e });
        }

    }

    render() {
        const { changes, error, loading, servantList, ceList } = this.state;
        const { localTime, region, visibleOnly } = this.props;
        if (error)
            return <ErrorStatus error={this.state.error}/>;

        if (loading || !changes?.length)
            return <Loading/>;

        let openedChange = true;

        var content = changes
            .sort((firstChange, secondChange) => (+ secondChange.timestamp) - (+ firstChange.timestamp))
            .map(change => {
                let renderedChanges = (
                    Object.entries(change.changes)
                        .filter(changeEntry => changeEntry[1].length)
                        .map(changeEntry => {
                            let title = '', content : Renderable[] = [], path = ''
                            let key = changeEntry[0] as keyof (typeof change)['changes'];
                            switch (key) {
                                case 'svt':
                                    title = 'Servant'; path = 'servant';
                                    break;
                                case 'ce':
                                    title = 'Craft Essence'; path = 'craft-essence';
                                    break;
                                case 'buff':
                                    title = 'Buff'; path = 'buff';
                                    break;
                                case 'func':
                                    title = 'Function'; path = 'func';
                                    break;
                                case 'skill':
                                    title = 'Skill'; path = 'skill';
                                    break;
                                case 'np':
                                    title = 'Noble Phantasm'; path = 'noble-phantasm';
                                    break;
                            }

                            switch (key) {
                                case 'svt':
                                case 'ce':
                                    content = (
                                        change.changes[key]
                                            .sort((a, b) => a.collectionNo - b.collectionNo)
                                            .map(svt => {
                                                var descriptor : Renderable = '';
                                                if (key === 'svt') {
                                                    let record = servantList.find(s => s.collectionNo === svt.collectionNo);
                                                    record && (descriptor = <BasicServantDescriptor region={region} servant={record}/>);
                                                }
                                                else {
                                                    let record = ceList.find(s => s.collectionNo === svt.collectionNo);
                                                    record && (descriptor = <BasicCraftEssenceDescriptor region={region} craftEssence={record} />);
                                                }
                                                return (
                                                    <li>
                                                        {descriptor || <Link to={`/${region}/${path}/${svt.id}`}>{svt.name}</Link>}
                                                        <br />
                                                    </li>
                                                )
                                            })
                                    );
                                    break;
                                default:
                                    content = (
                                        change.changes[key]
                                            .sort((a, b) => a.id - b.id)
                                            .map(obj => (
                                                <li>
                                                    {obj.id} -&nbsp;
                                                    <Link to={`/${region}/${path}/${obj.id}`}>{obj.name || `[${title} ${obj.id}]`}</Link>
                                                </li>
                                            ))
                                    )
                            }

                            return (
                                <>
                                    <h4>{title}</h4>
                                    {content}
                                    <br />
                                </>
                            )
                        })
                )

                var hasChanges = !!renderedChanges.length;
                if (!hasChanges && visibleOnly) return '';

                let initialOpen = openedChange;
                if (openedChange && hasChanges) {
                    // Only open up to the first one that has changes
                    openedChange = false;
                }


                let timestamp = new Date(+ change.timestamp * 1000 - (+!!localTime) * new Date().getTimezoneOffset() * 60 * 1000);
                return renderCollapsibleContent({
                    title: (
                        <>
                            <span style={{ fontFamily: 'monospace' }}>{change.commit.substr(0, 6)}</span>
                            &nbsp;- {localTime ? timestamp.toString() : timestamp.toUTCString()}
                        </>
                    ),
                    content: <>{hasChanges ? renderedChanges : 'No visible changes found.'}</>,
                    subheader: true,
                    initialOpen: initialOpen,
                });
            })

        if (visibleOnly) content = content.filter(Boolean);

        return (
            <div>
                <Settings
                    visibleOnly={Manager.changelogVisibleOnly()} updateVisibleOnly={Manager.setChangelogVisibleOnly}
                    localTime={Manager.changelogLocalTimestamp()} updateLocalTime={Manager.setChangelogLocalTimestamp}
                    />
                {content.length ? content : 'No changes found on the server.'}
            </div>
        )
    }
}