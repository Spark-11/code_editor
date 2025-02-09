var express = require('express');
const { signUp, login,createProject, savedProject, getProjects, getProject, deleteProject, editProject } = require('../controllers/userController');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/signUp',signUp)
router.post('/login',login)
router.post('/createProject',createProject)
router.post('/savedProject', savedProject)
router.post('/getProjects', getProjects)
router.post('/getProject', getProject)
router.post('/deleteProject',deleteProject)
router.post('/editProject',editProject)
module.exports = router;
