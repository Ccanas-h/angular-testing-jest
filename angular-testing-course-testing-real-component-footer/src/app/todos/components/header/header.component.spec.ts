import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { TodosService } from '../../services/todos.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let todosService: TodosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    todosService = TestBed.inject(TodosService);
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });



  //Ese esta hecho con JET pero es lo mismo que el de abajo. 
  // it('should add a todo', () => {
  //   jest.spyOn(todosService, 'addTodo').mockImplementation(() => {});
  //   const input = fixture.debugElement.query(
  //     By.css('[data-testid="newTodoInput"]')
  //   );
  //   input.nativeElement.value = 'foo';
  //   input.nativeElement.dispatchEvent(
  //     new KeyboardEvent('keyup', { key: 'Enter' })
  //   );
  //   expect(todosService.addTodo).toHaveBeenCalledWith('foo');
  //   expect(component.text).toEqual('');
  // });


  it('should add a todo MEE', () => {
    // En Jasmine, se usa `spyOn` para espiar el método `addTodo` del servicio `todosService`
    // Simulamos la implementación de `addTodo` para que no realice ninguna acción real.
    spyOn(todosService, 'addTodo').and.callFake(() => {});
  
    // Se busca el input en el DOM del componente
    const input = fixture.debugElement.query(
      By.css('[data-testid="newTodoInput"]')
    );
  
    // Simula que el usuario ha escrito 'foo' en el input
    input.nativeElement.value = 'foo';
  
    // Simula que el usuario presiona la tecla 'Enter'
    input.nativeElement.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Enter' })
    );
  
    // Verifica que el método `addTodo` fue llamado con el argumento 'foo'
    expect(todosService.addTodo).toHaveBeenCalledWith('foo');
  
    // Verifica que el campo de texto se haya vaciado después de agregar el todo
    expect(component.text).toEqual('');
  });
  


});
