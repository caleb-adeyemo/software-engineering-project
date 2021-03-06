import { strict as assert } from 'assert';
import * as util from './dbms.js';
import * as TM from './time.js';
import * as USER from './user.js';

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

// collect useful data about a reservation into a flat object
export function summary(resrv){
   return {
      username: resrv.user.username, 
      name: resrv.user.name,
      email: resrv.user.email,
      number_plate: resrv.number_plate,
      start_date: resrv.time.start.getTime(),
      dur_hours: resrv.time.duration.hr,
      dur_minutes: resrv.time.duration.min
   };
}

export function from_summary(summary){
   let start = new Date();
   start.setTime(summary.start_date);
   let dur = TM.duration(summary.dur_hours,summary.dur_minutes);
   let time = TM.time(start,dur); 
   let user = USER.User(summary.username,summary.name,summary.email,null);
   return reservation(time,user,summary.number_plate);
}
