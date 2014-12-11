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

##Arduino Setup

My setup has three solenoid valves on pins 10, 11, and 12. The [connection map](https://github.com/jamesmacfie/imber-remote/blob/master/connectionMaps.js) can be changed to any
other pin numbers if you want to change which pins direct the valves on the arduino.

Kit:
 * [Raspberry Pi](http://www.raspberrypi.org/)
 * USB wifi dongle (optional if you have a nearly ethernet port)
 * [Arduino Uno](http://arduino.cc/en/Main/arduinoBoardUno) or compatible microcontroller
 * Three solid state relays (I have [these](http://www.dx.com/p/arduino-2-channel-5v-relay-module-expansion-board-137160#.VIf7NtY6GKw))
 * Three solenoid valves (I have [these](http://www.dx.com/p/electric-solenoid-valve-for-water-air-n-c-12v-dc-1-2-normally-closed-golden-white-246864#.VIf67tY6GKw))
 * 12v power adapter
 * Male to female leads

You'll need to setup your SSR's with the default state to 'always off' so that they are only on when the Arduino sends
sends a current. Depending on your relays, the leads simply go form the appropriate Arduino port to the appropriate
relay pin. The USB goes to the Raspberry Pi and that's about it.

I'd recommend putting your valves in some sort of enclosure away from the electronics and in a manner where,
if a hose comes loose or bursts, no electronics are affected. It's happened to me before and isn't nice.

##Installation of the node module

```
npm install imber-remote

cd node_modules/imber-remote

node app.js

```

##Other notes

If you like you can SSH into your Raspberry Pi, but if your Pi exists soley for your sprinkler system like
mine does then having the node module run on startup by default might be something you want to do. You know,
so if your power goes out or something then your sprinkler system will automatically restart and start monitoring
for changes again without your input. There are plenty of guides on the net for this

You may also want to use something like [nodemon](https://github.com/remy/nodemon) or [forever](https://github.com/nodejitsu/forever) to ensure that if your app does crash for whatever reason then it
will startup again.
