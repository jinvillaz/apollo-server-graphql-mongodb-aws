import * as yup from 'yup';

export const CreateValidator = yup.object().shape({
  name: yup
    .string()
    .min(2, 'The name should have at least 2 characters long.')
    .max(50, 'The max length for name is 50 characters.')
    .required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
});

export const UpdateValidator = yup
  .object()
  .shape({
    name: yup
      .string()
      .min(2, 'The name should have at least 2 characters long.')
      .max(50, 'The max length for name is 50 characters.'),
    password: yup.string(),
  })
  .test('at-least-one-property', 'you must provide name or password', value => !!(value.name || value.password));
