export const ropaniToDaam = (theInput) => {
   const myArray = theInput.split("-");
        console.log(myArray);
        var r = parseInt(myArray[0]) > 0 ? parseInt(myArray[0]) : 0
        var a = parseInt(myArray[1]) > 0 ? parseInt(myArray[1]) : 0
        var p = parseInt(myArray[2]) > 0 ? parseInt(myArray[2]) : 0
        var d = parseInt(myArray[3]) > 0 ? parseInt(myArray[3]) : 0
        var tot = r * 16 * 16 + a * 16 + p * 4 + d 
        return tot;
   }