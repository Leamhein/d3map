import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as d3 from 'd3';
import { combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class D3Service {

  private svgSelectrion;
  private projection;
  private data$;

  constructor(
    private http: HttpClient,
  ) {
    this.data$ = this.getData();
  }

  private getData() {
    const mapUrl = 'http://enjalot.github.io/wwsd/data/world/world-110m.geojson';
    const dataUrl = 'http://enjalot.github.io/wwsd/data/world/ne_50m_populated_places_simple.geojson';

    return combineLatest([
      this.http.get(mapUrl),
      this.http.get(dataUrl)
    ])
      .pipe(
        tap(data => console.log(data)),
      );
  }

  public draw(): void {
    this.data$.subscribe(data => {
      this.drawMap(data[0]);
      this.drawCharts(data[1]);
    });
  }

  private drawMap(mapData): void {
    this.svgSelectrion = d3.select('svg.map');
    this.projection = d3.geoEqualEarth().rotate([90, 0, 0]);
    const path = d3.geoPath().projection(this.projection);

    this.svgSelectrion.append('path')
      .attr('d', path(mapData))
      .attr('fill', 'lightgray')
      .attr('stroke', 'gray');
  }

  private drawCharts(chartData) {
    const tooltip = d3.select('.wrapper')
      .append('div')
      .style('opacity', 0)
      .attr('class', 'tooltip')
      .style('background-color', 'white')
      .style('border', 'solid')
      .style('border-width', '2px')
      .style('border-radius', '5px')
      .style('padding', '5px')
      .style('position', 'absolute');

    this.svgSelectrion.selectAll('circle')
      .data(chartData.features)
      .enter()
      .append('circle')
      .attr('r', (d: any) => {
        return d.properties.pop_max / 1000000;
      })
      .attr('cx', (d: any) => {
        return this.projection(d.geometry.coordinates)[0];
      })
      .attr('cy', (d: any) => {
        return this.projection(d.geometry.coordinates)[1];
      })
      .attr('fill', 'darkgreen')
      .attr('opacity', 0.5)
      .on('mouseover', function() {
        tooltip
          .style('opacity', 1);
        d3.select(this)
          .style('stroke', 'white')
          .transition()
          .duration(550)
          .style('stroke-opacity', 0.8)
          .style('opacity', 0.7)
          .style('stroke-linecap', 'round')
          .style('stroke', 'black');
      })
      .on('mousemove', function(d) {
        const city = d.properties.name;
        const country = d.properties.sov0name;
        tooltip
        .html(`${country}, ${city}`)
        .style('left', (d3.mouse(this)[0] + 30) + 'px')
        .style('top', (d3.mouse(this)[1]) + 'px');
      })
      .on('mouseout', function() {
        tooltip
          .style('opacity', 0);
        d3.select(this)
          .transition()
          .duration(300)
          .style('stroke-opacity', 0.9)
          .style('opacity', 0.8)
          .style('stroke-linecap', 'round')
          .style('stroke', '#fff');
      });
  }
}
