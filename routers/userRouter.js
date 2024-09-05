const Router = require( 'express' );
const router = new Router();
const userController = require( '../controllers/userController' );
const authMiddleware = require( '../middlewares/authMiddleware' );

router.get( '/:id', userController.getOne );
router.put( '/:id', authMiddleware, userController.update );
router.delete( '/:id', authMiddleware, userController.delete );

module.exports = router;