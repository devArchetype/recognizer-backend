export const clearString = (str: string) => str.normalize('NFD')
  .replace(/\p{Diacritic}/gu, '')
  .replace(/[^a-zA-Z ]/g, '');

export const strictEquals = (str: string, comp: string) => {
  const string = clearString(str).toLowerCase().replaceAll(' ', '');
  const comparison = clearString(str).toLowerCase().replaceAll(' ', '');

  console.log(`
    stored: ${string}
    new: ${comparison}
    result: ${string === comparison}
  `);

  return string === comparison;
};
