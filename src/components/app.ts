import cars from '../data/cars';
import brands from '../data/brands';
import models from '../data/models';
import CarsCollection, { CarProps } from '../helpers/cars-collection';
import Table from './table';
import stringifyProps, { StringifyObjectProps } from '../helpers/stringify-object';
import CarJoined from '../types/car-joined';
import SelectField from './select-field';
import CarForm, { Values } from './car-form';

class App {
  private htmlElement: HTMLElement;

  private carsCollection: CarsCollection;

  private selectedBrandId: null | string;

  private brandSelect: SelectField;

  private carTable: Table<StringifyObjectProps<CarJoined>>;

  private carForm: CarForm;

  private editedCarId: string | null;

  public constructor(selector: string) {
    const foundElement = document.querySelector<HTMLElement>(selector);
    this.carsCollection = new CarsCollection({ cars, brands, models });
    this.editedCarId = null;

    if (foundElement === null) throw new Error(`There is no element with chosen selector '${selector}'`);

    this.carTable = new Table({
      title: 'List of vehicles',
      columns: {
        id: 'Identification',
        brand: 'Brand',
        model: 'Model',
        price: 'Price',
        year: 'Year',
      },
      rowsData: this.carsCollection.allCars.map(stringifyProps),
      onDelete: this.handleCarDelete,
      onEdit: this.handleCarEdit,
      editedCarId: this.editedCarId,
    });

    this.brandSelect = new SelectField({
      labelText: 'Selected brand:',
      onChange: this.handleBrandChange,
      options: [{ title: 'All', value: '0' }, ...brands.map(({ id, title }) => ({ title, value: id }))],
    });

    const originBID = brands[0].id;

    this.carForm = new CarForm({
      title: 'Add new vehicle',
      submitBtnText: 'Add',
      values: {
        brand: originBID,
        model: models.filter((m) => m.brandId === originBID)[0].id,
        price: '',
        year: '',
      },
      isEdited: Boolean(this.editedCarId),
      onSubmit: this.handleCreateCar,
    });

    this.selectedBrandId = null;
    this.htmlElement = foundElement;

    this.initialize();
  }

  private handleBrandChange = (brandId: string): void => {
    const brand = brands.find((b) => b.id === brandId);
    this.selectedBrandId = brand ? brandId : null;
    this.update();
  };

  private handleCarDelete = (carId: string): void => {
    this.carsCollection.deleteCarById(carId);

    this.update();
  };

  private handleCreateCar = ({
 brand, model, price, year,
}: Values): void => {
    const carProps: CarProps = {
      brandId: brand,
      modelId: model,
      price: Number(price),
      year: Number(year),
    };

    this.carsCollection.add(carProps);

    this.update();
  };

  private handleCarEdit = (carId: string) => {
    if (this.editedCarId === carId) {
      this.editedCarId = null;
    } else {
      this.editedCarId = carId;
    }

    this.update();
  };

  private handleUpdateCar = ({
 brand, model, price, year,
}: Values): void => {
    if (this.editedCarId) {
      const carProps: CarProps = {
        brandId: brand,
        modelId: model,
        price: Number(price),
        year: Number(year),
      };

      this.carsCollection.update(this.editedCarId, carProps);
      this.editedCarId = null;

      this.update();
    }
  };

  private update = (): void => {
    const { selectedBrandId, carsCollection, editedCarId } = this;
    if (selectedBrandId === null) {
      this.carTable.updateProps({
        title: 'List of vehicles',
        rowsData: carsCollection.allCars.map(stringifyProps),
        editedCarId,
      });
    } else {
      const brand = brands.find((b) => b.id === selectedBrandId);
      if (brand === undefined) throw new Error('Selected brand does not exist');

      this.carTable.updateProps({
        title: `${brand.title} brand vehicles`,
        rowsData: carsCollection.getByBrandId(selectedBrandId).map(stringifyProps),
        editedCarId,
      });
    }

    if (editedCarId) {
      const editedCar = cars.find((c) => c.id === editedCarId);
      if (!editedCar) {
        console.error('Error! Car does not exist');
        return;
      }

      const model = models.find((m) => m.id === editedCar.modelId);

      if (!model) {
        console.error('Error! Car does not exist');
        return;
      }

      this.carForm.updateProps({
        title: 'Edit vehicle',
        submitBtnText: 'Update',
        values: {
          brand: model.brandId,
          model: model.id,
          price: String(editedCar.price),
          year: String(editedCar.year),
        },
        isEdited: true,
        onSubmit: this.handleUpdateCar,
      });
    } else {
      const initialBrandId = brands[0].id;
      this.carForm.updateProps({
        title: 'Add new vehicle',
        submitBtnText: 'Add',
        values: {
          brand: initialBrandId,
          model: models.filter((m) => m.brandId === initialBrandId)[0].id,
          price: '',
          year: '',
        },
        isEdited: false,
        onSubmit: this.handleCreateCar,
      });
    }
  };

  initialize = (): void => {
    const container = document.createElement('div');
    container.className = 'container d-flex flex-row my-3';

    const createContainer = document.createElement('div');
    createContainer.className = 'd-flex align-items-start';
    createContainer.append(this.carForm.htmlElement);

    container.append(this.brandSelect.htmlElement, this.carTable.htmlElement, createContainer);

    this.htmlElement.append(container);
  };
}

export default App;
