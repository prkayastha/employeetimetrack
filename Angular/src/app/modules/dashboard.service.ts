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
    } ];
  }

  cards() {
    return [71, 78, 39, 66];
  }

  pieChart() {
    return [{
      name: 'SpaceX',
      y: 60,
      sliced: true,
      selected: true
    }, {
      name: 'Alibaba',
      y: 10
    }, {
      name: 'Cloud Security',
      y: 25
    }, {
      name: 'Sprint 3',
      y: 5
    }];
  }
}
