import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from './_services';

declare function startCapture(displayMediaOptions): any;

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
    /* const displayMediaOptions = {
      cursor: 'always',
      displaySurface: 'monitor'
    };

    startCapture(displayMediaOptions).then(([stream, video]) => {
      console.log('view value');
    }) */
    setTimeout(() => {
      this.alertService.success('Show success message')
    }, 2000)
    
  }
}
