
const express = require('express');
const cors = require('cors');
const server = express();

/**
 * Список задач
 */
let tasks = Array.from({ length: 14 }, (x, id) => ({
    id,
    name: `Задача ${id + 1}`,
    text: 'Здесь написано что надо сделать'
}));
/**
 * Все задачи
 * @param {*} req 
 * @param {*} res 
 */
const getAllTasks = (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(tasks);
};
/**
 * 1 задача
 * @param {*} req 
 * @param {*} res 
 */
const getTask = (req, res) => {
    const wantedId = req.query.id;
    const task = tasks.find(({id}) => id === wantedId);

    if (task) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.send(task);
    } else {
        res.send({ error: `Нет задачи с id ${wantedId}` });
    }
};
/**
 * Создание задачи
 * @param {*} req 
 * @param {*} res 
 */
const createTask = (req, res) => {
    // здесь можно добавить генерацию уникальных id
    const id = Date.now();
    const task = {
        id,
        name: `Задача ${id + 1}`,
        text: 'Здесь написано что надо сделать'
    };

    tasks.push(task);

    res.send(task);
};
/**
 * Редактирование задачи
 * @param {*} req 
 * @param {*} res 
 */
const editTask = (req, res) => {
    const task = req.body.task;

    if (task) {
        const ownTask = tasks.find(({id}) => id === task.id);

        if (ownTask) {
            ownTask.name = task.name;
            ownTask.text = task.text;

            res.send(task);
        } else {
            res.sendErrorCode(404);
        }
    } else {
        res.sendErrorCode(400);
    }
};
/**
 * Удаление задачи
 * @param {*} req 
 * @param {*} res 
 */
const deleteTask = (req, res) => {
    const deletedId = req.query.id;

    if (!isNaN(deletedId)) {
        console.log(deletedId, tasks);
        tasks = tasks.filter(({id}) => id != deletedId);

        res.send();
    } else {
        res.sendErrorCode(400);
    }
};

server.use(express.json());
server.use(cors());

server.get('/all', getAllTasks);
server.get('/task', getTask);
server.post('/create', createTask);
server.put('/edit', editTask);
server.delete('/delete', deleteTask);

server.listen(8080);