const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let projects = [];

app.get('/api/projects', (req,res)=>res.json(projects));

app.post('/api/projects', (req,res)=>{
  const p = {id:Date.now(), name:req.body.name, tasks:[]};
  projects.push(p); 
  io.emit('update', projects); 
  res.json(p);
});

app.post('/api/projects/:id/tasks', (req,res)=>{
  const p = projects.find(x=>x.id==req.params.id);
  const t = {id:Date.now(), title:req.body.title, assignee:req.body.assignee, status:'todo', comments:[]};
  p.tasks.push(t); 
  io.emit('update', projects); 
  res.json(t);
});

server.listen(3001, ()=>console.log('Running at http://localhost:3000'));