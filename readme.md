# Nandban
An emergent complexity experiment. Visit https://mattpk.github.io/nandban to play.

## Rules
Jets shoot lasers in the direction they face. If a Jet is hit by a laser, it becomes disabled and can not shoot.

## Controls
Arrow keys / WASD to move the cursor.
Space to place / remove Jets.

## Examples

### Placing jets:
![Placing jets](https://mattpk.github.io/nandban/gifs/place.gif)

### AND Gate:
![And gate](https://mattpk.github.io/nandban/gifs/andgate.gif)

### XOR Gate:
![XOR gate](https://mattpk.github.io/nandban/gifs/xor.gif)

### SR Latch:
![SR Latch](https://mattpk.github.io/nandban/gifs/srlatch.gif)

### Half Adder:
![Half Adder](https://mattpk.github.io/nandban/gifs/halfadder.gif)

### Full Adder:
![Full Adder](https://mattpk.github.io/nandban/gifs/fulladder.gif)

### 7 Bit Adder:

Demonstrating adding 0101101<sub>2</sub> + 1101110<sub>2</sub> = 10011011<sub>2</sub>
(45 + 110 = 155)
![7 Bit Adder](https://mattpk.github.io/nandban/gifs/7bitadder.gif)

### Advanced

#### Copy & Paste
Thanks to [Josh Jung](https://github.com/JoshJung17) for his implementation.
- 'V' to start/end selection
- 'Y' to yank selection
- 'P' to paste selection
- 'Esc' to stop selection

#### Save & Load
This functionality will be exposed in the UI soon, but for now you can open the developer console (Ctrl/⌘ + Shift + C) and use the functions `exportToString` and `importFromString(json)` respectively to save and load your boards.
