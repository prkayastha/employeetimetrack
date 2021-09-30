import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Account, Role } from 'src/app/_models';
import { AccountService } from 'src/app/_services';
import { SharedDataService } from '../../../../_services/shared-data.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  Role = Role;
  account: Account;

  collapse: boolean = false;

  constructor(private accountService: AccountService,
    private sharedData: SharedDataService) {
    this.accountService.account.subscribe(x => this.account = x);
  }

  ngOnInit() { }

  toggleSideBar() {
    this.collapse = this.collapse ? false : true;
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
      this.sharedData.emitChange('pieChart', this.collapse);
      this.sharedData.emitChange('areaChart', this.collapse);
    }, 300);
  }

  logout() {
    this.accountService.logout();
  }

}
