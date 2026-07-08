const fetch = require('node-fetch');
fetch('http://localhost:3000/api/applications/W639752984', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({"email":"saji04@gmail.com","messages":[{"id":"test-msg","subject":"Test","content":"Content","date":"2023-01-01","isRead":false}]})
}).then(res => res.text()).then(console.log).catch(console.error);
