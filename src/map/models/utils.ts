export const pointTransformer = (point: string) => {
  const matches = point.match(new RegExp('(-?[0-9]*) (-?[0-9]*)'));
  return {
    x: Number(matches[1]),
    y: Number(matches[2]),
  };
};
