import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatTableDataSource } from '@angular/material';
import { map, tap } from 'rxjs/operators';
import { UserDetails } from 'src/app/_models/userDetails';
import { ReportService } from 'src/app/_services/report.service';
import { SpinnerService } from '../../_services/spinner.service';
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
  @Input() userId: number;
  data = [];
  dashboard = [];
  ELEMENT_DATA: PeriodicElement[] = [];

  bigChart = [];
  pieChartData = [];

  displayedColumns: string[] = ['name', 'date'];
  dataSource1 = new MatTableDataSource<PeriodicElement>([]);
  dataSource2 = new MatTableDataSource<PeriodicElement>([]);

  break: any = { today: 0, weekly: 0 }
  workingHrs: any = { today: 0, weekly: 0 }


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('pieChart', { static: false }) pieChartComp: PieComponent;
  @ViewChild('areaChart', { static: true }) areaChart: AreaComponent;

  constructor(public report: ReportService,
    public user: UserDetails,
    public dialog: MatDialog,
    public spinner: SpinnerService) { }

  ngOnInit() {
    // this.bigChart = this.dashboardService.bigChart();
    // this.pieChartData = this.dashboardService.pieChart();
    this.spinner.show = true
    this.dataSource1.paginator = this.paginator;
    this.dataSource2.paginator = this.paginator;

    let obs = null;

    if (this.user.role === 'EMPLOYEE') {
      obs = this.report.dashboard(this.user.id).pipe(
        map(dashboard => {
          dashboard.projectInvovlement = this.mapForPieChart(dashboard.projectInvovlement);

          dashboard.projectHrByDay = this.mapForLineChart(dashboard.projectHrByDay);

          dashboard.breaks = this.mapForBreak(dashboard.breaks);

          dashboard.workingHrs = this.mapForBreak(dashboard.workingHrs);
          return dashboard
        })
      )
    } else {
      obs = this.report.dashboard(this.userId).pipe(
        map(dashboard => {
          dashboard.projectInvovlement = this.mapForPieChart(dashboard.projectInvovlement);

          dashboard.projectHrByDay = this.mapForLineChart(dashboard.projectHrByDay);

          dashboard.breaks = this.mapForBreak(dashboard.breaks);

          dashboard.workingHrs = this.mapForBreak(dashboard.workingHrs);
          return dashboard
        })
      )
    }

    obs.subscribe(dashboard => {
      const workingOnData = dashboard.workedOnProject.map(row => {
        return {
          name: row.projectName,
          date: row.lastWorkedAt
        }
      }).sort((a,b) => {
        return a.date < b.date ? 1 : -1;
      });

      this.dataSource1 = new MatTableDataSource<PeriodicElement>(workingOnData)

      const assignedProject = dashboard.assignedProjects.map(row => {
        return {
          name: row.projectName,
          date: row.assignedDate
        }
      })
      this.dataSource2 = new MatTableDataSource<PeriodicElement>(assignedProject);

      this.pieChartData = dashboard.projectInvovlement;
      if (!!this.pieChartData.length && !!this.pieChartComp) {
        this.pieChartComp.updateData(this.pieChartData);
      }

      this.bigChart = dashboard.projectHrByDay;
      if (!!this.areaChart && !!this.bigChart.length) {
        this.areaChart.updateData(this.bigChart);
      }

      this.break = dashboard.breaks;

      this.workingHrs = dashboard.workingHrs;
      this.spinner.show = false;
    }, error => {
      this.spinner.show = false;
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

    if (total == 0) {
      return [];
    }

    mapped = mapped.map(project => {
      project['percent'] = Math.round(project['inSeconds'] / total * 100);
      return { id: project.projectId, projectName: project.projectName, percentage: project.percent };
    });
    return mapped.map(project => ({ name: project.projectName, y: project.percentage })).filter(data => data.y > 0);
  }

  downloadPdf() {
    this.dialog.open(PdfreportComponent, { width: '400px', data: { id: this.user.id } });
  }

  getPercent(value, total) {
    return Math.floor((value / total) * 100);
  }

}
