import { Opine, Router } from '../deps.ts';
import { PetController } from '../controllers/PetController.ts';

export class PetRoutes {
  static load(app: Opine) {
    const router = new Router();

    router.post('/', PetController.addPet);
    router.get('/:id', PetController.getPet);
    router.get('/', PetController.listPet);

    app.use('/pets',router);
  }
}
