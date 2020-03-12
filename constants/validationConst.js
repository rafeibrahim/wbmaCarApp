const registerConstraints = {
  username: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 3,
      message: 'must be at least 3 characters',
    },
  },
  email: {
    presence: {
      message: 'cannot be blank.',
    },
    email: {
      message: 'not valid.',
    },
  },
  full_name: {
    presence: 'cannot be blank.',
  },
  password: {
    presence: {
      message: 'cannot be blank.',
    },
    length: {
      minimum: 5,
      message: 'must be at least 5 characters',
    },
  },
  confirmPassword: {
    presence: 'cannot be blank.',
    equality: {
      attribute: 'password',
    },
  },
};

const uploadConstraints = {
  regNo: {
    presence: {
      message: 'cannot be blank',
    },
    format: {
      pattern: /([A-Z]{3}-[0-9]{3})/,
      message: 'must be of format ABC-123',
    },
  },
  price: {
    presence: {
      message: 'cannot be blank',
    },
    numericality: {
      onlyInteger: true,
      greaterThan: 0,
      lessThanOrEqualTo: 150000,
      message: 'must be between 0 - 1500000',
    },
  },
};

export {registerConstraints, uploadConstraints};
