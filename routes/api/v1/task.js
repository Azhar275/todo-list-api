const express = require('express');
const router = express.Router();
const helper = require(__class_dir + '/helper.class.js');
const m$task = require(__module_dir + '/task.module.js');
const m$user = require(__module_dir + '/user.module.js');

router.post('/', m$user.authenticateToken, async function (req, res, next) {    
    const addTask = await m$task.add(req.body, req.headers['authorization'])    
    helper.sendResponse(res, addTask);
});

router.put('/edit', m$user.authenticateToken, async function (req, res, next) {    
    const editTask = await m$task.update(req.body, req.headers['authorization'])
    helper.sendResponse(res, editTask);
});

router.delete('/delete', m$user.authenticateToken, async function (req, res, next) {    
    const deleteTask = await m$task.delete(req.body, req.headers['authorization'])
    helper.sendResponse(res, deleteTask);
});

router.get('/all', m$user.authenticateToken, async function (req, res, next) {    
    const getAllTask = await m$task.getAll(req.headers['authorization'])
    helper.sendResponse(res, getAllTask);
});

// ==================================================User Related========================================================

router.post('/user/add', async function (req, res, next) {    
    const addUser = await m$user.add(req.body)    
    helper.sendResponse(res, addUser);
});

router.get('/user/find/:id', async function (req, res, next) {    
    const findUser = await m$user.find(req.params.id)    
    helper.sendResponse(res, findUser);
});

router.put('/user/update_pass/:id',async function (req, res, next) {    
    const changeUserPass = await m$user.changePass(req.params.id, req.body)    
    helper.sendResponse(res, changeUserPass);
});

router.delete('/user/delete', async function (req, res, next) {    
    const deleteUser = await m$user.delete(req.body)
    helper.sendResponse(res, deleteUser);
});

router.get('/login', async function (req, res, next) {    
    const login = await m$user.login(req.body)
    helper.sendResponse(res, login);
});



module.exports = router;