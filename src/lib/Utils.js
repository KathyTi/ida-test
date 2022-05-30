export function getPriceFromString(value){
    //console.log("RESULT1", value.trim())
    let result = value.toString().replace(/ /g,'').replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ')
    //console.log("RESULT2", result)
    return result
}

