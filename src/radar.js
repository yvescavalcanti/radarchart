function Radar(){
	var axes = null;
	var radio = 0;
	var center = null;
	var dados = null;	
	var margin = {left:20, top:20};
	var color = d3.schemeCategory10;
	var n_levels = 5;
	function main(selection){
		var levels = [];

		for(var i=1; i<n_levels; i++){
			var dist = radio/i;
			var aux = axes.keys().reduce(function(a,b){
				a[b] = dist;
				return a;
			},{});
			levels.push(aux);
			//console.log(aux);
		}
		selection.each(function(){
			
			var el = d3.select(this);
			var svg = d3.select('#chart').append('svg').attr('width',400)
			.attr('height',400);
			var back = svg.append('g').attr('transform', 'translate(20,20)');
			var g = svg.append('g').attr('transform','translate(20,20)');
			back.selectAll('.level').data(levels).enter()
				.append('polygon').attr('class','level')
				.attr('points', function(d){
						console.log(d);
						var points = axes.getNonScaledPoints(d);
						//console.log(points);
						return points.map(function(p){return [p.x, p.y].join(",");}).join(" ");
				});

			g.selectAll('.axes').data(axes, function(d){return d.id;}).enter().append('line')
			.attr('x1',center.x).attr('y1',center.y)
			.attr('x2',function(d){return d.apex.x;})
			.attr('y2',function(d){return d.apex.y;})
			.attr('fill','none').attr('stroke-width','1px').attr('stroke','blue');
			var enterData = g.selectAll('.entity').data(dados).enter();
			enterData.append('polygon').attr('fill',function(d,i){
					return color[i];
				}).attr('stroke','green').attr('class','entity')
				.attr("points", function(d){
						console.log(d);
						var points = axes.getPoints(d);
						return points.map(function(p){return [p.x, p.y].join(",");}).join(" ");
			});
			//enterData.append('circle').attr('fill','red').attr(	

		});
		
	}

	main.axes = function(_){
		return arguments.length ? (axes=_, main) : axes;
	};

	main.center = function(_){
		return arguments.length ? (center=_, main) : center;
	}

	main.data = function(_){
		return arguments.length ? (dados=_, main) : dados;
	};

	main.radio = function(_)
	{
		return arguments.length ? (radio=_, main) : radio;
	}

	return main;
}

