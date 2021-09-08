import { Component, EventEmitter, Input, Output } from "@angular/core";
import { TableHeader } from "./model/header.model";

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent {
    columns: TableHeader[] = [];
    displayedColumn: string[];
    dataSource: any[] = []; 
    @Output('onSort') emitSort: EventEmitter<any> = new EventEmitter();

    @Input() set header (passedData: TableHeader[]) {
        this.columns = [...this.columns, ...passedData];
        this.displayedColumn =  this.columns.map(column => column.headerDef);
    };

    @Input() set data (list) {
        this.dataSource = list;
    }

    constructor() {
    }

    sort(event) {
        const object = {
            sortColName: event.active,
            dir: event.direction
        }
        this.emitSort.emit(object);
    }
}