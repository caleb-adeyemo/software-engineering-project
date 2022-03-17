import assert from "assert/strict";
import * as util from "./dbms.js";

export const TIME_COLL = Symbol("times overlap"); // Return values
export const INV_USER = Symbol("invalid user"); // Return values
export const RES_OK = Symbol("reservation is vaild"); // Return values

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
	let start = new Date(
		_start.getFullYear(),
		_start.getMonth(),
		_start.getDay(),
		_start.getHours(),
		_start.getMinutes()
	);

	// checks to see if the time periods overlaps
	function overlap(t1) {
		console.log("t0: " + JSON.stringify(start));
		console.log("t1: " + JSON.stringify(t1));
		start.setHours(start.getHours() + _dur.hr);
		start.setMinutes(start.getMinutes() + _dur.min);
		let res = start > t1.start;
		console.log("t0 > t1: " + res + "\n");
		//reset start
		start.setHours(start.getHours() - _dur.hr);
		start.setMinutes(start.getMinutes() - _dur.min);

		return res;
	}
	return { start: start, overlap: overlap };
}

// Creates reservation object
export function reservation(time, space, user, number_plate) {
	return { time: time, space: space, user: user, number_plate };
}

// checks to see if reservations clashes/vaild
export function is_valid(res_arr, new_resrv) {
	const collisions = res_arr.filter((col) => col.space === new_resrv.space);
	for (let i = 0; i < collisions.length; i++) {
		if (collisions[i].time.overlap(new_resrv.time) === true) {
			console.log(TIME_COLL);
			return util.Result(TIME_COLL, "space already booked", null);
		}
	}
	return util.Result(RES_OK, "reservation made successfully", null);
}
