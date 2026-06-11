import { Client, Users, Databases, TablesDB } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  const eventHeader = req.headers['x-appwrite-event'] ?? req.headers['x-test-event'] ?? '';

  if (!eventHeader.includes('users.')) {
    error(`Critical failure: Not a user event!`)
    return res.json({
      error: "Not a user event!",
      event: eventHeader
    })
  }

  const user = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  const userId = user.$id;

  if (!userId) {
    error("Critical failure: No user id found in payload")
    return res.json({ success: false }, 400)
  }

  log(`Intercepted new user event: ${userId}. Syncing to database`)

  const client = new Client()
    .setEndpoint('https://appwrite.wintersunset95.in/v1') 
    .setProject('6a25699200297850cf39')
    .setKey(process.env.ADMIN_API_KEY); // Failsafe authentication

  const tablesDb = new TablesDB(client)

  if (eventHeader.includes('.create')) {
    try {
      await tablesDb.createRow({
        databaseId: '6a256ab3002cc4f2403e',
        tableId: 'userprofiles',
        rowId: userId,
        data: {
          userId: userId,
          preferences: JSON.stringify({ theme: 'dark', notifications: true })
        }
      })
      log(`Profile successfully forged for user ${userId}`)
      return res.json({ success: true, userId })
    } catch (err) {
      error(`Database sync failed for ${userId}: ${err.message}`)
      return res.json({ success: false, error: err.message}, 500)
    }

  } else if (eventHeader.includes('.delete')) {
    try {
      await tablesDb.deleteRow({
        databaseId: '6a256ab3002cc4f2403e',
        tableId: 'userprofiles',
        rowId: userId
      })
      log(`Profile successfully deleted for user ${userId}`)
      return res.json({ success: true, userId })
    } catch (err) {
      error(`Database sync failed for ${userId}: ${err.message}`)
      return res.json({ success: false, error: err.message}, 500)
    }
  } else {
    return res.json({ success: false, message: "Event not handled yet" })
  }
};
