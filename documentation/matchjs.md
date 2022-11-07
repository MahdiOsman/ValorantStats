# Breakdown of how the embeds are made

Main code for each embed:
```
// Return an embed
function getEmbed(jsonArrayPosition, userData, playerMatches) {
    const embed = new EmbedBuilder()
            .setColor(0xFA4454)
            .setTitle(`${JSON.stringify(userData.data.name).replace(/"/g, '')}'s Match History`)
            .setThumbnail('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0ViRuhE2KJirJx9yvzxAQP7oqN54LqfpVR1M249U&s')
            .addFields(
                { name: 'Gamemode', value: `${JSON.stringify(playerMatches.data[jsonArrayPosition].metadata.mode).replace(/"/g, '')}` },
                { name: 'Map', value: `${JSON.stringify(playerMatches.data[jsonArrayPosition].metadata.map).replace(/"/g, '')}` },
                { name: 'Agent', value: `${getPlayerCharacterByPUUID(playerMatches.data[jsonArrayPosition].players, JSON.stringify(userData.data.puuid).replace(/"/g, ''))}` },
                { name: 'KDA', value: `${getPlayerKillsByPUUID(playerMatches.data[jsonArrayPosition].players, JSON.stringify(userData.data.puuid).replace(/"/g, ''))}/${getPlayerDeathsByPUUID(playerMatches.data[jsonArrayPosition].players, JSON.stringify(userData.data.puuid).replace(/"/g, ''))}/${getPlayerAssistsByPUUID(playerMatches.data[jsonArrayPosition].players, JSON.stringify(userData.data.puuid).replace(/"/g, ''))}` },
                { name: 'Headshot Accuracy', value: `${isDeathmatch(playerMatches.data[jsonArrayPosition].metadata) ? 'N/A' : (getPlayerHeadshotAccuracyByPUUID(playerMatches.data[jsonArrayPosition].players, JSON.stringify(userData.data.puuid).replace(/"/g, ''))).concat('%')}` },
            );
    return embed;
}

// Return player kills/assists/deaths by comparing puuid
function getPlayerKillsByPUUID(data, puuid) {
    for (let i = 0; i < 10; i++) {
        if (data.all_players[i].puuid == puuid) {
            return data.all_players[i].stats.kills;
        };
    };
};

function getPlayerAssistsByPUUID(data, puuid) {
    for (let i = 0; i < 10; i++) {
        if (data.all_players[i].puuid == puuid) {
            return data.all_players[i].stats.assists;
        };
    };
};

function getPlayerDeathsByPUUID(data, puuid) {
    for (let i = 0; i < 10; i++) {
        if (data.all_players[i].puuid == puuid) {
            return data.all_players[i].stats.deaths;
        };
    };
};

// Return Headshot accuracy as a percentage
function getPlayerHeadshotAccuracyByPUUID(data, puuid) {
    for (let i = 0; i < 10; i++) {
        if (data.all_players[i].puuid == puuid) {
            const headshots = data.all_players[i].stats.headshots;
            const bodyshots = data.all_players[i].stats.bodyshots;
            const legshots = data.all_players[i].stats.legshots;
            const headshotAccuracy = (headshots / (headshots + bodyshots + legshots)) * 100;

            return headshotAccuracy.toFixed(1);
        };
    };
};

// Returns the agent played by the player during the match
function getPlayerCharacterByPUUID(data, puuid) {
    for (let i = 0; i < 10; i++) {
        if (data.all_players[i].puuid == puuid) {
            return data.all_players[i].character;
        };
    };
};

const matches = {};
const _size = 10; // Number of matches to get
const username = interaction.options.get('username'); // Player username
const tag = interaction.options.get('tag'); // Player tag
// GET Requests
const jsonData = await VAPI.fetchAccount(username.value, tag.value);
// Player match history as json object
const playerMatches = await VAPI.fetchMatches(`${JSON.stringify(jsonData.data.region).replace(/"/g, '')}`, username.value, tag.value, _size.toString());

// Adds embed vars to array matches[]
for (let i = 0; i < 10; i++) {
            matches[i] = getEmbed(i, userData, playerMatches);
        }
```

## The structure of the JSON array is:
```
{
    "status": 200,
    "data": [
        {
            "metadata": {
                "map": "Fracture",
                "game_version": "release-05.07-shipping-9-775731",
                "game_length": 1644520,
                "game_start": 1665956263,
                "game_start_patched": "Sunday, October 16, 2022 11:37 PM",
                "rounds_played": 19,
                "mode": "Unrated",
                "queue": "Standard",
                "season_id": "7a85de9a-4032-61a9-61d8-f4aa2b4a84b6",
                "platform": "PC",
                "matchid": "3383ec8e-5e94-4b58-87e9-f70174100dae",
                "region": "eu",
                "cluster": "Paris"
            },
            "players": {...},
            "teams": {...},
            "rounds": [...],
            "kills": [...] // Square Brackets indicate an object
        }
    ],
```

## Line by line breakdown

The output from the ```fetchMatches(region, username, tag, size);``` function can be found at ~/test/Output.js

We have given the *size* a value of 10, this will get the previous 10 matches played by the player. Each match is put into a JSON array. e.g. *data[0]* is match 1, *data[1]* is match 2 etc.


### getEmbed(jsonArrayPositions, userData, playerMatches);
This function takes in 3 parameters.
*jsonArrayPosition* - The position of the specific match withing the json array.
*userData* - JSON user data.
*playerMatches* - JSON match data.

We use a for-loop using this function in order to dynamically create variables that contain each embed correlating to each match.
```
for (let i = 0; i < 10; i++) {
            matches[i] = getEmbed(i, userData, playerMatches);
        }
```

The *i* variable is the position of the match within the JSON data. This can be seen here:
```{ name: 'Gamemode', value: `${JSON.stringify(playerMatches.data[jsonArrayPosition].metadata.mode).replace(/"/g, '')}` }```

The *value* is found using ````${JSON.stringify(playerMatches.data[jsonArrayPosition].metadata.mode).replace(/"/g, '')}` }```` where ```playerMatches.data[jsonArrayPosition].metadata.mode)``` is used in order to get the gamemode of the game from the 1st element within the array. ```.replace(/"/g, '')``` replace the quotes that are recieved from the JSON array as the function should not read the quotes. e.g. Data is recieved as *"test"* but we want *test*.


### getPlayerKillsByPUUID(data, puuid)
```
function getPlayerKillsByPUUID(data, puuid) {
    for (let i = 0; i < 10; i++) {
        if (data.all_players[i].puuid == puuid) {
            return data.all_players[i].stats.kills;
        };
    };
};
```
We loop through all the players within the match until we find the player being searched for using their puuid which is found when the ```fetchAccount(username, tag);``` is called. Once we find the players stats we will return the number of kills. The same thing is done for the other functions.