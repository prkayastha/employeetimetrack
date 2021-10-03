import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { AlertService } from "../../../../../_services";
import { ProjectService } from "../../../../../_services/project.service";

@Component({
    selector: 'project-import',
    templateUrl: 'project-import-dialog.component.html',
    styleUrls: ['./project-import-dialog.component.scss']
})
export class ProjectImportDialogComponent implements OnInit {

    isBusy: boolean = false;

    constructor(
        private dialog: MatDialogRef<ProjectImportDialogComponent>,
        private projectService: ProjectService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private alertService: AlertService
    ){}

    ngOnInit(): void {
    }

    importProject(id: string) {
        this.isBusy = true;
        this.projectService.importProject(id).subscribe((result) => {
            this.isBusy = false;
            this.alertService.success('Project successfully imported');
            this.dialog.close({refresh: true});
        }, (error) => {
            this.isBusy = false;
            this.alertService.error(error || 'Cannot import project');
            this.dialog.close({refresh: false});
        });
    }

}