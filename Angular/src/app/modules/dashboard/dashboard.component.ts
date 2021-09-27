import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ReportService } from 'src/app/_services/report.service';
import { UserDetails } from 'src/app/_models/userDetails';
import { map } from 'rxjs/operators';

export interface PeriodicElement {
  name: string;
  date: string;
}
/*const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'SpaceX', date: '22/09/2021' },
  { name: 'Alibaba', date: '20/09/2021' },
  { name: 'Cloud Security', date:'20/09/2021'},
  { name: 'Sprint3', date:'23/09/2021' }
]; */

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  data = [];
  dashboard = [];
  ELEMENT_DATA: PeriodicElement[] = [];

  bigChart = [];
  pieChart = [];

  displayedColumns: string[] = ['name', 'date'];
  //dataSource1 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource1 = new MatTableDataSource<PeriodicElement>([]);
  dataSource2 = new MatTableDataSource<PeriodicElement>([]);


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(private dashboardService: DashboardService, public report: ReportService, public user: UserDetails) { }

  ngOnInit() {
    this.bigChart = this.dashboardService.bigChart();
    this.pieChart = this.dashboardService.pieChart();

    this.dataSource1.paginator = this.paginator;
    this.dataSource2.paginator = this.paginator;

    this.report.dashboard(this.user.id).pipe(
      map(dashboard => {
        dashboard.timeForProject
        return dashboard

      })
    ).subscribe(dashboard => {
      const workingOnData = dashboard.workedOnProject.map(row => {
        return {
          name: row.projectName,
          date: row.lastWorkedAt
        }
      })
      this.dataSource1 = new MatTableDataSource<PeriodicElement>(workingOnData)

      const assignedProject = dashboard.assignedProjects.map(row => {
        return {
          name: row.projectName,
          date: row.assignedDate
        }
      })
      this.dataSource2 = new MatTableDataSource<PeriodicElement>(assignedProject)

      const projectInolvement = dashboard.projectInolvement.map(row => {
        return {
          name: row.projectName,
          time: row.timeForProject,
        }
      })

      const projectHrByDay = dashboard.projectHrByDay.map(row => {
        return {
          day: row.day,
          duration: row.duration
        }
      })
    });

  }

 

}
