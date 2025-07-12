import React, { useEffect, useState } from "react";
import { Table, Typography, Tag, Button, message } from "antd";
import OrderModal from "../orders/OrderModal";

const { Title } = Typography;

interface User {
  _id: string;
  username: string;
}

const OrdersTable = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/allorders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error("Error al obtener órdenes:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

 const handleSave = async (order: any) => {
  const isEdit = !!order._id;
  const endpoint = isEdit
    ? `http://localhost:3000/api/auth/orders/${order._id}`
    : "http://localhost:3000/api/auth/orders";

  const method = isEdit ? "PUT" : "POST";

  console.log("Enviando orden:", order);

  try {
    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Error al guardar orden");
    }
    message.success(isEdit ? "Orden actualizada" : "Orden creada con éxito");
    setModalVisible(false);
    setEditingOrder(null);
    fetchOrders();
  } catch (err: any) {
    console.error(err);
    message.error(err.message || "Error al guardar orden");
  }
};




  const openAddModal = () => {
    setEditingOrder(null);
    setModalVisible(true);
  };

  const openEditModal = (order: any) => {
    setEditingOrder(order);
    setModalVisible(true);
  };

  const columns = [
    {
      title: "Usuario",
      dataIndex: ["userCreate", "username"],
      key: "userCreate",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color =
          status === "completed"
            ? "green"
            : status === "cancelled"
            ? "red"
            : "orange";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    { title: "Subtotal", dataIndex: "subtotal", key: "subtotal" },
    { title: "Total", dataIndex: "entire", key: "entire" },
    { title: "Fecha", dataIndex: "createDate", key: "createDate" },
    {
      title: "Productos",
      key: "products",
      render: (_: any, record: any) => (
        <ul>
          {record.products.map((p: any, i: number) => (
            <li key={i}>
              {p.productId?.name || "Producto eliminado"} x {p.quantity} ($
              {p.price})
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: any) => (
        <Button onClick={() => openEditModal(record)}>Editar</Button>
      ),
    },
  ];

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Órdenes</Title>
      <Button
        type="primary"
        onClick={openAddModal}
        style={{ marginBottom: 16 }}
      >
        Crear Orden
      </Button>
      <Table dataSource={orders} columns={columns} rowKey="_id" />
      <OrderModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingOrder(null);
        }}
        onSave={handleSave}
        products={products}
        users={users}
        order={editingOrder}
      />
    </div>
  );
};

export default OrdersTable;
