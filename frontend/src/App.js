
import { Routes } from 'react-router-dom';
import './App.css';
import { Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import CreateTasks from './pages/createTasks';
import Dashboard from './pages/UserPage';
import TaskList from './pages/TaskList';
import EditTasks from './pages/EditTasks';
import TaskDetails from './pages/TaskDetails';
import DeleteTask from './pages/DeleteTask';





function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/createTasks" element={<CreateTasks />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tasks" element={<TaskList />} />
      <Route path="/editTasks/:id" element={<EditTasks />} />
      <Route path="/taskDetails/:id" element={<TaskDetails />} />
      <Route path="/deleteTask/:id" element={<DeleteTask />} />
    </Routes>
  );
}

export default App;
