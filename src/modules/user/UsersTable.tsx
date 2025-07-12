// src/modules/user/UsersTable.tsx
import React, { useEffect, useState } from "react";
import { Table, Typography, Button, Space, message } from "antd";
import UserModalForm from "../user/UserModal";

const { Title } = Typography;

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/roles");
      const data = await res.json();
      setRoles(data);
    } catch (error) {
      console.error("Error al obtener roles:", error);
    }
  };

  const handleSave = async (user: any) => {
    try {
      const isEdit = !!user._id;
      const endpoint = isEdit
        ? `http://localhost:3000/api/auth/users/${user._id}`
        : "http://localhost:3000/api/auth/user";
      const method = isEdit ? "PATCH" : "POST";
    const payload = {
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      ...(user.password && { password: user.password }),
      role: user.role,  
    };

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Error al guardar usuario");

      message.success(isEdit ? "Usuario actualizado" : "Usuario agregado");
      setModalVisible(false);
      fetchUsers();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      message.error("Error al guardar usuario");
    }
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setModalVisible(true);
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const columns = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Usuario", dataIndex: "username", key: "username" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Teléfono", dataIndex: "phone", key: "phone" },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (val: boolean) => (val ? "Activo" : "Inactivo"),
    },
    { title: "Creado", dataIndex: "createDate", key: "createDate" },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => openEditModal(record)}>Editar</Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
    fetchRoles(); 
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Usuarios</Title>
      <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
        Agregar Usuario
      </Button>
      <Table dataSource={users} columns={columns} rowKey="_id" />
      <UserModalForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        user={selectedUser}
        roles={roles}
      />
    </div>
  );
};

export default UsersTable;
