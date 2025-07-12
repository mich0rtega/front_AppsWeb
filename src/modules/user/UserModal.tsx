import { Modal, Form, Input, Select } from "antd";
import { useEffect } from "react";

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
        role: user.role?._id ?? user.role,
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
        <Form.Item
          name="name"
          label="Nombre"
          rules={[
            { required: true, message: "El nombre es obligatorio" },
            {
              pattern: /^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/,
              message: "El nombre solo debe contener letras y espacios",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="username"
          label="Usuario"
          rules={[
            { required: true, message: "El nombre de usuario es obligatorio" },
            {
              pattern: /^[a-zA-Z0-9_]+$/,
              message:
                "El usuario solo puede contener letras, números y guiones bajos",
            },
          ]}
        >
          <Input disabled={!!user} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Correo"
          rules={[
            { required: true, message: "El correo es obligatorio" },
            {
              type: "email",
              message: "El formato del correo no es válido",
            },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message:
                "El correo debe incluir un dominio válido (ej. usuario@dominio.com)",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Teléfono"
          rules={[
            {
              pattern: /^[0-9]{8,15}$/,
              message:
                "El teléfono debe contener entre 8 y 15 dígitos numéricos",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {!user && (
          <Form.Item
            name="password"
            label="Contraseña"
            rules={[
              { required: true, message: "La contraseña es obligatoria" },
              {
                min: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
              {
                pattern:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/,
                message:
                  "Debe contener al menos una mayúscula, una minúscula y un número",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}

        <Form.Item
          name="role"
          label="Rol"
          rules={[{ required: true, message: "Selecciona un rol" }]}
        >
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
