const chuckNorrisError = () => {
  throw Error(
    "Please ensure you mock 'Axios' - Only Chuck Norris is allowed to make API requests when testing ;)",
  );
};

export default {
  ...jest.requireActual('axios'),
  get: jest.fn(chuckNorrisError),
  post: jest.fn(chuckNorrisError),
  put: jest.fn(chuckNorrisError),
  delete: jest.fn(chuckNorrisError),
  request: jest.fn(chuckNorrisError),
};
