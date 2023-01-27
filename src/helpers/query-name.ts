export function getQueryPrefix(queryName: string) {
  const parts = queryName.split('By');
  return parts[0];
}
