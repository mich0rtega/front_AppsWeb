import React, { useEffect } from "react";
import { Modal, Form, Select, InputNumber, Button, Space } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

export default function OrderModal({
  visible,
  onClose,
  onSave,
  products,
  users,
  order,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (values: any) => void;
  products: { _id: string; name: string; price: number }[];
  users: { _id: string; username: string }[];
  order?: any;
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (order) {
      const productsForm = order.products.map((p: any) => ({
        productId: p.productId._id || p.productId,
        quantity: p.quantity,
        price: p.price,
      }));

      form.setFieldsValue({
        userId: order.userCreate?._id || order.userCreate,
        products: productsForm,
      });
    } else {
      form.resetFields();
    }
  }, [order, form, visible]);

  return (
    <Modal
      title={order ? "Editar Orden" : "Crear Orden"}
      open={visible}
      onCancel={onClose}
      onOk={() => {
        form.validateFields()
          .then((values) => {
            const preparedProducts = values.products.map((p: any) => ({
              productId: String(p.productId),
              quantity: Number(p.quantity),
              price: Number(p.price),
            }));

            onSave({
              _id: order?._id,
              user_id: String(values.userId),
              userCreate: String(values.userId),
              products: preparedProducts,
            });
          })
          .catch((info) => {
            console.log("Validación fallida:", info);
          });
      }}
      okText={order ? "Actualizar" : "Crear"}
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" name="orderForm">
        <Form.Item
          name="userId"
          label="Usuario"
          rules={[{ required: true, message: "Selecciona un usuario" }]}
        >
          <Select placeholder="Selecciona un usuario">
            {users.map((user) => (
              <Option key={user._id} value={user._id}>
                {user.username}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.List
          name="products"
          rules={[
            {
              validator: async (_, products) => {
                if (!products || products.length < 1) {
                  return Promise.reject(
                    new Error("Debe agregar al menos un producto")
                  );
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  align="baseline"
                  style={{ display: "flex", marginBottom: 8 }}
                >
                  <Form.Item
                    {...restField}
                    name={[name, "productId"]}
                    rules={[{ required: true, message: "Selecciona un producto" }]}
                  >
                    <Select placeholder="Producto" style={{ width: 200 }}>
                      {products.map((p) => (
                        <Option key={p._id} value={p._id}>
                          {p.name} - ${p.price}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "quantity"]}
                    rules={[
                      { required: true, message: "Ingresa cantidad" },
                      { type: "number", min: 1, message: "Cantidad mínima 1" },
                    ]}
                  >
                    <InputNumber placeholder="Cantidad" min={1} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "price"]}
                    rules={[
                      { required: true, message: "Ingresa precio" },
                      { type: "number", min: 0, message: "Precio mínimo 0" },
                    ]}
                  >
                    <InputNumber placeholder="Precio" min={0} />
                  </Form.Item>

                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  style={{ width: "60%" }}
                  icon={<PlusOutlined />}
                >
                  Agregar producto
                </Button>
                <Form.ErrorList errors={errors} />
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
}
