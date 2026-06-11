import { Client, Users, Databases } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  const eventHeader = req.headers['x-appwrite-event'] ?? req.headers['x-test-event'] ?? '';

  console.log("Event: ", eventHeader)

  if (!eventHeader.includes('users.') || !eventHeader.includes('.create')) {
    error(`Critical failure: Not a user creation event!`)
    return res.json({
      error: "Not a user creation event!",
      event: eventHeader
    })
  }

  const user = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const userId = user.$id;

  if (!userId) {
    error("Critical failure: No user id found in payload")
    return res.json({ success: false }, 400)
  }

  log(`Intercepted new user signup: ${userId}. Syncing to database`)

  const client = new Client()
    .setEndpoint('https://appwrite.wintersunset95.in/v1') 
    .setProject('6a25699200297850cf39')
    .setKey(process.env.ADMIN_API_KEY); // Failsafe authentication

  const databases = new Databases(client)

  try {
    await databases.createDocument(
      '6a256ab3002cc4f2403e',
      'userprofiles',
      userId,
      {
        userId: userId,
        preferences: JSON.stringify({ theme: 'dark', notifications: true })
      }
    )
    log(`Profile successfully forged for user ${userId}`)
    return res.json({ success: true, userId })
  } catch (err) {
    error(`Database sync failed for ${userId}: ${err.message}`)
    return res.json({ success: false, error: err.message}, 500)
  }
};
