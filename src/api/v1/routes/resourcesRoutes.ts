import { Router } from 'express';
import { 
    getResourceById, 
    createResource,
} from '../controllers/resourceController';
import authenticate from "../middleware/authenticate";
import authorize from "../middleware/authorize";
import { validateRequest } from "../middleware/validate";
import { resourceSchemas } from "../validation/resourceSchemas";


const router: Router = Router();

/**
 * @openapi
 * /resources/{id}:
 *   get:
 *     summary: Retrieve a resource by ID
 *     tags: [Resources]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *           default: 1
 *     responses:
 *       '200':
 *         description: Successfully retrieved resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       '404':
 *         description: Resource not found
 */
router.get('/:id', validateRequest(resourceSchemas.getById), getResourceById);

/**
 * @openapi
 * /resources:
 *   post:
 *     summary: Create a new resource
 *     tags: [Resources]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - type
 *               - url
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Express.js Guide"
 *               type:
 *                 type: string
 *                 example: "documentation"
 *               url:
 *                 type: string
 *                 example: "https://expressjs.com/en/guide"
 *               description:
 *                 type: string
 *                 example: "Official Express.js documentation"
 *     responses:
 *       '201':
 *         description: Resource created successfully
 *       '400':
 *         description: Invalid input data
 */
router.post('/', validateRequest(resourceSchemas.create), createResource);

export default router;
