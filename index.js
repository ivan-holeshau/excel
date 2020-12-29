const fs = require("fs");
const lodash = require("lodash")
const readline = require("readline");
const { google } = require("googleapis");
const sheets = google.sheets('v4');
// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = __dirname+"/token.json";



const get_oAuth2Client = () => {
  const fileContent = JSON.parse(fs.readFileSync(__dirname+"/credentials.json"));
  const { client_secret, client_id, redirect_uris } = fileContent.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  return oAuth2Client;
};

const autorize = () => {
  const oAuth2Client = get_oAuth2Client();
  const fileToken = fs.readFileSync(TOKEN_PATH);
  oAuth2Client.setCredentials(JSON.parse(fileToken));
  return oAuth2Client;
};
module.exports.autorize = autorize;


const createFolder = (name) => {
  const create = (auth, name) => {
    const drive = google.drive({ version: "v3", auth });
    var fileMetadata = {
      name: name,
      mimeType: "application/vnd.google-apps.folder",
    };
    drive.files.create(
      {
        resource: fileMetadata,
        fields: "id",
      },

      function (err, file) {
        if (err) {
          // Handle error
          console.error(err);
        } else {
          console.log("Folder Id:", file.data.id);
        }
      }
    );
  };
  const aut = autorize();

  create(aut, name);
  setTimeout(() => {
    listFiles(aut);
  }, 5000);
};

module.exports.createFolder = createFolder;

let listExcels = [];

function getListExcels() {
  console.log(__dirname)
  fs.readFile(__dirname+"/credentials.json", (err, content) => {
    if (err) return console.log("Error loading client secret file:", err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), listFiles);
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

const getUrlAut = (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  return authUrl;
};

function* getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  console.log("Authorize this app by visiting this url:", authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter the code from that page here: ", (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error("Error retrieving access token", err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log("Token stored to", TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

// /**
//  * Get and store new token after prompting for user authorization, and then
//  * execute the given callback with the authorized OAuth2 client.
//  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
//  * @param {getEventsCallback} callback The callback for the authorized client.
//  */
// function getAccessToken(oAuth2Client, callback) {
//   const authUrl = oAuth2Client.generateAuthUrl({
//     access_type: "offline",
//     scope: SCOPES,
//   });
//   console.log("Authorize this app by visiting this url:", authUrl);
//   const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout,
//   });
//   rl.question("Enter the code from that page here: ", (code) => {
//     rl.close();
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error("Error retrieving access token", err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log("Token stored to", TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//   });
// }

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFolders(auth) {
  const drive = google.drive({ version: "v3", auth });
l
  drive.files.list(
    {
      q: "mimeType='application/vnd.google-apps.folder'",
    },
    (err, res) => {
      if (err) return console.log("The API returned an error: " + err);
      const files = res.data.files;
      console.log(files.length);
      if (files.length) {
        console.log("Files:");
        files.map((file) => {
          listExcels.push(file.name);
          console.log(`${file.name} (${file.id})`);
        });
      } else {
        console.log("No files found.");
      }
    }
  );
}

/////////////////////
function* createToken() {
  //получить токен
  const aut = get_oAuth2Client();
  //  getAccessToken(aut);
  const a = getUrlAut(aut);
  let result = yield a;
  // let result = yield
  console.log("key", result);

 let value = false;
  aut.getToken(result, (err, token) => {
    if (err) return console.error("Error retrieving access token", err);
    aut.setCredentials(token);
    // Store the token to disk for later program executions
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) return console.error(err);
      console.log("Token stored to", TOKEN_PATH);
      result = true;
    });
  });

  // setTimeout(()=>{
  //   console.log('result',result)
  // },3000)
}

module.exports.createToken = createToken;



const  checkConnect =async()=>{
  try{
  const auth = autorize();
   const drive = google.drive({ version: "v3", auth });
 
  // drive.version;
  const a = await drive.files.list()
 console.log(await a)
  return true;
  }
  catch{
    return false;
}}
module.exports.checkConnect = checkConnect;


async function createExcel () {
  const authClient = autorize();
  const request = {
    resource: {
      // TODO: Add desired properties to the request body.
    },

    auth: authClient,
  };

  try {
    const response = (await sheets.spreadsheets.create(request)).data;
    // TODO: Change code below to process the `response` object:
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(err);
  }
}

module.exports.createExcel = createExcel;

async function delToken() {
  return new Promise((res, rej) => {
    fs.unlink(TOKEN_PATH, (err) => {
      if (err) throw err;
  
      res()
    })
  })

}

module.exports.delToken = delToken;

async function getTableRows(url,range){
  const authClient = autorize();
  const spreadsheetId= url.split('/')[5]

  const request = {
    spreadsheetId: spreadsheetId,  
    range, 
    valueRenderOption: 'FORMATTED_VALUE',  
    dateTimeRenderOption: 'FORMATTED_STRING',  
    auth: authClient,
  };

  try {
    console.log('try')
    const response = (await sheets.spreadsheets.values.get(request)).data;
    console.log('1')
    const json = response
    console.log(response)
    const rezult = lodash.get(json,"values")
    console.log('3')
    return rezult
  } catch (err) {
    return null;
  }
}

module.exports.getTableRows = getTableRows;


async function updateTable(url, range, value){
  try {
    const spreadsheetId= url.split('/')[5]
    const authClient = autorize();
    let values = value
    const resource = {
      values,
    };
 const valueInputOption = 'RAW'

 const result = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      requestBody:resource,
      valueInputOption,
      auth: authClient,
    }, );
    return result.status?true:false
  } catch (err) {
    return false
  }
}

module.exports.updateTable = updateTable