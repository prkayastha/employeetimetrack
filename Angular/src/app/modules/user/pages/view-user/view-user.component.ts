import { ThrowStmt } from "@angular/compiler";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import jsPDF from "jspdf";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { flatMap } from "rxjs/operators";
import { UserDetails } from "../../../../_models/userDetails";
import { UserService } from "../../user.service";
import { ReportService } from "src/app/_services/report.service";

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
        private report:ReportService,
        private userService: UserService,
    ){}

    ngOnInit(): void {
        this.route.paramMap.pipe(
            flatMap((params) => {
                this.userId = +params.get('userId');
                return this.userService.getUserById(this.userId);
            })
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

    //pdf function
    downloadPDF(){
        console.log("downloading pdf");
        const doc=new jsPDF();
       //     this.report.getPDFReport().subscribe(pdf => {
       //         this.pdf=pdf
              
      //      });
       doc.text("Employee Name: Santosh Devkota  \nPosition: Front End Developer ",10,10);
       doc.text("_____________________________________________________________________________________________",0,30);
       doc.text("Project Name: Space X \nTime for Project: 00:00:53 \nunproductive screens: 12 \ntotal screens: 40",10,40);
       doc.text("Project Name: Alibaba \nTime for Project: 01:00:53 \nunproductive screens: 2 \ntotal screens: 4",10,80);
       doc.text("Project Name: Sprint3 X \nTime for Project: 10:00:53 \nunproductive screens: 8 \ntotal screens: 19",10,120);
       doc.save('report.pdf');
    }

    getPDF(){
        this.report.getPDFReport().subscribe(pdf => {
                    this.pdf= pdf  
                });
    }


}