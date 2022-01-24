import SmartView from './smart-view';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {POINT_TYPES} from '../utils/const';
import {pointsCostByType, pointsDurationByType, pointsQuantityByType} from '../utils/stats';
import {getPointDurationByMinutes} from '../utils/duration';

const renderMoneyChart = (moneyCtx, points) => {
  const pointsMoneySum = POINT_TYPES.map((type) => pointsCostByType(points, type));
  const sortedPointsMoneySum = pointsMoneySum.sort(({moneySum: moneyA}, {moneySum: moneyB}) => moneyB - moneyA);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedPointsMoneySum.map(({pointType}) => pointType),
      datasets: [{
        data: sortedPointsMoneySum.map(({moneySum}) => moneySum),
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
          formatter: (val) => `€ ${val}`
        },
      },
      title: {
        display: true,
        text: 'MONEY',
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
  });
};

const renderTypeChart = (typeCtx, points) => {
  const pointsQuantity = POINT_TYPES.map((type) => pointsQuantityByType(points, type));
  const sortedTypeQuantity = pointsQuantity.sort(({typeQuantity: typeQuantityA}, {typeQuantity: typeQuantityB}) => typeQuantityB - typeQuantityA);

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedTypeQuantity.map(({pointType}) => pointType),
      datasets: [{
        data: sortedTypeQuantity.map(({typeQuantity}) => typeQuantity),
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
          formatter: (val) => `${val}x`
        },
      },
      title: {
        display: true,
        text: 'TYPE',
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
  });
};

const renderTimeChart = (timeCtx, points) => {
  const pointsDuration = POINT_TYPES.map((type) => pointsDurationByType(points, type));
  const sortedPointsDuration = pointsDuration.sort(({pointDuration: durationA}, {pointDuration: durationB}) => durationB - durationA);

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: sortedPointsDuration.map(({pointType}) => pointType),
      datasets: [{
        data: sortedPointsDuration.map(({pointDuration}) => pointDuration),
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
          formatter: (val) => `${getPointDurationByMinutes(val)}`
        },
      },
      title: {
        display: true,
        text: 'TIME',
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
  });
};

const createStatsTemplate = () => (
  `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>
        <div class="statistics__item">
          <canvas class="statistics__chart" id="money" width="900"></canvas>
        </div>
        <div class="statistics__item">
          <canvas class="statistics__chart" id="type" width="900"></canvas>
        </div>
        <div class="statistics__item">
          <canvas class="statistics__chart" id="time" width="900"></canvas>
        </div>
    </section>`
);

export default class StatisticsView extends SmartView {
  #moneyChart = null;
  #typeChart = null;
  #timeChart = null;

  constructor(points) {
    super();
    this._data = [...points];

    this.#setCharts();
  }

  get template() {
    return createStatsTemplate(this._data);
  }

  #setCharts = () => {
    const BAR_HEIGHT = 55;

    const moneyCtx = this.element.querySelector('#money');
    const typeCtx = this.element.querySelector('#type');
    const timeCtx = this.element.querySelector('#time');

    const chartHeight = BAR_HEIGHT * POINT_TYPES.length;

    moneyCtx.height = chartHeight;
    typeCtx.height = chartHeight;
    timeCtx.height = chartHeight;

    this.#moneyChart = renderMoneyChart(moneyCtx, this._data);
    this.#typeChart = renderTypeChart(typeCtx, this._data);
    this.#timeChart = renderTimeChart(timeCtx, this._data);
  };
}
