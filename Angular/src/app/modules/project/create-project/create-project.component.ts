import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, map } from 'rxjs/operators';

import { AccountService, AlertService } from '../../../_services';
import { MustMatch } from '../../../_helpers';
import { ProjectService } from 'src/app/_services/project.service';

@Component({
    selector: 'app-create-project',
    templateUrl: './create-project.component.html',
    styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {
    $managerList;
    $employeeList;
    @Output('formAction') emitAction: EventEmitter<any> = new EventEmitter();
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private projectService: ProjectService,
        private accountService: AccountService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.id = this.route.snapshot.params['userId'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            project_name: ['', Validators.required],
            projectManager: [0, Validators.required],
            assignee: ['', Validators.required]
        });

        // this.$managerList = this.projectService.getAllManager()
        this.$employeeList = this.accountService.getAll()


        /** if (!this.isAddMode) {
            this.accountService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        } */
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.emitAction.emit({ action: 'save' });
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createProject();
        } else {
            this.createProject();
        }
    }

    onCancel() {
        this.emitAction.emit({ action: 'cancel' });
    }

    private createProject() {
        this.projectService.createProject(this.form.value)
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
