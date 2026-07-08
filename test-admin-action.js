const email = 'test@example.com';
const appId = 'W0606650058';
const docName = 'ielts certificate';
const now = new Date();

async function run() {
  const reqRes = await fetch(`http://localhost:3000/api/applications/${appId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email, 
      requestedDocuments: [{ name: docName, status: 'Pending' }]
    })
  });
  console.log('first res', await reqRes.text());

  const newMessage = {
    id: `msg-${Date.now()}`,
    subject: "Action Required: IELTS Test Report Form Required",
    date: now.toLocaleDateString('en-US'),
    content: "Please upload",
    isRead: false
  };

  const msgRes = await fetch(`http://localhost:3000/api/applications/${appId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email, 
      messages: [newMessage]
    })
  });
  console.log('second res', await msgRes.text());
}
run();
