import { Router } from 'express';
import { 
    getAllResources, 
    getResourceById, 
    createResource,
    updateResource,
    deleteResource
} from '../controllers/resourceController';
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";


const router: Router = Router();

router.get('/', authenticate, authorize({hasRole:["admin", "manager", "officer"], allowSameUser: true}), getAllResources);
router.get('/:id', authenticate, authorize({hasRole:["admin", "manager", "officer"], allowSameUser: true}), getResourceById);
router.post('/', authenticate, authorize({hasRole:["admin", "manager"], allowSameUser: true}), createResource);
router.put('/:id', authenticate, authorize({hasRole:["admin", "manager"], allowSameUser: true}), updateResource);
router.delete('/:id', authenticate, authorize({hasRole:["admin"], allowSameUser: true}), deleteResource);

export default router;
