import { Router } from 'express';
import { createRegistration, getMyRegistrations, getRegistration } from '../controllers/registrationController.js';
import { initiatePayment, confirmPayment } from '../controllers/paymentController.js';
import validate from '../middleware/validate.js';
import { createRegistrationSchema, paymentConfirmSchema } from '../validators/registrationSchemas.js';

const router = Router();

router.post('/', validate(createRegistrationSchema), createRegistration);
router.get('/my', getMyRegistrations);
router.get('/:id', getRegistration);
router.post('/:registrationId/pay', initiatePayment);
router.post('/payment/confirm', validate(paymentConfirmSchema), confirmPayment);

export default router;
