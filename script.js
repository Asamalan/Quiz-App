// TODO(you): Write the JavaScript necessary to complete the assignment.

let theQuiz = {}
function reveal(selectors = []) {
    selectors.forEach(sel => {
        try {
            document.querySelector(sel).classList.toggle('hidden')
        } catch (error) { }
    })
}
document.querySelector('.start-button').addEventListener("click", () => {
    reveal(['#introduction'])
    fetch('https://wpr-quiz-api.herokuapp.com/attempts', {
        method: 'POST'
    }).then(r => r.json())
        .then(quiz => {
            theQuiz = quiz
            reveal(['.reveal-button'])
            const container = document.querySelector('#attempt-quiz')
            quiz.questions.forEach((q, i) => {
                let answersDiv = ""
                q.answers.forEach((a, i) => {
                    answersDiv += `
                        <label for="${q._id}_${i}" class="radioButton-choice">
                            <input class="radioButton" type="radio" name="${q._id}" id=${q._id}_${i}>
                            <span>${a.replaceAll('<', '&#60').replaceAll('>', '&#62').replaceAll('/', '&#47')}</span>
                            <div class="hltr"></div>
                        </label><br>
                    `
                })
                container.innerHTML += `
                    <div class="question-choice">
                        <h3 class="t">Question ${i + 1} of 10</h3>
                        <p>${q.text}</p>
                        <div class="choice-answer">
                            ${answersDiv}
                        </div>
                        </form>
                    </div>
                `
            })
        })
})
document.querySelector('.submit-button').addEventListener('click', onSubmit)
function onSubmit() {
    let selected = {}
    document.querySelectorAll('.choice-answer').forEach(q => {
        q.querySelectorAll('.radioButton').forEach((option, i) => {
            if (option.checked) {
                selected[option.getAttribute("name")] = i
            }
        })
    })
    fetch(`https://wpr-quiz-api.herokuapp.com/attempts/${theQuiz._id}/submit`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ answers: selected })
    }).then(r => r.json())
        .then(res => {
            reveal(['.review-quiz', '.reveal-button'])
            document.querySelector('.counter').innerHTML = res.score + "/10"
            document.querySelector('.percentage').innerHTML = res.score / res.questions.length * 100 + '%'
            document.querySelector('.feedback').innerHTML = res.scoreText
            for (const key in res.correctAnswers) {
                document.querySelectorAll(`[name="${key}"]`).forEach((c, i) => {
                    c.setAttribute("disabled", "")
                    if (res.correctAnswers[key] == i) {
                        if (c.checked) {
                            let x = document.createElement('div')
                            x.classList.add("right")
                            x.innerHTML = "Correct Answer"
                            c.parentElement.style.background = '#d4edda'
                            c.parentElement.appendChild(x)
                        } else {
                            let x = document.createElement('div')
                            x.classList.add("right")
                            x.innerHTML = "Correct Answer"
                            c.parentElement.style.background = '#ddd'
                            c.parentElement.appendChild(x)
                        }
                    } else {
                        if (c.checked) {
                            let x = document.createElement('div')
                            x.classList.add("wrong")
                            x.innerHTML = "Wrong Answer"
                            c.parentElement.style.background = '#f8d7da'
                            c.parentElement.appendChild(x)
                        }
                    }
                })
            }
        })
}

