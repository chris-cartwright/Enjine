import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'enjine';

  public columnDefs = [
    { headerName: 'Field', field: 'field', sortable: true, filter: true },
    { headerName: 'Left', field: 'left', sortable: true, filter: true },
    { headerName: 'Right', field: 'right', sortable: true, filter: true },
    { headerName: 'Difference', field: 'difference', sortable: true, filter: true }
  ];

  public rowData = [
    { field: 'Toyota', left: '15%', right: '20%', difference: '5%' }
  ];
}
