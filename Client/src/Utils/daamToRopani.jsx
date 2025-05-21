export const daamToRopani = (theInput) => {
    let x = theInput;
    let ur=0;
    let bd=0;
    let ua=0;    
    let ud=0;
    ur = Math.floor(x / 256);
    bd = x - (ur * 256);
    ua = Math.floor(bd / 16)
    bd = bd - (ua * 16);
    ud = Math.floor(bd / 4)
    bd = bd - (ud * 4);                
    var str =   ur + " रोपनी " + ua + " आना " + ud + " पैसा " + bd + " दाम";
    return str;
}