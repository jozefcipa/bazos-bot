import * as cheerio from 'npm:cheerio'
export interface BazosOffer {
  title: string
  description: string
  img: string
  price: string
  location: string
  url: string
}

async function fetchURL(url: string): Promise<cheerio.CheerioAPI> {
  const response = await fetch(url)
  const html = await response.text()
  return cheerio.load(html)
}

function parseOffers($: cheerio.CheerioAPI): BazosOffer[] {
  const offers = $('.inzeraty')

  const results: BazosOffer[] = []

  offers.each((_, element) => {
    const title = $(element).find('.nadpis').text()
    const description = $(element).find('.popis').text()
    const img = $(element).find('.obrazek').attr('src') ?? ''
    const price = $(element).find('.inzeratycena').text().trim()
    const location = $(element).find('.inzeratylok').html()?.replace(
      /<br>/g,
      ', ',
    ) ?? ''
    const url = $(element).find('.inzeratynadpis a').attr('href')!

    results.push({
      title,
      description,
      img,
      price,
      location,
      url,
    })
  })

  return results
}

export const isValidBazosURL = (url: string): boolean => {
  // Allow bazos.cz|bazos.sk search URLs and subdomain URLs like ostatni.bazos.cz/...
  const regex = /^(https?:\/\/)?((www\.)?(bazos\.cz|bazos\.sk)\/search\.php|[a-z0-9-]+\.(bazos\.cz|bazos\.sk)\/)/i
  return regex.test(url)
}

export const fetchOffers = async (url: string) => {
  const $ = await fetchURL(url)
  return parseOffers($)
}
