import * as SPACE from './space.js';
import * as TM from './time.js';
import * as USR from './user.js';
import * as RESRV from './reservation.js';
import * as SERVER from './server.js';
import {strict as assert} from 'assert';

function test(){
   const d0 = new Date("March 2,2022 10:20");
   const d1 = new Date("May 2,2022 10:20");
   const d_fail = new Date("April 3,2014 09:10");

   const one_hr = TM.duration(1,0);
   const two_hr = TM.duration(2,0);

   const t0 = TM.time(d0,one_hr);
   const t1 = TM.time(d1,one_hr);
   const t_fail = TM.time(d_fail,two_hr);

   const u0 = USR.User("send","help","synoptic@gmail.com");

   let lot_0 = SPACE.init_lot(1,10);

   const re0 = RESRV.reservation(
      t0,
      u0,
      "payn3"
   );

   const re1 = RESRV.reservation(
      t1,
      u0,
      "js is suffering"
   );

   SPACE.add_reservation(lot_0[0],re0);
   SPACE.add_reservation(lot_0[1],re0);
   SPACE.add_reservation(lot_0[1],re1);
   
   let query_0 = (resrv) => resrv.time.start.getTime() === t0.start.getTime();
   let query_1 = (resrv) => resrv.time.start.getTime() === t1.start.getTime();
   let query_f = (resrv) => resrv.time.start.getTime() === t_fail.start.getTime();

   let match = SERVER.get_reservations(lot_0, query_0);
   assert.deepEqual(match.length,2,"get query should find the two reservations with identical time");

   match = SERVER.get_reservations(lot_0, query_1);
   assert.deepEqual(match.length,1,"get query should find the single reservation with a unique time");


   match = SERVER.get_reservations(lot_0, query_f);
   assert.deepEqual(match.length,0,"get query should only return reservations that pass the predicate");
   match = SERVER.get_reservations_map(lot_0,query_0);
   console.log("======RAW  MAP=======");
   console.log(match);
   let sum_obj = SERVER.reservation_map_to_summary_map(match);
   console.log("======SUMMARIES======");
   console.log(sum_obj);
}

test();
console.log("=====ALL TESTS PASSED======");
