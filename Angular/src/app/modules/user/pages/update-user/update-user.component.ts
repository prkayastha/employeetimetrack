import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, tap } from 'rxjs/operators';

import { AccountService, AlertService } from '../../../../_services';
import { MustMatch } from '../../../../_helpers';
import { UserDetails } from '../../../../_models/userDetails';
import { SpinnerService } from '../../../../_services/spinner.service';

@Component({
    selector: 'app-update-user',
    templateUrl: './update-user.component.html',
    styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    operatorRole: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private userModel: UserDetails,
        private spinner: SpinnerService
    ) { 
        this.operatorRole = this.userModel.role;
    }

    ngOnInit() {
        this.spinner.show = true;
        this.id = this.route.snapshot.params['userId'];
        this.form = this.getForm();
        this.getUserInfo(+this.id);
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
        this.updateAccount();
    }

    private updateAccount() {
        const formValue = { ...this.form.value, roles: [this.form.value.role] };
        formValue['details'] = {
            designation: formValue.designation,
            skills: formValue.skills
        };
        this.accountService.update(this.id, formValue)
            .subscribe(
                (response) => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['/user', this.id]);
                },
                (error) => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    private getUserInfo(userId: number) {
        
        this.accountService.getUser(userId).pipe(
            tap(() => this.spinner.show = false)
        ).subscribe((user) => {
            const preFillValue = {
                firstName: user.firstname,
                lastName: user.lastname,
                email: user.email,
                role: user.roles[0].id,
                designation: user.designation,
                skills: user.skills,
                version: user.version
            };
            this.form.patchValue(preFillValue);
        })
    }

    private getForm() {
        return this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['', Validators.required],
            designation: [''],
            skills: [''],
            version: ['0']
        });
    }

}
