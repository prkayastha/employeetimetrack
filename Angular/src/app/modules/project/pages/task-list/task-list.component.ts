import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '../../../../_services';
import { Account } from '../../../../_models';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  tasks: any[];

  constructor(private accountService: AccountService) {}

  ngOnInit() {
      this.accountService.getAllTask()
          .pipe(first())
          .subscribe(tasks => this.tasks = tasks);
  }

  deleteTask(id: string) {
      const account = this.tasks.find(x => x.id === id);
      account.isDeleting = true;
      this.accountService.deleteTask(id)
          .pipe(first())
          .subscribe(() => {
              this.tasks = this.tasks.filter(x => x.id !== id) 
          });
  }
}
