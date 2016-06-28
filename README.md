# Constellation
Points and lines, basically.

This is not a glaring example of pretty code. Just checking out how many frames per second I can push out of <canvas>. Which on a browser handled by a window manager will usually be locked to 60fps. Let's get 60fps on as many devices as possible.

## Possible optimization paths

 * batch together line draws. Currently drawing one line by one line.
 * Matrix math to calculate distances? Might gain in computation speed, but lose in GC calls.
