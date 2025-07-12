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
        <Form.Item name="name" label="Nombre" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Precio" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="description" label="Descripción">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="status" label="Activo" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
