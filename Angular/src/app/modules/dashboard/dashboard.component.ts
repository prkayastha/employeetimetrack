import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { map } from 'rxjs/operators';
import { UserDetails } from 'src/app/_models/userDetails';
import { ReportService } from 'src/app/_services/report.service';
import { AreaComponent } from '../shared/widgets/area/area.component';
import { PieComponent } from '../shared/widgets/pie/pie.component';
import { PdfreportComponent } from '../user/pages/view-user/report/pdfreport/pdfreport.component';

export interface PeriodicElement {
  name: string;
  date: string;
}

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
  dataSource1 = new MatTableDataSource<PeriodicElement>([]);
  dataSource2 = new MatTableDataSource<PeriodicElement>([]);


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('pieChart', {static: true}) pieChartComp: PieComponent;
  @ViewChild('areaChart', {static: true}) areaChart: AreaComponent;

  constructor(public report: ReportService, public user: UserDetails, public dialog: MatDialog) { }

  ngOnInit() {
    // this.bigChart = this.dashboardService.bigChart();
    // this.pieChartData = this.dashboardService.pieChart();

    this.dataSource1.paginator = this.paginator;
    this.dataSource2.paginator = this.paginator;

    this.report.dashboard(this.user.id).pipe(
      map(dashboard => {
        dashboard.projectInvovlement = this.mapForPieChart(dashboard.projectInvovlement);

        dashboard.projectHrByDay = this.mapForLineChart(dashboard.projectHrByDay);

        dashboard.breaks = this.mapForBreak(dashboard.breaks);
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

      this.pieChartData = dashboard.projectInvovlement;
      this.pieChartComp.updateData(this.pieChartData);

      this.bigChart = dashboard.projectHrByDay;
      this.areaChart.updateData(this.bigChart);
    });
  }

  mapForBreak(breaks: any): any {
    return {
      today: this.roundOff(this.timeToSec(breaks.today) / 3600),
      weekly: this.roundOff(this.timeToSec(breaks.weekly) / 3600)
    }
  }

  mapForLineChart(projectHrByDay: any): any {
    projectHrByDay.forEach(project => {
      for (let i = 1; i <= 7; i++) {
        let row = project.durationByDay.find(day => day.day == i);
        if (!row) {
          row = { day: i, duration: '00:00:00' }
          project.durationByDay.push({ day: i, duration: '00:00:00', timeInSec: 0 });
        } else {
          row['timeInHr'] = this.timeToSec(row.duration) / 3600;
        }
      }
      project.durationByDay.sort((a, b) => {
        return a.day > b.day ? 1 : -1;
      });
    });

    return projectHrByDay.map(project => {
      return {
        name: project.projectName,
        data: project.durationByDay.map(duration => this.roundOff(duration.timeInHr || 0))
      }
    });
  }

  private roundOff(digit) {
    return Math.round(digit * 100) / 100;
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

  downloadPdf() {
    this.dialog.open(PdfreportComponent,{data:{id: this.user.id}});
  }

}
