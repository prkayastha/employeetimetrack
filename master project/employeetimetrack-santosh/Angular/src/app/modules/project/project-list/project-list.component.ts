import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '../../../_services';
import { Account } from '../../../_models';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  accounts: any[];

  constructor(private accountService: AccountService) {}

  ngOnInit() {
      this.accountService.getAll()
          .pipe(first())
          .subscribe(accounts => this.accounts = accounts);
  }

  deleteProject(id: string) {
      const account = this.accounts.find(x => x.id === id);
      account.isDeleting = true;
      this.accountService.deleteProject(id)
          .pipe(first())
          .subscribe(() => {
              this.accounts = this.accounts.filter(x => x.id !== id) 
          });
  }
}
