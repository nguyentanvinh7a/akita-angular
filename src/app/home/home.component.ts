import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { filter, switchMap, take } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';

import { TodoQuery } from '../state/query';
import { TodoStore } from '../state/store';
import { Todo } from '../todo.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
@Injectable({
  providedIn: 'root',
})
export class HomeComponent implements OnInit {
  loading = false;
  todos: Todo[] = [];

  constructor(
    private router: Router,
    private todoQuery: TodoQuery,
    private todoStore: TodoStore,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    //this.todoQuery.getLoading().subscribe((res: boolean) => this.loading = res);
    this.todoQuery.getTodos().subscribe(res => this.todos = res);
    this.todoQuery.getLoaded().pipe(
      take(1),
      filter(res => !res),
      switchMap(() => {
        this.todoStore.setLoading(true);
        return this.apiService.getTodos();
      })
    ).subscribe(res => {
      this.todoStore.update(state => {
        return {
          todos: res
        }
      })
      this.todoStore.setLoading(false);
    }, err => {
      console.log(err);
      this.todoStore.setLoading(false);
    });
  }

  addTodo() {
    this.router.navigateByUrl('/add-todo');
  }

}
