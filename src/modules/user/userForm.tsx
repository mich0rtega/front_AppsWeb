import React from 'react';
import { Form, Input, DatePicker, Select, Switch, Button } from 'antd';

const { Option } = Select;

const UserForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Datos del formulario:', values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Form.Item label="name" name="name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="username" name="username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="email" name="email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>

      <Form.Item label="password" name="password" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>

      <Form.Item label="roles" name="roles" rules={[{ required: true }]}>
        <Select mode="multiple" placeholder="Selecciona roles">
          <Option value="rol1">rol1</Option>
          <Option value="rol2">rol2</Option>
          <Option value="rol3">rol3</Option>
        </Select>
      </Form.Item>

      <Form.Item label="status" name="status" valuePropName="checked">
        <Switch />
      </Form.Item>

      <Form.Item label="phone" name="phone" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="createDate" name="createDate">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item label="deleteDate" name="deleteDate">
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
