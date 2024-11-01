import { Routes } from '@angular/router';
import { HomepageComponent } from './layout/components/main/homepage/homepage.component';
import { MainCanvasComponent } from './layout/components/main/main-canvas/main-canvas.component';
import { TableListComponent } from './layout/components/main/table-list/table-list.component';

export const routes: Routes = [
    { path: '', component: HomepageComponent },
    { path: 'canvas', component: MainCanvasComponent },
    { path: 'list', component: TableListComponent }
];
