import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Account,Role } from 'src/app/_models';
import { AccountService } from 'src/app/_services';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  
  
  Role = Role;
  account: Account;

  constructor(private accountService: AccountService) {
      this.accountService.account.subscribe(x => this.account = x);
  }

  ngOnInit() { }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }
  logout() {
    this.accountService.logout();
}

}
