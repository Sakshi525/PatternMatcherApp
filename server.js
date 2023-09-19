const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/matchPattern', (req, res) => {
    const { pattern, string } = req.body;

    if (!pattern || !string) {
        return res.status(400).json({ error: 'Both pattern and string are required.' });
    }

    const patternArray = pattern.split("");
    const stringArray = string.split(" ");

    if (patternArray.length > 5) {
        return res.status(400).json({ error: 'Pattern must have exactly 5 characters.' });
    }

    if (stringArray.length > 5) {
        return res.status(400).json({ error: 'String cannot have more than 5 words.' });
    }

    function hasMoreThanThreeSameChars(pattern) {
        for (let i = 0; i < pattern.length; i++) {
            let count = 0;
            for (let j = 0; j < pattern.length; j++) {
                if (pattern[i] === pattern[j]) {
                    count++;
                }
            }
            if (count > 3) {
                return true;
            }
        }
        return false;
    }

    function hasMoreThanThreeSameWords(words) {
        const wordCounts = {};

        for (const word of words) {
            wordCounts[word] = (wordCounts[word] || 0) + 1;
            if (wordCounts[word] > 3) {
                return true;
            }
        }
        return false;
    }

    if (hasMoreThanThreeSameChars(pattern)) {
        return res.status(400).json({ error: 'Pattern cannot have more than three same characters.' });
    }

    if (hasMoreThanThreeSameWords(stringArray)) {
        return res.status(400).json({ error: 'String cannot have more than 3 same words.' });
    }

    let isMatched = true;
    const matchingObj = {};
    for (let i = 0; i < patternArray.length; i++) {
        const eachPattern = patternArray[i];
        const eachWord = stringArray[i];

        if (matchingObj[eachPattern]) {
            if (matchingObj[eachPattern] !== eachWord) {
                isMatched = false
                break;
            }
        } else {
            matchingObj[eachPattern] = eachWord
        }
    }

    res.json({ result: isMatched });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});