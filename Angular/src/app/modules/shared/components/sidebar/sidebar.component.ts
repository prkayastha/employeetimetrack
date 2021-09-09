import { Component, OnInit } from '@angular/core';

import { AccountService } from '../../../../_services';
import { Account, Role } from '../../../../_models';
import { UserDetails } from 'src/app/_models/userDetails';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit{
  Role=Role;
  account=Account;

  constructor(private accountService:AccountService,public user:UserDetails) { 
    console.log(user.role);
    //this.accountService.account.subscribe(x=>this.account=x);
  }

  ngOnInit() {
    
  }

}
