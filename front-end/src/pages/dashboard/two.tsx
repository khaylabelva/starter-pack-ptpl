import React, { useEffect, useState } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  MenuItem,
} from '@mui/material';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

const initialForm = {
  title: '',
  description: '',
  status: '',
  priority: '',
  dueDate: '',
  assignedTo: '',
};

const statusOptions = ['Assigned', 'In Progress', 'Completed'];
const priorityOptions = ['Low', 'Medium', 'High', 'Urgent'];

export default function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<Task[]>(endpoints.tasks.list);
      setTasks(res.data || res);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId === null) {
        await axiosInstance.post(endpoints.tasks.create, form);
      } else {
        await axiosInstance.put(endpoints.tasks.update(editingId), form);
      }
      setForm(initialForm);
      setEditingId(null);
      setFormVisible(false);
      fetchTasks();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const onEdit = (task: Task) => {
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      assignedTo: task.assignedTo,
    });
    setEditingId(task.id);
    setFormVisible(true);
  };

  const onDelete = async (id: number) => {
    if (!window.confirm('Are you sure to delete this task?')) return;
    try {
      await axiosInstance.delete(endpoints.tasks.delete(id));
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const onCancel = () => {
    setEditingId(null);
    setForm(initialForm);
    setFormVisible(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4">Tasks</Typography>
        <Button variant="contained" onClick={() => setFormVisible(true)}>
          Add Task
        </Button>
      </Grid>

      {loading ? (
        <Typography color="text.secondary">Loading tasks...</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Assigned To</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {tasks.map((t, index) => (
                <TableRow key={t.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>{t.status}</TableCell>
                  <TableCell>{t.priority}</TableCell>
                  <TableCell>{t.assignedTo}</TableCell>
                  <TableCell>{new Date(t.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => onEdit(t)}>
                      Edit
                    </Button>
                    <Button size="small" color="error" onClick={() => onDelete(t.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {tasks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No tasks available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {formVisible && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
            {editingId === null ? 'Add New Task' : 'Edit Task'}
          </Typography>

          <Box
            component="form"
            onSubmit={onSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              name="title"
              label="Title"
              value={form.title}
              onChange={onChange}
              required
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              value={form.description}
              onChange={onChange}
              required
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              name="status"
              label="Status"
              value={form.status}
              onChange={onChange}
              select
              required
              fullWidth
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="priority"
              label="Priority"
              value={form.priority}
              onChange={onChange}
              select
              required
              fullWidth
            >
              {priorityOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="dueDate"
              label="Due Date"
              type="date"
              value={form.dueDate}
              onChange={onChange}
              InputLabelProps={{ shrink: true }}
              required
              fullWidth
            />
            <TextField
              name="assignedTo"
              label="Assigned To"
              value={form.assignedTo}
              onChange={onChange}
              required
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained">
                {editingId === null ? 'Add Task' : 'Update Task'}
              </Button>
              <Button type="button" onClick={onCancel}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Box>
  );
}