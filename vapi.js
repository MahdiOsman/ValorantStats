const ValorantAPI = require('unofficial-valorant-api');
const { APIKey } = require('./config.json');

const VAPI = new ValorantAPI();

module.exports = {
    fetchRank: async function(version, mode, region, puuid) {
        try {
            const rank = await VAPI.getMMRByPUUID({ version: version, mode: mode, region: region, puuid: puuid });
            return rank;
        } catch (err) {
            console.error(err);
        }
    },

    fetchAccount: async function(name, tag) {
        try {
            const account = await VAPI.getAccount({ name: name, tag: tag });
            return account;
        } catch (err) {
            console.error(err);
        }
    },

    fetchMatches: async function(region, name, tag, size) {
        try {
            const match = await VAPI.getMatches({ region: region, name: name, tag: tag, size: size });
            return match;
        } catch (err) {
            console.log(err);
        }
    },

    fetchMMRHistory: async function(region, name, tag) {
        try {
            const mmrhistory = await VAPI.getMMRHistory({ region: region, name: name, tag: tag });
            return mmrhistory;
        } catch (err) {
            console.log(err);
        }
    },
};
