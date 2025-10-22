let triviaBtn = document.querySelector("#js-new-quote");
triviaBtn.addEventListener('click', newTrivia);


let answerBtn = document.querySelector('#js-tweet');
answerBtn.addEventListener('click', newAnswer);

let current = {
    question: "",
    answer: "",


}

const endpoint = "https://trivia.cyberwisp.com/getrandomchristmasquestion";


async function newTrivia() {
    // console.log("Success");

    try {

        const response = await fetch(endpoint);
        if (!response.ok) {
            throw Error(response.statusText);
        }
        const json = await response.json();
        console.log(json);
        displayTrivia(json["question"]);
        current.question = json["question"];
        current.answer = json["answer"];
        console.log(current.question);
        console.log(current.answer);
    } catch (err) {
        console.log(err)
        alert('Failed to get new trivia');
    }
}

function displayTrivia(question) {
const questionText = document.querySelector('#js-quote-text');
questionText.textContent = question;

const answerText = document.querySelector("#js-answer-text");
answerText.textContent = "";
}

function newAnswer () {
    // console.log("success == answer!");
    const answerText = document.querySelector("#js-answer-text");
    answerText.textContent = current.answer;

}

newTrivia();