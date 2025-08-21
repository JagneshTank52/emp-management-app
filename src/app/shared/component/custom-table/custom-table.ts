import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { ReplaceUnderscorePipe } from '../../pipes/replace-underscore-pipe';
import { RemoveUnderscorePipe } from '../../pipes/remove-underscore-pipe';

@Component({
  selector: 'app-custom-table',
  imports: [
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    CommonModule,
    ReplaceUnderscorePipe,
    RemoveUnderscorePipe],
  templateUrl: './custom-table.html',
  styleUrl: './custom-table.css'
})
export class CustomTable {
  @Input() dataSource$!: Observable<any[]>;
  @Input() displayedColumns: string[] = [];
  @Input() length!: number;
  @Input() pageSize!: number;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() rowEdit = new EventEmitter<any>();

  onEdit(row: any) {
    this.rowEdit.emit(row);
  }
}
