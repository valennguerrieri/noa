import { Routes } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './auth/login/login.component';
import { BackgroundComponent } from './shared/background/background.component';
import { HomeComponent } from './pages/home/home.component';

import { AsistenteComponent } from './features/asistente/asistente.component';
import { AgendaComponent } from './features/agenda/agenda.component';
import { NotasComponent } from './features/notas/notas.component';
import { HabitosComponent } from './features/habitos/habitos.component';
import { MetasComponent } from './features/metas/metas.component';
import { GastosComponent } from './features/gastos/gastos.component';
import { AddNotasComponent } from './features/notas/componentes/add-notas/add-notas.component';
import { ListNotasComponent } from './features/notas/componentes/list-notas/list-notas.component';
import { DetailsNotasComponent } from './features/notas/componentes/details-notas/details-notas.component';
import { UpdateNotasComponent } from './features/notas/componentes/update-notas/update-notas.component';
import { AddMetasComponent } from './features/metas/componentes/add-metas/add-metas.component';
import { ListMetasComponent } from './features/metas/componentes/list-metas/list-metas.component';
import { DetailsMetasComponent } from './features/metas/componentes/details-metas/details-metas.component';
import { UpdateMetasComponent } from './features/metas/componentes/update-metas/update-metas.component';
import { AddEventosComponent } from './features/agenda/componentes/add-eventos/add-eventos.component';
import { DetailsEventosComponent } from './features/agenda/componentes/details-eventos/details-eventos.component';
import { DetailsHabitosComponent } from './features/habitos/componentes/details-habitos/details-habitos.component';
import { AddHabitosComponent } from './features/habitos/componentes/add-habitos/add-habitos.component';
import { DetailsGastosComponent } from './features/gastos/componentes/details-gastos/details-gastos.component';
import { AddGastosComponent } from './features/gastos/componentes/add-gastos/add-gastos.component';

export const routes: Routes = [
    { path: '', component: WelcomeComponent },
    { path: 'login', component: LoginComponent},
    { path: 'home', component: HomeComponent},
    { path: 'background', component: BackgroundComponent},

    { path: 'features/asistente', component: AsistenteComponent},
    { path: 'features/notas', component: NotasComponent},
    { path: 'features/habitos', component: HabitosComponent},
    { path: 'features/agenda', component: AgendaComponent},
    { path: 'features/metas', component: MetasComponent},
    { path: 'features/gastos', component: GastosComponent},

    { path: 'features/notas/componentes/add-notas', component: AddNotasComponent},
    { path: 'features/notas/componentes/list-notas', component: ListNotasComponent},
    { path: 'features/notas/componentes/details-notas/:id', component: DetailsNotasComponent}, 
    { path: 'features/notas/componentes/update-notas/:id', component: UpdateNotasComponent}, 

    { path: 'features/metas/componentes/add-metas', component: AddMetasComponent},
    { path: 'features/metas/componentes/list-metas', component: ListMetasComponent},
    { path: 'features/metas/componentes/details-metas/:id', component: DetailsMetasComponent}, 
    { path: 'features/metas/componentes/update-metas/:id', component: UpdateMetasComponent}, 

    { path: 'features/agenda/componentes/add-eventos', component: AddEventosComponent },
    { path: 'features/agenda/componentes/details-eventos/:id', component: DetailsEventosComponent },

    { path: 'features/habitos/componentes/add-habitos', component: AddHabitosComponent },
    { path: 'features/habitos/componentes/details-habitos/:id', component: DetailsHabitosComponent},

    { path: 'features/gastos/componentes/add-gastos', component: AddGastosComponent },
    { path: 'features/gastos/componentes/details-gastos/:id', component: DetailsGastosComponent }


];
