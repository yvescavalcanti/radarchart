import { select } from 'd3';
export class Chart{
    
    constructor(id, height, width){
        this.id = id;
        this.height = height;
        this.width = width;
        this.svg = select(this.id).append('svg').attr('height', height)
            .attr('width',width).on('change-color', this.updateColor);
        this.svg.append('g').append('circle').attr('r', 5)
        .attr('cx', 15).attr('cy', 15);
    }

    addPoint(x,y){
        this.svg.select('g')
        .append('circle').attr('r', 5)
        .attr('cx', x).attr('cy', y);
    }

    updateColor(){
        if(this.svg !== undefined)
        this.svg.selectAll('circle').attr('fill', 'orange');
    }
}

