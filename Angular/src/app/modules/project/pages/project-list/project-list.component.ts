import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProjectService } from 'src/app/_services/project.service';
import { TableHeader } from '../../../../_components/table/model/header.model';

const tableHeader: TableHeader[] = [
  { headerDef: 'id', headerLabel: 'Id', colName: 'id' },
  { headerDef: 'projectName', headerLabel: 'ProjectName', colName: 'projectName' },
  { headerDef: 'taskCount', headerLabel: 'Number of Task', colName: 'taskCount' },
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

  constructor(private projectService: ProjectService) {
    this.filterOption.button['callback'] = this.onCreate.bind(this);
    if (!!this.actionOption) {
      this.actionOption['edit'] = this.onEdit;
      this.actionOption['delete'] = this.onDelete;
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
    throw new Error('Method not implemented');
  }

  onDelete() {
    throw new Error('Method not implemented');
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

  deleteProject(id: string) {
  }
}
