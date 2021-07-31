//Daily dose calculator for Warfarinum drugs
//Define initial parrameters
var recomended_weekly_doze = 41
var max_dose_mg = 10
var number_of_days_to_calculate_doses = 28

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
medicines.push(new Medicine('Warfarin', 3, 66, 'tablet', [1, 0.5]))
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
base_doses.forEach((d) => console.log(d))


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
console.log(doses);

// let sizes_array = Array.from(doses)
// for (let size1 of sizes_array) {
//   for (let size2 of sizes_array) {
//     //create temporary dose
//     let temp_dose = new Dose(size1.mg, [...size1.drugs])
//     //continue until mg is lower max mg
//     while (temp_dose.mg + size2.mg <= max_dose_mg) {
//       //merge tempporary dose with one of existing dose in doses array
//       temp_dose.mg = temp_dose.mg + size2.mg
//       temp_dose.drugs = temp_dose.drugs.concat(size2.drugs)
//       //check the same mg in doses array
//       if (!doses.find((e) => e.mg === temp_dose.mg)) {
//         let new_dose = new Dose(temp_dose.mg, [...temp_dose.drugs])
//         doses.push(new_dose)
//       }
//     }
//   }
// }
// doses.sort((a, b) => a.mg - b.mg)
// console.log(doses);

// function doseOptimizator(dose) {
  
//   console.log(dose);
// }


// doses.forEach(d => doseOptimizator(d))

// //Expand parts variants
// let sizes_array = Array.from(doses_array)
// for (let size1 of sizes_array) {
//   for (let size2 of sizes_array) {
//     let new_dose = {
//       mg: size1.mg,
//       parts: [size1.drug_part],
//     }
//     while (new_dose.mg + size2.mg <= max_dose_mg) {
//       new_dose.mg = new_dose.mg + size2.mg
//       new_dose.parts.push(size2.drug_part)
//       //TODO reikia tobulinti paieska, kad parinktu su maziau objektu
//       if (!mg_array.find((e) => e === new_dose.mg)) {
//         mg_array.push(new_dose.mg)
//         drug_parts.push(new_dose)
//         new_dose.mg = new_dose.mg

//         let dose = createDose(new_dose)
//         doses_array.push(dose)
//       }
//     }
//   }
// }
// //doses optimizator
// doses_array.sort((a, b) => a.mg - b.mg)
// console.log('Dose variants: ')
// console.log(Array.from(doses_array))

// //TODO mintis cia del paieskos
// // console.log(doses_array[14].drug_part.parts.length)




// // // Define daily doses
// // var daily_doses = []
// // var balance = 0
// // for (let i = 0; i < number_of_days_to_calculate_doses; i++) {
// //   balance += recomended_daily_dose

// //   let closest_size = 0
// //   let smallest_diff = 9999
// //   for (let size of doses_array) {
// //     let diff = Math.abs(size - balance)
// //     if (diff < smallest_diff) {
// //       smallest_diff = diff
// //       closest_size = size
// //     }
// //   }

// //   daily_doses.push(closest_size)
// //   balance -= closest_size
// // }
// // console.log(daily_doses)

// // //calculate actual conmgption
// // var mg_of_conmgption = 0
// // for (let i = 0; i < daily_doses.length; i++) {
// //   mg_of_conmgption = mg_of_conmgption + daily_doses[i]
// // }
// // var conmged_weekly = (mg_of_conmgption / daily_doses.length) * 7
// // console.log('Recommended per week: ' + recomended_weekly_doze)
// // console.log('Conmged per week: ' + conmged_weekly)
