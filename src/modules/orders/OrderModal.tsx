
import React, { useEffect, useMemo } from "react";
import {
  Modal,
  Form,
  Select,
  InputNumber,
  Button,
  Space,
  message,
} from "antd";
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
  products: { _id: string; name: string; price: number; stock?: number }[];
  users: { _id: string; username: string }[];
  order?: any;
}) {
  const [form] = Form.useForm();

  // Crear un mapa de productos para validar fácilmente por ID
  const productMap = useMemo(
    () =>
      products.reduce((acc, p) => {
        acc[p._id] = p;
        return acc;
      }, {} as Record<string, typeof products[0]>),
    [products]
  );

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

  const validateNoDuplicates = (products: any[]) => {
    const ids = products.map((p) => p.productId);
    const hasDuplicates = new Set(ids).size !== ids.length;
    return !hasDuplicates;
  };

  return (
    <Modal
      title={order ? "Editar Orden" : "Crear Orden"}
      open={visible}
      onCancel={onClose}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            // Validar duplicados
            if (!validateNoDuplicates(values.products)) {
              message.error("No puedes agregar el mismo producto más de una vez");
              return;
            }

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
                      {
                        type: "number",
                        min: 1,
                        message: "Cantidad mínima 1",
                      },
                      {
                        validator: (_, value, callback) => {
                          const productId =
                            form.getFieldValue(["products", name, "productId"]);
                          const product = productMap[productId];
                          if (
                            product &&
                            product.stock !== undefined &&
                            value > product.stock
                          ) {
                            return Promise.reject(
                              new Error(
                                `No hay suficiente stock (máx: ${product.stock})`
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <InputNumber placeholder="Cantidad" min={1} />
                  </Form.Item>

                  <Form.Item
                    {...restField}
                    name={[name, "price"]}
                    rules={[
                      { required: true, message: "Ingresa precio" },
                      {
                        type: "number",
                        min: 1,
                        message: "El precio debe ser al menos 1",
                      },
                      {
                        validator: (_, value) => {
                          const productId =
                            form.getFieldValue(["products", name, "productId"]);
                          const product = productMap[productId];
                          if (product && product.price !== value) {
                            return Promise.reject(
                              new Error(
                                `El precio no coincide con el original ($${product.price})`
                              )
                            );
                          }
                          return Promise.resolve();
                        },
                      },
                    ]}
                  >
                    <InputNumber placeholder="Precio" min={1} />
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
