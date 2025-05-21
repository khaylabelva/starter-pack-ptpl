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
} from '@mui/material';

interface Product {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

const initialForm = {
  name: '',
  description: '',
  quantity: 0,
  price: 0,
};

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get<Product[]>(endpoints.products.list);
      setProducts(res.data || res);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: name === 'quantity' || name === 'price' ? Number(value) : value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId === null) {
        await axiosInstance.post(endpoints.products.create, form);
      } else {
        await axiosInstance.put(endpoints.products.update(editingId), form);
      }
      setForm(initialForm);
      setEditingId(null);
      setFormVisible(false);
      fetchProducts();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const onEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
    });
    setEditingId(product.id);
    setFormVisible(true);
  };

  const onDelete = async (id: number) => {
    if (!window.confirm('Are you sure to delete this product?')) return;
    try {
      await axiosInstance.delete(endpoints.products.delete(id));
      fetchProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
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
        <Typography variant="h4">Products</Typography>
        <Button variant="contained" onClick={() => setFormVisible(true)}>
          Add Product
        </Button>
      </Grid>

      {loading ? (
        <Typography color="text.secondary">Loading products...</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p, index) => (
                <TableRow key={p.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{p.description}</TableCell>
                  <TableCell>{p.quantity}</TableCell>
                  <TableCell>Rp{p.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell>
                    <Button size="small" onClick={() => onEdit(p)}>
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => onDelete(p.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No products available.
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
            {editingId === null ? 'Add New Product' : 'Edit Product'}
          </Typography>

          <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Name"
              value={form.name}
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
              name="quantity"
              label="Quantity"
              type="number"
              value={form.quantity === 0 ? '' : form.quantity}
              onChange={onChange}
              required
              fullWidth
            />
            <TextField
              name="price"
              label="Price"
              type="number"
              value={form.price === 0 ? '' : form.price}
              onChange={onChange}
              required
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained">
                {editingId === null ? 'Add Product' : 'Update Product'}
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
