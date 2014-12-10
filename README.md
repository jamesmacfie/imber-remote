Project Imber (remote)
======================

This is the second half of [Project Imber](https://github.com/jamesmacfie/imber) that directly interfaces with an arduino to control
solenoid valves to turn on and off a home garden sytem. The Raspberry Pi interfaces with the arduino
via [Johnny-Five](https://github.com/rwaldron/johnny-five).

It uses the [DDP protocol](https://www.meteor.com/blog/2012/03/21/introducing-ddp) to watch a remote Mongo collection for changes (running via a [Meteor](http://www.meteor.com)
server) and respond to those changes appropriately. The records have references to which pin they
relate to so that this module knows which Arduino output to turn on or off. The act of turning a valve on or off is
really simple; it simply applies current to the valve via a solid state relay (which is off by default). When
the value receives current then they open and the sprinkler turns on.

The implementation here is very strictly tied to the Mongo app at Project Imber but could probably
be extended to do other stuff with a minimal amount of tweaking.

Although this code can be run from any computer that runs node and has an Arduino attached to it,
ideally this belongs on a dedicated Raspberry Pi. So the installation instructions below assume this.

Arduino Setup

My setup has three solenoid valves on pins 10, 11, and 12. The connection map (link) can be changed to any
other pin numbers if you want to change which pins direct the valves on the arduino.

Kit:
 * Raspberry Pi (link)
 * USB wifi dongle (optional if you have a nearly ethernet port)
 * Arduino Uno (link)
 * Three solid state relays (I have these (link))
 * Three solenoid valves (I have these (link))
 * Male to female leads

Setup your kit a little somthing like this:
(insert image of the setup here)

I'd recommend putting your valves in some sort of enclosure away from the electronics and in a manner where,
if a hose comes loose or bursts, no electronics are affected. It's happened to me before and isn't nice.

Installation of the node module

```
npm install imber-remote

node app.js

```

Running on raspberry pi startup

If you like you can SSH into your Raspberry Pi, but if your Pi exists soley for your sprinkler system like
mine does then having the node module run on startup by default might be something you want to do. You know,
so if your power goes out or something then your sprinkler system will automatically restart and start monitoring
for changes again without your input.

Restarting on crash
