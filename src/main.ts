import { fetchOffers } from './src/api/bazos'

const url =
  'https://www.bazos.cz/search.php?hledat=ipod+nano+7&rubriky=www&hlokalita=&humkreis=25&cenaod=500&cenado=3000&Submit=Hledat&order=&kitx=ano'


async function main() {
    const offers = await fetchOffers(url)

  console.log(offers)

  // get URLs from redis
  // iterate through all of them and fetch offers
  // check if we have records for them in redis
  // if there are new ones, add them to redis and send Telegram message
  // if there are old ones in redis, remove them from redis
}

await main()
