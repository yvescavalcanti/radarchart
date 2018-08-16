function Radar(){
	var axes = null;
	var center = null;
	function main(selection){

		selection.each(function(){
			var el = d3.select(this);
			var svg = d3.select('#chart').append('svg').attr('width',400)
			.attr('height',400);

			var g = svg.append('g');

			g.selectAll('.axes').data(axes, function(d){return d.id;}).enter().append('line')
			.attr('x1',center.x).attr('y1',center.y)
			.attr('x2',function(d){return d.apex.x;})
			.attr('y2',function(d){return d.apex.y;})
			.attr('fill','none').attr('stroke-width','1px').attr('stroke','blue');

		});
		
	}

	main.axes = function(_){
		return arguments.length ? (axes=_, main) : axes;
	};

	main.center = function(_){
		return arguments.length ? (center=_, main) : center;
	}

	return main;
}

