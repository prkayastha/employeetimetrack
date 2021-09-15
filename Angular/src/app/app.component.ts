import { Component, OnInit, ViewChild } from '@angular/core';

declare function startCapture(displayMediaOptions): any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Employee Time Tracking App';

  ngOnInit(): void {
    /* const displayMediaOptions = {
      cursor: 'always',
      displaySurface: 'monitor'
    };

    startCapture(displayMediaOptions).then(([stream, video]) => {
      console.log('view value');
    }) */
  }
}
