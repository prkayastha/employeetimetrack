import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '../../../_services';
import { Account } from '../../../_models';
import { ProjectService } from 'src/app/_services/project.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  public $projectList: Observable<any>;


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
