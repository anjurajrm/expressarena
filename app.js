const express = require('express');
const morgan = require('morgan')

const app = express();
app.use(morgan('dev'))


app.get('/', (req, res) => {
    console.log('The root path was called');
    res.send('Hello Express!!');
});

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});

app.get('/burgers', (req, res) => {
    res.send('We have juicy cheese burgers!');
})

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
    Base URL: ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
  `;
    res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end(); //do not send any data back to the client
});

app.get('/greetings', (req, res) => {
    //1. get values from the request
    const name = req.query.name;
    const race = req.query.race;

    //2. validate the values
    if (!name) {
        //3. name was not provided
        return res.status(400).send('Please provide a name');
    }

    if (!race) {
        //3. race was not provided
        return res.status(400).send('Please provide a race');
    }

    //4. and 5. both name and race are valid so do the processing.
    const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

    //6. send the response 
    res.send(greeting);
});

app.get('/sum',(req,res)=>{
    const a= parseFloat(req.query.a)
    const b =parseFloat(req.query.b)
    // Validation - a and b are required and should be numbers
    if (!a) {
        return res
            .status(400)
            .send('a is required');
    }

    if (!b) {
        return res
            .status(400)
            .send('b is required');
    }
    const sum=a+b
    res.send(`The sum of ${a} and ${b} is ${sum}`)
})

app.get("/cipher",(req,res)=>{
    const text = req.query.text
    const shift = req.query.shift

    // validation: both values are required, shift must be a number
    if (!text) {
        return res
            .status(400)
            .send('text is required');
    }

    if (!shift) {
        return res
            .status(400)
            .send('shift is required');
    }

    const numShift = parseFloat(shift)
    if (Number.isNaN(numShift)) {
        return res
            .status(400)
            .send('shift must be a number');
    }
    
    const base ='A'.charCodeAt(0)
    const cipher= text.toUpperCase().split('')
                .map(char=>{
                    const code= char.charCodeAt(0)
                    if (code < base || code > (base + 26)) {
                        return char;
                    }
                    
                    let diff = code - base;
                    diff = diff + numShift;

                    // in case shift takes the value past Z, cycle back to the beginning
                    diff = diff % 26;

                    // convert back to a character
                    const shiftedChar = String.fromCharCode(base + diff);
                    return shiftedChar;
                })
                .join('')

    res.status(200).send(`${cipher}`)

})

app.get('/lotto',(rq,res)=>{
    const numbers = req.query.numbers
    if (!numbers) {
        return res
            .status(200)
            .send("numbers is required");
    }

    if (!Array.isArray(numbers)) {
        return res
            .status(200)
            .send("numbers must be an array");
    }

    const guesses = numbers
        .map(n => parseInt(n))
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

    if (guesses.length != 6) {
        return res
            .status(400)
            .send("numbers must contain 6 integers between 1 and 20");
    }      
    // here are the 20 numbers to choose from
    const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

    //randomly choose 6
    const winningNumbers = [];
    for (let i = 0; i < 6; i++) {
        const ran = Math.floor(Math.random() * stockNumbers.length);
        winningNumbers.push(stockNumbers[ran]);
        stockNumbers.splice(ran, 1);
    }

    //compare the guesses to the winning number
    let diff = winningNumbers.filter(n => !guesses.includes(n));

    // construct a response
    let responseText;

    switch (diff.length) {
        case 0:
            responseText = 'Wow! Unbelievable! You could have won the mega millions!';
            break;
        case 1:
            responseText = 'Congratulations! You win $100!';
            break;
        case 2:
            responseText = 'Congratulations, you win a free ticket!';
            break;
        default:
            responseText = 'Sorry, you lose';
    }


    // uncomment below to see how the results ran

    // res.json({
    //   guesses,
    //   winningNumbers,
    //   diff,
    //   responseText
    // });

    res.send(responseText);

})


app.get('/grade', (req, res) => {
    // get the mark from the query
    const { mark } = req.query;

    // do some validation
    if (!mark) {
        // mark is required
        return res
            .status(400)
            .send('Please provide a mark');
    }

    const numericMark = parseFloat(mark);
    if (Number.isNaN(numericMark)) {
        // mark must be a number
        return res
            .status(400)
            .send('Mark must be a numeric value');
    }

    if (numericMark < 0 || numericMark > 100) {
        // mark must be in range 0 to 100
        return res
            .status(400)
            .send('Mark must be in range 0 to 100');
    }

    if (numericMark >= 90) {
        return res.send('A');
    }

    if (numericMark >=80) {
        return res.send('B');
    }

    if (numericMark >= 70) {
        return res.send('C');
    }

    res.send('F');
});