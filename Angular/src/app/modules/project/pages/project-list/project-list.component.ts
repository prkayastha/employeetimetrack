import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProjectService } from 'src/app/_services/project.service';
import { TableHeader } from '../../../../_components/table/model/header.model';
import { UserDetails } from '../../../../_models/userDetails';

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
  }
}

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  public $projectList: Observable<any>;
  tableHeader = tableHeader;
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
    private userModel: UserDetails
  ) {
    this.filterOption.button['callback'] = this.onCreate.bind(this);
    if (!!this.actionOption) {
      this.actionOption['edit'] = this.onEdit.bind(this);
      this.actionOption['delete'] = this.onDelete.bind(this);
    }
    const projectNameCol = this.tableHeader.find(header => header.headerDef === 'projectName');
    projectNameCol.onClick = this.onProjectNameClick.bind(this);

    if (userModel.role === 'EMPLOYEE') {
      this.tableHeader.pop();
    }
  }

  ngOnInit() {
    this.$filter.pipe(
      debounceTime(300)
    ).subscribe(filter => {
      this.$projectList = this.projectService.getAllProject(filter);
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
    if (action.action !== 'cancel') {
      this.$filter.next(this.filter);
    }
  }

  onProjectNameClick(data: any) {
    this.router.navigate(['/project', 'task',data.id])
  }


  deleteProject(id: string) {
  }
}
