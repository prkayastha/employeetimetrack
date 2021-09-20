import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { first, map } from 'rxjs/operators';

import { AccountService, AlertService } from '../../../../_services';
import { MustMatch } from '../../../../_helpers';
import { ProjectService } from 'src/app/_services/project.service';
import { UserService } from '../../../user/user.service';

@Component({
    selector: 'app-create-project',
    templateUrl: './create-project.component.html',
    styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit, OnChanges {
    $managerList;
    $employeeList;
    @Output('formAction') emitAction: EventEmitter<any> = new EventEmitter();
    form: FormGroup;
    @Input('projectId') id: number = 0;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private projectService: ProjectService,
        private userService: UserService,
        private alertService: AlertService
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (!!changes.id && this.id !== 0) {
            this.projectService.getProjectDetail(this.id).subscribe((projectDetails: any) => {
                this.form.patchValue({
                    id: projectDetails.id,
                    projectName: projectDetails.projectName,
                    projectManager: projectDetails.projectOwner.id,
                    assignee: projectDetails.assignees,
                    version: projectDetails.version
                });
                this.form.get('assignee').setValue(projectDetails.assignees);
            });
        }
    }

    ngOnInit() {
        this.form = this.formBuilder.group({
            id: [this.id],
            projectName: ['', Validators.required],
            projectManager: [0, this.validateNumber],
            assignee: [[]],
            version: [0]
        });

        this.$managerList = this.userService.getAllManager();
        this.$employeeList = this.userService.getAllEmployee();
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

        this.createProject();
    }

    onCancel() {
        this.emitAction.emit({ action: 'cancel' });
    }
    
    private createProject() {
        this.form.patchValue({id: this.id});
        const value = {...this.form.value, projectOwnerUserId: this.form.value.projectManager};
        value.assignee = value.assignee.map(assignee => assignee.id);
        this.projectService.createProject(value)
            .subscribe({
                next: () => {
                    this.alertService.success('Account created successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/project', 'list']);
                    this.emitAction.emit({ action: 'save' });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private validateNumber(control: AbstractControl): ValidationErrors | null {
        return control.value == 0 ? { error: 'Must not be 0' } : null;

    }

}
