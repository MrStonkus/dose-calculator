//Daily dose calculator for Warfarinum drugs
//Define initial parrameters
var recomended_weekly_doze = 41.25
var max_dose_mg = 10
var number_of_days_to_calculate_doses = 14

var recomended_daily_dose = recomended_weekly_doze / 7
// unique id generator
function generateUID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function Dose(dose_mg, drugs) {
  this.mg = dose_mg
  this.drugs = drugs // [{med_ID, split_part}]
}

function Medicine(name, mg, quantity, form, parts) {
    this.id = generateUID()
    this.name = name
    this.mg = mg
    this.quantity = quantity
    this.form = form
    this.split_parts = parts // array
    
  }
  
//create medicine database
var medicines = []
medicines.push(new Medicine('Orfarin', 5, 100, 'tablet', [1, 0.5]))
// medicines.push(new Medicine('Warfarin', 3, 66, 'tablet', [1, 0.5]))
medicines.forEach(d => console.log(d))

//create first base doses from medicines
let base_doses = []
for (medicine of medicines) {
  for (split_part of medicine.split_parts) {
    
    let dose_mg = medicine.mg * split_part
    const drugs = [
      {
        med_id: medicine.id,
        split_part: split_part
      }
    ]
    base_doses.push(new Dose(dose_mg, drugs))
  }
}
// base_doses.forEach((d) => console.log(d))


// Expand doses to all possible options. Use recursive func
let doses = []
function fill_doses(temp_dose, base_dose_index) {
  // Go back if reached out of base doses array
  if (base_dose_index === base_doses.length) {
    return
  }
  // Get base dose from base doses array
  let base_dose = base_doses[base_dose_index]
  do {
    // Go to itself func with increment index
    fill_doses(new Dose(temp_dose.mg, [...temp_dose.drugs]), base_dose_index + 1)
    // Get index of the same size dose
    let existing_size_index = doses.findIndex(e => e.mg === temp_dose.mg)
    if (existing_size_index === -1) {
      // There was no dose with this size, let's add it
      doses.push(new Dose(temp_dose.mg, [...temp_dose.drugs]))
    } else {
      // There's already a dose with the same size
      let existing_size_dose = doses[existing_size_index]

      // Is the temp_dose better?
      if (temp_dose.drugs.length < existing_size_dose.drugs.length) {
        doses[existing_size_index] = new Dose(temp_dose.mg, [...temp_dose.drugs])
      }
    }

    temp_dose.mg += base_dose.mg
    temp_dose.drugs.push(base_dose.drugs[0])
  } while(temp_dose.mg <= max_dose_mg)
}
//send empty dose to recursion function
fill_doses(new Dose(0, []), 0)
doses.sort((l, r) => r.mg - l.mg)
// console.log(doses)


// Define daily doses
var daily_doses = []
var balance = 0
for (let i = 0; i < number_of_days_to_calculate_doses; i++) {
  balance += recomended_daily_dose

  let smallest_diff = 9999
  for (let dose of doses) {
    let diff = Math.abs(dose.mg - balance)
    if (diff < smallest_diff) {
          smallest_diff = diff
          closest_dose = dose
    }
  }
  daily_doses.push(closest_dose)
  balance -= closest_dose.mg
}
// console.log(daily_doses)

// Calculate actual weekly consumption
let total_consumed = 0
daily_doses.forEach((dose) => (total_consumed += dose.mg))
actual_weekly_consumption = (total_consumed / daily_doses.length) * 7

console.log('Recommended per week: ' + recomended_weekly_doze)
console.log('Consumed per week: ' + actual_weekly_consumption)

// Show daily doses
let d = new Date()
let dateToday = d.toISOString().slice(0, 10)
console.log('Daily doses for: ' + dateToday)
console.log('| Date | mg | Week | Month |');

let weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

for (let i = 0; i < daily_doses.length; i++) {
  
  let date = d.getDate()
  let mg = daily_doses[i].mg 
  let weekDay = weekDays[d.getDay()]
  let month = d.getMonth() + 1

  console.log('%s, %s, %s, %s', date, mg, weekDay, month)
  d.setDate(d.getDate() + 1)
}

