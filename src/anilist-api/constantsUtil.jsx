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

/* Media's card*/
// colors pack
export const colorsCollection = ['#E34F85', '#EBB62D', '#D3E7F3', '#EF5D5D', '#6EC8F2', '#E0D59E', '#2F3689', 
'#3480EA', '#9263E9', '#194C71', '#77F3E9', '#9CE53E', '#F25226', '#01C3D5']

// => object of media status
export const statusCollection = {
    FINISHED: {
      label: "Finished",
      color: "rgb(104, 214, 57)"
    },
    RELEASING: {
      label: "Airing",
      color: "rgb(2, 169, 255)"
    },
    NOT_YET_RELEASED: {
      label: "Not Yet Aired",
      color: "rgb(146, 86, 243)"
    },
    CANCELLED: {
      label: "Cancelled",
      color: "rgb(247, 121, 164)"
    }
}
/* Media's card*/
