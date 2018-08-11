function radians(angle){
	return angle * (Math.PI / 180);
}

function _x(radio){
	return function(dist, angle){
		return radio + (Math.cos(radians(angle)*dist));
	};	
}

function _y(radio){
	return function(dist, angle){
		return radio - (Math.sin(radians(angle)*dist));	
	};	
}

function radialAxes(){
	var keys = [];
	var radio = 0;
	var step = 0;
	var x,y;

	function main(data){

		step = 360 / keys.length;

		var aux = 90;
		
		data.forEach(function(d){
			console.log(aux);	
			aux+=step;
		});
	}

	main.keys = function(_){
		return (arguments.length) ? (keys = _, main) : keys;
	};

	main.radio = function(_){
		if (arguments.length){
			radio = _;
			x = _x(radio);
			y = _y(radio);
			return main;
		}
		else return radio;
	};

	return main;
}
