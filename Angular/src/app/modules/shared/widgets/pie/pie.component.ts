import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import { SharedDataService } from '../../../../_services/shared-data.service';

@Component({
  selector: 'app-widget-pie',
  templateUrl: './pie.component.html',
  styleUrls: ['./pie.component.scss']
})
export class PieComponent implements OnInit {
  chartId: string = 'pieChart';
  Highcharts = Highcharts;
  chartOptions: any = {};
  chart: Highcharts.Chart;
  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chart = chart;
  }


  @Input() data = [];
  @ViewChild('pieChart', {static: true}) pieChart: any;

  constructor(private sharedData: SharedDataService) { 
    const observable = this.sharedData.addObs(this.chartId);
    observable.subscribe((isCollapse) => {
      setTimeout(() => {
        const width = isCollapse ? 540 : 430;
        this.chart.setSize(width, 400)
        this.chart.redraw();
      }, 100)
    });
  }

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
