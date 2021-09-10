import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl } from "@angular/forms";
import { debounceTime } from "rxjs/operators";

@Component({
    selector: 'app-filter-options',
    templateUrl: './filter-option.component.html',
    styleUrls: ['./filter-option.component.scss']
})
export class FilterOptionComponent implements OnInit {
    searchValue: FormControl = new FormControl();
    @Input() option: any;
    @Output('onSearch') search = new EventEmitter();

    ngOnInit(): void {
        this.searchValue.valueChanges.pipe(
            debounceTime(300)
        ).subscribe(value => {
            this.search.emit(value);
        });
    }
}