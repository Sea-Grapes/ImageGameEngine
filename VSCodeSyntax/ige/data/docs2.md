# `00`: (special) Null
Not an instruction (does nothing). Should be used whenever this pixel is meant to be part of the parameter from the previous pixel (this prevents this pixel from being accidentally ran as an instruction)

# `50`: (method) Offset function
Ignores the next `G_1` pixels. Jumping 0 pixels makes the pointer land on where it currently is, then re-executes the offset instruction, soft-locking the proram in an infinite loop. This is to say that, whatever the pointer lands on will be executed before the pointer continues to move.

# `40`: (method) Goto function
Goes to the specified address.
- `G_1`, `B_1`: The address to jump to.