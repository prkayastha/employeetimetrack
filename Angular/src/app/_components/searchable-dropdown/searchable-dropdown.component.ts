import { Component, forwardRef, ElementRef, ViewChild, Input, OnInit, OnChanges, SimpleChanges } from "@angular/core";
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from "@angular/material";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from "rxjs";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";

@Component({
    selector: 'input-searchable-dropdown',
    templateUrl: './searchable-dropdown.component.html',
    styleUrls: ['./searchable-dropdown.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => SearchableDropdownComponent),
            multi: true
        }
    ]
})
export class SearchableDropdownComponent implements ControlValueAccessor, OnChanges {
    actualValue = null;
    selectable = false;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    _value: any[] = [];
    filteredOptions: Observable<any[]>;
    filterInput: FormControl = new FormControl('');
    _src: any[] = [];
    selectFromList: boolean = false;

    @Input() label: string = '';
    @Input() placeholder: string = '';
    @Input() dataSource(source: any[]) {
        this._src = [...this._src, ...source];
    }


    @ViewChild('searchInput', { static: false }) searchInput: ElementRef<HTMLInputElement>;

    onChange = (_value) => { };

    onTouched = () => { };

    touched = false;

    disabled = false;

    constructor() {
    }
    
    ngOnChanges(changes: SimpleChanges): void {
        if (!!changes && !!changes.dataSource && !!changes.dataSource.currentValue) {
            this._src = [...changes.dataSource.currentValue];
            this.filteredOptions = this.filterInput.valueChanges.pipe(
                startWith(null),
                map((filter: string | null) => !!filter ? this._filter(filter) : this._src.slice())
            );
        }
    }

    writeValue(obj: any[]): void {
        this.actualValue = obj;
        this.onChange(this.actualValue)
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    add(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        if (value) {
            this._value.push(this._src.find(option => option.id === value));
            this.writeValue(this._value);
        }

        // Clear the input value
        event['chipInput']!.clear();

        this.filterInput.setValue(null);
    }

    remove(value: any) {
        const index = this._value.findIndex(option => {
            return option.id == value.id
        });

        if (index >= 0) {
            this._value.splice(index, 1);

            this.writeValue(this._value);
        }
    }

    private _filter(filter: any): any {
        if (!isNaN(filter)) {
            filter = filter.toString();
        }
        const filterValue = filter.toLowerCase();
        return this._src.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    selected(event: MatAutocompleteSelectedEvent) {
        const selectedObject = this._src.find(option => option.id === event.option.value);
        this._value.push(selectedObject);
        this.writeValue(this._value);
        this.searchInput.nativeElement.value = '';
        this.searchInput.nativeElement.blur();
        this.filterInput.setValue(null);
    }

    hasInList(id: any) {
        return !!this._value.find(option => option.id === id);
    }

}