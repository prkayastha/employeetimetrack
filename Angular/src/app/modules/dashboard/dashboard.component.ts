import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';

export interface PeriodicElement {
  name: string;
  date: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'SpaceX', date: '22/09/2021' },
  { name: 'Alibaba', date: '20/09/2021' },
  { name: 'Cloud Security', date:'20/09/2021'},
  { name: 'Sprint3', date:'23/09/2021' }
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data=[];

  bigChart = [];
  pieChart = [];

  displayedColumns: string[] = ['name', 'date'];
  dataSource1 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);



  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.bigChart = this.dashboardService.bigChart();
    this.pieChart = this.dashboardService.pieChart();

    this.dataSource1.paginator = this.paginator;

  }

}
