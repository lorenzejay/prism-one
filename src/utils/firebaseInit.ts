import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

const serviceAccount = JSON.stringify({
  // type: process.env.type,
  project_id: process.env.project_id,
  // private_key_id: process.env.private_key_id,
  private_key: process.env.private_key?.replace(/\\n/g, "\n"),
  client_email: process.env.client_email,
  // client_id: process.env.client_id,
  // auth_uri: process.env.auth_uri,
  // token_uri: process.env.token_uri,
  // auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  // client_x509_cert_url: process.env.client_x509_cert_url,
});

const app = admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(serviceAccount) as ServiceAccount
  ),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});
const auth = admin.auth();
const storage = admin.storage();
export { app, auth, storage };
