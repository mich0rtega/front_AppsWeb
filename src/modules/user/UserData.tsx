import { useState } from "react";
import { Table, Button, Space, message } from "antd";
import UserModalForm from "../user/UserModal";

const initialData = [
  { key: "1", name: "Juan Pérez", email: "juan@mail.com", age: 30 },
  { key: "2", name: "Ana López", email: "ana@mail.com", age: 25 },
];

const initialRoles = [
  { _id: "1", name: "Admin" },
  { _id: "2", name: "User" },
];

export default function UserData() {
  const [data, setData] = useState(initialData);
  const [roles] = useState(initialRoles); 
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const openAddModal = () => {
    setSelectedUser(null);
    setModalVisible(true);
  };

  const openEditModal = (user: any) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleSave = (values: any) => {
    if (selectedUser) {
      setData((prev) =>
        prev.map((item) =>
          item.key === selectedUser.key ? { ...selectedUser, ...values } : item
        )
      );
      message.success("Usuario editado correctamente");
    } else {
      const newUser = {
        ...values,
        key: Date.now().toString(),
      };
      setData((prev) => [...prev, newUser]);
      message.success("Usuario agregado correctamente");
    }
    setModalVisible(false);
  };

  const columns = [
    { title: "Nombre", dataIndex: "name", key: "name" },
    { title: "Correo", dataIndex: "email", key: "email" },
    { title: "Edad", dataIndex: "age", key: "age" },
    {
      title: "Acciones",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => openEditModal(record)}>Editar</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button type="primary" onClick={openAddModal} style={{ marginBottom: 16 }}>
        Agregar Usuario
      </Button>
      <Table columns={columns} dataSource={data} />

      <UserModalForm
        visible={modalVisible}
        message="Por favor, llena los campos"
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        user={selectedUser}
        roles={roles} // <-- Aquí pasas la prop roles
      />
    </>
  );
}
