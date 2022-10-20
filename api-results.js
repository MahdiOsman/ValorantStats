const VAPI = require('./vapi.js');

function getPlayerPositionByPUUID(data, puuid) {
    for (let i = 0; i < 10; i++) {
        if (data.all_players[i].puuid == puuid) {
            return data.all_players[i].stats.kills;
        }
    };
};

async function run() {
    const jsonData = await VAPI.fetchAccount('GoEasyOnMe', '00012');
    // const playerMatches = await VAPI.fetchMatches('eu', 'GoEasyOnMe', '000', '1');

    // const playerPosition = getPlayerPositionByPUUID(playerMatches.data[0].players, `${JSON.stringify(jsonData.data.puuid).replace(/"/g, '')}`);

    console.log(jsonData);
};

run();  