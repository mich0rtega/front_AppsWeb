// src/components/UserModalForm.tsx
import { Modal, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;

export default function UserModalForm({
  visible,
  onClose,
  onSave,
  user,
  roles,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  user?: any;
  roles: { _id: string; name: string }[];
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        role: user.role?._id ?? user.role, // para prevenir errores de formato
      });
    } else {
      form.resetFields();
    }
  }, [user, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave({ ...user, ...values });
      form.resetFields();
    });
  };

  return (
    <Modal
      title={user ? "Editar Usuario" : "Agregar Usuario"}
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="username" label="Usuario" rules={[{ required: true }]}>
          <Input disabled={!!user} />
        </Form.Item>
        <Form.Item name="email" label="Correo" rules={[{ required: true, type: "email" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Teléfono">
          <Input />
        </Form.Item>
        {!user && (
          <Form.Item name="password" label="Contraseña" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item name="role" label="Rol" rules={[{ required: true }]}>
          <Select placeholder="Selecciona un rol">
            {roles.map((r) => (
              <Option key={r._id} value={r._id}>
                {r.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
