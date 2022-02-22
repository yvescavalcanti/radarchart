import {selectAll} from 'd3';
import { getAxes } from './src/util';
import { Chart } from './src/chart';

export var chart = Chart;
// let dados = [{
//     nome: 'sample_one', forca:10, velocidade:100, peso:200
// },
// {
//     nome: 'sample_two', forca:-100, velocidade:200, peso:50
// },
// {
//     nome: 'sample_three', forca:100, velocidade:10, peso:85
// }    ]

// let props = ['forca', 'velocidade'];

// let axes = getAxes(dados, props);
// console.log(axes);
// console.log(axes[0].applyScale(0));
// const square = selectAll("rect");
// square.style("fill", "orange");

// let g_one = new Chart("#g_one", 400, 400);
// let g_two = new Chart("#g_two", 200, 400);

// setTimeout(() => {
//     g_one.addPoint(35,76);
//     selectAll('svg').dispatch('change-color')
// }, 5000);