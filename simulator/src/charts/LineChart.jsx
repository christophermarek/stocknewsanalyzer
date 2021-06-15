import React from 'react';
import { Line } from 'react-chartjs-2';

/*
const example_data = {
  labels: ['1', '2', '3', '4', '5', '6'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      fill: false,
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgba(255, 99, 132, 0.2)',
    },
  ],
};
*/
const example_options = {
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    duration: 0
  },
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

//https://stackoverflow.com/questions/53872165/cant-resize-react-chartjs-2-doughnut-chart
// to control chart sizes i passed this into the options, and can just control with css width

const LineChart = ({ data, options }) => (
  <>
    <Line data={data} options={example_options} />
  </>
);

export default LineChart;