import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor() { }

  bigChart() {
    return [{
      name: 'Project 1',
      data: [4, 6, 8, 9, 10, 11, 5]
    }, {
      name: 'Project 2',
      data: [10, 10, 11, 13, 2, 7, 9]
    }, ];
  }

  cards() {
    return [71, 78, 39, 66];
  }

  pieChart() {
    return [{
      name: 'Project 1',
      y: 60,
      sliced: true,
      selected: true
    }, {
      name: 'Project 2',
      y: 10
    }, {
      name: 'Project 3',
      y: 25
    }, {
      name: 'Project 4',
      y: 5
    }];
  }
}