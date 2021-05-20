import {ClassName, Entity, Region, Trait} from "@atlasacademy/api-connector";
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
import TraitsSelector from "../Component/TraitsSelector";
import {getURLSearchParams} from "../Helper/StringHelper";

const attributeDescriptions = new Map<Entity.Attribute, string>(),
    classNameDescriptions = new Map<ClassName, string>(),
    entityTypeDescriptions = new Map<Entity.EntityType, string>([
        [Entity.EntityType.NORMAL, 'Servant'],
        [Entity.EntityType.HEROINE, 'Servant (Mash)'],
        [Entity.EntityType.COMBINE_MATERIAL, 'Exp Card'],
        [Entity.EntityType.ENEMY, 'Enemy'],
        [Entity.EntityType.ENEMY_COLLECTION, 'Enemy Servant'],
        [Entity.EntityType.ENEMY_COLLECTION_DETAIL, 'Boss'],
        [Entity.EntityType.SERVANT_EQUIP, 'Craft Essence'],
        [Entity.EntityType.STATUS_UP, 'Fou Card'],
    ]),
    genderDescriptions = new Map<Entity.Gender, string>();

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
    traitList: Trait.Trait[];
    illustratorList: string[];
    cvList: string[];
    searching: boolean;
    entities: Entity.EntityBasic[];
    name?: string;
    type?: Entity.EntityType[];
    className?: ClassName[];
    gender?: Entity.Gender[];
    attribute?: Entity.Attribute[];
    trait: number[];
    illustrator?: string;
    cv?: string;
}

class EntitiesPage extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        const defaultState: IState = {
            loading: true,
            traitList: [],
            illustratorList: [],
            cvList: [],
            searching: false,
            entities: [],
            trait: []
        };

        if (props.location.search !== "") {
            const searchParams = new URLSearchParams(props.location.search);
            this.state = {
                ...defaultState,
                name: searchParams.get('name') ?? undefined,
                illustrator: searchParams.get('illustrator') ?? undefined,
                cv: searchParams.get('cv') ?? undefined,
                type: searchParams.getAll('type') as Entity.EntityType[],
                className: searchParams.getAll('className') as ClassName[],
                gender: searchParams.getAll('gender') as Entity.Gender[],
                attribute: searchParams.getAll('attribute') as Entity.Attribute[],
                trait: searchParams.getAll('trait').map(num => parseInt(num)),
            }
        } else if (props.traitSelected) {
            this.state = {
                ...defaultState,
                trait: [props.traitSelected]
            }
        } else {
            this.state = stateCache.get(props.region) ?? defaultState;
        }
    }

    async componentDidMount() {
        Manager.setRegion(this.props.region);
        document.title = `[${this.props.region}] Entities - Atlas Academy DB`;

        try {
            const [traitList, illustratorList, cvList] = await Promise.all([
                Api.traitList(), Api.illustratorList(), Api.cvList()
            ]);
            if (this.props.location.search !== "" || this.props.traitSelected) {
                await this.search();
            }

            if (stateCache.has(this.props.region)) {
                this.setQueryURL();
            }

            this.setState({
                loading: false,
                traitList,
                illustratorList: illustratorList.map(illustrator => illustrator.name),
                cvList: cvList.map(cv => cv.name),
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

    private location(entity: Entity.EntityBasic): string | undefined {
        switch (entity.type) {
            case Entity.EntityType.NORMAL:
            case Entity.EntityType.HEROINE:
                return entity.collectionNo === 0
                    ? `/${this.props.region}/enemy/${entity.id}`
                    : `/${this.props.region}/servant/${entity.id}`;
            case Entity.EntityType.SERVANT_EQUIP:
                return `/${this.props.region}/craft-essence/${entity.id}`;
            case Entity.EntityType.ENEMY:
            case Entity.EntityType.ENEMY_COLLECTION:
            case Entity.EntityType.ENEMY_COLLECTION_DETAIL:
                return `/${this.props.region}/enemy/${entity.id}`;
        }

        return undefined;
    }

    getQueryString(): string {
        return getURLSearchParams({
            name: this.state.name,
            type: this.state.type,
            className: this.state.className,
            gender: this.state.gender,
            attribute: this.state.attribute,
            trait: this.state.trait,
            illustrator: this.state.illustrator,
            cv: this.state.cv
        }).toString();
    }

    setQueryURL() {
        this.props.history.replace(`/${this.props.region}/entities?${this.getQueryString()}`);
    }

    private async search() {
        // no filter set
        if (!this.state.name && !this.state.illustrator && !this.state.cv
            && (this.state.type === undefined || this.state.type.length === 0)
            && (this.state.className === undefined || this.state.className.length === 0)
            && (this.state.gender === undefined || this.state.gender.length === 0)
            && (this.state.attribute === undefined || this.state.attribute.length === 0)
            && this.state.trait.length === 0
        ) {
            this.setState({entities: []});
            this.props.history.replace(`/${this.props.region}/entities`);
            alert('Please refine the results before searching');
            return;
        }

        try {
            this.setState({searching: true, entities: []});
            const entities = await Api.searchEntity(
                this.state.name,
                this.state.type,
                this.state.className,
                this.state.gender,
                this.state.attribute,
                this.state.trait,
                undefined,
                this.state.illustrator,
                this.state.cv
            );

            this.setQueryURL();

            this.setState({searching: false, entities: entities});
        } catch (e) {
            this.props.history.replace(`/${this.props.region}/entities`);
            this.setState({
                error: e
            });
        }
    }

    render() {
        if (this.state.error)
            return (
                <div style={{textAlign: "center"}}>
                    <ErrorStatus error={this.state.error}/>
                    <Button variant={"primary"} onClick={
                        () => this.setState({error: undefined, searching: false})
                    }>
                        Redo the Search
                    </Button>
                </div>
            );

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
                        <SearchableSelect<Entity.EntityType> id='select-EntityType'
                                                      options={Object.values(Entity.EntityType)}
                                                      labels={entityTypeDescriptions}
                                                      selected={this.state.type ? this.state.type[0] : undefined}
                                                      onChange={(value?: Entity.EntityType) => {
                                                          this.setState({type: value ? [value] : undefined});
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
                                                     selected={this.state.className ? this.state.className[0] : undefined}
                                                     onChange={(value?: ClassName) => {
                                                         this.setState({className: value ? [value] : []});
                                                     }}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Gender</Form.Label>
                        <SearchableSelect<Entity.Gender> id='select-Gender'
                                                  options={Object.values(Entity.Gender)}
                                                  labels={genderDescriptions}
                                                  selected={this.state.gender ? this.state.gender[0] : undefined}
                                                  onChange={(value?: Entity.Gender) => {
                                                      this.setState({gender: value ? [value] : []});
                                                  }}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Attribute</Form.Label>
                        <SearchableSelect<Entity.Attribute> id='select-Attribute'
                                                     options={Object.values(Entity.Attribute)}
                                                     labels={attributeDescriptions}
                                                     selected={this.state.attribute ? this.state.attribute[0] : undefined}
                                                     onChange={(value?: Entity.Attribute) => {
                                                         this.setState({attribute: value ? [value] : []});
                                                     }}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Traits</Form.Label>
                        <TraitsSelector region={this.props.region}
                                       traitList={this.state.traitList}
                                       initialTraits={this.state.trait}
                                       onUpdate={(trait => {
                                           this.setState({trait: trait});
                                       })}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Illustrator</Form.Label>
                        <SearchableSelect<string>
                            id="select-illustrator"
                            options={this.state.illustratorList}
                            labels={new Map(this.state.illustratorList.map(illustrator => [illustrator, ""]))}
                            selected={this.state.illustrator ?? undefined}
                            onChange={(value?: string) => {
                                this.setState({ illustrator: value });
                            }}
                            disableLabelStyling={true}
                        />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Voice Actor</Form.Label>
                        <SearchableSelect<string>
                            id="select-voice-actor"
                            options={this.state.cvList}
                            labels={new Map(this.state.cvList.map(illustrator => [illustrator, ""]))}
                            selected={this.state.cv ?? undefined}
                            onChange={(value?: string) => {
                                this.setState({ cv: value });
                            }}
                            disableLabelStyling={true}
                        />
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
                    {this.state.entities.map((entity) => {
                        const route = this.location(entity);

                        return (
                            <tr key={entity.id}>
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
