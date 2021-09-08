import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { EmployeeListComponent } from "./pages/employee-list/employee-list.component";
import { UpdateUserComponent } from "./pages/update-user/update-user.component";

const routes = [
    { path: 'list', component: EmployeeListComponent },
    { path: 'update/:userId', component: UpdateUserComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule {
}