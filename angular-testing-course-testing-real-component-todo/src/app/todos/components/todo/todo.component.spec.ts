import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoComponent } from './todo.component';
import { TodosService } from '../../services/todos.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { first } from 'rxjs';

fdescribe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let todosService: TodosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TodoComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    todosService = TestBed.inject(TodosService);
    component.todo = {
      id: '1',
      text: 'foo',
      isCompleted: false,
    };
    component.isEditing = false;
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  it('has a correct initial state', () => {
    const todo = fixture.debugElement.query(By.css('[data-testid="todo"]'));
    const edit = fixture.debugElement.query(By.css('[data-testid="edit"]'));
    const label = fixture.debugElement.query(By.css('[data-testid="label"]'));
    expect(todo.classes['completed']).not.toBeDefined();
    expect(todo.classes['editing']).not.toBeDefined();
    expect(edit).toBeFalsy();
    expect(label.nativeElement.textContent).toEqual('foo');
  });


  it('should toggle a todo made by ME', () => {
    // jest.spyOn(todosService, 'toggleTodo').mockImplementation(() => {});
    spyOn(todosService, 'toggleAll').and.callFake(() => {});
    const check = fixture.debugElement.query(By.css('[data-testid="toggle"]'));
    check.nativeElement.click();
    expect(todosService.toggleTodo).toHaveBeenCalledWith('1');
  });

  it('should toggle a todo', () => {
    // jest.spyOn(todosService, 'toggleTodo').mockImplementation(() => {});
    spyOn(todosService, 'toggleAll').and.callFake(() => {});
    const toggle = fixture.debugElement.query(By.css('[data-testid="toggle"]'));
    toggle.nativeElement.click();
    expect(todosService.toggleTodo).toHaveBeenCalledWith('1');
  });


  it('should remove a todo made by ME', () => {
    // jest.spyOn(todosService, 'toggleTodo').mockImplementation(() => {});
    spyOn(todosService, 'removeTodo').and.callFake(() => {});
    const button = fixture.debugElement.query(By.css('[data-testid="destroy"]'));
    button.nativeElement.click();
    expect(todosService.removeTodo).toHaveBeenCalledWith('1');
  });

  it('should remove a todo', () => {
    // jest.spyOn(todosService, 'removeTodo').mockImplementation(() => {});
    spyOn(todosService, 'removeTodo').and.callFake(() => {});
    const destroy = fixture.debugElement.query(
      By.css('[data-testid="destroy"]')
    );
    destroy.nativeElement.click();
    expect(todosService.removeTodo).toHaveBeenCalledWith('1');
  });


  it('should activate editing made by ME', () => { 
    const label = fixture.debugElement.query(
      By.css('[data-testid="destroy"]')
    );
    label.nativeElement.dblclick();
    expect(component.setEditingId.emit).toHaveBeenCalledWith('1');
  });

  it('should activate editing', () => {
    const label = fixture.debugElement.query(By.css('[data-testid="label"]'));
    let clickedTodoId: string | null | undefined;
    component.setEditingId.pipe(first()).subscribe((todoId) => {
      clickedTodoId = todoId;
    });
    label.triggerEventHandler('dblclick');
    expect(clickedTodoId).toEqual('1');
  });

  it('should change todo', () => {
    // jest.spyOn(todosService, 'changeTodo').mockImplementation(() => {});
    spyOn(todosService, 'changeTodo').and.callFake(() => {});
    component.isEditing = true;
    fixture.detectChanges();

    const edit = fixture.debugElement.query(By.css('[data-testid="edit"]'));
    edit.nativeElement.value = 'foo';

    // Simula el evento de teclado 'keyup' con la tecla 'Enter' en el elemento edit para desencadenar 
    // el cambio del "todo", permitiendo probar la interacción de edición en los tests.
    edit.nativeElement.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Enter' })
    );
    expect(todosService.changeTodo).toHaveBeenCalledWith('1', 'foo');
  });
});
