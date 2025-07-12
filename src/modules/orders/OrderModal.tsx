import { useEffect, useMemo } from "react";
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

type Product = {
  _id: string;
  name: string;
  price: number;
  stock?: number;
};

type User = {
  _id: string;
  username: string;
};

type OrderProductForm = {
  productId: string;
  quantity: number;
  price: number;
};

type Order = {
  _id?: string;
  userCreate?: User | string;
  products: Array<{
    productId: Product | string;
    quantity: number;
    price: number;
  }>;
};

type OrderModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (values: {
    _id?: string;
    user_id: string;
    userCreate: string;
    products: OrderProductForm[];
  }) => void;
  products: Product[];
  users: User[];
  order?: Order;
};

export default function OrderModal({
  visible,
  onClose,
  onSave,
  products,
  users,
  order,
}: OrderModalProps) {
  const [form] = Form.useForm();

  // Mapa para acceder rápido a productos por id
  const productMap = useMemo(() => {
    return products.reduce<Record<string, Product>>((acc, p) => {
      acc[p._id] = p;
      return acc;
    }, {});
  }, [products]);

  useEffect(() => {
    if (order) {
      // Formatear productos para el formulario
      const productsForm = order.products.map((p) => ({
        productId: typeof p.productId === "string" ? p.productId : p.productId._id,
        quantity: p.quantity,
        price: p.price,
      }));

      form.setFieldsValue({
        userId: typeof order.userCreate === "string" ? order.userCreate : order.userCreate?._id,
        products: productsForm,
      });
    } else {
      form.resetFields();
    }
  }, [order, form, visible]);

  // Validar que no haya productos duplicados en la lista
  const validateNoDuplicates = (products: OrderProductForm[]) => {
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
            if (!validateNoDuplicates(values.products)) {
              message.error("No puedes agregar el mismo producto más de una vez");
              return;
            }

            const preparedProducts: OrderProductForm[] = values.products.map(
              (p: any) => ({
                productId: String(p.productId),
                quantity: Number(p.quantity),
                price: Number(p.price),
              })
            );

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
      destroyOnClose
    >
      <Form form={form} layout="vertical" name="orderForm">
        <Form.Item
          name="userId"
          label="Usuario"
          rules={[{ required: true, message: "Selecciona un usuario" }]}
        >
          <Select placeholder="Selecciona un usuario" showSearch optionFilterProp="children">
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
                  return Promise.reject(new Error("Debe agregar al menos un producto"));
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
                    <Select placeholder="Producto" style={{ width: 200 }} showSearch optionFilterProp="children">
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
                      {
                        validator: (_, value) => {
                          const productId = form.getFieldValue(["products", name, "productId"]);
                          const product = productMap[productId];
                          if (
                            product &&
                            product.stock !== undefined &&
                            value > product.stock
                          ) {
                            return Promise.reject(
                              new Error(`No hay suficiente stock (máx: ${product.stock})`)
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
                      { type: "number", min: 1, message: "El precio debe ser al menos 1" },
                      {
                        validator: (_, value) => {
                          const productId = form.getFieldValue(["products", name, "productId"]);
                          const product = productMap[productId];
                          if (product && product.price !== value) {
                            return Promise.reject(
                              new Error(`El precio no coincide con el original ($${product.price})`)
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
