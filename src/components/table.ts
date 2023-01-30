import countObjectProperties from '../helpers/count-object-properties';

export type TableProps<Type> = {
  title: string,
  columns: Type,
  rowsData: Type[],
  editedCarId: string | null,
  onDelete: (id: string) => void,
  onEdit: (id: string) => void,
};

type RowData = {
  id: string,
  [key: string]: string,
};

class Table<Type extends RowData> {
  public htmlElement: HTMLTableElement;

  private props: TableProps<Type>;

  private tbody: HTMLTableSectionElement;

  private thead: HTMLTableSectionElement;

  public constructor(props: TableProps<Type>) {
    this.props = props;
    this.columnCheck();
    this.htmlElement = document.createElement('table');
    this.thead = document.createElement('thead');
    this.tbody = document.createElement('tbody');

    this.initialize();
  }

  private columnCheck = (): void => {
    const { rowsData, columns } = this.props;

    if (this.props.rowsData.length === 0) return;
    const columnCount = countObjectProperties(columns);

    const columnsEqualRows = rowsData.every((row) => {
      const rowCellsCount = countObjectProperties(row);

      return rowCellsCount === columnCount;
    });

    if (!columnsEqualRows) {
      throw new Error(
        'The column and row quantity is different',
      );
    }
  };

private initializeHead = () => {
    const { title, columns } = this.props;

    const headersArrays = Object.values(columns);
    const headersRowHtmlStr = headersArrays.map((header) => `<th>${header}</th>`).join('');

    this.thead.innerHTML = `
    <tr>
      <th colspan="${headersArrays.length + 1}" class="text-center h5">${title}</th>
    </tr>
    <tr>${headersRowHtmlStr}<th>Actions</th></tr>
    `;
  };

  private initializeTbody = () => {
    const { rowsData, columns, editedCarId } = this.props;

    this.tbody.innerHTML = '';
    const rowsHtmlElements = rowsData.map((rowData) => {
    const rowHtmlElement = document.createElement('tr');

    if (editedCarId === rowData.id) { rowHtmlElement.style.backgroundColor = '#f9ffa3'; }

      const cellsHtmlStr = Object.keys(columns).map((key) => `<td>${rowData[key]}</td>`).join(' ');

      rowHtmlElement.innerHTML = cellsHtmlStr;

      this.createActions(rowHtmlElement, rowData.id);

      return rowHtmlElement;
    });
    this.tbody.append(...rowsHtmlElements);
  };

  private createActions = (rowHtmlElement: HTMLTableRowElement, id: string): void => {
    const { onDelete, onEdit, editedCarId } = this.props;

    const buttonCell = document.createElement('td');
    buttonCell.className = 'd-flex gap-2';

    const isCancelButton = editedCarId === id;
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.innerHTML = isCancelButton ? '<i class="fa-regular fa-xmark"></i>' : '<i class="fa-regular fa-pen-to-square"></i>';
    editButton.className = `btn btn-${isCancelButton ? 'dark' : 'warning'}`;
    editButton.style.width = '50px';
    editButton.addEventListener('click', () => onEdit(id));

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.innerHTML = '<i class="fa-regular fa-trash"></i>';
    deleteButton.className = 'btn btn-danger';
    deleteButton.addEventListener('click', () => onDelete(id));
    deleteButton.style.width = '50px';

    buttonCell.append(editButton, deleteButton);
    rowHtmlElement.append(buttonCell);
  };

  private renderView = (): void => {
    this.initialize();
  };

   private initialize = (): void => {
    this.initializeHead();
    this.initializeTbody();

    this.htmlElement.className = 'table table-striped table-bordered rounded rounded-3 overflow-hidden';
    this.htmlElement.append(this.thead, this.tbody);
   };

  public updateProps = (newProps: Partial<TableProps<Type>>): void => {
    this.props = { ...this.props, ...newProps };
    this.renderView();
  };
}

export default Table;
