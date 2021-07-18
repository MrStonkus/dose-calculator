//Define initial parrameters
var weekly_doze = 37.5
var daily_dose = weekly_doze / 7
var dose_variants_min_value = 0
var dose_variants_max_value = 10
var drugs = [
  {
    name: 'Orfarin',
    concentration: 5,
    measurement: 'mg',
    quantity: 100,
    unit: 'tablet',
    can_be_splitted_into_2_parts: true,
  },
  {
    name: 'Orfarin',
    concentration: 3,
    measurement: 'mg',
    quantity: 100,
    unit: 'tablet',
    can_be_splitted_into_2_parts: true,
  }
]

//List parrameters
console.log('Weekly doze: ' + weekly_doze)
console.log('Daily dose: ' + daily_dose + drugs[0].measurement)
for (let i = 0; i < drugs.length; i++) {
    console.log(drugs[i])
}

//Define dose variants array
var dose_variants = []
for (let i = 0; i < drugs.length; i++){
    dose_variants.push(drugs[i].concentration)
    if (drugs[i].can_be_splitted_into_2_parts) {
        dose_variants.push(drugs[i].concentration / 2)
    }
}
dose_variants.sort((a, b) => a - b) //dose_variants.sort(function(a, b){return a - b});
//Expand dose variants
for (let y = 0; y < dose_variants.length; y++){
    
    let variant = dose_variants[0] + dose_variants[y]
    if (variant <= dose_variants_max_value) {
        
        let still_exist = dose_variants.find((o) => o === variant)
        if (!still_exist) {
            dose_variants.push(variant)
            
        }
    }
}
dose_variants.sort((a, b) => a - b) //dose_variants.sort(function(a, b){return a - b});
console.log(dose_variants)




