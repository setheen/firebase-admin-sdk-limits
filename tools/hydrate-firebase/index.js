// Imports
const admin = require("firebase-admin");
const serviceAccount = require("../../credentials.json");
const config = require("../../config.json");

// Setup
const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://limits-4ac8f.firebaseio.com/"
});

// Run
app.database().ref("/").remove()
.then(addUsers)
.then(addDrivers)
.then(addTrips)
.then(() => { console.log("done"), process.exit(0) });

async function addUsers()
{
    await batch(config.totalUsers, i =>
    {
        const now = new Date().getTime();
        const priority = parseFloat(`1.456${i}2287E12`);
        return app.database().ref(`users/exampleUser${i}`).set({ created : now, deviceNotificationId : "random64696e477ff880a034c62b9bb11d8e2f38f22dcccc85a07a98d39b",
            displayName : `Example User${i}`, email : `exampleuser${i}@example.com`,
            lastSeen : { appVersion : "v1.32.0", epoch : now, platform : "andrios", releaseNotesVersion : "v1.24.0", sawGPSInfo : false, sawNewUserHelp : true },
            notifications : { messages : true, trips : true },
            pfmCID : { ".value" : i, ".priority" :  priority },
            pfmDID : { ".value" : i, ".priority" : priority },
            provider : "example"
        });
    });
}

async function addDrivers()
{
    await batch(config.totalDrivers, i =>
    {
        const now = new Date().getTime();
        const priority = parseFloat(`1.456${i}2287E12`);
        return app.database().ref(`lookups/driver/${i}`).set({ ".priority": priority, cid: i, driverId: `drv${i}`, uid: `google:123456789${i}6678870` });
    });
}

async function addTrips()
{
    await batch(config.totalTrips, i =>
    {
        const now = new Date().getTime();
        const priority = parseFloat(`1.456${i}2287E12`);
        let entry = { drivers: { } };
        entry.drivers[`dvr${i}`] =  { ".priority": priority , cid: i };
        return app.database().ref(`lookups/trip/${i}12345`).set(entry);
    });
}

async function batch(count, callback)
{
    let promises = [];
    for (let i = 0; i < count; i++)
    {
        promises.push(callback(i));
        if (promises.length === config.batchSize)
        {
            try { await Promise.all(promises); }
            catch (e) { console.error(e); }
            finally { promises = []; }
        }
    }

    try { await Promise.all(promises); }
    catch (e) { console.error(e); }
}