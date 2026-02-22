export const getDateKey = (date: Date) => {
  return `${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
};

export const getDateKeyFromUrl = () => {
  const date = getDateFromUrl();

  return getDateKey(date);
};

// localhost:3000/puzzle/2-21-2026
export const getDateFromUrl = () => {
  const pathname = window.location.pathname;
  const match = pathname.match(/\/puzzle\/(\d+)-(\d+)-(\d+)/);

  if (match) {
    const [, month, day, year] = match;
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  }

  return new Date();
};
