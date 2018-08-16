/* converte graus em radianos */
function radians(angle){
	return angle * (Math.PI / 180);
}

function _x(radio){
	return function(dist, angle){
		return radio + ((Math.cos(radians(angle))*dist));
	};	
}

function _y(radio){
	return function(dist, angle){
		return radio - ((Math.sin(radians(angle))*dist));	
	};	
}

/* Função que retorna função geradora de eixos radiais */
function radialAxes(){
	var keys = [];
	var radio = 0;
	var step = 0;
	var x,y;
	var axes = [];

	function main(data){
		// defining angle between axes
		step = 360 / keys.length;
		// start angle for the first axes in degrees
		var aux = 90;
	
		var axes = [];
		keys.forEach(function(k,i){
			axes.push({
				id:i,
				angle: aux,
				apex:{
					x:x(radio, aux),
					y:y(radio, aux)
				}
			});

			aux+=step;
			
		});

		axes.apex = function(){
			return this.map(function(a){
				return a.apex;	
			});	
		};

		return axes;
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

	main.axes = function(){
			
	};

	return main;
}
