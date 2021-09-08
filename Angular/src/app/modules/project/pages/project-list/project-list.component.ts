import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '../../../../_services';
import { Account } from '../../../../_models';
import { ProjectService } from 'src/app/_services/project.service';
import { Observable } from 'rxjs';
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


  constructor(private projectService: ProjectService) { }

  ngOnInit() {
    this.$projectList = this.projectService.getAllProject();
  }

  deleteProject(id: string) {
    /* const account = this.accounts.find(x => x.id === id);
    account.isDeleting = true;
    this.accountService.deleteProject(id)
        .pipe(first())
        .subscribe(() => {
            this.accounts = this.accounts.filter(x => x.id !== id) 
        }); */
  }
}
