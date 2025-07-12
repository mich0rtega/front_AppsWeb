import { Modal, Form, Input, InputNumber, Switch } from 'antd';
import { useEffect } from 'react';

export default function ProductModalForm({
  visible,
  onClose,
  onSave,
  product,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  product?: any;
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  }, [product, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave({ ...product, ...values });
      form.resetFields();
    });
  };

  return (
    <Modal
      title={product ? 'Editar Producto' : 'Agregar Producto'}
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
            { required: true, message: 'El nombre es obligatorio' },
            {
              type: 'string',
              min: 3,
              message: 'Debe tener al menos 3 caracteres',
            },
            {
              pattern: /^[a-zA-Z0-9ÁÉÍÓÚáéíóúñÑ\s\-_,.()]+$/,
              message: 'El nombre no debe contener símbolos especiales',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="price"
          label="Precio"
          rules={[
            { required: true, message: 'El precio es obligatorio' },
            {
              type: 'number',
              min: 1,
              message: 'El precio debe ser al menos 1',
            },
          ]}
        >
          <InputNumber min={1} step={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="stock"
          label="Stock"
          rules={[
            { required: true, message: 'El stock es obligatorio' },
            {
              type: 'number',
              min: 0,
              message: 'El stock no puede ser negativo',
            },
            {
              validator: (_, value) =>
                Number.isInteger(value)
                  ? Promise.resolve()
                  : Promise.reject(new Error('El stock debe ser un número entero')),
            },
          ]}
        >
          <InputNumber min={0} step={1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="description"
          label="Descripción"
          rules={[
            {
              validator: (_, value) =>
                !value || value.length >= 10
                  ? Promise.resolve()
                  : Promise.reject(new Error('La descripción debe tener al menos 10 caracteres')),
            },
          ]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item name="status" label="Activo" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
