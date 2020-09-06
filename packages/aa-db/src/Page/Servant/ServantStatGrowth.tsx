import {Region, Servant} from "@atlasacademy/api-connector";
import React from "react";
import {formatNumber} from "../../Helper/OutputHelper";
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';

interface IProps {
    region: Region;
    servant: Servant.Servant;
}

class ServantStatGrowth extends React.Component<IProps> {
    render() {
        let { hpGrowth, lvMax, atkGrowth } = this.props.servant;
        // pad to make for the zero point
        hpGrowth = [0, ...hpGrowth];
        atkGrowth = [0, ...atkGrowth];
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
                            }
                        },
                        series: [{
                            type: 'line',
                            data: hpGrowth,
                            name: 'HP',
                            yAxis: 0,
                            tooltip: {
                                headerFormat: '<span style="font-size: 12px">Level <b>{point.key}</b></span><br/>',
                                pointFormatter: function () {
                                    let { x, y } = (this as any);
                                    return `HP : <b>${formatNumber(y)}</b>` + (x > lvMax ? ` (grailed)` : '') + `<br/>`
                                }
                            },
                            zones: [
                                {
                                    value: hpGrowth[lvMax + 1]
                                },
                                { color: '#C70039' }
                            ]
                        }, {
                            type: 'line',
                            data: atkGrowth,
                            name: 'ATK',
                            yAxis: 1,
                            tooltip: {
                                headerFormat: '<span style="font-size: 12px">Level <b>{point.key}</b></span><br/>',
                                pointFormatter: function () {
                                    let { x, y } = (this as any);
                                    return `ATK : <b>${formatNumber(y)}</b>` + (x > lvMax ? ` (grailed)` : '') + `<br/>`
                                }
                            },
                            zones: [
                                {
                                    value: atkGrowth[lvMax + 1]
                                },
                                { color: '#C70039' }
                            ]
                        }],
                        credits: false,
                        chart: { zoomType: 'xy' },
                        xAxis: [{
                            min: 1,
                            title: { text: 'Level' }
                        }],
                        yAxis: [{
                            title: { text: 'HP' },
                            max: Math.max(...hpGrowth),
                            min: Math.min(...hpGrowth)
                        }, {
                            title: { text: 'ATK' },
                            max: Math.max(...atkGrowth),
                            min: Math.min(...atkGrowth),
                        }],
                        tooltip: {
                            useHTML: true
                        }
                    }}
                    />
            </div>
        )
    }
}

export default ServantStatGrowth;
