/** Calculate distance between two (lat, lng) coordinates.
 * From Gemini.
 * Haversine formula: This formula calculates the great-circle 
 * distance between two points on a sphere.
 * Earth's radius: The R constant represents the Earth's radius in 
 * meters.
*/

/**Return results in meters. */
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  // Distance in meters
  let distance = R * c; 
  console.log("type of distance ", typeof(distance));
  return distance;
}

function deg2rad(degrees) {
  return degrees * (Math.PI / 180);
}

// Sample call to the function
const lat1 = 52.520008;
const lon1 = 13.404954;
const lat2 = 48.858844;
const lon2 = 2.294422;

//const distance = haversineDistance(lat1, lon1, lat2, lon2);
//console.log("Distance:", distance.toFixed(2), "meters");