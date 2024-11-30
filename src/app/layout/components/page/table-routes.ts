import { Routes } from "@angular/router";
import { HomepageComponent } from "../main/homepage/homepage.component";
import { MainCanvasComponent } from "../main/main-canvas/main-canvas.component";
import { TableListComponent } from "../main/table-list/table-list.component";

export const tableRoutes: Routes = [
    {
        path: '',
        children: [
            { path: '', component: HomepageComponent },
            { path: 'canvas', component: MainCanvasComponent },
            { path: 'list', component: TableListComponent }
        ]
    }
]