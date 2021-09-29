import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import * as moment from 'moment-timezone';
import { ReportService } from '../../_services/report.service';
import { BehaviorSubject } from 'rxjs';
import { ViewCaptureComponent } from './component/view-capture.component';
import { UserDetails } from '../../_models/userDetails';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workdiary',
  templateUrl: './workdiary.component.html',
  styleUrls: ['./workdiary.component.scss']
})
export class WorkdiaryComponent implements OnInit {
  // The value of the search input.
  timeSlot = [...Array(6).keys()];
  searchTerm: string;
  date: FormControl = new FormControl();
  $workDiary: BehaviorSubject<any> = new BehaviorSubject(null);
  role: string;
  userId: number;
  name: string;
  today = new Date();

  constructor(
    public dialog: MatDialog,
    private report: ReportService,
    private route: ActivatedRoute,
    private user: UserDetails) {
    this.role = this.user.role;
    this.date.valueChanges.subscribe((date) => {
      const zone = moment.tz.guess();
      const dateMoment = moment.tz(date, zone);

      if (this.role === 'EMPLOYEE') {
        this.getWorkDiary(dateMoment);
      } else {
        this.getWorkDiary(dateMoment, this.userId);
      }
    });
  }

  ngOnInit(): void {
    if (this.role === 'ADMIN' || this.role === 'MANAGER') {
      this.route.queryParamMap.subscribe((query) => {
        this.userId = (<any>query.get('userId')) as number;
        this.name = query.get('name').trim();
        this.date.patchValue(this.today);
      })
    } else {
      this.date.patchValue(this.today);
    }
  }

  getWorkDiary(date: any, userId?: number) {
    const role = this.user.role;
    let requestHook = null;

    if (role === 'EMPLOYEE') {
      requestHook = this.report.getWorkDiary(date.format('YYYY-MM-DD'), date.format('Z'), this.user.id);
    } else {
      requestHook = this.report.getWorkDiary(date.format('YYYY-MM-DD'), date.format('Z'), userId);
    }

    requestHook.subscribe((response) => {
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

  getImgInfo(slot, list, infoKey) {
    const capture = list.find(screen => screen.timeMinutes / 10 == slot);

    if (!!capture) {
      return capture[infoKey];
    }

    return null;
  }

  showCheckbox() {
    return this.user.role !== 'EMPLOYEE';
  }

  onMark(event: Event, captureId: number) {
    const markedUnproductive = event.target['checked'];
    this.report.markScreen({ id: captureId, markUnproductive: markedUnproductive }).subscribe((result) => {
      //no action
    });
  }
}
