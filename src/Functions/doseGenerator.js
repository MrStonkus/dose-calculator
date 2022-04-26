// -----------------export export FUNCTIONS for dose generator----------------------
// -----------------FUNCTIONS----------------------
export function medicine(name, mg, quantity, parts, color) {
	return {
		id: generateUID(),
		name,
		mg,
		quantity,
		splitParts: parts, // array
		color,
		quantityForSchedule: mg * quantity,
	}
}

// unique id generator
function generateUID() {
	return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Expand doses to all possible options.
export function generatePosibleDoses(medicines, maxDoseMG) {
	let doses = []
	let baseDoses = getFirstBaseDoses(medicines)
	generatePosibleDosesRecur(doses, baseDoses, dose(0, []), 0)
	doses.sort((l, r) => r.mg - l.mg)
	return doses
}

//create first base doses from medicines
function getFirstBaseDoses(medicines) {
	let baseDoses = []
	for (medicine of medicines) {
		for (let splitPart of medicine.splitParts) {
			let doseMg = medicine.mg * splitPart
			const drugs = [
				{
					medID: medicine.id,
					splitPart: splitPart,
				},
			]
			baseDoses.push(dose(doseMg, drugs))
		}
	}
	return baseDoses
}

function dose(doseMg, drugs) {
	return {
		mg: doseMg,
		drugs, // [{med_ID, splitPart}]
	}
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
			dose(tempDose.mg, [...tempDose.drugs]),
			baseDoseIndex + 1
		)
		// Get index of the same size dose
		let existingSizeIndex = doses.findIndex((e) => e.mg === tempDose.mg)
		if (existingSizeIndex === -1) {
			// There was no dose with this size, let's add it
			doses.push(dose(tempDose.mg, [...tempDose.drugs]))
		} else {
			// There's already a dose with the same size
			let existingSizeDose = doses[existingSizeIndex]

			// Is the tempDose better?
			if (tempDose.drugs.length < existingSizeDose.drugs.length) {
				doses[existingSizeIndex] = dose(tempDose.mg, [...tempDose.drugs])
			}
		}

		tempDose.mg += baseDose.mg
		tempDose.drugs.push(baseDose.drugs[0])
	} while (tempDose.mg <= 10)
}

export function getDailyDoses(weeklyDose, nrDays, cumulDiff, posibleDoses) {
	// Define daily doses
  let dailyDoses = []
  let closestDose
	for (let i = 0; i < nrDays; i++) {
		const recomendedDailyDose = weeklyDose / 7
		cumulDiff += recomendedDailyDose
		let smallestDiff = Number.MAX_SAFE_INTEGER
		for (let dose of posibleDoses) {
			let diff = Math.abs(dose.mg - cumulDiff)
			if (diff < smallestDiff) {
				smallestDiff = diff
				closestDose = { ...dose }
			}
		}
		//add cumulative difference to daily dose
		cumulDiff -= closestDose.mg
		closestDose.cumDiff = cumulDiff

		dailyDoses.push(closestDose)
	}
	return dailyDoses
}

// generate shedule of doses
export function getDosesSchedule(dailyDoses, startDate) {
	const d = startDate
	let dosesSchedule = []
	for (let i = 0; i < dailyDoses.length; i++) {
		let shedulDose = {
			date: new Date(d),
			mg: dailyDoses[i].mg,
			cumulDiff: dailyDoses[i].cumDiff,
			medPart: agregateDrugs(dailyDoses[i]),
		}
		dosesSchedule.push(shedulDose)
		console.log(shedulDose)
		d.setDate(d.getDate() + 1)
	}
	return dosesSchedule
}

// Let's aggregate drugs to know how many identical drugs are
function agregateDrugs(dose) {
	let aggregatedDrugs = {}

	for (let drug of dose.drugs) {
		// Return medical by drug.medID
		// let med = medicines.find((med) => med.id === drug.medID)
		// Create drug key
		let key = drug.medID + drug.splitPart

		// count same drugs parts together
		aggregatedDrugs[key] = {
			splitPart: drug.splitPart,
			count: aggregatedDrugs[key] ? aggregatedDrugs[key].count + 1 : 1,
			medId: drug.medID,
		}
	}
	return aggregatedDrugs
}

export function showScheduleInConsole(schDoses, weeklyDose) {
	let weekDays = [
		'sunday',
		'monday',
		'tuesday',
		'wednesday',
		'thursday',
		'friday',
		'saturday',
	]
	for (let dailyDose of schDoses) {
		let { date, mg, cumulDiff } = dailyDose
		let weekDay = weekDays[date.getDay()]

		date = date.toLocaleDateString()
		mg = mg + ' mg.'
		console.log(date, mg, weekDay, cumulDiff)
	}

	console.log('Recommended per week: ' + weeklyDose)
	// Calculate actual weekly consumption
	const averageWeeklyConsumption =
		(schDoses.reduce((acc, dose) => (acc += dose.mg), 0) / schDoses.length) * 7
	console.log('Consumed per week: ' + averageWeeklyConsumption)
	console.log(
		'Difference: ' + (weeklyDose - averageWeeklyConsumption + ' mg./week')
	)
}
		
		
		