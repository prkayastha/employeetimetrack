import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '../../../_services';
import { MustMatch } from '../../../_helpers';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {
  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private accountService: AccountService,
      private alertService: AlertService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['userId'];
    this.isAddMode = !this.id;

    this.form = this.formBuilder.group({
        task_id:['',Validators.required],
        taskName: ['', Validators.required],
    }, );

    /** if (!this.isAddMode) {
        this.accountService.getById(this.id)
            .pipe(first())
            .subscribe(x => this.form.patchValue(x));
    } */
}

// convenience getter for easy access to form fields
get f() { return this.form.controls; }

onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.form.invalid) {
        return;
    }

    this.loading = true;
    if (this.isAddMode) {
        this.createTask();
    } else {
        this.createTask();
    }
}

private createTask() {
    this.accountService.createTask(this.form.value)
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success('Account created successfully', { keepAfterRouteChange: true });
                this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
}

private updateAccount() {
    this.accountService.update(this.id, this.form.value)
        .pipe(first())
        .subscribe({
            next: () => {
                this.alertService.success('Update successful', { keepAfterRouteChange: true });
                this.router.navigate(['../../'], { relativeTo: this.route });
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
}


}
