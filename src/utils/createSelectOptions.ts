export function createSelectOptions(array: string[]) {
  return array.map((element) => {
    const name: string = element
      .replace('_', ' ')
      .split(' ')
      .map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
      .join(' ');
    return {
      name,
      value: element,
    };
  });
}
