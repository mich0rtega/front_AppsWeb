import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, message, Spin, Space } from 'antd';
import ProductModalForm from '../products/ProductModal';

interface Product {
  _id?: string;
  name: string;
  price: number;
  status: boolean;
  description: string;
  stock: number;
}

const ProductForm: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (product: Product) => {
    const isEdit = !!product._id;
    const endpoint = isEdit
      ? `http://localhost:3000/api/auth/updateprod/${product._id}`
      : 'http://localhost:3000/api/auth/create';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (!res.ok) throw new Error('Error al guardar producto');

      message.success(isEdit ? 'Producto actualizado' : 'Producto agregado');
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      message.error('Error al guardar producto');
    }
  };

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Precio',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag color={status ? 'green' : 'red'}>{status ? 'Activo' : 'Inactivo'}</Tag>
      ),
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: 'Acciones',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space>
          <Button onClick={() => openEditModal(record)}>Editar</Button>
        </Space>
      ),
    },
  ];

  const openAddModal = () => {
    setSelectedProduct(null);
    setModalVisible(true);
  };

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Lista de Productos</h2>
      <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
        Agregar Producto
      </Button>
      {loading ? (
        <Spin />
      ) : (
        <Table dataSource={products} columns={columns} rowKey="_id" />
      )}
      <ProductModalForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        product={selectedProduct || undefined}
      />
    </div>
  );
};

export default ProductForm;
