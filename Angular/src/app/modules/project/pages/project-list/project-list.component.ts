import { Component, OnInit } from '@angular/core';
import { MatDialog, PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, takeLast, tap } from 'rxjs/operators';
import { ProjectService } from 'src/app/_services/project.service';
import { TableHeader } from '../../../../_components/table/model/header.model';
import { UserDetails } from '../../../../_models/userDetails';
import { SpinnerService } from '../../../../_services/spinner.service';
import { ProjectImportDialogComponent } from './project-import-dialog/project-import-dialog.component';

const tableHeader: TableHeader[] = [
  { headerDef: 'id', headerLabel: 'Id', colName: 'id' },
  { headerDef: 'projectName', headerLabel: 'ProjectName', colName: 'projectName', headerCss: 'px-3' },
  { headerDef: 'taskCount', headerLabel: 'Number of Task', colName: 'taskCount' },
  { headerDef: 'createdAt', headerLabel: 'Date Created', colName: 'createdAt'}
];

const filterOption = {
  search: {
    placeholder: 'Project Name',
    label: 'Search'
  },
  button: {
    label: 'Create Project'
  },
  trelloCallback: null
}

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  public $projectList: Observable<any>;
  tableHeader;
  filterOption = filterOption;
  actionOption: any = {};
  filter = {
    offset: 0,
    limit: 100,
    orderBy: "id",
    order: "Desc",
    search: null,
  };
  $filter: Subject<any> = new BehaviorSubject(null);
  actionCreate = false;
  actionProjectId: number = 0;

  constructor(
    private projectService: ProjectService,
    private router: Router,
    private userModel: UserDetails,
    private spinner: SpinnerService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.spinner.show = true;
    this.setUpHeader();
    this.filterOption.trelloCallback = this.onTrelloImport.bind(this);
    this.$filter.pipe(
      debounceTime(300)
    ).subscribe(filter => {
      this.$projectList = this.projectService.getAllProject(filter).pipe(
        tap(() => this.spinner.show = false)
      );
    });
    this.$filter.next(this.filter);
  }

  sort(sortOption: any) {
    const option = {
      ...this.filter,
      orderBy: sortOption.sortColName,
      order: sortOption.dir
    };
    this.filter = option;
    this.$filter.next(option);
  }

  search(searchValue) {
    const option = {
      ...this.filter,
      search: searchValue
    };
    this.filter = option;
    this.$filter.next(option);
  }

  onCreate() {
    this.actionCreate = true;
  }

  onEdit(data: any) {
    this.actionProjectId = data.id;
    this.actionCreate = true
  }

  onDelete(data: any) {
    this.projectService.deleteProject(data.id).subscribe(response => {
      this.$filter.next(this.filter);
    })
  }

  onPaginate(pageEvent: PageEvent) {
    const option = {
      ...this.filter,
      offset: pageEvent.pageIndex * pageEvent.pageSize
    };
    this.filter = option;
    this.$filter.next(option);
  }

  createFormAction(action: any) {
    this.actionCreate = false;
    this.actionProjectId = 0;
    if (action.action !== 'cancel') {
      this.$filter.next(this.filter);
    }
  }

  onProjectNameClick(data: any) {
    this.router.navigate(['/project', 'task', data.id], { queryParams: {name: data.projectName} })
  }

  private setUpHeader() {
    this.tableHeader = [...tableHeader];
    this.filterOption.button['callback'] = this.onCreate.bind(this);
    if (!!this.actionOption && this.userModel.role !== 'EMPLOYEE') {
      this.actionOption['edit'] = this.onEdit.bind(this);
      this.actionOption['delete'] = this.onDelete.bind(this);
    }
    const projectNameCol = this.tableHeader.find(header => header.headerDef === 'projectName');
    if (!!projectNameCol) projectNameCol.onClick = this.onProjectNameClick.bind(this);

    if (this.userModel.role === 'EMPLOYEE') {
      this.tableHeader.pop();
    }
  }

  onTrelloImport() {
    this.projectService.importFromTrello().subscribe((response: any) => {
      if ( !!response['requireConnection']) {
        this.connectToTrello();
        return
      }

      this.openImportDialog(response['collection']);
    });
  }

  connectToTrello() {
    const userId = this.userModel.id;

    this.projectService.connectTrello(userId).subscribe((response: any) => {
      window.open(response.url, '_blank');
    })
  }

  isShowTrello() {
    return this.userModel.role!=='EMPLOYEE';
  }

  openImportDialog(data: any[]) {
    this.dialog.open(ProjectImportDialogComponent, {
      autoFocus: false,
      data
    }).afterClosed().subscribe((result) => {
      if (!!result && !!result.refresh) {
        this.$filter.next(this.filter);
      }
    })
  }
}
