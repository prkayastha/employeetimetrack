import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
    hasAction = false;
    actionOption: any = null;
    @Output('onSort') emitSort: EventEmitter<any> = new EventEmitter();
    @Input() set header(passedData: TableHeader[]) {
        this.columns = [...this.columns, ...passedData];
        this.displayedColumn = this.columns.map(column => column.headerDef);
    };
    @Input() set data(list) {
        this.dataSource = list;
    }
    @Input() set action(option) {
        if (!!option) {
            this.displayedColumn.push('action');
            this.hasAction = true;
            this.actionOption = option;
        }
    };

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