import { readToken, delay } from "./utils/file.js";
import { createConnection } from "./utils/websocket.js";
import { showBanner } from "./utils/banner.js";
import axios from 'axios';
import fs from 'fs';
import readline from 'readline';
console.clear();
const RED = '\x1b[31m';
const RESET = '\x1b[0m';


fs.readFile('tokens.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading token from file:', err);
        return;
    }

    const authorizationToken = data.trim();
    const url = 'https://api.oasis.ai/internal/providerRewards,settingsProfile?batch=1&input=%7B%220%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%2C%221%22%3A%7B%22json%22%3Anull%2C%22meta%22%3A%7B%22values%22%3A%5B%22undefined%22%5D%7D%7D%7D';
    const headers = {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9,id;q=0.8',
        'authorization': authorizationToken,
        'content-type': 'application/json',
        'origin': 'https://dashboard.oasis.ai',
        'priority': 'u=1, i',
        'referer': 'https://dashboard.oasis.ai/',
        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
        'sec-ch-ua-mobile': '?1',
        'sec-ch-ua-platform': '"Android"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'
    };
	
    axios.get(url, { headers })
        .then(response => {
            const data = response.data;
            const pointsTotal = data[0].result.data.json.points.total;
            const email = data[1].result.data.json.email;
            showBanner();
            console.log(`Email: ${RED}${email}${RESET} - Points Total: ${RED}${pointsTotal}${RESET}`);
        })
        .catch(error => {
            console.error('Error making the request:', error);
        });
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function start() {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const answer = await new Promise(resolve => rl.question('Apakah ingin melanjutkan? (Y/N) ', resolve));

    if (answer.toLowerCase() === 'y') {
        const tokens = await readToken("providers.txt");

        // Membuat koneksi tanpa proxy
        for (const token of tokens) {
            await createConnection(token);
            await delay(0);
        }
    } else {
        console.log('Process terminated.');
    }
    rl.close();
}

start();
