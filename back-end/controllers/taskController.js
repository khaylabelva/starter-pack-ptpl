let tasks = [];
let idCounter = 1;

exports.getTasks = (req, res) => {
    res.json(tasks);
};

exports.createTask = (req, res) => {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    const newTask = {
        id: idCounter++,
        title,
        description,
        status,
        priority,
        dueDate,
        assignedTo,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
};

exports.updateTask = (req, res) => {
    const id = parseInt(req.params.id);
    const { title, description, status, priority, dueDate, assignedTo } = req.body;

    const task = tasks.find(t => t.id === id);
    if (!task) return res.sendStatus(404);

    task.title = title;
    task.description = description;
    task.status = status;
    task.priority = priority;
    task.dueDate = dueDate;
    task.assignedTo = assignedTo;
    task.updatedAt = new Date().toISOString();

    res.json(task);
};

exports.deleteTask = (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return res.sendStatus(404);
    tasks.splice(index, 1);
    res.sendStatus(204);
};
