import { TestBed, waitForAsync } from '@angular/core/testing';
import { authGuard } from './auth.guard';
import { of } from 'rxjs';
import { CurrentUserService } from './currentUser.service';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  const mockCurrentUser = {
    currentUser$: of<{ id: string } | null>(null),
  };
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: CurrentUserService,
          useValue: mockCurrentUser,
        },
      ],
    });
    router = TestBed.inject(Router);
  });

  it(
    'returns false for not logged in user',
    waitForAsync(() => {

      // jest.spyOn(router, 'navigateByUrl').mockImplementation();
      spyOn(router, 'navigateByUrl').and.callFake(() => {});

      /**
       * TestBed.runInInjectionContext asegura que el guard se ejecuta con las dependencias necesarias en el contexto adecuado, 
       * facilitando pruebas precisas y evitando errores relacionados con la falta de inyección.
       */
      TestBed.runInInjectionContext(() => {
        return authGuard();
      }).subscribe((result) => {
        expect(result).toBe(false);
        expect(router.navigateByUrl).toHaveBeenCalledWith('/');
      });
    })
  );

  it(
    'returns true for logged in user',
    waitForAsync(() => {
      mockCurrentUser.currentUser$ = of({ id: '1' });
      TestBed.runInInjectionContext(() => {
        return authGuard();
      }).subscribe((result) => {
        expect(result).toBe(true);
      });
    })
  );
});
