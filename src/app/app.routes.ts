import { Routes } from '@angular/router';
import { HomepageComponent } from './layout/components/main/homepage/homepage.component';
import { MainCanvasComponent } from './layout/components/main/main-canvas/main-canvas.component';
import { TableListComponent } from './layout/components/main/table-list/table-list.component';
import { FlowPageComponent } from './layout/flow/flow-page/flow-page.component';
import { PageComponent } from './layout/components/page/page.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: PageComponent
            },
            {
                path: 'flow',
                component: FlowPageComponent
            }
        ]
    }
];
