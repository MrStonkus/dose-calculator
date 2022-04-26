//Daily dose calculator for Warfarinum drugs by Valdas Stonkus.
import {
	generateMedicines,
	generatePosibleDoses,
	getDailyDoses,
	getDosesSchedule,
	showScheduleInConsole,
} from './src/Functions/doseGenerator.js'

//Define initial parrameters ------------------------------------------------
const weeklyDose = 40.74
const startDate = new Date('2022-04-27')
const nrDays = 30
const maxDoseMG = 10
const medArr = [
  {
    name: 'Warfarinum',
    mg: 5,
    quantity: 100,
    splitParts: [1, 0.5],
    color: 'red'
  },
  {
    name: 'Warfarinum',
    mg: 3,
    quantity: 100,
    splitParts: [1],
    color: 'blue'
  }
]
// 0= generate new or set previous day cumu.diff number to generate from existing chedule
let cumulDiff = 0 //cumulativeDifference, default 0

//Generator --------------------------------------------------------------
const medicines = generateMedicines(medArr)
// pos doses ex. [1.5, 3, 4.5, 5, 8, 10] etc. 
const posibleDoses = generatePosibleDoses(medicines, maxDoseMG)

// daily doses ex. [{mg: 1.5, drugs: [object, object], cumDiff: 0}]
const dailyDoses = getDailyDoses(weeklyDose, nrDays, posibleDoses, cumulDiff)

// dosesSch ex. [{date: 2020-04-27T00:00:00.000Z, mg: 1.5, cumulDiff: 0, medPart: [object, object]}]
const dosesSchedule = getDosesSchedule(dailyDoses, startDate)

showScheduleInConsole(dosesSchedule, weeklyDose, medicines)




