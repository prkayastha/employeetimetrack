import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '../../../../_services';
import { Account } from '../../../../_models';
import { ProjectService } from 'src/app/_services/project.service';
import { ActivatedRoute } from '@angular/router';
import { UserDetails } from 'src/app/_models/userDetails';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  project: any;
  public tasklist: any;

  constructor(private projectService: ProjectService, private route: ActivatedRoute,private userDetail:UserDetails) { }

  ngOnInit() {
    const id = this.route.snapshot.params.projectid;
    this.projectService.getProjectDetail(id).subscribe(project => {
      this.project = project;
    })
  }

  addTask(inputbox: HTMLInputElement) {
    const taskname=inputbox.value;
    this.projectService.addTask(taskname,this.project.id,this.userDetail.id).subscribe(task=>{
      //after success
      inputbox.value='';
    });
  }
  getTask(){
    const tasklist={
      offset:0,
      limit: 10,
      orderBy: "createdAt",
      order:"ASC",
      search: ""
    }
    this.projectService.getAllTask(tasklist).subscribe(task=>{
      this.tasklist=task

    });
  }
}
