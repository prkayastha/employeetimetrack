import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserDetails } from 'src/app/_models/userDetails';
import { ProjectService } from 'src/app/_services/project.service';
import { TaskTimerComponent } from '../project-list/task-timer/task-timer.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})

export class TaskListComponent implements OnInit {
  projectName: string;
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
  public editMode: number;
  public giveInvalidFeedback = false;
  public filterOption = {
    search: {
      placeholder: 'Task Description',
      label: 'Search'
    }
  }

  constructor(private projectService: ProjectService,
    private route: ActivatedRoute,
    private userDetail: UserDetails,public dialog:MatDialog){ }

  ngOnInit() {
    this.projectId = this.route.snapshot.params.projectid;
    this.projectName = this.route.snapshot.queryParams.name;
    this.roles = this.userDetail.role;
    this.getTask(this._filter);

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

  editTask(id: number) {
    this.editMode = id;
  }

  updateTask(task: any, descriptionField: HTMLInputElement) {
    if (descriptionField.value === '') {
      this.giveInvalidFeedback = true;
      return;
    }

    const updateTask = {
      id: task.id,
      taskDescription: descriptionField.value,
      projectId: this.projectId,
      assigneeUserId: this.userDetail.id,
      version: task.version
    };
    this.projectService.updateTask(updateTask).subscribe((response) => {
      this.editMode = 0;
      this.giveInvalidFeedback = false;
      this.$filter.next(this._filter);
    })
  }

  closeTask(task: any, descriptionField: HTMLInputElement) {
    this.editMode = 0;
    this.giveInvalidFeedback = false;
  }

  onPaginate(page: PageEvent) {
    const option = {
      ...this._filter,
      offset: page.pageIndex * page.pageSize
    };
    this._filter = option;
    this.$filter.next(option);
  }

  search(searchString: string) {
    const option = {
      ...this._filter,
      search: searchString
    };
    this._filter = option;
    this.$filter.next(option);
  }
  openDialog(taskDescription:string, id: number){
    this.dialog.open(TaskTimerComponent,{disableClose: true, data:{id,taskDescription}},);
    console.log(id,taskDescription);

  }
}
