# Todo features

- [ ] parse md for function names and documentation
- [ ] add signature help to method parameters
- [ ] add color picker for non-special pixels


# Ideas for implementation

I could simply parse the current line, get the first for the current command, and the position in the array for the nth parameter

Use snippetString builder thing to build it off of parameters! maybe?

The output of lexing should be like

[
  {
    value: 'abc',
    start: 0,
    end: 2
  }
]


# shitty regex
test.split(/(#region|#endregion)[ \t]*(\w*)/g)


For any parameters - they are only going to be in the format FF or $123. Therefore we should parse by matching for this, then any other symbols are removed. This is for like FILL|X1 Y1|X2 Y2|RR GG BB