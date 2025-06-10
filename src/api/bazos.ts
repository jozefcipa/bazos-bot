import * as cheerio from 'cheerio'
import { Offer } from '../types'

async function fetchURL(url: string): Promise<cheerio.CheerioAPI> {
    const response = await fetch(url)
    const html = await response.text()
    return cheerio.load(html)
  }
  
  function parseOffers($: cheerio.CheerioAPI): Offer[] {
    const offers = $('.inzeraty')
  
    const results: Offer[] = []
  
    offers.each((_, element) => {
      const title = $(element).find('.nadpis').text()
      const descr = $(element).find('.popis').text()
      const img = $(element).find('.obrazek').attr('src')
      const price = $(element).find('.inzeratycena').text().trim()
      const location = $(element).find('.inzeratylok').html().replace(
        /<br>/g,
        ', ',
      )
      const url = $(element).find('.inzeratynadpis a').attr('href')
  
      results.push({
        title,
        descr,
        img,
        price,
        location,
        url,
      })
    })
  
    return results
  }

export const fetchOffers = async (url: string) => {
    const $ = await fetchURL(url)
    return parseOffers($)
}