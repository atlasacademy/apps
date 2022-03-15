import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import React from "react";

import { CraftEssence, Region } from "@atlasacademy/api-connector";

import { formatNumber } from "../../Helper/OutputHelper";

interface IProps {
    region: Region;
    craftEssence: CraftEssence.CraftEssence;
}

class CraftEssenceStatGrowth extends React.Component<IProps> {
    render() {
        let { hpGrowth, lvMax, atkGrowth } = this.props.craftEssence;
        return (
            <div>
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

export default CraftEssenceStatGrowth;
