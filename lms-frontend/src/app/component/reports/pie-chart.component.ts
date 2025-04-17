import { Component, OnInit, ElementRef, Input, OnChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-pie-chart',
  template: '<svg width="300" height="300"></svg>',
})
export class PieChartComponent implements OnChanges {
  @Input() data: any[] = [];

  constructor(private el: ElementRef) {}

  ngOnChanges(): void {
    const svg = d3
      .select(this.el.nativeElement)
      .select('svg')
      .append('g')
      .attr('transform', 'translate(150,150)');

    const radius = 150;

    const color: d3.ScaleOrdinal<string, string> = d3
      .scaleOrdinal<string>()
      .domain(this.data.map((d) => d.label))
      .range(['#F59E0B', '#6366F1', '#EF4444']);

    const pie = d3.pie<any>().value((d) => d.value);

    const arc = d3
      .arc<any>()
      .innerRadius(0)
      .outerRadius(radius - 40);

    const arcs = svg.selectAll('arc').data(pie(this.data)).enter().append('g');

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d: d3.PieArcDatum<any>): string => {
        return color(String(d.data.label));
      });

    arcs
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .text((d) => d.data.label)
      .style('fill', '#fff')
      .style('font-size', '12px');
  }
}
