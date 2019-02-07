import { Component } from '@angular/core';

type ValueList = { [key: string]: number };
type RowData = { field: string, left: number, right: number, difference: number | null };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private leftValues: ValueList = {};
  private rightValues: ValueList = {};

  public title = 'enjine';

  public columnDefs = [
    { headerName: 'Field', field: 'field', sortable: true, filter: true, sort: 'asc' },
    { headerName: 'Left', field: 'left', sortable: true, filter: true, valueFormatter: this.percentFormatter },
    { headerName: 'Right', field: 'right', sortable: true, filter: true, valueFormatter: this.percentFormatter },
    { headerName: 'Difference', field: 'difference', sortable: true, filter: true, valueFormatter: this.percentFormatter }
  ];

  public rowData: RowData[];

  public changeListener(leftRight: 'left' | 'right', files: FileList) {
    console.log(files);
    if (!files || files.length == 0) {
      return;
    }

    let reader = new FileReader();
    reader.onloadend = (_) => {
      const csv = reader.result as string;
      let atData = false;
      let output: ValueList = {};
      for (let line of csv.split('\n').map(s => s.trim())) {
        const values = line.split(',');
        if (!values || values.length < 2) {
          continue;
        }

        if (!atData && values[0].match(/holding\s+name/i)) {
          atData = true;
          // Header row. Continue to the next row.
          continue;
        }

        if (!atData) {
          continue;
        }

        output[values[0]] = parseFloat(values[1].replace(/[^0-9\.]/g, ''));
      }

      switch (leftRight) {
        case 'left':
          this.leftValues = output;
          break;

        case 'right':
          this.rightValues = output;
          break;
      }

      this.calculate();
    };

    reader.readAsText(files.item(0));
  }

  private calculate() {
    this.rowData = [];
    if (!this.leftValues
      || this.leftValues.length === 0
      || !this.rightValues
      || this.rightValues.length === 0) {
      return;
    }

    for (let entry of Object.entries(this.leftValues)) {
      let left = entry[1];
      let right = this.rightValues[entry[0]];

      this.addRow(entry[0], left, right);
    }

    for (let entry of Object.entries(this.rightValues).filter(v => this.leftValues[v[0]] == undefined)) {
      let left = this.leftValues[entry[0]];
      let right = entry[1];

      this.addRow(entry[0], left, right);
    }
  }

  private addRow(field: string, left: number, right: number) {
    let difference = Math.abs(left - right);
    if (isNaN(difference)) {
      difference = null;
    }

    this.rowData.push({
      field: field,
      left: left,
      right: right,
      difference: difference
    });
  }

  private percentFormatter(value: any) {
    if (!!value.value) {
      return `${value.value}%`;
    }

    return '';
  }
}
