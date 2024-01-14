import React from "react";
import { Button } from "react-bootstrap";

import "./ButtonGrid.css";

interface IProps {
    /** The items to display in the grid. Array of objects containing a uniqueId which will be passed to the onClick handler, and a displayName for each item */
    itemList: {
        uniqueId: number;
        displayName: string;
    }[];
    /** All buttons enabled by default */
    defaultEnabled: boolean;
    /** Buttons prevented from being interacted with */
    disabledItems?: number[];
    /** Title for the grid */
    title: string;
    /** Inline style overrides for the container of the buttons */
    containerStyleOverride?: React.CSSProperties;
    /** Inline style overrides for each button */
    buttonStyleOverride?: React.CSSProperties;
    /** Handler that is supplied to the button onClick attriute, taking an array of currently enabled uniqueIds as the only parameter */
    onClick: (checkedItems: number[]) => void;
}

interface IState {
    /** The uniqueIds corresponding to the currently toggled buttons */
    enabledButtonIds: number[];
    /** Array holding the states of the buttons */
    buttonStates: { [key: number]: boolean };
    /** The items to display in the grid. Array of objects containing a uniqueId which will be passed to the onClick handler, and a displayName for each item */
    itemList: {
        uniqueId: number;
        displayName: string;
    }[];
    /** Toggle all buttons */
    allToggled: boolean;
    /** Whether to show the grid modal */
    showModal: boolean;
    /** Screen width */
    screenWidth: number;
}

/**
 * A stylable wrapper around a grid of check input elements, best placed in its own stacking context.
 * @param props {@link IProps Props to pass into the component.}
 */
class ButtonGrid extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = {
            enabledButtonIds: props.defaultEnabled ? props.itemList.map((item) => item.uniqueId) : [],
            buttonStates: props.itemList.reduce((acc, curr) => ({ ...acc, [curr.uniqueId]: props.defaultEnabled }), {}),
            itemList: [...props.itemList],
            allToggled: !props.defaultEnabled,
            screenWidth: window.innerWidth,
            showModal: window.innerWidth > 999,
        };
    }

    componentDidMount = () => {
        /* Attach listener to resize */
        window.addEventListener("resize", this.handleWindowSizeChange.bind(this));
    };

    componentWillUnmount = () => {
        window.removeEventListener("resize", this.handleWindowSizeChange.bind(this));
    };

    handleWindowSizeChange() {
        this.setState({ screenWidth: window.innerWidth, showModal: window.innerWidth > 999 });
    }

    handleClick(e: React.MouseEvent<HTMLButtonElement>) {
        const uniqueId =
            this.state.itemList.find((item) => item.displayName === e.currentTarget.innerText)?.uniqueId ?? -1;
        const enabledButtonIds = [...this.state.enabledButtonIds];
        const buttonStates = { ...this.state.buttonStates };

        if (enabledButtonIds.includes(uniqueId)) {
            enabledButtonIds.splice(enabledButtonIds.indexOf(uniqueId), 1);
        } else {
            enabledButtonIds.push(uniqueId);
        }

        buttonStates[uniqueId] = !buttonStates[uniqueId];

        this.setState({ enabledButtonIds, buttonStates }, () => {
            this.props.onClick(enabledButtonIds);
        });
    }

    handleToggle() {
        const enabledButtonIds = this.state.allToggled ? this.state.itemList.map((item) => item.uniqueId) : [];
        const buttonStates = this.state.allToggled
            ? this.state.itemList
                  .filter((item) => !this.props.disabledItems?.includes(item.uniqueId))
                  .reduce((acc, curr) => ({ ...acc, [curr.uniqueId]: true }), {})
            : {};

        this.setState(
            {
                enabledButtonIds,
                buttonStates,
                allToggled: !this.state.allToggled,
            },
            () => {
                this.props.onClick(
                    this.state.allToggled
                        ? []
                        : this.state.itemList
                              .filter((item) => !this.props.disabledItems?.includes(item.uniqueId))
                              .map((item) => item.uniqueId)
                );
            }
        );
    }

    toggleModal() {
        this.setState({
            showModal: !this.state.showModal,
        });
    }

    render() {
        const isSmallScreen = this.state.screenWidth < 999;

        return (
            <div id="toggle-base">
                {isSmallScreen ? (
                    <>
                        <Button id="toggle-modal" onClick={this.toggleModal.bind(this)}>
                            Gimmick Controls
                        </Button>
                        <Button id="toggle-all" variant={"dark"} onClick={this.handleToggle.bind(this)}>
                            All
                        </Button>
                    </>
                ) : (
                    []
                )}
                {this.state.showModal ? (
                    <div id="toggle-container" style={this.props.containerStyleOverride ?? {}}>
                        <h4>{this.props.title}</h4>
                        {!isSmallScreen ? (
                            <Button id="toggle-all" variant={"dark"} onClick={this.handleToggle.bind(this)}>
                                Toggle All
                            </Button>
                        ) : (
                            []
                        )}
                        {this.props.itemList.map((item) => (
                            <Button
                                key={item.uniqueId}
                                className="toggle-button"
                                variant={
                                    this.props.disabledItems?.includes(item.uniqueId)
                                        ? "danger"
                                        : this.state.buttonStates[item.uniqueId]
                                          ? "success"
                                          : "secondary"
                                }
                                disabled={this.props.disabledItems?.includes(item.uniqueId)}
                                style={this.props.buttonStyleOverride ?? {}}
                                onClick={this.handleClick.bind(this)}
                            >
                                {item.displayName}
                            </Button>
                        ))}
                    </div>
                ) : (
                    []
                )}
            </div>
        );
    }
}

export default ButtonGrid;
