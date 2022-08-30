import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactApexChart from 'react-apexcharts'
const ApexCharts = window.ApexCharts;

ReactDOM.render(<App />, document.getElementById("root"));

let data = document.querySelector("#pie-chart-data").innerHTML;
data = data.split(' ');
data = data.map(Number);

let lcdata1 = document.querySelector("#line-chart-data-1").innerHTML;
lcdata1 = lcdata1.split(' ');
lcdata1 = lcdata1.map(Number);

let lcdata2 = document.querySelector("#line-chart-data-2").innerHTML;
lcdata2 = lcdata2.split(' ');
lcdata2 = lcdata2.map(Number);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

class PieChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            series: data,
            options: {
                chart: {
                    type: 'polarArea',
                    fontFamily: 'Helvetica, Arial, sans-serif'
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (value) {
                        return (Math.round(value * 100) / 100) + "%";
                    }
                },
                labels: ["Motor Vehicles", "Office Waste", "Human Waste", "Computing Power", "Air Travel", "Employee"],
                stroke: {
                    colors: ['#fff']
                },
                legend: {
                    show: true,
                    position: 'top',
                    horizontalAlign: 'center',
                    fontSize: '12px',
                    fontFamily: 'Helvetica, Arial, sans-serif'
                },
                fill: {
                    opacity: 0.75
                }
            }
        };
    }

      
    componentDidMount() {
      window.setInterval(() => {

        data = document.querySelector("#pie-chart-data").innerHTML;
        data = data.split(' ');
        data = data.map(Number);
        
        this.setState({
            series: data
        });
      }, 1000);
    }

    render() {
        return (<div id="chart">
            <ReactApexChart options={this.state.options} series={this.state.series} type="polarArea" />
        </div>);
    }
}

const domContainerPie = document.querySelector("#pie-chart");
ReactDOM.render(React.createElement(PieChart), domContainerPie);

class AreaChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: 'Estimated Trajectory (tons CO2/yr)',
                data: lcdata1
            }, {
                name: 'Potential Reduction (tons CO2/yr)',
                data: lcdata2
            }],
            options: {
                chart: {
                    height: 150,
                    type: 'area',
                    fontFamily: 'Helvetica, Arial, sans-serif'
                },
                // yaxis no decimals
                yaxis: {
                    decimalsInFloat: 0
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                xaxis: {
                    type: 'datetime',
                    categories: [
                        "2022-01-01T00:00:00.000Z",
                        "2023-01-01T00:00:00.000Z",
                        "2024-01-01T00:00:00.000Z",
                        "2025-01-01T00:00:00.000Z",
                        "2026-01-01T00:00:00.000Z",
                        "2027-01-01T00:00:00.000Z",
                        "2028-01-01T00:00:00.000Z"]
                },
                tooltip: {
                    x: {
                        format: 'Year 20yy'
                    },
                },
            },


        };
    }

      
    componentDidMount() {
      window.setInterval(() => {

        lcdata1 = document.querySelector("#line-chart-data-1").innerHTML;
        lcdata1 = lcdata1.split(' ');
        lcdata1 = lcdata1.map(Number);
        
        lcdata2 = document.querySelector("#line-chart-data-2").innerHTML;
        lcdata2 = lcdata2.split(' ');
        lcdata2 = lcdata2.map(Number);
        
        this.setState({
            series: [{
                name: 'Estimated Trajectory (tons CO2/yr)',
                data: lcdata1
            }, {
                name: 'Potential Reduction (tons CO2/yr)',
                data: lcdata2
            }]
        });
      }, 1000);
    }
    
    render() {
        return (<div id="chartline">
            <ReactApexChart options={this.state.options} series={this.state.series} type="area" height={350} />
        </div>);
    }
}

const domContainerArea = document.querySelector("#area-chart");
ReactDOM.render(React.createElement(AreaChart), domContainerArea);
