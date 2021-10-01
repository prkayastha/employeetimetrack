import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDividerModule, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule,
  MatListModule, MatChipsModule, MatFormFieldModule, MatAutocompleteModule, MatTableModule, MatSortModule, MatPaginatorModule, MatDialogModule, MatProgressSpinnerModule, MatProgressBarModule
} from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AreaComponent } from './widgets/area/area.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { CardComponent } from './widgets/card/card.component';
import { PieComponent } from './widgets/pie/pie.component';
import { SearchableDropdownComponent } from '../../_components/searchable-dropdown/searchable-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { TableComponent } from '../../_components/table/table.component';
import { FilterOptionComponent } from '../../_components/filterOption/filter-option.component';
import { SpinnerComponent } from '../../_components/spinner/spinner.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

const matModules = [
  MatDividerModule,
  MatToolbarModule,
  MatIconModule,
  MatChipsModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatButtonModule,
  MatMenuModule,
  MatListModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorModule,
  MatIconModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatProgressBarModule
];

const declareComponent = [
  HeaderComponent,
  FooterComponent,
  SidebarComponent,
  AreaComponent,
  CardComponent,
  PieComponent,
  SearchableDropdownComponent,
  TableComponent,
  FilterOptionComponent,
  SpinnerComponent,
  DashboardComponent
]

@NgModule({
  declarations: [
    ...declareComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxLocalStorageModule.forRoot(),
    FlexLayoutModule,
    RouterModule,
    HighchartsChartModule,
    FormsModule,
    ReactiveFormsModule,
    ...matModules
  ],
  exports: [
    ...declareComponent,
    ...matModules,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule
  ]
})
export class SharedModule { }
