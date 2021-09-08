import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDividerModule, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule,
  MatListModule, MatChipsModule, MatFormFieldModule, MatAutocompleteModule
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
import { SearchableDropdownComponent } from '../_components/searchable-dropdown/searchable-dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxLocalStorageModule } from 'ngx-localstorage';

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
];

const declareComponent = [
  HeaderComponent,
  FooterComponent,
  SidebarComponent,
  AreaComponent,
  CardComponent,
  PieComponent,
  SearchableDropdownComponent
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
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
