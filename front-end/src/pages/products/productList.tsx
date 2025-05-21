import React, { useEffect, useState } from 'react';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { stylesMode } from 'src/theme/styles';

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

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      {loading && <Typography color="text.secondary">Loading products...</Typography>}

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
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
            value={form.quantity}
            onChange={onChange}
            required
            fullWidth
          />
          <TextField
            name="price"
            label="Price"
            type="number"
            value={form.price}
            onChange={onChange}
            required
            fullWidth
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained">
              {editingId === null ? 'Add Product' : 'Update Product'}
            </Button>
            {editingId !== null && (
              <Button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialForm);
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Box>
      </Paper>

      {products.map((p) => (
        <Paper key={p.id} sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography fontWeight="bold">{p.name}</Typography>
            <Typography variant="body2">{p.description}</Typography>
            <Typography variant="body2">Qty: {p.quantity}</Typography>
            <Typography variant="body2">Price: ${p.price.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button size="small" variant="outlined" onClick={() => onEdit(p)}>
              Edit
            </Button>
            <Button
              size="small"
              variant="contained"
              color="error"
              onClick={() => onDelete(p.id)}
            >
              Delete
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}