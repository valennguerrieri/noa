import { ApplicationConfig, provideZoneChangeDetection, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { provideHttpClient } from '@angular/common/http';

import { importProvidersFrom } from '@angular/core';

import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
registerLocaleData(localeEsAr, 'es-AR');

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideAnimations(), 
    provideToastr({
        timeOut: 3000,
        positionClass: 'toast-top-center',
        preventDuplicates: true,
        closeButton: true,
      }),
    { provide: LOCALE_ID, useValue: 'es-AR' },
    provideCharts(withDefaultRegisterables())
  ]
};
