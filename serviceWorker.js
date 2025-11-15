const CACHE_NAME = 'testCache';
const REQUEST_NAME = 'testing123';

slowFunction = async (timeout = 3000) => {
  let start = performance.now();
  let x = 0;
  let i = 0;
  do {
    i += 1;
    x += (Math.random() - 0.5) * i;
  } while (performance.now() - start < timeout);

  return `Результат: ${x}`;
};

getCachedResult = async () => {
  const cache = await caches.open(CACHE_NAME);
  const res = await cache.match(REQUEST_NAME);
  return res ? await res.text() : null;
};

cacheSave = async (result) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.put(REQUEST_NAME, new Response(result, { headers: { 'Content-Type': 'text/plain' } }));
};

// Все клиенты
broadcast = async (msg) => {
  const clientsList = await self.clients.matchAll();
  for (const client of clientsList) {
    client.postMessage(msg);
  }
};

//читаем входящие сообщения RUN_FUNCTION и отправляем с типом RESULT
self.addEventListener('message', async (event) => {
  const { type, function: fnName, isCache } = event.data || {};
  if (type === 'RUN_FUNCTION') {
    let result = null;

    if (isCache) {
      result = await getCachedResult();
      broadcast({ type: 'RESULT', function: fnName, result });
    } else {
      result = await slowFunction(300);
      await cacheSave(result);
      broadcast({ type: 'RESULT', function: fnName, result });
    }
  }
});
