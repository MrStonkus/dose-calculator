//Daily dose calculator for Warfarinum drugs by Valdas Stonkus.

//Define initial parrameters
var recomendedWeeklyDoze = 41.25
var maxDoseMG = 10
var numberOfDaysToCalculateDoses = 45
var recomendedDailyDose = recomendedWeeklyDoze / 7
let startDate = '2021-07-29'

//create medicine database
var medicines = []
medicines.push(new Medicine('Orfarin', 5, 100, 'tablet', [1, 0.5], 'red'))
// medicines.push(new Medicine('Warfarin', 3, 100, 'tablet', [1, 0.5], 'blue'))
medicines.forEach(d => console.log(d))

let doses = generatePosibleDoses(medicines)

// Define daily doses
var dailyDoses = []
var cumulativeDifference = 0
for (let i = 0; i < numberOfDaysToCalculateDoses; i++) {
  cumulativeDifference += recomendedDailyDose
  let smallestDiff = Number.MAX_SAFE_INTEGER
  for (let dose of doses) {
    let diff = Math.abs(dose.mg - cumulativeDifference)
    if (diff < smallestDiff) {
      smallestDiff = diff
      closestDose = { ...dose }
    }
  }
  // //substract dose mg from medicine 
  // closestDose.drugs.forEach(drug => {
  //   medicines.forEach(med => {
  //     if (drug.medID == med.id) {
          
  //       med.quantityForSchedule -= (drug.splitPart * med.mg)
  //     }
  //   })
  // })
  //add cumulative difference to daily dose
  cumulativeDifference -= closestDose.mg
  closestDose.cumDiff = cumulativeDifference

  dailyDoses.push(closestDose)
}

//create doses schedule
const d = new Date(startDate)
let dosesSchedule = []
for (let i = 0; i < dailyDoses.length; i++) {
  let dose = {
    date: new Date(d),
    mg: dailyDoses[i].mg,
    cumulativeDifference: dailyDoses[i].cumDiff,
    description: getDoseDescription(dailyDoses[i])
  }
  dosesSchedule.push(dose)
  
  d.setDate(d.getDate() + 1)
}

//show schedule in console
let weekDays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]
for (let dailyDose of dosesSchedule) {
  let { date, mg, cumulativeDifference } = dailyDose
  let weekDay = weekDays[date.getDay()]
  date = date.toISOString().slice(0, 10)
  mg = mg + ' mg.'
  console.log(date, mg, weekDay, cumulativeDifference)
}
// Calculate actual weekly consumption
let totalConsumed = 0
dosesSchedule.forEach((dose) => (totalConsumed += dose.mg))
averageWeeklyConsumption = (totalConsumed / dailyDoses.length) * 7

console.log('Recommended per week: ' + recomendedWeeklyDoze)
console.log('Consumed per week: ' + averageWeeklyConsumption)
console.log('Difference: ' + (recomendedWeeklyDoze - averageWeeklyConsumption + ' mg./week'))


// -----------------FUNCTIONS----------------------
//create first base doses from medicines
function getFirstBaseDoses(medicines) {
  let baseDoses = []
  for (medicine of medicines) {
    for (splitPart of medicine.splitParts) {
      let doseMg = medicine.mg * splitPart
      const drugs = [
        {
          medID: medicine.id,
          splitPart: splitPart,
        },
      ]
      baseDoses.push(new Dose(doseMg, drugs))
    }
  }
  return baseDoses
}

// Expand doses to all possible options.
function generatePosibleDoses(medicines) {
  let doses = []
  let baseDoses = getFirstBaseDoses(medicines)
  generatePosibleDosesRecur(doses, baseDoses, new Dose(0, []), 0)
  doses.sort((l, r) => r.mg - l.mg)
  return doses
}

// Expand doses to all possible options. Use recursive func
function generatePosibleDosesRecur(doses, baseDoses, tempDose, baseDoseIndex) {
  // Go back if reached out of base doses array
  if (baseDoseIndex === baseDoses.length) {
    return
  }
  // Get base dose from base doses array
  let baseDose = baseDoses[baseDoseIndex]
  do {
    // Go to itself func with increment index
    generatePosibleDosesRecur(
      doses,
      baseDoses,
      new Dose(tempDose.mg, [...tempDose.drugs]),
      baseDoseIndex + 1
    )
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
  this.quantityForSchedule = mg * quantity
}