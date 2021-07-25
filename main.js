//Define initial parrameters
var recomended_weekly_doze = 41
var recomended_daily_dose = recomended_weekly_doze / 7
var dose_variants_max_value = 10
var number_of_days_to_calculate_doses = 28
//generates unique id
function newUid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
//create unique drugs_array - Factory function
function createDrugs(name, concentration, measurement, quantity, unit, can_split) {
  return {
    id: newUid(),
    name,
    concentration,
    measurement,
    quantity,
    unit,
    can_split, //can one tablet be splitted to two parts? true/false
  }
}
//creates drug parts(tablete/pils) 
function createDrugPart(drugID, part, concentration) {
  return {
    id: newUid(),
    drugID,
    part,
    concentration  
  }
}
//creates drug dose with tablete parts information 
function createDose(drug_part) {
  return {
    id: newUid(),
    drug_part: drug_part,
    concentration: function () {
      //TODO reikia dabaigti
      return drug_part.concentration.reduce((a, b) => a + b, 0)
    }
    }
  }

//create new drugs_array
var drugs_array = []
drugs_array.push(createDrugs('Orfarin', 5, 'mg', 100, 'tablet', true))
drugs_array.push(createDrugs('Orfarin', 3, 'mg', 100, 'tablet', true))

//log info
console.log('Weekly doze: ' + recomended_weekly_doze)
console.log('Daily dose: ' + recomended_daily_dose + drugs_array[0].measurement)
console.log('Drugs:');
for (let drug of drugs_array) {
  console.log(drug)
}

//define default drug parts
var drug_parts = []
var concentration_array = []
for (let drug of drugs_array) {
  
  drug_parts.push(createDrugPart(drug.id, 1, drug.concentration))
  concentration_array.push(drug.concentration)  
  if (drug.can_split) {
    drug_parts.push(createDrugPart(drug.id, 0.5, drug.concentration /2))
    concentration_array.push(drug.concentration)  
  }
}
console.log('List of drug parts');
console.log(drug_parts);

//create default variants of doses
var doses_array = []
for (part of drug_parts) {
  let dose = createDose(part)
  doses_array.push(dose)
}
console.log('Doses');
console.log(doses_array);


//Expand parts variants
let sizes_array = Array.from(drug_parts)
for (let size1 of sizes_array) {
  for (let size2 of sizes_array) {
    let total = {
      sum: size1.concentration,
      parts: [size1]
    }
    while (total.sum + size2.concentration <= dose_variants_max_value) {
      total.sum = total.sum + size2.concentration
      total.parts.push(size2)
      
      if (!concentration_array.find(e => e === total.sum)) {
        
        concentration_array.push(total.sum)
        drug_parts.push(total)
        
        let dose = createDose(total.parts)
        doses_array.push(dose)
      }
    }
  }
}

console.log('Dose variants: ');
console.log(Array.from(doses_array).sort((a, b) => a - b))

// Define daily doses
var daily_doses = []
var balance = 0
for (let i = 0; i < number_of_days_to_calculate_doses; i++) {
  balance += recomended_daily_dose

  let closest_size = 0
  let smallest_diff = 9999
  for (let size of doses_array) {
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


