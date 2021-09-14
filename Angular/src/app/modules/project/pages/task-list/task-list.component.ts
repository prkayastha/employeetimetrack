import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { UserDetails } from 'src/app/_models/userDetails';
import { ProjectService } from 'src/app/_services/project.service';


@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  project: any;
  projectId: number;
  public $taskList: Subject<any> = new BehaviorSubject(null);
  public $filter: Subject<any> = new BehaviorSubject(null);
  public _filter = {
    offset: 0,
    limit: 10,
    orderBy: "createdAt",
    order: "ASC",
    search: ""
  };
  public roles;

  constructor(private projectService: ProjectService, 
    private route: ActivatedRoute, 
    private userDetail: UserDetails) { }

  ngOnInit() {
    this.projectId = this.route.snapshot.params.projectid;

    this.projectService.getProjectDetail(this.projectId).pipe(
      switchMap(project => {
        this.project = project;
        this.roles = this.userDetail.role;
        return of(this._filter)
      })
    ).subscribe(filter => {
      this.getTask(filter);
    });

    
    this.$filter.subscribe((filter) => {
      this.getTask(filter);
    });

  }

  addTask(inputbox: HTMLInputElement) {
    const taskname = inputbox.value;
    this.projectService.addTask(taskname, this.projectId, this.userDetail.id).subscribe(task => {
      this.$filter.next(this._filter);
      inputbox.value = '';
    });
  }

  getTask(options: any) {
    this.projectService.getAllTask(options, this.projectId).subscribe(task => {
      this.$taskList.next(task)
    });
  }

  deleteTask(id: number) {
    this.projectService.deleteTask(id).subscribe(task => {
      this.$filter.next(this._filter);
    })
  }

  onPaginate(page: PageEvent) {
    const option = {
      ...this._filter,
      offset: page.pageIndex * page.pageSize
    };
    this._filter = option;
    this.$filter.next(option);
  }
}
