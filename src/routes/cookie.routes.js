import { Router } from "express";
const router = Router();
const cookieCtrl = require('../controllers/cookies.controller')




router.get('/', cookieCtrl.get_cookie);
router.get('/set-cookie', cookieCtrl.set_cookie);
router.get('/clear-cookie', cookieCtrl.delete_cookie);
router.get('/check-cookie', cookieCtrl.check_cookie);



export default router;