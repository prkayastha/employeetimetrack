import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
    selector: 'project-import',
    templateUrl: 'project-import-dialog.component.html',
    styleUrls: ['./project-import-dialog.component.scss']
})
export class ProjectImportDialogComponent implements OnInit {

    isBusy: boolean = false;

    constructor(
        private dialog: MatDialogRef<ProjectImportDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ){}

    ngOnInit(): void {
    }

}