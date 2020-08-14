import {Attribute, BaseEntityBasic, ClassName, EntityType, Gender, Region, Trait} from "@atlasacademy/api-connector";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AxiosError} from "axios";
import React from "react";
import {Button, Form, Table} from "react-bootstrap";
import {withRouter} from "react-router";
import {Link, RouteComponentProps} from "react-router-dom";
import Api from "../Api";
import ErrorStatus from "../Component/ErrorStatus";
import FaceIcon from "../Component/FaceIcon";
import Loading from "../Component/Loading";
import SearchableSelect from "../Component/SearchableSelect";
import Manager from "../Setting/Manager";
import TraitsSelector from "./Entities/TraitsSelector";

const attributeDescriptions = new Map<Attribute, string>(),
    classNameDescriptions = new Map<ClassName, string>(),
    entityTypeDescriptions = new Map<EntityType, string>([
        [EntityType.NORMAL, 'Servant'],
        [EntityType.HEROINE, 'Servant (Mash)'],
        [EntityType.COMBINE_MATERIAL, 'Exp Card'],
        [EntityType.ENEMY, 'Enemy'],
        [EntityType.ENEMY_COLLECTION, 'Enemy Servant'],
        [EntityType.ENEMY_COLLECTION_DETAIL, 'Boss'],
        [EntityType.SERVANT_EQUIP, 'Craft Essence'],
        [EntityType.STATUS_UP, 'Fou Card'],
    ]),
    genderDescriptions = new Map<Gender, string>();

let stateCache = new Map<Region, IState>([]);

interface ChangeEvent extends React.ChangeEvent<HTMLInputElement> {

}

interface IProps extends RouteComponentProps {
    region: Region;
    traitSelected?: number;
}

interface IState {
    loading: boolean;
    error?: AxiosError;
    traitList: Trait[];
    searching: boolean;
    entities: BaseEntityBasic[];
    name?: string;
    type?: EntityType;
    className?: ClassName;
    gender?: Gender;
    attribute?: Attribute;
    traits: number[];
}

class EntitiesPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const defaultState : IState = {
            loading: true,
            traitList: [],
            searching: false,
            entities: [],
            traits: []
        };

        if (props.traitSelected) {
            this.state = {
                ...defaultState,
                traits: [props.traitSelected]
            }
        } else {
            this.state = stateCache.get(props.region) ?? defaultState;
        }
    }

    async componentDidMount() {
        Manager.setRegion(this.props.region);

        try {
            const traitList = await Api.traitList();
            if (this.props.traitSelected) {
                await this.search();
                this.props.history.replace(`/${this.props.region}/entities`);
            }

            this.setState({
                loading: false,
                traitList
            });
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    componentDidUpdate() {
        stateCache.set(this.props.region, {...this.state});
    }

    private location(entity: BaseEntityBasic): string | undefined {
        switch (entity.type) {
            case EntityType.NORMAL:
            case EntityType.HEROINE:
                return `/${this.props.region}/servant/${entity.id}`;
            case EntityType.SERVANT_EQUIP:
                return `/${this.props.region}/craft-essence/${entity.id}`;
            case EntityType.ENEMY:
            case EntityType.ENEMY_COLLECTION:
            case EntityType.ENEMY_COLLECTION_DETAIL:
                return `/${this.props.region}/enemy/${entity.id}`;
        }

        return undefined;
    }

    private async search() {
        // no filter set
        if (!this.state.name
            && !this.state.className
            && !this.state.gender
            && !this.state.attribute
            && this.state.traits.length === 0
        ) {
            this.setState({entities: []});
            alert('Please refine the results before searching');
            return;
        }

        try {
            await this.setState({searching: true, entities: []});

            const entities = await Api.searchEntity(
                this.state.name,
                this.state.type,
                this.state.className,
                this.state.gender,
                this.state.attribute,
                this.state.traits
            );

            this.setState({searching: false, entities: entities});
        } catch (e) {
            this.setState({
                error: e
            });
        }
    }

    render() {
        if (this.state.error)
            return <ErrorStatus error={this.state.error}/>;

        if (this.state.loading)
            return <Loading/>;

        return (
            <div>
                {this.state.searching ? <Loading/> : null}

                <h1>Entities Search</h1>

                <form onSubmit={(ev: React.FormEvent) => {
                    ev.preventDefault();
                    this.search();
                }}>

                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control value={this.state.name ?? ''}
                                      onChange={(ev: ChangeEvent) => {
                                          this.setState({name: ev.target.value});
                                      }}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Type</Form.Label>
                        <SearchableSelect<EntityType> id='select-EntityType'
                                                      options={Object.values(EntityType)}
                                                      labels={entityTypeDescriptions}
                                                      selected={this.state.type}
                                                      onChange={(value?: EntityType) => {
                                                          this.setState({type: value});
                                                      }}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Class</Form.Label>
                        <SearchableSelect<ClassName> id='select-ClassName'
                                                     options={
                                                         Object
                                                             .values(ClassName)
                                                             .filter(className => className !== ClassName.EXTRA)
                                                     }
                                                     labels={classNameDescriptions}
                                                     selected={this.state.className}
                                                     onChange={(value?: ClassName) => {
                                                         this.setState({className: value});
                                                     }}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Gender</Form.Label>
                        <SearchableSelect<Gender> id='select-Gender'
                                                  options={Object.values(Gender)}
                                                  labels={genderDescriptions}
                                                  selected={this.state.gender}
                                                  onChange={(value?: Gender) => {
                                                      this.setState({gender: value});
                                                  }}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Attribute</Form.Label>
                        <SearchableSelect<Attribute> id='select-Attribute'
                                                     options={Object.values(Attribute)}
                                                     labels={attributeDescriptions}
                                                     selected={this.state.attribute}
                                                     onChange={(value?: Attribute) => {
                                                         this.setState({attribute: value});
                                                     }}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Traits</Form.Label>
                        <TraitsSelector region={this.props.region}
                                        traitList={this.state.traitList}
                                        traits={this.state.traits}
                                        onUpdate={(traits => {
                                            this.setState({traits});
                                        })}/>
                    </Form.Group>
                    <Button variant={'primary'} onClick={() => this.search()}>
                        Search
                        {' '}
                        <FontAwesomeIcon icon={faSearch}/>
                    </Button>
                </form>

                <hr/>

                <Table responsive>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Icon</th>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.entities.map((entity, index) => {
                        const route = this.location(entity);

                        return (
                            <tr key={index}>
                                <td>
                                    {route ? (
                                        <Link to={route}>
                                            {entity.id}
                                        </Link>
                                    ) : entity.id}
                                </td>
                                <td>{entityTypeDescriptions.get(entity.type) ?? entity.type}</td>
                                <td>
                                    <FaceIcon location={entity.face}/>
                                </td>
                                <td>{entity.name}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }
}

export default withRouter(EntitiesPage);
