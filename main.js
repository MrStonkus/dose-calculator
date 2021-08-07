//Daily dose calculator for Warfarinum drugs by Valdas Stonkus.

//Define initial parrameters
var recomendedWeeklyDoze = 41.25
var maxDoseMG = 10
var numberOfDaysToCalculateDoses = 28
var recomendedDailyDose = recomendedWeeklyDoze / 7
let startDate = '2021-07-29'

//create medicine database
var medicines = []
medicines.push(new Medicine('Orfarin', 5, 100, 'tablet', [1, 0.5], 'red'))
// medicines.push(new Medicine('Warfarin', 3, 66, 'tablet', [1, 0.5], 'blue'))
medicines.forEach(d => console.log(d))

//create first base doses from medicines
let baseDoses = []
for (medicine of medicines) {
  for (splitPart of medicine.splitParts) {
    
    let doseMg = medicine.mg * splitPart
    const drugs = [
      {
        medID: medicine.id,
        splitPart: splitPart
      }
    ]
    baseDoses.push(new Dose(doseMg, drugs))
  }
}

// Expand doses to all possible options.
let doses = []
fillDoses(new Dose(0, []), 0)
doses.sort((l, r) => r.mg - l.mg)

// Define daily doses
var dailyDoses = []
var balance = 0
for (let i = 0; i < numberOfDaysToCalculateDoses; i++) {
  balance += recomendedDailyDose
  let smallestDiff = 9999
  for (let dose of doses) {
    let diff = Math.abs(dose.mg - balance)
    if (diff < smallestDiff) {
          smallestDiff = diff
          closestDose = dose
    }
  }
  dailyDoses.push(closestDose)
  balance -= closestDose.mg
}

// Calculate actual weekly consumption
let totalConsumed = 0
dailyDoses.forEach((dose) => (totalConsumed += dose.mg))
actualWeeklyConsumption = (totalConsumed / dailyDoses.length) * 7

console.log('Recommended per week: ' + recomendedWeeklyDoze)
console.log('Consumed per week: ' + actualWeeklyConsumption)

// Show daily doses
let d = new Date(startDate)

console.log(d);

let dateToday = d.toISOString().slice(0, 10)
console.log('Daily doses for: ' + dateToday)
console.log('| Date | mg | Description | Week | Month |');

let weekDays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

for (let i = 0; i < dailyDoses.length; i++) {
  let date = d.getDate()
  let mg = dailyDoses[i].mg
  let description = getDoseDescription(dailyDoses[i])
  let weekDay = weekDays[d.getDay()]
  let month = d.getMonth() + 1

  console.log('%s, %s mg -> %s, %s, %s', date, mg, description, weekDay, month)
  d.setDate(d.getDate() + 1)
}

// Expand doses to all possible options. Use recursive func
function fillDoses(tempDose, baseDoseIndex) {
  // Go back if reached out of base doses array
  if (baseDoseIndex === baseDoses.length) {
    return
  }
  // Get base dose from base doses array
  let baseDose = baseDoses[baseDoseIndex]
  do {
    // Go to itself func with increment index
    fillDoses(new Dose(tempDose.mg, [...tempDose.drugs]), baseDoseIndex + 1)
    // Get index of the same size dose
    let existingSizeIndex = doses.findIndex(e => e.mg === tempDose.mg)
    if (existingSizeIndex === -1) {
      // There was no dose with this size, let's add it
      doses.push(new Dose(tempDose.mg, [...tempDose.drugs]))
    } else {
      // There's already a dose with the same size
      let existingSizeDose = doses[existingSizeIndex]

      // Is the tempDose better?
      if (tempDose.drugs.length < existingSizeDose.drugs.length) {
        doses[existingSizeIndex] = new Dose(tempDose.mg, [...tempDose.drugs])
      }
    }

    tempDose.mg += baseDose.mg
    tempDose.drugs.push(baseDose.drugs[0])
  } while(tempDose.mg <= maxDoseMG)
}

// get compact description like: { ks1vgoxdijetmplg2y1: [Array], 'ks1vgoxdijetmplg2y0.5': [Array] }
function getDoseDescription(dose) {
  let aggregatedDrugs = {}
  
  // Let's aggregate drugs to know how many identical drugs are
  for (drug of dose.drugs) {

    // Return medical by drug.medID
    let med = medicines.find(med => med.id === drug.medID)
    // Create drug key
    let key = drug.medID + drug.splitPart
    
    if (!aggregatedDrugs[key]) {

      // Key is't found in dic
      // Value= [count, med, part]
      aggregatedDrugs[key] = [1, med, drug.splitPart]

    } else {
      // Key was found in dic
      aggregatedDrugs[key] = [aggregatedDrugs[key] + 1, med, drug.splitPart]
    }
  }
  return aggregatedDrugs
}

// unique id generator
function generateUID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Dose class function
function Dose(doseMg, drugs) {
  this.mg = doseMg
  this.drugs = drugs // [{med_ID, splitPart}]
}

// Medicine class function
function Medicine(name, mg, quantity, type, parts, color) {
  this.id = generateUID()
  this.name = name
  this.mg = mg
  this.quantity = quantity
  this.type = type
  this.splitParts = parts // array
  this.color = color
}