import Car from './car';
import Brand from './brand';
import Model from './model';

type CarJoined = Omit<Car, 'model_id'> & {
    brand: Brand['title'],
    model: Model['title'],
  };
  

export default CarJoined;
