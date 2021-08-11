const { CustomError } = require("restaurants-utils");
const axios = require("axios");
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

const checkValidRestaurantMw = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    if (!restaurantId) {
      throw new CustomError(403, "Restaurant id id is missing in url");
    }

    const restaurant = await axios.get(`http://localhost:4000/restaurants/${restaurantId}`);
    if (restaurant) next();
  } catch ({ response }) {
    next(new CustomError(response.status, response.data));
  }
};

module.exports = { orderRequestSchema, validateResourceMW, checkValidRestaurantMw };
