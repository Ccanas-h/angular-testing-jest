import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainComponent } from './main.component';
import { TodosService } from '../../services/todos.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TodoInterface } from '../../types/todo.interface';
import { TodoComponent } from '../todo/todo.component';
import { By } from '@angular/platform-browser';

// Shallow testing
@Component({
  standalone: true,
  selector: 'app-todos-todo',
  template: '',
})
class TodoComponentMock {
  @Input({ required: true }) todo!: TodoInterface;
  @Input({ required: true }) isEditing!: boolean;
  @Output() setEditingId: EventEmitter<string | null> = new EventEmitter();
}

fdescribe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let todosService: TodosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MainComponent, HttpClientTestingModule],
    })
      .overrideComponent(MainComponent, {
        remove: { imports: [TodoComponent] },
        add: { imports: [TodoComponentMock] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    todosService = TestBed.inject(TodosService);
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });

  describe('component visibility', () => {
    it('should be hidden without todos', () => {
      const main = fixture.debugElement.query(By.css('[data-testid="main"]'));
      expect(main.classes['hidden']).toEqual(true);
    });
    it('should be visible with todos', () => {
      todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: false }]);
      fixture.detectChanges();
      const main = fixture.debugElement.query(By.css('[data-testid="main"]'));
      expect(main.classes['hidden']).not.toBeDefined();
    });
  });

  it('should highlight toggle all checkbox MADE BY ME', () => {
    todosService.todosSig.set([
        {id:"1", text: "uno", isCompleted: true},
        {id:"2", text: "dos", isCompleted: true}
    ]);
    fixture.detectChanges();
    const main = fixture.debugElement.query(By.css('[data-testid="toggleAll"]'));
    expect(main.nativeElement.checked).toEqual(true);
  });


  it('should highlight toggle all checkbox', () => {
    todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: true }]);
    fixture.detectChanges();
    const toggleAll = fixture.debugElement.query(
      By.css('[data-testid="toggleAll"]')
    );
    expect(toggleAll.nativeElement.checked).toEqual(true);
  });


  it('should toggle all todos made by ME', () => {
    // Crea un espía en el método `toggleAll` del servicio `todosService`.
    // No estamos interesados en probar la funcionalidad interna de `toggleAll`,
    // sino el comportamiento del componente que llama a este método.
    // Por eso, reemplazamos la implementación real del método por una función vacía.
    // Esto nos permite simplemente verificar que el método fue llamado correctamente.
    spyOn(todosService, 'toggleAll').and.callFake(() => {});
    /**
     * verifica que el método toggleAll del servicio fue llamado con el argumento true.
     * Aunque en la prueba hemos reemplazado la implementación del método con una función vacía
     * usando spyOn o mockImplementation, el espía (spy) creado por spyOn todavía registra todos
     * los llamados que se hacen a esa función, incluyendo los argumentos con los que fue llamada.
     */
  
    // Simulamos que el signal `todosSig` tiene dos todos incompletos.
    // Esto es importante para que el estado del componente refleje que hay tareas por completar.
    todosService.todosSig.set([
        {id:"1", text: "uno", isCompleted: false},
        {id:"2", text: "dos", isCompleted: false}
    ]);
  
    // Busca el checkbox o botón que marca/desmarca todos los todos (toggle all) en el DOM del componente,
    // utilizando un identificador de `data-testid="toggleAll"`.
    const toggleAll = fixture.debugElement.query(
        By.css('[data-testid="toggleAll"]')
    );
  
    // Actualiza la vista del componente para reflejar los cambios realizados en los todos.
    fixture.detectChanges();
  
    // Simula un clic en el elemento de "toggle all".
    // Esto debería desencadenar la lógica del componente para marcar/desmarcar todos los todos.
    toggleAll.nativeElement.click();
  
    // Verifica que el método `toggleAll` del servicio fue llamado con el argumento `true`,
    // lo que indica que todos los todos deberían marcarse como completados.
    expect(todosService.toggleAll).toHaveBeenCalledWith(true);
  });
  


  it('should toggle all todos', () => {
    // jest.spyOn(todosService, 'toggleAll').mockImplementation(() => {});
    spyOn(todosService, 'toggleAll').and.callFake(() => {});
    todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: true }]);
    fixture.detectChanges();
    const toggleAll = fixture.debugElement.query(
      By.css('[data-testid="toggleAll"]')
    );
    toggleAll.nativeElement.click();
    expect(todosService.toggleAll).toHaveBeenCalledWith(false);
  });

  it('should render a list of todos', () => {
    todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: false }]);
    fixture.detectChanges();
    const todos = fixture.debugElement.queryAll(By.css('[data-testid="todo"]'));
    expect(todos.length).toEqual(1);
    // `componentInstance` accede directamente a la instancia del componente, 
    // En este caso accede a los componentes hijos ya que son un array de <app-todos-todo
    // permitiendo verificar sus propiedades y métodos internos.
    expect(todos[0].componentInstance.todo).toEqual({
      id: '1',
      text: 'foo',
      isCompleted: false,
    });
    expect(todos[0].componentInstance.isEditing).toEqual(false);
  });

  it('should change editingId', () => {
    todosService.todosSig.set([{ id: '1', text: 'foo', isCompleted: false }]);
    fixture.detectChanges();
    const todos = fixture.debugElement.queryAll(By.css('[data-testid="todo"]'));
    todos[0].componentInstance.setEditingId.emit('1');
    expect(component.editingId).toEqual('1');
  });
});
