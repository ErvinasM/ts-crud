type OptionType = {
  title: string;
  value: string;
};

export type SelectFieldProps = {
  labelText: string;
  onChange?: (newValue: string) => void;
  options: OptionType[];
  name?: string;
  value?: string;
};

class SelectField {
  private static intCounter = 0;

  private props: SelectFieldProps;

  private htmlSelectElement: HTMLSelectElement;

  private htmlLabelElement: HTMLLabelElement;

  public htmlElement: HTMLDivElement;

  constructor(props: SelectFieldProps) {
    this.props = props;
    this.htmlElement = document.createElement('div');
    this.htmlSelectElement = document.createElement('select');
    this.htmlLabelElement = document.createElement('label');

    SelectField.intCounter += 1;

    this.initialize();
    this.renderView();
  }

  private initialize = (): void => {
    const elementId = `select-${SelectField.intCounter}`;

    this.htmlLabelElement.setAttribute('for', elementId);

    this.htmlSelectElement.className = 'form-select';
    this.htmlSelectElement.id = elementId;

    this.htmlElement.className = 'form-group';
    this.htmlElement.append(this.htmlLabelElement, this.htmlSelectElement);
  };

  private renderView = (): void => {
    const { labelText, onChange, name } = this.props;

    this.htmlLabelElement.innerHTML = labelText;
    if (onChange) { this.htmlSelectElement.addEventListener('change', () => onChange(this.htmlSelectElement.value)); }
    if (name) { this.htmlSelectElement.name = name; }

    this.renderSelectOptions();
  };

  private renderSelectOptions = (): void => {
    const { options, value } = this.props;

    const optionsHtmlElements = options.map((option) => {
      const element = document.createElement('option');
      element.innerHTML = option.title;
      element.value = option.value;
      element.selected = option.value === value;

      return element;
    });

    this.htmlSelectElement.innerHTML = '';
    this.htmlSelectElement.append(...optionsHtmlElements);
  };

  public updateProps = (newProps: Partial<SelectFieldProps>): void => {
    this.props = { ...this.props, ...newProps };

    this.renderView();
  };
}

export default SelectField;
