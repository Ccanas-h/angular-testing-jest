import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { TodosService } from '../../services/todos.service';
import { FilterEnum } from '../../types/filter.enum';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let todosService: TodosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FooterComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    todosService = TestBed.inject(TodosService);
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  describe('component visibility', () => {
    it('should be hidden when no todos', () => {
      const footer = fixture.debugElement.query(
        By.css('[data-testid="footer"]')
      );
      expect(footer.classes['hidden']).toEqual(true);
    });

    it('should be visible with todos MADE BY ME', () => {
      // Simula la configuración del signal `todosSig` con un array que contiene un todo activo (no completado)
      todosService.todosSig.set([
        {
          id: '1',
          text: 'foo',
          isCompleted: false
        }
      ]);
    
      // Forza la detección de cambios para actualizar el DOM y reflejar el nuevo estado del signal `todosSig`
      fixture.detectChanges();
  
      // Busca el elemento del DOM que tiene el atributo `data-testid="footer"`
      const footer = fixture.debugElement.query(
        By.css('[data-testid="footer"]')
      );
    
      // Verifica que el elemento `footer` no tenga la clase `hidden`.
      // Esto indica que el footer es visible porque hay al menos un todo activo
      expect(footer.classes['hidden']).not.toBeDefined();
    });
    

    it('should be visible with todos', () => {
      todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: false }]);
      fixture.detectChanges();
      const footer = fixture.debugElement.query(
        By.css('[data-testid="footer"]')
      );
      expect(footer.classes['hidden']).not.toBeDefined();
    });
  });


  describe('counter ACTIVES Todos Made BY ME', () => {
    it('should count actives Todos', () => {
      todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: false }]);
      fixture.detectChanges();

      const todoCountElement = fixture.debugElement.query(
        By.css('[data-testid="todoCount"] strong') // Especifica el selector para el elemento <strong> dentro del contenedor
      );

      // Obtén el contenido de texto dentro del strong (el valor del activeCount)
      const activeCountText = todoCountElement.nativeElement.textContent.trim();
      expect(activeCountText).toBe('1');
    });
  });


  describe('counters', () => {
    it('renders counter for 1 todo', () => {
      todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: false }]);
      fixture.detectChanges();
      const todoCount = fixture.debugElement.query(
        By.css('[data-testid="todoCount"]')
      );
      expect(todoCount.nativeElement.textContent).toContain('1 item left');
    });

    it('renders counter for 2 todos', () => {
      todosService.todosSig.set([
        { id: '1', text: 'foo', isCompleted: false },
        { id: '2', text: 'bar', isCompleted: false },
      ]);
      fixture.detectChanges();
      const todoCount = fixture.debugElement.query(
        By.css('[data-testid="todoCount"]')
      );
      expect(todoCount.nativeElement.textContent).toContain('2 items left');
    });
  });


  describe('filters ME', () => {
    it('highlights default filter ME', () => {
      const filterLinks = fixture.debugElement.queryAll(
        By.css('[data-testid="filterLink"]')
      );

      expect(filterLinks[0].classes["selected"]).toBeDefined();
      expect(component.filterSig()).toBe("all");
    });

    it('highlights changed filter ME', () => {
      // component.filterSig.set(FilterEnum.active); Puede ser de esta forma tambien. 
      const filterLinks = fixture.debugElement.queryAll(
        By.css('[data-testid="filterLink"]')
      );

      //Hacer click en opcion "Active" desde el dom. 
      filterLinks[1].triggerEventHandler('click');
      fixture.detectChanges();

      expect(filterLinks[1].classes["selected"]).toBeDefined();
      expect(component.filterSig()).toBe("active");

    });

  });


  describe('filters', () => {
    it('highlights default filter', () => {
      const filterLinks = fixture.debugElement.queryAll(
        By.css('[data-testid="filterLink"]')
      );
      expect(filterLinks[0].classes['selected']).toBe(true);
    });

    it('highlights changed filter', () => {
      //Aqui verifico que tras cambiar el estado del signal, este tras una deteccion de cambios
      //Este tambien cambia lo que ve el usuario activado. 
      todosService.filterSig.set(FilterEnum.active);
      fixture.detectChanges();
      const filterLinks = fixture.debugElement.queryAll(
        By.css('[data-testid="filterLink"]')
      );
      expect(filterLinks[1].classes['selected']).toBe(true);
    });

    it('changes a filter', () => {
      const filterLinks = fixture.debugElement.queryAll(
        By.css('[data-testid="filterLink"]')
      );

      //Aqui force el click al "active" y verifico si cambio el filterSig correctamente. 
      filterLinks[1].triggerEventHandler('click');
      expect(todosService.filterSig()).toBe(FilterEnum.active);
    });
  });
});
