import * as reservations from "./reservation.js"; 
import * as util from "./dbms.js"; 

export function space(level, bay) {
   function key(){
      return level + bay;  
   }
   let reservations = []; 

   function serialise(){
      return util.to_str(level,bay,reservations);
   }
   return { level: level, bay: bay, key: key, reservations, serialise};
}

export function deserialise(deserialised_arr){
   let [dsrl_lvl,dsrl_bay,dsrl_arr] = deserialised_arr.map(str => JSON.parse(str));
   let new_space = space(dsrl_lvl,dsrl_bay); 

   for(let i = 0; i < dsrl_arr.length; i++){
      let initialised_reservation = reservations.deserialise(dsrl_arr[i]); 
      new_space.reservations.push(initialised_reservation);
   }
   return new_space; 
}
// Inistialsie the parking lot
export function init_lot(levels, bays) {
	let spaces = [];
	let level = "A";
	let bay_count = 0;

	const n_spaces = levels * bays; //Number of bays

	let parking_spot;

	for (let i = 0; i < n_spaces; i++) {
		parking_spot = space(level, bay_count.toString());
		bay_count++;
		if (bay_count === bays) {
			bay_count = 0;
			level = String.fromCharCode(level.charCodeAt() + 1); // Increment the Level A -> B
		}
		spaces.push(parking_spot); // Add to the array
	}
	return spaces;
}

// checks if reservation is valid before inserting
export function add_reservation(space,new_resrv){
   let result = reservations.is_valid(space.reservations,new_resrv);

   if(result.code === reservations.RES_OK){
      space.reservations.push(new_resrv);
      result.unwrap = new_resrv;
   }
   return result; 
}

