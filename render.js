// require the necessarry modules
const fs = require("fs");
const path = require("path");

// function to display error messages
function Err(errType=0,errMsg="",lineN,vars=false){
    let fName = (vars) ? varFileName : fileName;
    let types = ["Render Error","Type Error","Variable Error","Reference Error"];
    if(lineN === null){
        console.error(
            `\n${types[errType]} : ${errMsg}\n`+
            `  origin : ${path.join(process.cwd(),fName)}\n`
        );
    } else{
        console.error(
            `\n${types[errType]} : ${errMsg}\n`+
            `  origin : ${path.join(process.cwd(),fName)}\n`+
            `  line : ${lineN}\n`
        );
    }
}
//function to right rotate an array
let rightRotate = (arr,d) => {
    let sliceAt = (d <= arr.length) ? arr.length - d : arr.length - d%arr.length;
    return (sliceAt === 0) ? arr : arr.slice(sliceAt).concat(arr.slice(0,sliceAt));
}
//function to left rotate an array
let leftRotate = (arr,d) => {
    let sliceAt = (d <= arr.length) ? d : d%arr.length;
    return (sliceAt === 0) ? arr : arr.slice(sliceAt).concat(arr.slice(0,sliceAt));
}
//function to randomize the elements of an array
function randomize(str=""){
    return str.split("").sort(() => {return Math.random() - 0.5}).join("");
}

let fileName = process.argv[2]+".pet"; // initialize the filename from the script call from the CLI
let filePath = path.join(process.cwd(),"src/"+fileName); //initialize the filepath by merging the path of the current working directory and the provided file
let varFileName = process.argv[2]+".vpet"; // initialize the variable filename from the script call from the CLI
let varFilePath = path.join(process.cwd(),"src/"+varFileName); //initialize the variable filepath by merging the path of the current working directory and the provided file

let vars = {}; // initialize an object to store the variables
let varErrState = false; // boolean to determine whether there was an error in getting the variables
let varReg = /^<[a-zA-Z][\w]+:(int|str|bigInt)>$/; // regex to test a variable initialization

if(fs.existsSync(varFilePath)){ // if a file with the path in 'varFilePath' exists...
    let fileContent = fs.readFileSync(varFilePath,{encoding:"utf-8"}); // get the content of the file
    let lines = fileContent.split("\r").join("").split("\n"); // split the content into lines
    let currentVar = ""; // variable to store the variable processing at a time
    let val = ""; // variable to store the value of the variable processing at a time
    let type = ""; // variable to store the type of the variable processing at a time
    for(let i = 0; i < lines.length; i++){ // for each line...
        if(varReg.test(lines[i])){ // test if the line initializes a new variable
            if(currentVar !== ""){ // if the 'currentVar' variable is not equal to an empty string...
                if(type === "int"){ // if the type of the variable is "int" (integer/number)
                    vars[currentVar] = {type: type, value: Number(val)}; // set the current variable in the 'vars' object as an object containing the type and the value converted to a Number
                } else if(type === "bigInt"){ // if the type of the variable is "bigInt" (big integer/long/double);
                    vars[currentVar] = {type: type, value: BigInt(val)};  // set the current variable in the 'vars' object as an object containing the type and the value converted to a BigInt
                } else { // otherwise (type = "str")... 
                    vars[currentVar] = {type: type, value: `"${val}"`}; // set the current variable in the 'vars' object as an object containing the type and the value with preceding and following quotes
                }
                val = ""; // set the value to be an empty string for the next iteration
            }
            // example line: <varName:int>
            let varName = lines[i].slice(1,lines[i].indexOf(":")); // set the variable name by slicing the line appropriately ('varName' in the case of the example line)
            let varType = lines[i].slice(lines[i].indexOf(":")+1,lines[i].indexOf(">")) // set the variable type by slicing the line appropriately ('int' in the case of the example line)
            currentVar = varName; // set the currentVar to the processed variable name
            type = varType; // // set the type to the processed variable type
        } else{ // otherwise...
            if(type === "int" && isNaN(Number(lines[i])) || type === "bigInt" && isNaN(Number(lines[i]))) {Err(1,"Invalid variable value provided",i+1,true); varErrState = true; break;}; // if the variable type is 'int' or 'bigInt' and the value converted to the Number type is NaN throw an error, set varErrState to true and break the loop
            let gibberish = "abcdefghijklmnopqrstuvwxyz01234567890ABCDEFGH".split("").sort(() => {return Math.random() - 0.5}).join(""); // generate a random string
            val += (type === "int" || type === "bigInt") ? lines[i] : // if variable type is 'int' or 'bigInt', add on the raw line to the value
            lines[i].replace(/\\\\n/g,`{${gibberish}}`).replace(/\\n/g,"\n").replace(RegExp(`{${gibberish}}`,"g"),"\\n"); // else (type: 'str') replace all occurences of '\\n' (in-document perspective) with the random string, replace all occurences of '\n' (in-document perspective) with line breaks and replace all occurences of the random string with '\n' (in-document perspective)
        }
        if(i === lines.length-1) { // if the current interation was for the last line of the document...
            if(type === "int"){ // if the type of the variable is "int" (integer/number)
                vars[currentVar] = {type: type, value: Number(val)}; // set the current variable in the 'vars' object as an object containing the type and the value converted to a Number
            } else if(type === "bigInt"){ // if the type of the variable is "bigInt" (big integer/long/double);
                vars[currentVar] = {type: type, value: BigInt(val)};  // set the current variable in the 'vars' object as an object containing the type and the value converted to a BigInt
            } else { // otherwise (type = "str")... 
                vars[currentVar] = {type: type, value: `"${val}"`}; // set the current variable in the 'vars' object as an object containing the type and the value with preceding and following quotes
            }
        };
    }
}

let lineStructure1 = /^\s*peththa \? (keep|repeat|reverse|jumble|rotateR|rotateL) : bath \? (str|int|bigInt) : kawada \? (\d+|".+"|\([a-zA-Z]\w+\)) \[(log|store)\]( {\d+})?$/; // 1st regex for valid line structure in .pth file
let lineStructure2 = /^\s*<(keep|repeat|reverse|jumble|rotateR|rotateL)> \[(log|store)\]( {\d+})?$/; // 2nd regex for valid line structure in .pth file
let emptyLine = /^(|\s+)$/; // regex for an empty line in .pth file
let commentedLine = /^###.+$/; // regex for a commented line in .pth file

if(fs.existsSync(filePath) && varErrState === false){ // if the file at 'filePath' exists and there was no error in processing the variables...
    let fileContent = fs.readFileSync(filePath,{"encoding":"utf-8"}); // get the file content
    let lines = fileContent.split("\r").join("").split("\n") // split the file content in to lines
    let lineValues = []; // array to store values from 'store' lines;

    for(let i = 0; i < lines.length; i++){ // for each lines of the file...
        let func,type,val,option,logOrStore,logVal,isVar = false; // initialize all variables to store data and states in the process
        // 'isVar' variable contains a boolean value which says whether the value of a line comes from a variable or not. It's set to false by default

        if(lineStructure1.test(lines[i])){ // test if the line is of the first valid line structure
            let splt = lines[i].trim().split("?"); // split the line in to 3 parts from the '?'
            func = splt[1].slice(1,splt[1].indexOf(":")).trim(); // get the function of the line by slicing the line appropriately
            type = splt[2].slice(1,splt[2].indexOf(":")).trim(); // get the type of the line's value by slicing the line appropriately
            val = splt[3].slice(1,splt[3].lastIndexOf(`[`)).trim(); // get the value of the line by slicing the line appropriately
            option = (func === "rotateL" || func === "rotateR" || func === "repeat") ? // if the function ('func' variable) is equal to 'rotateL', 'rotateR' or 'repeat'...
            splt[3].slice(splt[3].lastIndexOf(`{`)+1,splt[3].lastIndexOf(`}`)).trim() : null; // set the option variable to the value within curly braces in the line and set to null otherwise
            logOrStore = splt[3].slice(splt[3].lastIndexOf(`[`)+1,splt[3].lastIndexOf(`]`)).trim(); // get the value within square brackets in the line to determine whether the output value should be logged or stored

            if(/^\([a-zA-Z]\w+\)$/.test(val)){ // check whether the variable name provided is of valid format. If so....
                isVar = true; // set the value of 'isVar' to 'true'
                if(vars[val.slice(1,val.length-1)] !== undefined){ // if a variable with the given name exists...
                    let varName = val.slice(1,val.length-1) // get the variable name
                    val = vars[varName].value; // get the value from the 'vars' object and set it as the value for the 'val' variable
                    if(vars[varName].type !== type) {Err(0,"Invalid type provided",i+1); break;}; // if the variable type is not equal to the provided type, throw an error stating that the provided type is invalid and break the loop
                } else { // otherwise...
                    Err(3,`Cannot find a variable named '${val.slice(1,val.length-1)}'`,i+1); // Throw an error saying that the variable does not exist
                    break; // break the loop
                }
            }
            if(type === "str"){ // if the provided type of the value is 'str' (string)...
                if(val.startsWith('"') && val.endsWith('"')){ // if the value starts and ends with quotes...
                    val = val.slice(1,val.length-1); // set the value of the 'val' variable to the current value sliced by 1 on both ends
                } else { // otherwise...
                    Err(1,"Invalid value provided",i+1); // throw an error saying that the value is invalid
                    break; // break the loop
                }
            }
        } else if(lineStructure2.test(lines[i])){ // or if the line is of the second valid line structure...
            func = lines[i].trim().slice(1,lines[i].lastIndexOf(">")); // set the function to be the provided value within '<' and '>'
            val = lineValues[lineValues.length-1].val; // set the value to be the value of the last element of the stored values
            type = lineValues[lineValues.length-1].type; // set the type to be the type of the last element of the stored values
            logOrStore = lines[i].trim().slice(lines[i].lastIndexOf("[")+1,lines[i].lastIndexOf("]")); // get the value within square brackets in the line to determine whether the output value should be logged or stored
            option = (func === "rotateL" || func === "rotateR" || func === "repeat") ? // if the function ('func' variable) is equal to 'rotateL', 'rotateR' or 'repeat'...
            lines[i].trim().slice(lines[i].lastIndexOf("{")+1,lines[i].lastIndexOf("}")) : null; // set the option variable to the value within curly braces in the line and set to null otherwise
        } else if(commentedLine.test(lines[i]) || emptyLine.test(lines[i])){ // or if the line is a empty line or a commented line...
            continue; // skip the current iteration
        } else{ // otherwise...
            Err(0,"Unidentified line structure",i+1 ) // Throw an error stating that the line is not of a valid structure
            break; // break the loop
        }
        logVal = null; // set the log value ('logVal' variable) to null
        switch(func){ // initialize a switch on the function 'func' variable
            case 'keep': // if the function is 'keep'...
                logVal = val; // set the log value to the 'val' variable
                break; // breath the switch
            case 'repeat': // or if the function is 'repeat'...
                logVal = NaN; // set the log value to NaN
                if(type === "str" && isNaN(Number(option)) === false) // if type is equal to 'str' and the option provides a valid option...
                    logVal = val.repeat(Number(option)); // set the log value to be the value repeated `option` number of times
                break; // break the switch
            case 'reverse': // or if the function is 'reverse'...
                if(type === "str") logVal = val.split("").reverse().join(""); // set the log value to the value reversed if the type of the value is 'str'
                break; // break the switch
            case 'jumble':
                if(type === "str") logVal = console.log(randomize(val.split("")).join("")); // set the log value to the value string shuffled if the type of the value is 'str'
                break; // break the switch
            case 'rotateR':
                logVal = NaN; // set the log value to NaN
                if(type === "str" && isNaN(Number(option)) === false) // if type is equal to 'str' and the option provides a valid option...
                    logVal = rightRotate(val.split(""),Number(option)).join(""); // set the log value to be the value right rotated `option` number of times
                break; // break the switch
            case 'rotateL':
                logVal = NaN; // set the log value to NaN
                if(type === "str" && isNaN(Number(option)) === false) // if type is equal to 'str' and the option provides a valid option...
                    logVal = leftRotate(val.split(""),Number(option)).join(""); // set the log value to be the value left rotated `option` number of times
                break; // break the switch
        }
        if(typeof logVal === "number" && isNaN(Number(logVal))){Err(1,"Invalid type or option value provided",i+1); break;} // if the log value is equal to NaN, throw an error  
        if(logVal === null){Err(1,"Invalid type provided",i+1); break;} // if the log value is null, throw an error
        (logOrStore === "log") ? console.log(logVal) : lineValues.push({val: logVal, type: type}); // log the log value to the console if the 'logOrStore' variable is set to 'log' or push the log value with its type to the lineValues array
    }
} else if(varErrState === false){
    Err(0,"File Not Found",null);
}