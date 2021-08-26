import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';

export interface PeriodicElement {
  name: string;
  date: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Project 1', date: '24/12/2012' },
  { name: 'Project 2', date: '14/10/2016' },
  { name: 'Project 3', date:'11/12/2021'},
  { name: 'Project 4', date:'14/06/2022' }
];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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
