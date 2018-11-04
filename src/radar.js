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
	var svg, duration = 3500;
	var size = 400;
	// define se a área do radar deve ser preenchida
	var fill = false;
	// armazena área total
	var totalArea = -1;
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
			svg = el.append('svg').attr('width',size)
			.attr('height',size);
			var defs = svg.append("defs");

			//Code taken from http://stackoverflow.com/questions/9630008/how-can-i-create-a-glow-around-a-rectangle-with-svg
			//Filter for the outside glow
			var filter = defs.append("filter")
				.attr("id","glow");
		
			filter.append("feGaussianBlur")
				.attr("class", "blur")
				.attr("stdDeviation","4.5")
				.attr("result","coloredBlur");
		
			var feMerge = filter.append("feMerge");
			feMerge.append("feMergeNode")
				.attr("in","coloredBlur");
			feMerge.append("feMergeNode")
				.attr("in","SourceGraphic");

			if(back === undefined){
				back = svg.append('g').attr('transform', function(d){
					return "translate("+margin.left+","+margin.top+")";
				});

				back.selectAll('.level').data(levels).enter()
				.append('polygon')
				.attr('class',function(d,i){
					// marcando a maior área do gráfico a fim de calcular área total
					if(i == 0) return 'level base-level';
					return 'level';
				})
				.attr('points', function(d){
						//console.log(d);
						var points = axes.getNonScaledPoints(d);
						return points.map(function(p){return [p.x, p.y].join(",");}).join(" ");
				});
				
				var gAxes = back.selectAll('.axes').data(axes, function(d){return d.id;})
				.enter();
				// adicionando legenda dos eixos
				gAxes.append("text").attr("class","axis-text")
				.text(function(d){return d.label;})
				.attr('x', function(d){
					return d.apex.x<center.x ? d.apex.x - d.label.length : d.apex.x + d.label.length;
				}).attr('y',function(d){
					if ( d.apex.y < center.y ) return d.apex.y - 20;
					return d.apex.y;
				})
				.classed('anchor-end', function(d){
	
					if(Math.round(d.apex.x) < center.x)
						return true;
					else
						return false;
					
				})
				.classed('anchor-start', function(d){
					//console.log(Math.round(d.apex.x));
					if(Math.round(d.apex.x) > center.x)
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
					return 'none';//color[i];
				})
				.attr('class','entity')
				.attr('stroke',function(d,i){
					return color[i];
				})
				.attr('fill-opacity',function(d,i){
					if(fill)
					return opacity(i);
					else return 0;
				})
				.attr('stroke-width',"4px")
				.attr("points", function(d){
					
					return d.points.map(function(p){return [p.x, p.y].join(",");}).join(" ");
			}).on("mouseenter",function(d){
				var hover = this;
				svg.selectAll('.entity').transition(duration).style('opacity', function(){
				
					return hover === this ? 1 : 0;
				});
				//var el = d3.select(this).attr('stroke','black');
				var points = axes.getPoints(d);
				var polygon = points.map(function(el){return [el.x, el.y];});
				var center = d3.polygonCentroid(polygon);
				var area = Math.round(d3.polygonArea(polygon)*100)/100;
				totalArea = totalArea === -1 ? calcArea(d3.select('.base-level')) : totalArea;
				dataArea.selectAll('.centerpoint').data([center]).enter()
				.append('text')
				.attr('class','centerpoint')
				.attr('x',function(d){return d[0];})
				.attr('y',function(d){return d[1];}).text(porcentagem(area, totalArea)+"%")
				.style('text-anchor','middle');
				var dta = dataArea.selectAll('.points').data(points).enter();
				
				svg.selectAll('.axis-text').transition(duration).style('opacity',0.5);
				dta.append('text')
				.attr('class','points')
				.attr('x',function(d){ return d.x < main.center().x ? d.x-20 : d.x + 20;})
				.attr('y',function(d){return d.y < main.center().y ? d.y-20 : d.y + 20;})
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
				.text(function(d){return d.value;}).style('filter','url(#glow)');
			})
			.on("mouseout",function(d,i){
				var hover = this;
				svg.selectAll('.entity').transition(duration).style('opacity', 1);
				d3.select(this).attr('stroke',color[i]);
				dataArea.selectAll('.points').remove();
				dataArea.selectAll('.centerpoint').remove();
				svg.selectAll('.axis-text').transition(duration).style('opacity',1);
				
			});
			polygons.merge(enterData).transition().duration(2000)
			.attr('points',
				function(d){
					return d.points.map(function(p){return [p.x, p.y].join(",");}).join(" ");
				});

		});
		
	}



	main.axes = function(_){
		if(arguments.length){
			axes = _.axes;
			center = _.center;
			radio = _.radio;
			return main;
		}else return axes;
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

	main.size = function(_){
		return arguments.length ? ( size=_, main ) : size;
		return main;
	}
	// default = false
	main.fill = function(_){
		return arguments.length ? (fill=_, main) : margin;
	}

	return main;
}

function calcArea(d){
	var a =  d3.polygonArea(d.attr('points').split(' ').map(function(el){return el.split(',').map(Number)}));
	return (Math.round(a*100))/100;
}

function porcentagem(a,b){
	return Math.round((a/b) * 100);
}