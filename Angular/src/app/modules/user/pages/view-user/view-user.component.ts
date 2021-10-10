import { ThrowStmt } from "@angular/compiler";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { flatMap, tap } from "rxjs/operators";
import { UserDetails } from "../../../../_models/userDetails";
import { UserService } from "../../user.service";
import { ReportService } from "src/app/_services/report.service";
import { SpinnerService } from "../../../../_services/spinner.service";

@Component({
    selector: 'view-user',
    templateUrl: './view-user.component.html',
    styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
    userId: number;
    $userInformation: Subject<any> = new BehaviorSubject(null);
    role: string;
    pdf: any;

    constructor(
        private route: ActivatedRoute,
        private rotuer: Router,
        private report: ReportService,
        private userService: UserService,
        private spinner: SpinnerService,
        private user: UserDetails
    ) { }

    ngOnInit(): void {
        this.spinner.show = true
        this.route.paramMap.pipe(
            flatMap((params) => {
                this.userId = +params.get('userId');
                return this.userService.getUserById(this.userId);
            }),
            tap(() => this.spinner.show = false)
        ).subscribe((userDetails) => {
            this.$userInformation.next(userDetails);
            this.role = userDetails.roles[0].role;
        });
    }

    onDelete() {
        this.userService.deleteUser(this.userId).subscribe((response) => {
            this.rotuer.navigate(['/user', 'list']);
        });
    }

    onEdit() {
        this.rotuer.navigate(['/user', 'update', this.userId]);
    }

    showViewReport() {
        return this.role === 'EMPLOYEE';
    }

    showDelete() {
        return this.user.role === 'ADMIN';
    }
}