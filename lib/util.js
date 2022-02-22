/* converte graus em radianos */
let radians = angle => angle * (Math.PI / 180);

let polarToCartesian = (radio, angle, scale = null) => {
	var _x = Math.cos(radians(angle));
	var _y = Math.sin(radians(angle));
	var f = function (val) {
		return {
			x: radio + scale(val) * _x,
			y: radio - scale(val) * _y
		};
	};
	var g = function (val) {
		return {
			x: radio + val * _x,
			y: radio - val * _y
		};
	};

	return scale === null ? g : f;
};

module.exports = {
	radians: radians,
	polarToCartesian: polarToCartesian
};