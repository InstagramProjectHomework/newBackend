import { Router } from "express";
const router = Router();

import * as authCtrl from '../controllers/auth.controller';
import * as postCtrl from '../controllers/post.controller';
import * as commentCtrl from '../controllers/comment.controller';
import { authJwt, verifyCredentials } from "../middlewares";

//Sign Up (Registration)
router.get('/signup', () => { });
router.post('/signup', authCtrl.signup_post);

//Log In (Authentication)
router.post('/login', authCtrl.login_post);
router.get('/login', authJwt.verifyToken, authCtrl.login_get);

//Log Out (End User Session)
router.get('/logout', authCtrl.logout_get);

//User Management
router.get('/user/:user');
router.patch('/user/userupdate/:userId', authJwt.verifyToken, authCtrl.user_update,);
router.post('/user/verifyEmail/:token', authCtrl.verifyEmail);

//Posts Management
router.post('/post',authJwt.verifyToken, postCtrl.create_post);
router.get('/post/all', authJwt.verifyToken, postCtrl.allposts);
router.get('/post/:postid', authJwt.verifyToken, postCtrl.getpostbyid);

//Comments Management
router.post('/comment/:postid', authJwt.verifyToken, commentCtrl.createcomment);
router.get('/comment/:commentid', authJwt.verifyToken, commentCtrl.getcomment);

export default router;