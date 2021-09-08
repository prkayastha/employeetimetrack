import { Component, OnInit } from '@angular/core';
import { debounceTime, first } from 'rxjs/operators';

import { AccountService } from '../../../../_services';
import { Account } from '../../../../_models';
import { ProjectService } from 'src/app/_services/project.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { TableHeader } from '../../../../_components/table/model/header.model';

const tableHeader: TableHeader[] = [
  {headerDef: 'id', headerLabel: 'Id', colName: 'id'},
  {headerDef: 'projectName', headerLabel: 'ProjectName', colName: 'projectName'},
  {headerDef: 'taskCount', headerLabel: 'Number of Task', colName: 'taskCount'},
];

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  public $projectList: Observable<any>;
  tableHeader = tableHeader;
  filter = {
    offset: 0,
    limit: 100,
    orderBy: "id",
    order: "Desc",
    search: null,
  };
  $filter: Subject<any> = new BehaviorSubject(null);

  constructor(private projectService: ProjectService) { }

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
    this.$filter.next(option);
  }

  deleteProject(id: string) {
  }
}
