
function addZero(str,length){
    return new Array(length - String(str).length + 1).join("0") + str;              
}

console.log(addZero(10,5))