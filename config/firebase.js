const  { initializeApp, cert } = require ('firebase-admin');
const getMessaging = require('firebase-admin/messaging')
let firebaseadmin = null;

try {
  if (process.env.FIERBASESDK) {
    const serviceAccount = typeof process.env.FIERBASESDK === 'string'
      ? JSON.parse(process.env.FIERBASESDK)
      : process.env.FIERBASESDK;
    firebaseadmin = initializeApp({
      credential: cert(serviceAccount),
    });
    console.log('[Firebase] Admin SDK initialized successfully');
  } else {
    console.warn('[Firebase] Warning: FIERBASESDK environment variable is not defined.');
  }
} catch (error) {
  console.error('[Firebase] Failed to initialize Firebase Admin SDK:', error.message);
}



exports.sendNotification = async (token, title, body) => {
    try {
        if (!token) {
            return;
        }

        const messaging = getMessaging(firebaseadmin);

        const res = await messaging.sendEachForMulticast({
            tokens: token,

            notification: {
                title,
                body,
            },

            webpush: {
                notification: {
                    icon: "https://res.cloudinary.com/dblxejpyp/image/upload/v1790678167/logo.png",
                },
            },
        });

  console.log(res)
    } catch (error) {
        console.log("FCM Error:", error);
    }
};


