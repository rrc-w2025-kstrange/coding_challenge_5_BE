import { Router } from 'express';
import { 
    createLoan, 
    getAllLoans, 
    getLoanById,
    updateLoan,
    deleteLoan
} from '../controllers/loanController';
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";


const router: Router = Router();

router.get('/', authenticate, authorize({hasRole:["admin", "manager", "officer"], allowSameUser: true}), getAllLoans);
router.get('/:id', authenticate, authorize({hasRole:["admin", "manager", "officer"], allowSameUser: true}), getLoanById);
router.post('/', authenticate, authorize({hasRole:["admin", "manager"], allowSameUser: true}), createLoan);
router.put('/:id', authenticate, authorize({hasRole:["admin", "manager"], allowSameUser: true}), updateLoan);
router.delete('/:id', authenticate, authorize({hasRole:["admin"], allowSameUser: true}), deleteLoan);

export default router;
