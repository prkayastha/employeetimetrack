import { Component, OnInit } from '@angular/core';
import { UserDetails } from 'src/app/_models/userDetails';
import { ReportService } from 'src/app/_services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
reports=[];
pdfreport=[];
  constructor(public report:ReportService,public user:UserDetails) { }

  ngOnInit() {
    this.report.getEmployeeReport(this.user.id).subscribe(reports => {
      this.reports= reports 
  });
  }
  listPDFReport(){
    this.report.getPDFReport().subscribe(pdfreport => {
      this.pdfreport= pdfreport
      console.log(pdfreport) 
  });
  }

}
