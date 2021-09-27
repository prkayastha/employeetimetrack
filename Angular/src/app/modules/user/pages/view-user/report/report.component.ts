import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/_services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
reports=[];
  constructor(public report:ReportService) { }

  ngOnInit() {
    this.report.getEmployeeReport().subscribe(reports => {
      this.reports= reports 
      console.log(reports) 
  });
  }

}
