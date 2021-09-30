import { Component } from "@angular/core";
import { SpinnerService } from "../../_services/spinner.service";

@Component({
    templateUrl: 'spinner.component.html',
    selector: 'spinner',
    styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {

    constructor(public spinner: SpinnerService) {
    }

}