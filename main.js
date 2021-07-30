//Daily dose calculator for Warfarinum drugs
//Define initial parrameters
var recomended_weekly_doze = 41
var recomended_daily_dose = recomended_weekly_doze / 7
var dose_options_max_mg = 10
var number_of_days_to_calculate_doses = 28

// unique id generator
function generateUID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

function Dose(dose_mb, drugs) {
  this.mg = dose_mb
  this.drugs = drugs // [{drugId, part}]
}

function Drug(name, mg, quantity, form, can_split) {
    this.id = generateUID()
    this.name = name
    this.mg = mg
    this.quantity = quantity
    this.form = form
    this.small_part = can_split ? 0.5 : 1
  }
  
//create drugs database
var drugs_arr = []
drugs_arr.push(new Drug('Orfarin', 5, 100, 'tablet', true))
drugs_arr.push(new Drug('Warfarin', 3, 66, 'tablet', true))
drugs_arr.forEach(d => console.log('Drug: ', d))

//TODO padaryti perrinkima pilna
//create default doses
let doses_arr = []
for (drug of drugs_arr) {
  const dose_mb = drug.mg * drug.small_part
  const drugs = [
    {
      id: drug.id,
      part: drug.small_part
    }
  ]
  doses_arr.push(new Dose(dose_mb, drugs))
}
doses_arr.forEach(d => console.log(d))


//Expand doses to max options ex.10


let sizes_array = Array.from(doses_arr)
for (let size1 of sizes_array) {
  for (let size2 of sizes_array) {
    let temp_dose = new Dose(size1.mg, [...size1.drugs])
    
    while (temp_dose.mg + size2.mg <= dose_options_max_mg) {
      temp_dose.mg = temp_dose.mg + size2.mg
      temp_dose.drugs = temp_dose.drugs.concat(size2.drugs)//TODO problema
      let new_dose = new Dose(temp_dose.mg, [...temp_dose.drugs])
      
      if (!doses_arr.find((e) => e.mg === new_dose.mg)) {
        doses_arr.push(new_dose)
      }
    }
  }
}
// doses_arr.forEach(d => console.log(d))
console.log(doses_arr);



// //Expand parts variants
// let sizes_array = Array.from(doses_array)
// for (let size1 of sizes_array) {
//   for (let size2 of sizes_array) {
//     let new_dose = {
//       mg: size1.mg,
//       parts: [size1.drug_part],
//     }
//     while (new_dose.mg + size2.mg <= dose_options_max_mg) {
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
