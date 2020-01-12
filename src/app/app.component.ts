import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { D3Service } from './d3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('mapWrapper', {static: false}) mapWrapper: ElementRef<HTMLElement>;

  constructor(
    private d3: D3Service,
  ) {}

  ngAfterViewInit(): void {
    this.d3.draw();
  }
}
