import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { CreateTaskComponent } from './create-task/create-task.component';
import { NotifyService } from './services/notify.service';
import * as moment from 'moment-timezone';
import { ReportService } from '../../_services/report.service';
import { BehaviorSubject } from 'rxjs';
import { ViewCaptureComponent } from './component/view-capture.component';

@Component({
  selector: 'app-workdiary',
  templateUrl: './workdiary.component.html',
  styleUrls: ['./workdiary.component.scss']
})
export class WorkdiaryComponent {
  // The value of the search input.
  searchTerm: string;
  date: FormControl = new FormControl();
  $workDiary: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    public dialog: MatDialog, 
    private notifyService: NotifyService, 
    private report: ReportService) {
    this.date.patchValue(moment.tz().utcOffset("+09:30").toString());

    this.date.valueChanges.subscribe((date) => {
      const zone = moment.tz.guess();
      const dateMoment = moment.tz(date, zone);
      this.getWorkDiary(dateMoment);
    });
  }

  getWorkDiary(date:any) {
    this.report.getWorkDiary(date.format('YYYY-MM-DD'), date.format('Z')).subscribe((response) => {
      //perform ops
      this.$workDiary.next(response);
    });
  }

  openCapture(location: string) {
    const initState = {
      data: {
        location
      },
      width: '80%',
      height: '80%'
    };

    const dialogRef = this.dialog.open(ViewCaptureComponent, initState);

    dialogRef.afterClosed();
  }

  /**
   * Opens a dialog to create a new task.
   */
  openCreateDialog(): void {
    this.notifyService.announceTaskStarted(-1);
    this.dialog.open(CreateTaskComponent, { width: '400px' });
    this.searchTerm = '';
    this.search();
  }

  /**
   * Notifies subscribed components that a search has occured.
   */
  search() {
    this.notifyService.announceSearch(this.searchTerm);
  }
}
