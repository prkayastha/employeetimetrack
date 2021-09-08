import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '../../../../_services';
import { Account } from '../../../../_models';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  accounts: any[];

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.accountService.getAll()
      .pipe(first())
      .subscribe((accounts: {count: number; collection: any[]}) => {
        this.accounts = accounts.collection
      });
  }

  deleteAccount(id: string) {
    const account = this.accounts.find(x => x.id === id);
    account.isDeleting = true;
    this.accountService.delete(id)
      .pipe(first())
      .subscribe(() => {
        this.accounts = this.accounts.filter(x => x.id !== id)
      });
  }

}
