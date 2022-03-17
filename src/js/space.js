// Creates Space object
export function space(level, bay) {
    return { level: level, bay: bay };
}

// Inistialsie the parking lot 
export function init_lot(levels, bays) {
    let spaces = [];
    let level = 'A';
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