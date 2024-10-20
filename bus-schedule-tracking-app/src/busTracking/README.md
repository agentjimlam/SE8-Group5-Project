# Bus Stop Tracking

## To use this component

### Step 1
Add to your **.env** the [HERE API key](https://www.here.com/docs/bundle/getting-here-credentials/page/README.html).

VITE_HERE_API_KEY=<YOUR_HERE_API_KEY>

### Step 2

Include the component **`<BusTrackingMain />`** to your main router.

## Considerations

The sequence of bus routes is already extracted in BusRoutes. 

The next nearest stops can be polled with an interval, but this will incur a lot of unnecessary API calls.
Reasons for this is that in the beginning few stops, usually users have not reached their intended destination. 

Instead of interval polling, I implement a button to get the next nearest bus stops. 
The button to get the nearest bus stops is to avoid unnecessary API calls. The user only clicks the bus stops when
they want to know how near they are to their intended destination.

The next nearest stop can be one or two bus stops away. This can happen when the bus stops are very near to each other.
I will put the nearest stops in an array and list the top three nearest.
- the bus route of a service number is already in proper sequence number.
- so, I traverse the array in sequence, so the first nearest stop will in the first in the nearest array, then followed
by the next nearest one.
- the criteria will be about xx meters away. I will test and trial what xx distance is the most optimal.
- The top three in the array will be displayed to the users.

## Data in BusServices

In bus services data, some loop bus will have both direction 1 and 2 and LoopDesc like bus 359.

But for some, there is only direction 1 and LoopDesc, like bus 120, 121, 122.

When I assemble the bus route I need to first check for the direction 1 first. Then, I compare whether
the Origin==Destination to check for loop condition.

If Origin and Destination are not the same, then I proceed to get the item in BusServices for Direction 2.




