//Daily dose calculator for Warfarinum drugs by Valdas Stonkus.
import {
	medicine,
	generatePosibleDoses,
	getDailyDoses,
	getDosesSchedule,
	showScheduleInConsole,
} from './src/Functions/doseGenerator.js'

//Define initial parrameters
const weeklyDose = 40.74
const startDate = new Date('2022-04-27')
const nrDays = 30
const maxDoseMG = 10
const medicines = [
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
// 0= generate new or previous day cumu.diff number to generate from existing chedule
let cumulDiff = 0 //cumulativeDifference

//create medicine data
medicines.map((_, i) => medicine(medicines[i]))
// generate scheduler
const posibleDoses = generatePosibleDoses(medicines, maxDoseMG)
const dailyDoses = getDailyDoses(weeklyDose, nrDays, cumulDiff, posibleDoses)
const dosesSchedule = getDosesSchedule(dailyDoses, startDate)

showScheduleInConsole(dosesSchedule, weeklyDose, medicines)




