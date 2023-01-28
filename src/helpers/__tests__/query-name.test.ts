import { getQueryPrefix } from '../query-name';

test('getQueryPrefix should return correct prefix', () => {
  expect(getQueryPrefix('getByRole')).toBe('get');
  expect(getQueryPrefix('getAllByText')).toEqual('getAll');
  expect(getQueryPrefix('queryByTestId')).toEqual('query');
  expect(getQueryPrefix('queryAllByPlaceholderText')).toEqual('queryAll');
  expect(getQueryPrefix('findByHintText')).toEqual('find');
  expect(getQueryPrefix('findAllByDisplayValue')).toEqual('findAll');
});
