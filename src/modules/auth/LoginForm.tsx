import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

type FieldType = {
  username?: string;
  password?: string;
  remember?: boolean;
};

const LoginForm: React.FC = () => {
  const [form] = Form.useForm(); 
  const { login } = useAuth();
  const navigate = useNavigate(); 

  const handleSubmit = async () => { 
    try {
      const values = form.getFieldsValue();
      console.log(values);

      const response = await fetch('http://localhost:3000/api/auth/login-user', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      login(data.accessToken);
      navigate('/'); 
      form.resetFields();
    } catch (error) {
      console.error("Ocurrió un error en LoginForm.tsx:", error);
    }
  };

  return (
    <Form
      form={form}
      name="loginForm"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600, margin: 'auto', marginTop: '100px' }}
      initialValues={{ remember: true }}
      autoComplete="off"
      onFinish={handleSubmit} 
    >
      <Form.Item<FieldType>
        label="Usuario"
        name="username"
        rules={[{ required: true, message: 'Por favor ingresa tu usuario' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Contraseña"
        name="password"
        rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item<FieldType> name="remember" valuePropName="checked">
        <Checkbox>Recuérdame</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Iniciar sesión
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
