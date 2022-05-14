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

function test_route(){
   const query_lot = 'LIBRARY';

   const d0 = new Date("March 2,2022 10:20");
   const d1 = new Date("May 2,2022 10:20");
   const d2 = new Date("April 3,2022 09:10");

   const one_hr = TM.duration(1,0);
   const two_hr = TM.duration(2,0);

   const t0 = TM.time(d0,one_hr);
   const t1 = TM.time(d1,one_hr);
   const t2 = TM.time(d2,two_hr);

   const u0 = USR.User("send","help","synoptic@gmail.com");


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
   const re2 = RESRV.reservation(
      t2,
      u0,
      "stare into the abyss long enough ..."
   );
   let space_db = SERVER.init_server_db();
   let test_lot = space_db.get(query_lot);
   SPACE.add_reservation(test_lot[0],re0);  
   SPACE.add_reservation(test_lot[1],re1);  
   SPACE.add_reservation(test_lot[2],re2);  
   console.log("==========TEST ROUTE=========");
   let start = new Date("January 2,2022 10:20");
   let end   = new Date("June 2,2022 10:20");
   let req = {};

   req.LOT = 'LIBRARY';
   req.START = start.getTime();
   req.END = end.getTime();
   req.KEYS = ["A0","A1","A2"];
   let summary = SERVER.post_reservations(req,space_db);

   assert(summary.A0,"captures all reservations within time period");
   assert(summary.A1,"captures all reservations within time period");
   assert(summary.A2,"captures all reservations within time period");
   console.log("=====SUMMARIES=====");
   console.log(summary);

   let exc1_date = new Date("May 1,2022 09:30");
   req.END = exc1_date.getTime();
   summary = SERVER.post_reservations(req,space_db);
   let exists = Boolean(summary.A1);

   assert(summary.A0,"captures only the reservations within time period");
   assert(summary.A2,"captures only the reservations within time period");
   assert.deepEqual(exists,false,"dont capture reservations out of time period");
  
   req.END = null;
   summary = SERVER.post_reservations(req,space_db);
   let exists_a0 = Boolean(summary.A0);
   let exists_a1 = Boolean(summary.A1);
   let exists_a2 = Boolean(summary.A2);
   assert.deepEqual(exists_a0,false,"no false positives, db contains no dates that start on january");
   assert.deepEqual(exists_a1,false,"no false positives, db contains no dates that start on january");
   assert.deepEqual(exists_a2,false,"no false positives, db contains no dates that start on january");


   let should_exist = d1; 
   req.START = should_exist;
   summary = SERVER.post_reservations(req,space_db);
   
   exists_a0 = Boolean(summary.A0);
   exists_a2 = Boolean(summary.A2);
   assert(summary.A1,"should capture start dates that match");
   assert.deepEqual(exists_a0,false,"should only capture resevations that start on the same date");
   assert.deepEqual(exists_a2,false,"should only capture resevations that start on the same date");
}
test();
test_route();
console.log("=====ALL TESTS PASSED======");
