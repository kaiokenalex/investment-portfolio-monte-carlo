function monteCarlo1000() {
const sheet =
SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Simulation");
const init = sheet.getRange("B1").getValue();
const contrib = sheet.getRange("B2").getValue();
const avg = sheet.getRange("B3").getValue();
const stddev = sheet.getRange("B4").getValue();
const years = sheet.getRange("B5").getValue();
const trials = 1000;
const results = [];
for (let i = 0; i < trials; i++) {
let value = init;
for (let y = 0; y < years; y++) {
const randReturn = normInv(Math.random(), avg, stddev);
value = value * (1 + randReturn) + contrib;
}
results.push([value]);
}
// Output results to column D
sheet.getRange(1, 7).setValue("Simulation Results");
sheet.getRange(2, 7, trials, 1).setValues(results);
}
// Normal inverse function
function normInv(p, mean, std) {
return mean + std * Math.sqrt(2) * erfinv(2 * p - 1);
}
// Error function inverse approximation
function erfinv(x) {
let a = 0.147;
let the_sign_of_x = x < 0 ? -1 : 1;
let ln1MinusXSquared = Math.log(1 - x * x);
let part1 = 2 / (Math.PI * a) + ln1MinusXSquared / 2;
let part2 = ln1MinusXSquared / a;
return the_sign_of_x * Math.sqrt(Math.sqrt(part1 * part1 - part2) - part1);
}
