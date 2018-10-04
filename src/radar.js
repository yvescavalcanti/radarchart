function Radar(){
	var axes = null;
	var radio = 0;
	var center = null;
	var dados = null;	
	var margin = {left:20, top:20};
	var color = d3.schemeCategory10;
	var n_levels = 5;
	var opacity = d3.scaleLinear().range([0.8,0.4]);
	var dataArea, back;
	var svg;
	function main(selection){
		var self = this;
		var levels = [];
		var step = radio/n_levels;
		var dist = radio;
		for(var i=1; i<=n_levels; i++){
			var aux = axes.keys().reduce(function(a,b){
				a[b] = dist;
				return a;
			},{});
			dist-=step;
			levels.push(aux);
		}


		selection.each(function(){
			
			var el = d3.select(this);
			if(svg === undefined)
			svg = el.append('svg').attr('width',400)
			.attr('height',400);
			if(back === undefined){
				back = svg.append('g').attr('transform', function(d){
					return "translate("+margin.left+","+margin.top+")";
				});

				back.selectAll('.level').data(levels).enter()
				.append('polygon').attr('class','level')
				.attr('points', function(d){
						//console.log(d);
						var points = axes.getNonScaledPoints(d);
						//console.log(points);
						return points.map(function(p){return [p.x, p.y].join(",");}).join(" ");
				});

				var gAxes = back.selectAll('.axes').data(axes, function(d){return d.id;})
				.enter();
				// adicionando legenda dos eixos
				gAxes.append("text").attr("class","axis-text")
				.text(function(d){return d.label;})
				.attr('x', function(d){return d.apex.x;}).attr('y',function(d){return d.apex.y;})
				.classed('anchor-end', function(d){
					//console.log(Math.round(d.apex.x));
					if(Math.round(d.apex.x) < radio)
						return true;
					else
						return false;
					
				})
				.classed('anchor-start', function(d){
					//console.log(Math.round(d.apex.x));
					if(Math.round(d.apex.x) > radio)
						return true;
					else
						return false;
					
				})
				.attr('dy',function(d){
					if(Math.round(d.apex.y)>radio)
						return 10;
				});

				gAxes.append('line')
				.attr('x1',center.x).attr('y1',center.y)
				.attr('x2',function(d){return d.apex.x;})
				.attr('y2',function(d){return d.apex.y;})
				.attr('fill','none').attr('class','axis')
				.on("mouseover",function(d){
					d3.select(this).classed("axis-hover", true);
				})
				.on("mouseout",function(){
					d3.select(this).classed("axis-hover", false);
				});
			}

			if(dataArea === undefined)
			dataArea = svg.append('g').attr('transform', function(d){
				return "translate("+margin.left+","+margin.top+")";
			});
			
		
			opacity = opacity.domain([0,dados.length]);
			var id = 0;
			var enterData = dataArea.selectAll('.entity')
			.data(dados, function(d){
				d.points = axes.getPoints(d);
				
				return d.id || (d.id = ++id);
			});
			
			
			var polygons = enterData.enter().append('polygon').attr('fill',function(d,i){
					return color[i];
				})
				.attr('class','entity')
				.attr('stroke',function(d,i){
					return color[i];
				})
				.attr('opacity',function(d,i){
					return opacity(i);
				})
				.attr('stroke-width',"1px")
				.attr("points", function(d){
					
					return d.points.map(function(p){return [p.x, p.y].join(",");}).join(" ");
			}).on("mouseenter",function(d){
				var el = d3.select(this).attr('stroke','black');
				var points = axes.getPoints(d);
				var polygon = points.map(function(el){return [el.x, el.y];});
				var center = d3.polygonCentroid(polygon);
				var area = Math.round(d3.polygonArea(polygon)*100)/100;
				
				dataArea.selectAll('.centerpoint').data([center]).enter().append('text')
				.attr('class','centerpoint')
				.attr('x',function(d){return d[0];})
				.attr('y',function(d){return d[1];}).text(area)
				.style('text-anchor','middle');
				dataArea.selectAll('.points').data(points).enter().append('text')
				.attr('class','points')
				.attr('x',function(d){return d.x;})
				.attr('y',function(d){return d.y;})
				.classed('anchor-end', function(d){
					//console.log(Math.round(d.apex.x));
					if(Math.round(d.x) < radio)
						return true;
					else
						return false;
					
				})
				.classed('anchor-start', function(d){
					//console.log(Math.round(d.apex.x));
					if(Math.round(d.x) > radio)
						return true;
					else
						return false;
					
				})
				.text(function(d){return d.value;});
			})
			.on("mouseout",function(d,i){
				d3.select(this).attr('stroke',color[i]);
				dataArea.selectAll('.points').remove();
				dataArea.selectAll('.centerpoint').remove();
			});
			polygons.merge(enterData).transition().duration(2000)
			.attr('points',
				function(d){
					//var points = axes.getNonScaledPoints(d);
					//console.log(points);
					return d.points.map(function(p){return [p.x, p.y].join(",");}).join(" ");
				});

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

	main.margin = function(_)
	{
		return arguments.length ? (margin=_, main) : margin;
	}

	main.pushEntity = function(e){
		dados.push(e);
		this.teste();
		return main;
	}

	main.teste = function(){
		console.log("teste");
		return main;
	}

	return main;
}

