import * as sp from "./space.js"; 
import * as RSRV from "./reservation.js"; 
import * as TM from "./time.js";

import {strict as assert} from 'assert';

function should_make_space(){
   const d0 = TM.duration(1,0);
   const day0 = new Date('1/7/17');
   const t0 = TM.time(day0,d0); 
   
   const res = RSRV.reservation(t0,'guest','ABC 123');

   let space = sp.space("A","1");
   sp.add_reservation(space,res);
   let str = space.serialise(); 

   const dsrl_space = sp.deserialise(str);

   assert.deepEqual(
      dsrl_space.level,
      space.level,
      'space obj is deserialised correctly'
   ); 

   assert.deepEqual(
      dsrl_space.bay,
      space.bay,
      'space obj is deserialised correctly'
   );
  
   assert.deepEqual(
        dsrl_space.reservations[0].time.start,
        space.reservations[0].time.start,
        'space reservation arr is deserialised correctly'
    );

   assert.deepEqual(
        dsrl_space.reservations[0].time.duration,
        space.reservations[0].time.duration,
        'space reservation arr is deserialised correctly'
    );
   assert.deepEqual(
        dsrl_space.reservations[0].user,
        space.reservations[0].user,
        'space reservation arr is deserialised correctly'
    );
   assert.deepEqual(
        dsrl_space.reservations[0].number_plate,
        space.reservations[0].number_plate,
        'space reservation arr is deserialised correctly'
    );
}


should_make_space();
console.log("====ALL TESTS PASSED===="); 
