const contactList = document.getElementById('contactList');
const newContactInput = document.getElementById('newContact');
const addBtn = document.getElementById('addBtn');
const testBtn = document.getElementById('testBtn');

// Загрузка контактов и отображение
function loadContacts() {
  chrome.storage.local.get('chatIds', (data) => {
    contactList.innerHTML = '';
    const contacts = data.chatIds || [];
    contacts.forEach((id, index) => {
      const li = document.createElement('li');
      li.textContent = id;

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Удалить';
      delBtn.style.marginLeft = '5px';
      delBtn.addEventListener('click', () => removeContact(index)); // CSP-safe

      li.appendChild(delBtn);
      contactList.appendChild(li);
    });

    // Обновляем chat_id в background
    chrome.runtime.sendMessage({ type: 'SAVE_CHAT_ID', ids: contacts });
    console.log('[POPUP] Обновлён chat_id для background:', contacts);
  });
}

// Добавление нового контакта
function addContact() {
  const newId = newContactInput.value.trim();
  if (!newId) return;

  chrome.storage.local.get('chatIds', (data) => {
    let contacts = data.chatIds || [];
    if (contacts.length >= 2) {
      alert('Можно хранить не более двух контактов');
      return;
    }
    contacts.push(newId);
    chrome.storage.local.set({ chatIds: contacts }, () => {
      newContactInput.value = '';
      loadContacts();
    });
  });
}

// Удаление контакта по индексу
function removeContact(index) {
  chrome.storage.local.get('chatIds', (data) => {
    let contacts = data.chatIds || [];
    contacts.splice(index, 1);
    chrome.storage.local.set({ chatIds: contacts }, () => {
      loadContacts();
    });
  });
}

// Отправка тестового сообщения через background
function sendTestMessage() {
  chrome.runtime.sendMessage({ type: 'TEST_ALERT' }, (response) => {
    console.log('[POPUP] Ответ от background:', response);
    alert(response.status === 'ok' ? 'Тестовое сообщение отправлено' : 'Нет chat_id для отправки');
  });
}

addBtn.addEventListener('click', addContact);
testBtn.addEventListener('click', sendTestMessage);
loadContacts();
