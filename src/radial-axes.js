

function polarToCartesian(radio, angle, scale){
	var _x = Math.cos(radians(angle)); 
	var _y = Math.sin(radians(angle));
	//console.log("_x:"+_x);
	//console.log("_y:"+_y);
	var f = function(val){
		return { 
			x: radio + scale(val)*_x, 
			y: radio - scale(val)*_y 
		}; 
	};
	return f;
}

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


function getAxesMax(key,data)
{
	return d3.max(
		data.map(
			function(d)
			{
				return d[key];
			}
		)
	);
}
function getAxesMin(key,data)
{
	return d3.min(
		data.map(
			function(d)
			{
				return d[key];
			}
		)
	);
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
		console.log(data);
		// start angle for the first axes in degrees
		var aux = 90;
		var axes = [];
		keys.forEach(function(k,i){
			var scale = d3.scaleLinear().range([0,radio])
				.domain([0 ,getAxesMax(k,data)]);
			axes.push({
				// id para identificação
				id:i,
				key:k,
				// ângulo do eixo
				angle: aux,
				// localização do extremo do eixo
				apex:{
					x:x(radio, aux),
					y:y(radio, aux)
				},
				// função para posicionar pontos ao longo do eixo
				getPoint:function(d)
					{
						console.log("aux:"+aux);
						return (polarToCartesian(radio,this.angle,scale))(d[k]);
					}
			});
			// calcula ângulo do próximo eixo
			aux+=step;
			
		});

		axes.apex = function(){
			return this.map(function(a){
				return a.apex;	
			});	
		};
		
		axes.getPoints = function(d){
		var p = [];
		axes.forEach(function(a){
			p.push(
				a.getPoint(d)
			);
		});
		return p;
		
	}
	
	
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
