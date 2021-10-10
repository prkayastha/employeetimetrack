import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDetails } from 'src/app/_models/userDetails';
import { ReportService } from 'src/app/_services/report.service';
import { MatDialog } from '@angular/material';
import { PdfreportComponent } from './pdfreport/pdfreport.component';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  reports = [];
  pdfreport = [];
  name: string;
  userID:number;
  constructor(public report: ReportService, public user: UserDetails, public route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit() {
    this.userID = this.route.snapshot.params.id;
    this.name = this.route.snapshot.queryParams.name;
    this.report.getEmployeeReport(this.userID).subscribe(reports => {
      this.reports = reports
    });
  }
 

  openDialog(id: number){
    this.dialog.open(PdfreportComponent,{width: '400px', data:{id}});
    console.log(id);

  }

}
