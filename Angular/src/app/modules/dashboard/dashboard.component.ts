import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ReportService } from 'src/app/_services/report.service';
import { UserDetails } from 'src/app/_models/userDetails';
import { map } from 'rxjs/operators';
import { Project } from '../../_models/project';
import { PieComponent } from '../shared/widgets/pie/pie.component';
import { BehaviorSubject } from 'rxjs';

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
  pieChartData = [];

  displayedColumns: string[] = ['name', 'date'];
  //dataSource1 = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  dataSource1 = new MatTableDataSource<PeriodicElement>([]);
  dataSource2 = new MatTableDataSource<PeriodicElement>([]);


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('pieChart', {static: true}) pieChartComp: PieComponent;

  constructor(private dashboardService: DashboardService, public report: ReportService, public user: UserDetails) { }

  ngOnInit() {
    this.bigChart = this.dashboardService.bigChart();
    // this.pieChartData = this.dashboardService.pieChart();

    this.dataSource1.paginator = this.paginator;
    this.dataSource2.paginator = this.paginator;

    this.report.dashboard(this.user.id).pipe(
      map(dashboard => {
        /*
        {
          totalTime: 7200
          collection: [
            { id: 1, projectName: 'Web App', percentage: 56 }
          ]
        }
        */
        dashboard.projectInvovlement = this.mapForPieChart(dashboard.projectInvovlement);

        dashboard.projectHrByDay = this.mapForLineChart(dashboard.projectHrByDay);
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
      this.dataSource2 = new MatTableDataSource<PeriodicElement>(assignedProject);

      // this.pieChart.next(this.dashboardService.pieChart());

      this.pieChartData = dashboard.projectInvovlement;
      this.pieChartComp.updateData(this.pieChartData);

      /* const projectInolvement = dashboard.projectInolvement.map(row => {
        return {
          name: row.projectName,
          time: row.timeForProject,
        }
      }) */

      /*const projectHrByDay = dashboard.projectHrByDay.map(row => {
        return {
          day: row.day,
          duration: row.duration
        }
      }) */
    });
  }
  mapForLineChart(projectHrByDay: any): any {
    projectHrByDay.forEach(project => {
      for (let i = 1; i <= 7; i++) {
        let row = project.durationByDay.find(day => day.day == i);
        if (!row) {
          row = { day: i, duration: '00:00:00' }
          project.durationByDay.push({ day: i, duration: '00:00:00', timeInSec: 0 });
        } else {
          row['timeInSec'] = this.timeToSec(row.duration);
        }
      }

    });

    return projectHrByDay;
  }

  private timeToSec(time: string): number {
    const splitted = time.split(':');
    return (+splitted[0]) * 3600 + (+splitted[1]) * 60 + (+splitted[2]);
  }

  private mapForPieChart(list) {
    let total = 0;
    let mapped = list.map(project => {
      project['inSeconds'] = this.timeToSec(project.timeForProject);
      total = total + project['inSeconds'];
      return project;
    })

    mapped = mapped.map(project => {
      project['percent'] = Math.round(project['inSeconds'] / total * 100);
      return { id: project.projectId, projectName: project.projectName, percentage: project.percent };
    });
    return mapped.map(project => ({name: project.projectName, y: project.percentage}));;
  }

}
