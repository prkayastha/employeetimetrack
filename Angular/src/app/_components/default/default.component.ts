import { Component, OnInit } from '@angular/core';
import { SpinnerService } from '../../_services/spinner.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {

  sideBarOpen = true;

  constructor(public spinner: SpinnerService) { }

  ngOnInit() { }


  sideBarToggler(event: Event) {
    this.sideBarOpen = !this.sideBarOpen;
  }

}
