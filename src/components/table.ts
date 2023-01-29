export type TableProps<Type> = {
  title: string,
  columns: Type,
  rowsData: Type[],
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
    this.htmlElement = document.createElement('table');
    this.thead = document.createElement('thead');
    this.tbody = document.createElement('tbody');

    this.initialize();
  }

private initializeHead = () => {
    const { title, columns } = this.props;

    const headersArrays = Object.values(columns);
    const headersRowHtmlStr = headersArrays.map((header) => `<th>${header}</th>`).join('');

    this.thead.innerHTML = `
    <tr>
      <th colspan="${headersArrays.length}" class="text-center h3">${title}</th>
    </tr>
    <tr>${headersRowHtmlStr}</tr>
    `;
  };

  private initializeTbody = () => {
    const { rowsData, columns } = this.props;

    this.tbody.innerHTML = '';
    const rowsHtmlElements = rowsData.map((rowData) => {
      const rowHtmlElement = document.createElement('tr');

      const cellsHtmlStr = Object.keys(columns).map((key) => `<td>${rowData[key]}</td>`).join(' ');

      rowHtmlElement.innerHTML = cellsHtmlStr;
      return rowHtmlElement;
    });
    this.tbody.append(...rowsHtmlElements);
  };

   private initialize = (): void => {
    this.initializeHead();
    this.initializeTbody();

    this.htmlElement.className = 'table table-striped table-bordered rounded rounded-3 overflow-hidden';
    this.htmlElement.append(this.thead, this.tbody);
   };
}

export default Table;
