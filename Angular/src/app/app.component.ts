import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from './_services';
import { environment } from 'src/environments/environment';

declare function startCapture(displayMediaOptions): any;

const baseUrl = environment.apiUrl;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Employee Time Tracking App';

  constructor(private alertService: AlertService) {
    
  }

  ngOnInit(): void {
      console.log('Server Info: ', baseUrl); 
  }
}
