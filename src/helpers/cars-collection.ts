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

    constructor(props: CarsCollectionProps) {this.props = props;}

    private joinCar = ({ model_id, ...car}: Car) => 
        {
            const {brands, models} = this.props;
            const carBrand = brands.find((brand) => brand.id === carModel?.brand_id);
            const carModel = models.find((model) => model.id === model_id);

            return {...car,brand: (carBrand && carBrand.title) ?? 'undefined', model: (carModel && carModel.title) ?? 'undefined',};
        };

    public get all(): CarJoined[] 
        {
            return this.props.cars.map(this.joinCar);
        }
}

export default CarsCollection;
