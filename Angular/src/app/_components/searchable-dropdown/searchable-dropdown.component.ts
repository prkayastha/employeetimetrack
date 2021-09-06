import { Component, forwardRef, ElementRef, ViewChild } from "@angular/core";
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
export class SearchableDropdownComponent implements ControlValueAccessor {
    actualValue = null;

    selectable = false;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    _value: any[] = [];
    filteredOptions: Observable<any[]>;
    filterInput: FormControl = new FormControl('');
    _src: any[] = [
        { id: 1, name: 'Prajesh' },
        { id: 2, name: 'Ravi' },
        { id: 3, name: 'Santosh' }
    ];
    selectFromList: boolean = false;

    @ViewChild('searchInput', { static: false }) searchInput: ElementRef<HTMLInputElement>;

    onChange = (_value) => {};

    onTouched = () => {};

    touched = false;

    disabled = false;

    constructor() {
        this.filteredOptions = this.filterInput.valueChanges.pipe(
            startWith(null),
            map((filter: string | null) => filter ? this._filter(filter) : this._src.slice())
        )
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

        // Add our fruit
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

    private _filter(filter: string): any {
        if (this.selectFromList) {
            return this._src;
        }

        const filterValue = filter.toLowerCase();

        return this._src.filter(option => option.name.toLowerCase().includes(filterValue));
    }

    selected(event: MatAutocompleteSelectedEvent) {
        this.selectFromList = true;
        setTimeout(() => {
            this.selectFromList = false;
        }, 1000);
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