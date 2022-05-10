import { strict as assert } from 'assert';
import * as util from './dbms.js';
import * as TM from './time.js';

export const TIME_COLL = Symbol("times overlap"); 
export const INV_USER = Symbol("invalid user"); 
export const RES_OK = Symbol("reservation is vaild");

// Creates reservation object
export function reservation(time,  user, number_plate) {
   function serialise(){
      let str = []; 
      str.push(TM.serialise(time));
      let other_info = util.to_str(user,number_plate); 
      str.push(other_info); 
   } 
   function equals(other){
      return time.equals(other.time)
         && user.equals(other.user) 
         && number_plate === other.number_plate;
   }
   return {time: time, user: user,number_plate: number_plate};
}

// checks to see if reservations clashes/vaild
export function is_valid(res_arr, new_resrv) {
	for (let i = 0; i < res_arr.length; i++) {
		if (res_arr[i].time.overlap(new_resrv.time) === true) {
			console.log(TIME_COLL);
			return util.Result(TIME_COLL, "space already booked", false);
		}
	}
   return util.Result(RES_OK, "reservation made successfully", true);
}

export function deserialise(str){
   let tmp_date = new Date(str.time.start); 
   let new_time = TM.time(tmp_date,str.time.duration); 
   return reservation(new_time,str.user,str.number_plate); 
}
