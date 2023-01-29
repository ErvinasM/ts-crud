import cars from '../data/cars';
import brands from '../data/brands';
import models from '../data/models';
import CarsCollection from '../helpers/cars-collection';
import Table from './table';
import stringifyProps from '../helpers/stringify-object';

class App {
  private htmlElement: HTMLElement;

  private carsCollection: CarsCollection;

  public constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);
    this.carsCollection = new CarsCollection({ cars, brands, models });

    if (foundElement === null) throw new Error(`Nerastas elementas su selektoriumi '${selector}'`);

    this.htmlElement = foundElement;
  }

  public initialize = (): void => {
    const carTable = new Table({
      title: 'Car list',
      columns: {
        id: 'ID',
        brand: 'Brand',
        model: 'Model',
        price: 'Price',
        year: 'Year',
      },
      rowsData: this.carsCollection.allCars.map(stringifyProps),
    });
    const container = document.createElement('div');
    container.className = 'container my-3';
    container.appendChild(carTable.htmlElement);
    this.htmlElement.append(container);
  };
}

export default App;
