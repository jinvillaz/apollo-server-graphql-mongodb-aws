import * as yup from 'yup';

export const CreateValidator = yup.object().shape({
  sku: yup
    .string()
    .min(2, 'The sku should have at least 2 characters long.')
    .max(25, 'The max length for sku is 25 characters.')
    .required(),
  name: yup
    .string()
    .min(2, 'The name should have at least 2 characters long.')
    .max(50, 'The max length for name is 50 characters.')
    .required(),
  brand: yup
    .string()
    .min(2, 'The brand should have at least 2 characters long.')
    .max(50, 'The max length for brand is 25 characters.')
    .required(),
  price: yup.number().required(),
});

export const UpdateValidator = yup
  .object()
  .shape({
    sku: yup
      .string()
      .min(2, 'The sku should have at least 2 characters long.')
      .max(25, 'The max length for sku is 25 characters.'),
    name: yup
      .string()
      .min(2, 'The name should have at least 2 characters long.')
      .max(50, 'The max length for name is 50 characters.'),
    brand: yup
      .string()
      .min(2, 'The brand should have at least 2 characters long.')
      .max(50, 'The max length for brand is 25 characters.'),
    price: yup.number(),
  })
  .test(
    'at-least-one-property',
    'Must provide at least one of the following values [name|sku|brand|price]',
    value => !!(value.sku || value.name || value.brand || value.price)
  );
