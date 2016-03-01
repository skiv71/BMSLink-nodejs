# BMSLink-nodejs

This is still a work in progress!

Porting the old system, into a single process, self contained Node application.

Has its own (mine) NoSQL database, with store and collections created automatically.

Has a RESTful API with defined routes, most standard read,insert,update and remove.

Some are specific, i.e. scada route (working) and logs (not finished yet).

The first interface I tackled was the 'rfxcom' interface.

This is working well for receiving and transmitting (with limited decoding/encoding for the time being).

The RFXtrx433 requires my own Raspberry PI virtual device server (making the rfxcom appear as a virtual serial port).

I'll get this Git'd soon.

More to follow... :)
