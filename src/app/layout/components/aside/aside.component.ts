import { Component, OnInit } from '@angular/core';
import { TableFormComponent } from "./forms/table-form/table-form.component";
import { AsideMenu } from '../../models/aside-menu.enum';
import { LinkFormComponent } from './forms/link-form/link-form.component';
import { IndexFormComponent } from './forms/index-form/index-form.component';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [TableFormComponent, LinkFormComponent, IndexFormComponent, NgClass],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.css'
})
export class AsideComponent implements OnInit {
  declare view: AsideMenu;
  enum: typeof AsideMenu = AsideMenu;

  ngOnInit(): void {
    this.view = AsideMenu.MAKE_TABLE;
  }

  displayTableMaker() {
    this.view = AsideMenu.MAKE_TABLE;
  }

  displayLinkMaker() {
    this.view = AsideMenu.MAKE_LINK;
  }

  displayIndexMaker() {
    this.view = AsideMenu.MAKE_INDEX;
  }
}
