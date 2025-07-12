import { useEffect, useState } from "react";
import { Table, Typography, Button, Space, message } from "antd";
import UserModalForm from "../user/UserModal";

const { Title } = Typography;

type User = {
  _id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  status: boolean;
  createDate: string;
  role?: string | { _id: string; name: string };
  password?: string;
};

type Role = {
  _id: string;
  name: string;
};

const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/users");
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const data: User[] = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      message.error("Error al obtener usuarios");
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/roles");
      if (!res.ok) throw new Error("Error al obtener roles");
      const data: Role[] = await res.json();
      setRoles(data);
    } catch (error) {
      console.error("Error al obtener roles:", error);
      message.error("Error al obtener roles");
    }
  };

  const handleSave = async (user: User & { password?: string }) => {
    try {
      const isEdit = !!user._id;
      const endpoint = isEdit
        ? `http://localhost:3000/api/auth/users/${user._id}`
        : "http://localhost:3000/api/auth/user"; // corregido
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

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al guardar usuario");
      }

      message.success(isEdit ? "Usuario actualizado" : "Usuario agregado");
      setModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      console.error("Error al guardar usuario:", error);
      message.error(error.message || "Error al guardar usuario");
    }
  };

  const openAddModal = () => {
    setSelectedUser(null);
    setModalVisible(true);
  };

  const openEditModal = (user: User) => {
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
      render: (_: any, record: User) => (
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
