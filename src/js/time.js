import {strict as assert} from 'assert';
import * as util from "./dbms.js"; 
// Ensures the input duration are whole nubers not floating points (i.e. 1.5hrs)
export function duration(hr, min) {
	assert.deepEqual(Number.isInteger(hr), true, "hours must be a whole number");
	assert.deepEqual(
		Number.isInteger(min),
		true,
		"minutes must be a whole number"
	);
	return { hr: hr, min: min };
}

//returns time object
export function time(_start, _dur) {
	let start = new Date();
      start.setTime(_start.getTime());

	// checks to see if the time periods overlaps
         function overlap(t1) {
		console.log("t0: " + JSON.stringify(start));
		console.log("t1: " + JSON.stringify(t1));
		start.setHours(start.getHours() + _dur.hr);
		start.setMinutes(start.getMinutes() + _dur.min);
		let res = start >= t1.start;
		console.log("t0 > t1: " + res + "\n");
		//reset start
		start.setHours(start.getHours() - _dur.hr);
		start.setMinutes(start.getMinutes() - _dur.min);

		return res;
	}


	return { start: start, duration: _dur, overlap: overlap };
}

