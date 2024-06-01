# PeththaScript
PeththaScript is just a meme project I've been working on :wink:. Hope you like it. Have fun! :heart:

---

## Documentation

### Requirements
1. Node.js

### 1. How to Setup
Download the complete folder as a zip file. Extract the zip file to anywhere on your device. And you're ready to go.

### 2. Creating Your First File
Open the extracted folder in your preferred code editor. Create a new file with the extention `.pet`. It is recommended not to use spaces in the file name. However, using spaces is also fine if wanted. The format for the file name is give below.

```
[filename].peth
```

### 3. Writing the First Line of Code
PeththaScript has a very simple syntax once you understand it. Basically every line has 3 sections explaining 3 properties about the input value. These 2 sections are broken into `peththa`, `bath` and `kawada`. At the end of each line is a pair of square brackets surrounding what to do with the processed value. There are 2 valid values that can be written within these square brackets. They are either `log` or `store`. Back to the 3 sections of the line, `peththa` defines what to do with the input value, `bath` is where you input the type of the input and `kawada` is where the actual input is provided. Given below is the syntax of a simple PeththaScript line.

```
peththa ? function : bath ? type : kawada ? value [log|store]
```

There are 6 valid functions. They are,
- keep
- repeat
- reverse
- jumble
- rotateR
- rotateL

The `keep` function is used when you want to log or store the raw value of your input.
The `repeat` function is used to repeat a string *n* number of times.
The `reverse` function is used to reverse the characters of a string.
The `jumble` function is used to shuffle the position of the characters of a string.
The `rotateR` function is used to [right rotate](https://www.geeksforgeeks.org/complete-guide-on-array-rotations/) a string *n* number of times.
The `rotateL` function is used to [left rotate](https://www.geeksforgeeks.org/complete-guide-on-array-rotations/) a string *n* number of times.

In the functions `repeat`, `rotateR` and `rotateL` take the input of *n* using what's termed as a **sectional input field**. Sectional input fields are written using curly braces (`{}`) and the value written within the curly braces is called the **sectional input**. A sectional input field can only contain one numerical value. An example is given below.

```
peththa ? repeat : bath ? str : kawada ? "hello world" [log] {2}
peththa ? rotateR : bath ? str : kawada ? "hello world" [log] {2}
peththa ? rotateL : bath ? str : kawada ? "hello world" [log] {2}
```
Output:
```
hello worldhello world
ldhello wor
llo worldhe
```

By the first line of code we are saying to repeat the provided string 2 times and log it to the console, the second line says to right rotate the string 2 times and log it and the third line is saying to left rotate the 2 times and log it.

That's all about functions. When talking about data types, there are 3 valid types in PeththaScript. They are,

- str : type provided when the value is a string
- int : type provided when the value is a number
- bigInt : type provided when the value is a very large number

When providing the value in the `kawada` section,

- Values of type `str` must be surrounded by double quotes
- Values of type `str` can contain double quotes within the string itself. The string is closed at the last double quotation mark.
- Values of type `int` and `bigInt` must be numberical

Next is what we call the `Dot Function`. The Dot Function is the value we write at the end of the line within square brackets.

```
peththa ? keep : bath ? int : kawada ? 2134 [log]
```

Here `[log]` is the dot function. The 2 valid dot functions are `log` and `store`. The `log` function is pretty straight-forward. It logs the value to the console. However the store function is bit more complicated. Whenever you write a line with the `store` dot function, the `render` file stores that value in a variable. And that introduces us to a new line structure.

```
peththa ? keep : bath ? str : kawada ? "Hello World" [store]
<reverse> [log]
```
Output
```
dlroW olleH
```

Here, the value of the first line is stored for later use and the second line accesses this value. So basically, you just have to write the wanted function within '<>' and just define the dot function to access the stored value. These lines are called `accessor lines`.

> If a new line with the `store` dot function is written after the previous one, the stored value is replaced with the processed value of the new line and that value is provided to any accessor lines thereafter.

```
peththa ? keep : bath ? str : kawada ? "Hello World" [store]
<reverse> [log]
peththa ? keep : bath ? str : kawada ? "Hi There" [store]
<reverse> [log]
```
Output
```
dlroW olleH
erehT iH
```
### Variables
If you've been wondering, "Wait! I can't write all the text I want in that one line", don't worry! I got you. Variables in PeththaScript, like any other language, is used to store values to be used later. However, in PeththaScript, variables are written in a seperate file. This file's name must be the filename as your code file. The only difference is that the extention need to be `.vpeth` instead of `.peth`. This file should also be created within the `src` folder.

```
[filename].vpeth
```

To define variables, a line structure similar to the following is used.

```
<varName:varType>
```
This is a `declaration line` and is used to define a variable. Here, the variable name (varName) must start with a capital or simple English letter and after that can contain any english letter, integers from 0-9 and underscores (`_`).

Example: `variable_name1`

The value of the variable needs to start in the line following the declaration line. When writing strings, double quotes are not used. Instead you can just write it in as many lines as wanted and the line breaks are not accounted for. If you want to add any line breaks, you can use `\n` within the value of the variable. You can use multiple lines when defining variables of type `int` and `bigInt` as well since the line breaks are not counted.

```
<var1:str>
Hello world!
This is Infroid Coder.
Hope you're all doing well.
<var2:int>
21984789
32439
<var3:bigInt>
7432839809443462
48798489358793487
343782
```

The value of `var1` in this case is:
```
Hello world!This is Infroid Coder.Hope you're all doing well
```

Notice how there are no spaces after 'Hello world!' and '...Infroid Coder.' since the line breaks were replaced with empty strings.

The value of `var2` is:
```
2198478932439
```

The value of `var3` is:
```
743283980944346248798489358793487343782
```

### Accessing Variables in the Code

To access a variable you've just initialized/defined, you would start with the same syntax of a normal line except, the type or `bath` is set to the type of the variable and the value or `kawada` is set to the variable name surrounded by paranthesis.

```
peththa ? keep : bath ? str : kawada ? (var1) [log]
```

Here, `var1` is the variable name and notice how the type is set `str` which is the type of the variable.

### Comments
Comments are important for documenting your code or debugging. In PeththaScript you can write comments in the following format.

```
### This is a comment
```

### Run the Code
To run the code you've just written, type the following command in the terminal while selecting the root folder in which the `peth_run.js` is located.

```
node peth_run [filename]
```

P.S - Exclude the file extention when running the `peth` file.

---

<p align="center">That is all for the documentation. Hope you have fun with <b>PeththaScript</b>. Happy Coding!👨‍💻</p>

---

<h1 align="center">Thank You!</h1>
