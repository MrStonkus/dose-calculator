//Daily dose calculator for Warfarinum drugs by Valdas Stonkus.
import {
	medicine,
	generatePosibleDoses,
	getDailyDoses,
	getDosesSchedule,
	showScheduleInConsole,
} from './src/Functions/doseGenerator.js'

//Define initial parrameters
let weeklyDose = 40.74
let maxDoseMG = 10
let nrDays = 30
let startDate = new Date('2022-03-13')
console.log(startDate.toLocaleDateString())
// 0= generate new or previous day cumu.diff number to generate from existing chedule
let cumulDiff = -0.4600000000000035 //cumulativeDifference

//create medicine data
let medicines = []
medicines.push(medicine('Warfarinq', 5, 100, [1], 'red'))
medicines.push(medicine('Warfarin', 3, 100, [1], 'blue'))
medicines.forEach((med) => console.log(med))

const posibleDoses = generatePosibleDoses(medicines, maxDoseMG)
console.table(posibleDoses)
const dailyDoses = getDailyDoses(weeklyDose, nrDays, cumulDiff, posibleDoses)
const dosesSchedule = getDosesSchedule(dailyDoses, startDate)
showScheduleInConsole(dosesSchedule, weeklyDose)



