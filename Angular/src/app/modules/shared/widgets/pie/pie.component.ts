import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-widget-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {

  Highcharts = Highcharts;
  chartOptions: any = {};


  @Input() data = [];
  @ViewChild('pieChart', {static: true}) pieChart: any;

  constructor() { }

  ngOnInit() {
    this.chartOptions = this.getChartOption();
  }

  updateData(data: any[]) {
    this.data = data;
    this.chartOptions = this.getChartOption();
  }

  private getChartOption() {
    return {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Project Involvement'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      exporting: {
        enabled: false
      },
      credits: {
        enabled: false
      },
      series: [{
        name: 'Project Involvement',
        colorByPoint: true,
        data: this.data
      }]
    };
  }

}
