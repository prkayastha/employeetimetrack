import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
    templateUrl: './view-capture.component.html'
})
export class ViewCaptureComponent {

    imageUrl: string;

    constructor(
        @Inject(MAT_DIALOG_DATA) private data: any
    ) {
        this.imageUrl = data.location;
    }

}