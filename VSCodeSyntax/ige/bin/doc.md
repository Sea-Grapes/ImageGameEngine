#region 00: Null
Not an instruction (does nothing). Should be used whenever this pixel is meant to be part of the parameter from the previous pixel (this prevents this pixel from being accidentally ran as an instruction)

#region 50: Offset
Ignores the next `G_1` pixels. Jumping 0 pixels makes the pointer land on where it currently is, then re-executes the offset instruction, soft-locking the proram in an infinite loop. This is to say that, whatever the pointer lands on will be executed before the pointer continues to move.

#region 40: Goto
Goes to the specified address.
- `G_1`, `B_1`: The address to jump to.

#region A0: Value mode
This pixel will be treated as a value, and won't be executed as any code. This comes in handy for certain instructions.
If this pixel is `0xA0`, the pixel will be treated as a VALUE, and will be read like this:
- `G_1`: The length, in bytes, of the value.
Every pixel after that will be read as a value. So if `G_1=0x04` (hex value of 4), then the value read will be the concatenation of `R_2,G_2,B_2,R_3`. This means `B_1` is ignored.


#region A1: Variable mode
This pixel will be treated as a value, and won't be executed as any code. This comes in handy for certain instructions.
If this pixel is `0xA1`, the pixel will be treated as a VARIABLE, and will be read like this:
- `G_1`, `B_1`: The address of the variable.
- `G_2`: The length of the variable, in bytes.
- `B_2`: The amount of pixel offset to start reading the value from.
    - For example, if you read from AA AA with an offset of hex 0A, you'll instead read from AA B4 (0xAA + 0x0A = 0xB4)


#region B0: Write
Writes a singular pixel value to a specific address.
- `G_1`, `B_1`: The X and Y pixel to write to.
- The second pixel will be the pixel value to write.


#region C0: Copy Area
Copies an area to another area.
- `G_1`, `B_1`: The top left corner of the data to copy.
- `G_2`, `B_2`: The bottom right corner of the data to copy.
- `G_3`, `B_3`: The top left target corner.
- `R_4`, `G_4`, `B_4`: The mask color. any pixel with this exact color will not be copied over to the target.


#region CA: Copy Value
Copies a singular pixel to another.
- `G_1`, `B_1`: The source pixel.
- `G_2`, `B_2`: The target pixel.


#region D0: Fill area
Fills a square/rectangular area with a singular color. This wraps; it starts at the "top left", and works its way down and to the right, wrapping around the screen (if needed) until it reaches the "bottom right". 
- `G_1`, `B_1`: The top left corner of the square.
- `G_2`, `B_2`: The bottom right corner of the square.
- `R_3`, `G_3`, `B_3`: The value to fill with.


#region BB: Blit
Renders the screen.
- `B_1`: The FPS for this blit.
If this is 0, then it'll render without pause. Any other number will wait `1/val` seconds AFTER rendering the image.

Keep in mind that the `speed` argument in the main.py will override this. The `forcefull` argument will also disable this.


#region EF: Branch to
Jumps instruction to the given address, and appends the address of this instruction to the [branch stack](#branch-stack). Or rather, it searches for the right-most null value, and replaces it with the current address. If the stack is full, the last value in the stack will be overwritten.
- `G_1`, `B_1`: The address to branch to.


#region EE: Return
Returns to the last executed "branch to" instruction. Or rather, it searches for the right-most non-0 pixel in the [branch stack](#branch-stack), and jumps to that address. Also sets the last element in the stack to 0. If the stack is empty, returns to (0, 0).