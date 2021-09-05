import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '../../../_services';
import { Account } from '../../../_models';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  accounts: any[];

  constructor(private accountService: AccountService) {}

  ngOnInit() {
      this.accountService.getAll()
          .pipe(first())
          .subscribe(accounts => this.accounts = accounts);
  }

  deleteTask(id: string) {
      const account = this.accounts.find(x => x.id === id);
      account.isDeleting = true;
      this.accountService.deleteTask(id)
          .pipe(first())
          .subscribe(() => {
              this.accounts = this.accounts.filter(x => x.id !== id) 
          });
  }
}
