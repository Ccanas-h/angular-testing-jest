import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';
import { UtilsService } from '../../services/utils.service';
import { By } from '@angular/platform-browser';
import { first } from 'rxjs';

fdescribe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  /**
   * Existen dos opciones para importar  y usar una dependencia externa del componente. 
   * Podemos usarla directamente, en cuyo caso solo basta con colocar providers: [UtilsService],
   * Y podemos mockearla. En en ese caso se debe hacer lo siguiente. 
   */
  const mockUtilService = {
    range: () => [1, 2, 3, 4, 5] //Esto es asi dado que colocamos total 50 y limite 10. 5 paginas en total.
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaginationComponent],
      // providers: [UtilsService],
      providers: [{ provide: UtilsService, useValue: mockUtilService }],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    component.total = 50;
    component.limit = 10;
    component.currentPage = 1;
    fixture.detectChanges();
  });

  it('creates component', () => {
    expect(component).toBeTruthy();
  });

  /**
     * Esta prueba se asegura de que la paginación se renderice correctamente.
     * Utilizamos `By.css()` para encontrar todos los elementos que representan los contenedores de página.
     */
  it('renders correct pagination', () => {
    // Se buscan todos los elementos de la paginación (cada número de página).
    const pageContainers = fixture.debugElement.queryAll(
      By.css('[data-testid="page-container"]') // Usamos un atributo `data-testid` para localizar los elementos de paginación.
    );

    // Verificamos que haya 5 páginas, que es lo que esperamos dado el mock y las configuraciones de `total` y `limit`.
    expect(pageContainers.length).toBe(5);
    // Verificamos que el primer contenedor de página tenga el texto '1'.
    expect(pageContainers[0].nativeElement.textContent).toContain('1');
  });

  /**
   * Esta prueba verifica que cuando se hace clic en una página de la paginación,
   * el evento `pageChangeEvent` se emita con el número de página correcto.
   */
  it('should emit a clicked page', () => {
    // Se buscan los elementos de la paginación.
    const pageContainers = fixture.debugElement.queryAll(
      By.css('[data-testid="page-container"]')
    );
    let clickedPage: number | undefined;

    // Nos suscribimos al evento `pageChangeEvent` y guardamos el valor emitido en `clickedPage`.
    component.pageChangeEvent.pipe(first()).subscribe((page) => {
      clickedPage = page;
    });

    // Simulamos un clic en la primera página.
    pageContainers[0].triggerEventHandler('click');

    // Verificamos que la página clickeada sea la 1 (porque clickeamos la primera página).
    expect(clickedPage).toEqual(1);
  });

  /**
   * Prueba similar a la anterior, pero en lugar de simular un clic en el DOM,
   * invocamos directamente el método `selectPage` del componente.
   * Esto permite probar la lógica del método `selectPage` sin interactuar con el DOM.
   */
  it('should emit a clicked page made By ME', () => {
    let paginaClickeada: number | undefined;

    // Nos suscribimos al evento `pageChangeEvent` y guardamos el valor emitido en `paginaClickeada`.
    component.pageChangeEvent.subscribe(data => {
      paginaClickeada = data;
    });

    // Llamamos directamente a `selectPage` con el número de página 2.
    component.selectPage(2);

    // Verificamos que el evento haya emitido la página 2.
    expect(paginaClickeada).toBe(2);
  });

});