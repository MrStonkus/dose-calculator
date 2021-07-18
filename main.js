//Define initial parrameters
var recomended_weekly_doze = 43
var recomended_daily_dose = recomended_weekly_doze / 7
var dose_variants_max_value = 10
var number_of_days_to_calculate_doses = 7
var drugs = [
  {
    name: 'Orfarin',
    concentration: 5,
    measurement: 'mg',
    quantity: 100,
    unit: 'tablet',
    can_split: true,
  },
  {
    name: 'Orfarin',
    concentration: 3,
    measurement: 'mg',
    quantity: 100,
    unit: 'tablet',
    can_split: true,
  },
]

//List parrameters
console.log('Weekly doze: ' + recomended_weekly_doze)
console.log('Daily dose: ' + recomended_daily_dose + drugs[0].measurement)
for (let i = 0; i < drugs.length; i++) {
  console.log(drugs[i])
}

//Define dose variants array
var dose_sizes = new Set()

for (let drug of drugs) {
  dose_sizes.add(drug.concentration)
  if (drug.can_split) {
    dose_sizes.add(drug.concentration / 2)
  }
}

//Expand dose variants
let sizes_array = Array.from(dose_sizes)
for (let size1 of sizes_array) {
    for (let size2 of sizes_array) {
      let total = size1
      while (total + size2 <= dose_variants_max_value) {
        total += size2
        dose_sizes.add(total)
    }
  }
}

console.log(Array.from(dose_sizes).sort((a, b) => a - b))

// Define daily doses
var daily_doses = []
var balance = 0
for (let i = 0; i < number_of_days_to_calculate_doses; i++) {
  balance += recomended_daily_dose

  let closest_size = 0
  let smallest_diff = 9999
  for (let size of dose_sizes) {
    let diff = Math.abs(size - balance)
    if (diff < smallest_diff) {
      smallest_diff = diff
      closest_size = size
    }
  }
    
  daily_doses.push(closest_size)
  balance -= closest_size
}
console.log(daily_doses)

//calculate actual consumption
var sum_of_consumption = 0
for (let i = 0; i < daily_doses.length; i++) {
  sum_of_consumption = sum_of_consumption + daily_doses[i]
}
var consumed_weekly = (sum_of_consumption / daily_doses.length) * 7
console.log('Recommended per week: ' + recomended_weekly_doze)
console.log('Consumed per week: ' + consumed_weekly)
