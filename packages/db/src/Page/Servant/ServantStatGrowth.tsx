import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";

import { Region, Servant } from "@atlasacademy/api-connector";

import { formatNumber } from "../../Helper/OutputHelper";

import "./ServantStatGrowth.css";

interface IProps {
    region: Region;
    servant: Servant.Servant;
}

class ServantStatGrowth extends React.Component<IProps> {
    render() {
        let { hpGrowth, lvMax, atkGrowth, growthCurve } = this.props.servant,
            growthCurveName: string;
        switch (growthCurve) {
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 9999:
                growthCurveName = "Linear";
                break;
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
                growthCurveName = "Reverse S";
                break;
            case 11:
            case 12:
            case 13:
            case 14:
            case 15:
                growthCurveName = "S";
                break;
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
                growthCurveName = "Semi Reverse S";
                break;
            case 26:
            case 27:
            case 28:
            case 29:
            case 30:
                growthCurveName = "Semi S";
                break;
            default:
                growthCurveName = "Unknown";
        }
        return (
            <div>
                <div className="growth-curve-name">
                    <b>Growth Curve:</b> {growthCurveName}
                </div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={{
                        title: { text: `` },
                        plotOptions: {
                            line: {
                                crisp: false,
                                getExtremesFromAll: true,
                                marker: { enabled: false },
                            },
                        },
                        series: [
                            {
                                type: "line",
                                data: hpGrowth,
                                name: "HP",
                                yAxis: 0,
                                tooltip: {
                                    pointFormatter: function () {
                                        let { x, y } = this as any;
                                        return (
                                            `HP: <b>${formatNumber(y)}</b>` + (x > lvMax ? ` (grailed)` : "") + `<br/>`
                                        );
                                    },
                                },
                                zones: [
                                    {
                                        value: hpGrowth[lvMax],
                                    },
                                    { color: "#C70039" },
                                ],
                                pointStart: 1,
                            },
                            {
                                type: "line",
                                data: atkGrowth,
                                name: "ATK",
                                yAxis: 0,
                                tooltip: {
                                    pointFormatter: function () {
                                        let { x, y } = this as any;
                                        return (
                                            `ATK: <b>${formatNumber(y)}</b>` + (x > lvMax ? ` (grailed)` : "") + `<br/>`
                                        );
                                    },
                                },
                                zones: [
                                    {
                                        value: atkGrowth[lvMax],
                                    },
                                    { color: "#C70039" },
                                ],
                                pointStart: 1,
                            },
                        ],
                        credits: false,
                        chart: { zoomType: "x" },
                        xAxis: [
                            {
                                title: { text: "Level" },
                                crosshair: {
                                    dashStyle: "Dash",
                                },
                            },
                        ],
                        yAxis: [
                            {
                                title: { text: undefined },
                                min: 0,
                            },
                        ],
                        tooltip: {
                            shared: true,
                            useHTML: true,
                            headerFormat: '<span style="font-size: 12px">Level <b>{point.key}</b></span><br/>',
                        },
                    }}
                />
            </div>
        );
    }
}

export default ServantStatGrowth;
