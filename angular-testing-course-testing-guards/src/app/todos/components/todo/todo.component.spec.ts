import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { TodoComponent } from './todo.component';
import { TodosService } from '../../services/todos.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { first } from 'rxjs';
import { SimpleChange } from '@angular/core';

describe('TodoComponent', () => {
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

  it('should toggle a todo', () => {
    jest.spyOn(todosService, 'toggleTodo').mockImplementation(() => {});
    const toggle = fixture.debugElement.query(By.css('[data-testid="toggle"]'));
    toggle.nativeElement.click();
    expect(todosService.toggleTodo).toHaveBeenCalledWith('1');
  });

  it('should remove a todo', () => {
    jest.spyOn(todosService, 'removeTodo').mockImplementation(() => {});
    const destroy = fixture.debugElement.query(
      By.css('[data-testid="destroy"]')
    );
    destroy.nativeElement.click();
    expect(todosService.removeTodo).toHaveBeenCalledWith('1');
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
    jest.spyOn(todosService, 'changeTodo').mockImplementation(() => {});
    component.isEditing = true;
    fixture.detectChanges();

    const edit = fixture.debugElement.query(By.css('[data-testid="edit"]'));
    edit.nativeElement.value = 'foo';
    edit.nativeElement.dispatchEvent(
      new KeyboardEvent('keyup', { key: 'Enter' })
    );
    expect(todosService.changeTodo).toHaveBeenCalledWith('1', 'foo');
  });

  it('should focus after editing activation', fakeAsync(() => {
    component.isEditing = true;
    component.ngOnChanges({
      isEditing: new SimpleChange(false, true, false),
    });
    fixture.detectChanges();
    tick();
    const edit = fixture.debugElement.query(By.css(':focus'));
    expect(edit).toBeTruthy();
  }));
});
