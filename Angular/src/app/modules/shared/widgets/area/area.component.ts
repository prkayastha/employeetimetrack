import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';


@Component({
  selector: 'app-widget-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  chartOptions: {};
  @Input() data: any = [];

  Highcharts = Highcharts;

  chart: Highcharts.Chart;

  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chart = chart;
  }

  constructor() { }

  ngOnInit() {
    this.chartOptions = this.getOptions();
  }

  updateData(data: any[]) {
    // this.data = data;
    // this.chart.series[0].remove(true);
    for (let i=0; i < data.length; i++) {
      this.chart.addSeries(data[i]);
    }
    this.chart.update({
        series: this.data
      });
  }

  private getOptions() {
    return {
      chart: {
        type: 'area'
      },
      title: {
        text: 'Weekly Spent Hours on Projects per day'
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        title: {
          text: 'Day'
        },
      },
      yAxis: {
        title: {
          text: 'Hours'
        },
      },
      tooltip: {
        split: true,
        valueSuffix: ' hours'
      },
      credits: {
        enabled: false
      },
      exporting: {
        enabled: false,
      },
      series: this.data
    };
  }

}
