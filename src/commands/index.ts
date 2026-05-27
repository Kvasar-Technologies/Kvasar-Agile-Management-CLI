import { Command } from 'commander';

// Auth commands
import { loginCommand } from './auth/login.js';
import { logoutCommand } from './auth/logout.js';
import { whoamiCommand } from './auth/whoami.js';

// Resource commands
import { valueStreamsCommand } from './value-streams.js';
import { usersCommand } from './users.js';
import { teamsCommand } from './teams.js';
import { strategicThemesCommand } from './strategic-themes.js';
import { solutionsCommand } from './solutions.js';
import { portfoliosCommand } from './portfolios.js';
import { pisCommand } from './pis.js';
import { organizationsCommand } from './organizations.js';
import { itemsCommand } from './items.js';
// import { groupsCommand } from './groups.js'; // Skipped for now - complex polymorphic types
import { kpisCommand } from './kpis.js';
import { kanbansCommand } from './kanbans.js';
import { objectivesCommand } from './objectives.js';
import { artsCommand } from './arts.js';
import { authChangeCommand } from './auth-change.js';
 import { epicsCommand } from './epics.js';
 import { productsCommand } from './products.js';
 import { servicesCommand } from './services.js';
 import { systemsCommand } from './systems.js';

/**
 * Register all CLI commands
 */
export function registerAllCommands(program: Command): void {
  // Auth top-level commands
  program.addCommand(loginCommand);
  program.addCommand(logoutCommand);
  program.addCommand(whoamiCommand);

  // Resource command groups
   program.addCommand(valueStreamsCommand);
   program.addCommand(usersCommand);
   program.addCommand(teamsCommand);
   program.addCommand(strategicThemesCommand);
   program.addCommand(solutionsCommand);
   program.addCommand(portfoliosCommand);
   program.addCommand(pisCommand);
   program.addCommand(organizationsCommand);
   program.addCommand(itemsCommand);
   program.addCommand(epicsCommand);
   // program.addCommand(groupsCommand); // Skipped for now - complex polymorphic types
   program.addCommand(kpisCommand);
   program.addCommand(kanbansCommand);
   program.addCommand(objectivesCommand);
     program.addCommand(artsCommand);
     program.addCommand(authChangeCommand);
     program.addCommand(productsCommand);
     program.addCommand(servicesCommand);
     program.addCommand(systemsCommand);
 }
