import Car from '../types/car';
import Brand from '../types/brand';
import Model from '../types/model';
import CarJoined from '../types/car-joined';

const randomizedID = (): string => String(Math.floor(Math.random() * 256));

export type CarProps = {
    brandId: string;
    modelId: string;
    price: number;
    year: number;
  };

type CarsCollectionProps = {
    cars: Car[],
    brands: Brand[],
    models: Model[],
};

class CarsCollection {
    private props: CarsCollectionProps;

    constructor(props: CarsCollectionProps) { this.props = props; }

    private joinCar = ({ modelId, ...car }: Car) => {
            const { brands, models } = this.props;
            const carModel = models.find((model) => model.id === modelId);
            const carBrand = brands.find((brand) => brand.id === carModel?.brandId);

            return { ...car, brand: (carBrand && carBrand.title) ?? 'undefined', model: (carModel && carModel.title) ?? 'undefined' };
        };

    public get allCars(): CarJoined[] {
            return this.props.cars.map(this.joinCar);
        }

    public getByBrandId = (brandId: string): CarJoined[] => {
        const { cars, models } = this.props;
        const bModelsIds = models.filter((model) => model.brandId === brandId)
        .map((model) => model.id);
        let bCars = cars.filter((car) => bModelsIds.includes(car.modelId)).map(this.joinCar);

        if (brandId === '0') { bCars = cars.map(this.joinCar); }

        return bCars;
    };

    public deleteCarById = (carId: string): void => {
        this.props.cars = this.props.cars.filter((car) => car.id !== carId);
      };

    public add = ({ modelId, brandId, ...carProps }: CarProps): void => {
        const { models, brands, cars } = this.props;
        const model = models.find((m) => m.id === modelId);
        const brand = brands.find((b) => b.id === brandId);

        if (!model || !brand) {
          throw new Error('Incorrect information');
        }

        const newCar: Car = { id: randomizedID(), ...carProps, modelId };

        cars.push(newCar);
      };

      public update = (carId: string, { brandId, modelId, ...props }: CarProps) => {
        const { cars, models, brands } = this.props;

        const updatedCarIndex = cars.findIndex((c) => c.id === carId);
        if (updatedCarIndex === -1) {
          throw new Error(`Klaida: nerastas mašinos id: '${carId}'`);
        }

        const model = models.find((m) => m.id === modelId);
        if (!model) {
          throw new Error(`Klaida: nerastas mašinos modelio id: '${modelId}'`);
        }

        const brand = brands.find((b) => b.id === brandId);
        if (!brand) {
          throw new Error(`Klaida: nerastas mašinos markės id: '${brandId}'`);
        }

        const updatedCar: Car = {
          ...cars[updatedCarIndex],
          ...props,
          modelId,
        };

        this.props.cars.splice(updatedCarIndex, 1, updatedCar);
      };
}

export default CarsCollection;
