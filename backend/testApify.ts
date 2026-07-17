import { fetchBapanasPrices } from './src/cron/bapanasFetcher'; fetchBapanasPrices().then(() => {console.log('Test completed.'); process.exit(0)});
