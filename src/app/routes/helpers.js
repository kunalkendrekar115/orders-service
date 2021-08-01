const { CustomError } = require("restaurants-utils");
const yup = require("yup");

const orderRequestSchema = yup.object().shape({
  totalAmount: yup.number().required("Total amout is required"),
  items: yup
    .array()
    .of(
      yup.object().shape({
        itemId: yup.string().required("Item Id is required"),
        itemName: yup.string().required("Item Name is required"),
        quantity: yup.number().required("quantity is required"),
        price: yup.number().required("Price is required")
      })
    )
    .min(1)
    .required("min 1 item is required")
});

const validateResourceMW = (resourceSchema) => async (req, res, next) => {
  const resource = req.body;
  try {
    await resourceSchema.validate(resource, { abortEarly: false });
    next();
  } catch (e) {
    next(new CustomError(403, e.errors));
  }
};

module.exports = { orderRequestSchema, validateResourceMW };
