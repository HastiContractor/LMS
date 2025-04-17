import { Component, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  template: '<svg width="400" height="300"></svg>',
})
export class BarChartComponent implements OnChanges {
  @Input() data: any[] = [];

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    const svg = d3.select(this.el.nativeElement).select('svg');
    const width = +svg.attr('width');
    const height = +svg.attr('height');

    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(this.data.map((d) => d.label))
      .range([0, chartWidth])
      .padding(0.2);

    const y = d3.scaleLinear().domain([0, 30]).range([chartHeight, 0]);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    g.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x));

    g.append('g').call(d3.axisLeft(y));

    g.selectAll('.bar')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.label)!)
      .attr('y', (d) => y(d.value))
      .attr('width', x.bandwidth())
      .attr('height', (d) => chartHeight - y(d.value))
      .attr('fill', '#60A5FA');
  }
}
