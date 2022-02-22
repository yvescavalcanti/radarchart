import { index, max, min, rollup } from 'd3-array';
import { scaleLinear } from 'd3-scale';
/* converte graus em radianos */
let radians = (angle) => angle * (Math.PI / 180);

let polarToCartesian = (radio, angle, scale = null)=>{
	var _x = Math.cos(radians(angle)); 
	var _y = Math.sin(radians(angle));
	var f = function(val){
		return { 
			x: radio + scale(val)*_x, 
			y: radio - scale(val)*_y 
		}; 
	};
	var g = function(val){
		return { 
			x: radio + val*_x, 
			y: radio - val*_y 
		}; 
	};

	return scale === null ? g : f;
}

function analyseData(dados, properties){
    let saida = new Map();
    return properties.map(prop => {
        var d = dados.map(el => el[prop]);
        // return saida.set(prop, {
        //     max: max(d), min: min(d)
        // });
        return new Axe(prop, max(d), min(d), 400);
    });
    //return saida;
}

class Axe{
    constructor(id, max, min, radius){
        this.id = id;
        this.max = max;
        this.min = min;
        this.radius = radius;
        this.scale = scaleLinear().range([0,radius])
        .domain([min ,max]);
    }

    applyScale = (value) => this.scale(value);

}

export let getAxes = (dados, props) => {
    return analyseData(dados, props);
}
// module.exports = {
//     getAxes: _getAxes,
//     radians: radians,
//     polarToCartesian: polarToCartesian
// }