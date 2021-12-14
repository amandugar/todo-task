const express = require("express")
const mongoose = require("mongoose")
const { v4: uuid } = require("uuid")

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

mongoose.connect(
  "mongodb+srv://amandugar:amandugar@cluster0.y6axd.mongodb.net/todolist-task?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

const taskSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  taskName: {
    type: String,
    required: true,
  },
  taskDescription: {
    type: String,
    required: true,
  },
  taskStatus: {
    type: String,
    required: true,
    enum: ["todo", "inprogress", "done"],
  },
})

const Task = mongoose.model("Task", taskSchema)

app.get("/", (req, res) => {
  res.send("Welcome to Todo List APIs")
})

app.post("/add-task", (req, res) => {
  const task = new Task({
    id: uuid(),
    taskName: req.body.taskName,
    taskDescription: req.body.taskDescription,
    taskStatus: "todo",
  })
  task
    .save()
    .then(() => {
      res.send("Task added successfully")
    })
    .catch(err => {
      res.send(err)
    })
})

app.get("/get-all-tasks", (req, res) => {
  Task.find({}, (err, task) => {
    if (err) {
      res.json({ status: "error", message: err })
    } else {
      res.json({ ...task, status: "success" })
    }
  })
})

app.delete("/delete-task", (req, res) => {
  Task.findOneAndDelete({ id: req.body.id }, (err, task) => {
    if (err) {
      res.json({ status: "error", message: err })
    } else {
      res.json({ status: "success", message: "Task deleted successfully" })
    }
  })
})

app.put("/update-task-status", (req, res) => {
  Task.findOneAndUpdate(
    { id: req.body.id },
    { $set: { taskStatus: req.body.taskStatus } },
    { new: true },
    (err, task) => {
      if (err) {
        res.json({ status: "error", message: err })
      } else {
        res.json({
          status: "success",
          message: "Task updated successfully",
          ...task,
        })
      }
    }
  )
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Server started on port 3000")
})
