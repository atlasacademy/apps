import Api from "../Api";
import {AxiosError} from "axios";
import ErrorStatus from "../Component/ErrorStatus";
import {Link} from "react-router-dom";
import Loading from "../Component/Loading";
import Manager from "../Setting/Manager";
import React from 'react';
import {Region, Change} from '@atlasacademy/api-connector';
import renderCollapsibleContent from '../Component/CollapsibleContent';
import { Renderable } from "../Helper/OutputHelper";

import './ChangelogPage.css';
interface IProps {
    region: Region;
    visibleOnly?: boolean;
}

interface IState {
    error?: AxiosError;
    loading: boolean;
    changes: Change.Change[];
}

export default class extends React.Component<IProps, IState> {
    constructor(props : IProps) {
        super(props);

        this.state = {
            loading: true,
            changes: []
        }
    }

    async componentDidMount() {
        try {
            Manager.setRegion(this.props.region);
            this.setState({ loading: false, changes: await Api.changelog() });

            document.title = `[${this.props.region}] Changelog - Atlas Academy DB`;
        } catch (e) {
            this.setState({ error: e });
        }

    }

    render() {
        const { changes, error, loading } = this.state;
        const { region, visibleOnly } = this.props;
        if (error)
            return <ErrorStatus error={this.state.error}/>;

        if (loading || !changes?.length)
            return <Loading/>;

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
                                            .map(svt => (
                                                <li>
                                                    {svt.collectionNo} -&nbsp;
                                                    <Link to={`/${region}/${path}/${svt.id}`}>
                                                        {svt.name}
                                                    </Link>
                                                </li>
                                            ))
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

                return renderCollapsibleContent({
                    title: (
                        <>
                            <span style={{ fontFamily: 'monospace' }}>{change.commit.substr(0, 7)}</span>
                            &nbsp;- {new Date(+ change.timestamp * 1000).toUTCString()}
                        </>
                    ),
                    content: <>{hasChanges ? renderedChanges : 'No visible changes found.'}</>,
                    subheader: false,
                    initialOpen: false
                });
            })

        if (visibleOnly) content = content.filter(Boolean);

        return content.length ? content : 'No changes found on the server.';
    }
}