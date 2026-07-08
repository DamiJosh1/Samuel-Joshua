const fs = require('fs');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const path = require('path');

async function migrate() {
  if (!fs.existsSync('db_data.json')) {
    console.log('No db_data.json found. Skipping migration.');
    return;
  }
  const firebaseConfigStr = fs.readFileSync(path.join(process.cwd(), 'firebase-applet-config.json'), 'utf8');
  const firebaseConfig = JSON.parse(firebaseConfigStr);

  const firebaseApp = initializeApp(firebaseConfig);
  const firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

  const fileData = JSON.parse(fs.readFileSync('db_data.json', "utf-8"));
  
  console.log("Migrating users...");
  for (const [email, user] of fileData.users) {
    await setDoc(doc(firestoreDb, 'users', email), user);
    console.log('Migrated user:', email);
  }
  
  console.log("Migrating applications...");
  for (const [email, apps] of fileData.applications) {
    await setDoc(doc(firestoreDb, 'applications', email), { apps });
    console.log('Migrated applications for:', email);
  }
  
  console.log("Migration complete.");
}

migrate().catch(console.error);
