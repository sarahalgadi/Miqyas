const router = express.Router();
const loginController = require('../controller/loginController');

// routing 
router.get('/login',loginController.getLogin);
router.post('/login',loginController.postLogin);
router.post('/login',loginController.logout);

