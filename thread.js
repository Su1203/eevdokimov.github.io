let subworker = null;

self.addEventListener('message', (evt) => {
  if (!subworker) {
    subworker = new Worker('./thread2.js');
    console.log('thread2.js создали');

    // Получаем результат от thread2.js
    subworker.addEventListener('message', (e) => {
      self.postMessage(e.data);
    });
  }
  subworker.postMessage(5000);
});
