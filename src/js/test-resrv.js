import * as reservations from "./reservation.js"; 
import * as space from "./space.js";
import * as user from "./user.js";
import { strict as assert } from 'assert';
import * as util from "./dbms.js";

const d0 = new Date("March 2,2022 10:20");
const d1 = new Date("March 3,2022 10:20");
const d2 = new Date("March 2,2022,10:40");
const one_hr = reservations.duration(1, 0);
const t0 = reservations.time(d0, one_hr);
const t1 = reservations.time(d1, one_hr);
const t2 = reservations.time(d2, one_hr);

function test_reservations() {
   console.log("====TEST RESERVATIONS====");

   let test_space = space.space("A", "2");
   console.log("key " + test_space.key());
   let test_user = user.User("foo", "bar", "foobar@gmail.com");
   let test_vID = "ABCDEF6";
   let test_time = reservations.time(d0, one_hr);
   let resrv_arr = [];
   let test_resrv = reservations.reservation(
         test_time,
         test_user,
         test_vID
   );
   resrv_arr.push(test_resrv);
   console.log("====BASIC RESRV TEST====");
   let test_time1 = reservations.time(d1, one_hr);
   let test_resrv1 = reservations.reservation(
         test_time1,
         test_user,
         test_vID
   );
   let res = reservations.is_valid(resrv_arr, test_resrv1);
   assert.deepEqual(
         res.code,
         reservations.RES_OK,
         "vaid reservations are accepted"
   );
   resrv_arr.push(test_resrv1);
   let res2 = reservations.is_valid(resrv_arr, test_resrv);
   assert.deepEqual(
         res2.code,
         reservations.TIME_COLL,
         "duplicate reservations are not accepted"
   );

   resrv_arr.push(test_resrv1);
   console.log("====TEST OVERLAP====");
   let res1 = reservations.is_valid(resrv_arr, test_resrv);
   console.log(res1);
   assert.deepEqual(
         res1.code,
         reservations.TIME_COLL,
         "duplicate reservations are not accepted"
   );

   space.add_reservation(test_space,test_resrv);
   space.add_reservation(test_space,test_resrv);
   space.add_reservation(test_space,test_resrv1);
   assert.deepEqual(
         test_space.reservations.length,
         2,
         "space validated reservations before adding them"
   );

   console.log("=====TEST OUTCOME=======");
   console.log(test_space.reservations);
   console.log("============");
}

function test_spaces() {
      console.log("====TEST SPACES====");
      let spaces = space.init_lot(2, 3);

      for (let i = 0; i < 6; i++) {
            console.log(spaces[i]);
      }

      assert.deepEqual(
            spaces[5].level,
            "B",
            "level is assigned in alphabetical order"
      );
      assert.deepEqual(
            spaces[5].bay,
            "2",
            "lot is indexed from 0 and reset by each level"
      );
}

function test_times() {
      console.log("====TEST TIMES====");

      assert.deepEqual(
            t0.overlap(t1),
            false,
            "march 2nd 10:20 cannot overlap with march 3rd"
      );
      assert.deepEqual(
            t0.overlap(t2),
            true,
            "time 10:40 is within the range 10:20-11:20"
      );
}

test_spaces();
test_times();
test_reservations();

console.log("all tests passed");
