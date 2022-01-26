import SmartView from './smart-view';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {POINT_TYPES} from '../utils/const';
import {ChartsOptions} from '../utils/stats';

const BAR_HEIGHT = 55;

const createStatsItemTemplate = (chartType) => (
  `<div class="statistics__item">
     <canvas class="statistics__chart" id="${chartType}" width="900"></canvas>
   </div>`
);

const createStatsTemplate = (chartTypes) => {
  const statItemsTemplate = chartTypes.map((type) => createStatsItemTemplate(type)).join('');

  return (
    `<section class="statistics">
       <h2 class="visually-hidden">Trip statistics</h2>
       ${statItemsTemplate}
     </section>`
  );
};

export default class StatisticsView extends SmartView {
  #chartTypes = ['money', 'type', 'time'];
  #charts = new Map();
  #chartLabels = null;

  constructor(points) {
    super();
    this._data = [...points];
    this.#chartLabels = POINT_TYPES.map((type) => type.toUpperCase());

    this.#setCharts();
  }

  get template() {
    return createStatsTemplate(this.#chartTypes);
  }

  #getChartsData = (points, chartType) => POINT_TYPES.map((type) => chartType(points, type));
  #setDataObject = (chartLabels, chartData) => chartLabels.map((label, index) => ({label, data: chartData[index]}));

  #setCharts = () => {
    this.#chartTypes.forEach((chartType) => {
      const sortedChartLabels = [];
      const sortedChartData = [];

      const chartCanvas = this.element.querySelector(`#${chartType}`);
      chartCanvas.height = BAR_HEIGHT * POINT_TYPES.length;

      const chartTypeUppercase = chartType.toUpperCase();
      const chartData = this.#getChartsData(this._data, ChartsOptions[chartTypeUppercase].setData);
      const chartDataObjects = this.#setDataObject(this.#chartLabels, chartData);

      chartDataObjects.sort((dataA, dataB) => dataB.data - dataA.data);

      chartDataObjects.forEach((object) => {
        sortedChartLabels.push(object.label);
        sortedChartData.push(object.data);
      });

      this.#charts.set(chartTypeUppercase, new Chart(chartCanvas, {
        plugins: [ChartDataLabels],
        type: 'horizontalBar',
        data: {
          labels: sortedChartLabels,
          datasets: [{
            data: sortedChartData,
            backgroundColor: '#ffffff',
            hoverBackgroundColor: '#ffffff',
            anchor: 'start',
            barThickness: 44,
            minBarLength: 50,
          }],
        },
        options: {
          responsive: false,
          plugins: {
            datalabels: {
              font: {
                size: 13,
              },
              color: '#000000',
              anchor: 'end',
              align: 'start',
              formatter: ChartsOptions[chartTypeUppercase].setFormatter,
            },
          },
          title: {
            display: true,
            text: chartTypeUppercase,
            fontColor: '#000000',
            fontSize: 23,
            position: 'left',
          },
          scales: {
            yAxes: [{
              ticks: {
                fontColor: '#000000',
                padding: 5,
                fontSize: 13,
              },
              gridLines: {
                display: false,
                drawBorder: false,
              },
            }],
            xAxes: [{
              ticks: {
                display: false,
                beginAtZero: true,
              },
              gridLines: {
                display: false,
                drawBorder: false,
              },
            }],
          },
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          },
        },
      }));
    });
  };
}
