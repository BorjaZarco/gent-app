import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DiagramDetailsComponent } from './pages/diagram/diagram-details/diagram-details.component';
import { DiagramComponent } from './pages/diagram/diagram.component';

const routes: Routes = [
  { path: '', redirectTo: 'diagram', pathMatch: 'full' },
  {
    path: 'diagram',
    component: DiagramComponent,
    children: [{ path: ':id', component: DiagramDetailsComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
