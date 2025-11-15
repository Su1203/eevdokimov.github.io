// Контракт
// { type: "RUN_FUNCTION",  isCache: boolean } - запустить функцию
// { type: "RESULT",  result: any } - вернуть результат в  result

//startButton - кнопка Старт
//unregisterButton - кнопка Unregister (при нажатии поднимается alert )

//в serviceWorker.js
//slowFunction - функция расчета
//getCachedResult - получить данные из кеш
//cacheSave - сохранить в кеш
//broadcast - отправить всем клиентам новые данные

const startButton = document.getElementById('start');
const unregisterButton = document.getElementById('unregister');
const resultElement = document.getElementById('result');

// Входящие сообщения
navigator.serviceWorker.addEventListener('message', (event) => {
  const msg = event.data;
  if (msg.type === 'RESULT') {
    resultElement.textContent = `Результат: ${msg.result}`;
  }
});

//нажали Старт
startButton.addEventListener('click', () => {
  sendMessage({ type: 'RUN_FUNCTION', isCache: false });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const reg = navigator.serviceWorker.register('serviceWorker.js');
    // Читаем кеш
    sendMessage({ type: 'RUN_FUNCTION', isCache: true });
  });
}

unregisterButton.addEventListener('click', async () => {
  const fields = await navigator.serviceWorker.getRegistrations();
  for (const reg of fields) {
    await reg.unregister();
  }
  alert('Worker удалён');
});

// Отправка
sendMessage = (msg) => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(msg);
  } else {
    navigator.serviceWorker.ready.then((reg) => {
      if (reg.active) reg.active.postMessage(msg);
    });
  }
};
