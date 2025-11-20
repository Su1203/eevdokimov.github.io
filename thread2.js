const slowFunction = (timeout = 3000) => {
  let start = performance.now();
  let x = 0;
  let i = 0;
  do {
    i += 1;
    x += (Math.random() - 0.5) * i;
  } while (performance.now() - start < timeout);
  console.log('end', x);

  return `Результат: ${x}`;
};

self.addEventListener('message', (e) => {
  const result = slowFunction(e.data);
  self.postMessage(result);
});
