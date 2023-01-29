import Car from '../types/car';
import Brand from '../types/brand';
import Model from '../types/model';
import CarJoined from '../types/car-joined';

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
        const bCars = cars.filter((car) => bModelsIds.includes(car.modelId)).map(this.joinCar);

        return bCars;
    };
}

export default CarsCollection;
