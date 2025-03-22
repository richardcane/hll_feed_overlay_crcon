function parseArgs() {
    const args = process.argv.slice(2);
    const filters = {
      showAllies: args.includes('--allies'),
      showAxis: args.includes('--axis'),
      ids: [],
    };
  
    const idIndex = args.indexOf('--id');
    if (idIndex !== -1 && args[idIndex + 1]) {
      filters.ids.push(args[idIndex + 1]);
    }
  
    return filters;
  }
  
  function shouldShowKill(log, filters) {
    const killerTeam = log.message.includes('(Axis') ? 'Axis' : 'Allies';
    const victimTeam = log.message.includes('->') && log.message.includes('(Allies') ? 'Allies' : 'Axis';
    const { showAllies, showAxis, ids } = filters;
  
    // Team filtering
    if (showAllies && killerTeam !== 'Allies' && victimTeam !== 'Allies') return false;
    if (showAxis && killerTeam !== 'Axis' && victimTeam !== 'Axis') return false;
  
    // Player ID filtering
    if (ids.length > 0 && !ids.includes(log.steam_id_64_1) && !ids.includes(log.steam_id_64_2)) {
      return false;
    }
  
    return true;
  }
  
  module.exports = { parseArgs, shouldShowKill };
  