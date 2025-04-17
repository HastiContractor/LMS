import { Component, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-chart',
  template: '<svg width="500" height="300"></svg>',
})
export class LineChartComponent implements OnChanges {
  @Input() data: any[] = [];

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    const svg = d3.select(this.el.nativeElement).select('svg');
    svg.selectAll('*').remove();

    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const margin = { top: 20, right: 30, bottom: 30, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const x = d3
      .scalePoint()
      .domain(this.data.map((d) => d.label))
      .range([0, chartWidth])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(this.data, (d) => d.value)!])
      .range([chartHeight, 0]);

    const line = d3
      .line<any>()
      .x((d) => x(d.label)!)
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    //X Axis

    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x));

    //Y Axis
    g.append('g').call(d3.axisLeft(y));

    //Line Path
    g.append('path')
      .datum(this.data)
      .attr('fill', 'none')
      .attr('stroke', '#10B981')
      .attr('stroke-width', 2)
      .attr('d', line);

    //Dots
    g.selectAll('.dot')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.label)!)
      .attr('cy', (d) => y(d.value))
      .attr('r', 4)
      .attr('fill', '#10B981');
  }
}
