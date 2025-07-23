/* for seasons navigation configuration */
export const seasonsEn = ['WINTER', 'SPRING', 'SUMMER', 'FALL']

// => array of year from current year to 2008
export const yearsCollection = Array.from({ length: new Date().getFullYear() + 1 - 2008 + 1 }, (_, i) => new Date().getFullYear() + 1 - i)

// => array of combination of season and year { season, year }
export const seasonsCombination = yearsCollection.flatMap(year =>
    seasonsEn.map(season => ({ season, year }))
)

// => array of sort options
export const sortOptions = ['Title', 'Popularity', 'Studio', 'Date', 'Score']
/* for seasons navigation configuration */