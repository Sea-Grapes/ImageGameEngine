# 0x00: Null

label: 00
insertText: 40 ${1:00} {2:00}

Not an instruction (does nothing). Should be used whenever this pixel is meant to be part of the parameter from the previous pixel (this prevents this pixel from being accidentally ran as an instruction)

signature: 

## `0x40`: Goto
Goes to the specified address.
- `G_1`, `B_1`: The address to jump to.