import { Component, OnInit,Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportService } from 'src/app/_services/report.service';
import { MatDialogRef,MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-pdfreport',
  templateUrl: './pdfreport.component.html',
  styleUrls: ['./pdfreport.component.scss']
})
export class PdfreportComponent implements OnInit {
  reports=[];
  userID:number;
  constructor(public report:ReportService,public route:ActivatedRoute,
    public dialog: MatDialogRef<PdfreportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.userID = this.data.id;
    this.report.getPDFReport(this.userID).subscribe(reports => {
      this.reports = reports
    });
  }

}
