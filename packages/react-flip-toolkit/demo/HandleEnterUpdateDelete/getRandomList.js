export default () => {
  return Array.from(new Array(100).keys()).filter(n => Math.random() > 0.5);
};
