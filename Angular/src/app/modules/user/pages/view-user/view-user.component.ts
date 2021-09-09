import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { flatMap } from "rxjs/operators";
import { UserService } from "../../user.service";

@Component({
    selector: 'view-user',
    templateUrl: './view-user.component.html',
    styleUrls: ['./view-user.component.scss']
})
export class ViewUserComponent implements OnInit {
    userId: number;
    $userInformation: Observable<any>;

    constructor(
        private route: ActivatedRoute,
        private userService: UserService
    ){
        
    }

    ngOnInit(): void {
        this.$userInformation = this.route.paramMap.pipe(
            flatMap((params) => {
                this.userId = +params.get('userId');
                return this.userService.getUserById(this.userId);
            })
        );

        this.$userInformation.subscribe((userInfo) => {
            console.log(userInfo);
        })
    }


}