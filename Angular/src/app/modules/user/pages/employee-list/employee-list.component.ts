import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { TableHeader } from '../../../../_components/table/model/header.model';
import { SpinnerService } from '../../../../_services/spinner.service';
import { UserService } from '../../user.service';


const tableHeader: TableHeader[] = [
  { headerDef: 'id', headerLabel: 'Id', colName: 'id' },
  { headerDef: 'name', headerLabel: 'Name', colName: 'firstname', headerCss: 'px-3' },
  { headerDef: 'role', headerLabel: 'Role', colName: 'role' },
  { headerDef: 'designation', headerLabel: 'Designation', colName: 'designation' },
  { headerDef: 'noOfProject', headerLabel: 'Projects Involved', colName: 'noOfProject' },
  { headerDef: 'timeSpent', headerLabel: 'Time Involvement (weekly)', colName: 'timeSpent' }
]

const headerOption = {
  search: {
    label: 'Search',
    placeholder: 'Enter name'
  }
};

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  accounts: any[];
  tableHeader = tableHeader;
  headerOption = headerOption;
  $userList: Observable<any>;
  _filter: any;
  $filter: Subject<any> = new BehaviorSubject(null);

  @ViewChild('paginator', {static: true}) paginator: MatPaginator;

  constructor(
    private userService: UserService,
    private router: Router,
    private spinner: SpinnerService
  ) { 
    const nameCol = this.tableHeader.find(header => header.headerDef === 'name');
    nameCol.onClick = function (data: any) {
      this.router.navigate(['/user', data.id]);
    }.bind(this)
  }

  ngOnInit() {
    this.spinner.show = true;
    this._filter = {
      offset: 0,
      limit: 10,
      orderBy: "id",
      order: "desc",
      search: ""
    };

    this.$filter.next(this._filter);
    this.$filter.pipe(
      debounceTime(300)
    ).subscribe(filter => {
      this.$userList = this.userService.getAllUsers(filter).pipe(
        tap(() => this.spinner.show = false)
      );
    });
  }

  sort(sortOption: any) {
    const options = {
      ...this._filter,
      orderBy: sortOption.sortColName,
      order: sortOption.dir
    };
    this._filter = options;
    this.$filter.next(this._filter);
  }

  search(searchOption: any) {
    const options = {
      ...this._filter,
      search: searchOption
    };
    this.paginator.firstPage();
    this._filter = options;
    this.$filter.next(this._filter);
  }

  onPaginate(event: PageEvent) {
    const options = {
      ...this._filter,
      offset: event.pageIndex * event.pageSize
    };
    this._filter = options;
    this.$filter.next(this._filter);
  }

  deleteAccount(id: string) {
    /* const account = this.accounts.find(x => x.id === id);
    account.isDeleting = true;
    this.accountService.delete(id)
      .pipe(first())
      .subscribe(() => {
        this.accounts = this.accounts.filter(x => x.id !== id)
      }); */
  }

}
