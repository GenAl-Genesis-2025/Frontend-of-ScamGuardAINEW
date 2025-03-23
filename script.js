
       /* script.js */
document.addEventListener('DOMContentLoaded', function() {
    const analyzeButton = document.getElementById('analyzeButton');
    const clearButton = document.getElementById('clearButton');
    const inputText = document.getElementById('inputText');
    const resultDiv = document.getElementById('result');
    const historyList = document.getElementById('historyList');
    const probabilityDiv = document.getElementById('probability');
    let queries = [];
    let probabilityChart;

    analyzeButton.addEventListener('click', function() {
        const text = inputText.value;
        const analysisResult = simulateAIAnalysis(text);

        resultDiv.innerHTML = analysisResult.message;
        resultDiv.className = '';
        resultDiv.classList.add('result-' + analysisResult.status);

        queries.push({ query: text, result: analysisResult.message, status: analysisResult.status, probability: analysisResult.probability });
        updateHistory();
        updateProbability(analysisResult.probability);
    });

    clearButton.addEventListener('click', function() {
        inputText.value = '';
        resultDiv.innerHTML = '';
        resultDiv.className = '';
        probabilityDiv.style.display = 'none';
    });

    function simulateAIAnalysis(text) {
        let probability = 0;
        if (text.toLowerCase().includes('urgent') || text.toLowerCase().includes('limited time')) {
            probability += 30;
        }
        if (text.toLowerCase().includes('bank account') && text.toLowerCase().includes('verify')) {
            probability += 60;
        }
        if (text.length < 5) {
            probability = 0;
            return { status: 'safe', message: 'Please enter text for analysis.', probability: probability };
        } else {
            probability += Math.floor(Math.random() * 10);
        }

        if (probability >= 70) {
            return { status: 'danger', message: 'Phishing attempt detected. Do not share sensitive information.', probability: probability };
        } else if (probability >= 30) {
            return { status: 'warning', message: 'Potential urgency/scarcity scam. Be cautious.', probability: probability };
        } else {
            return { status: 'safe', message: 'No immediate red flags detected. Proceed with caution.', probability: probability };
        }
    }

    function updateHistory() {
        historyList.innerHTML = '';
        queries.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `Query: ${item.query} - Result: ${item.result} - Probability: ${item.probability}%`;
            listItem.classList.add('result-' + item.status);
            historyList.appendChild(listItem);
        });
    }

    function updateProbability(probability) {
        probabilityDiv.style.display = 'block';
        if (probabilityChart) {
            probabilityChart.destroy();
        }
        const ctx = document.getElementById('probabilityChart').getContext('2d');
        probabilityChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Scam Probability'],
                datasets: [{
                    label: 'Percentage',
                    data: [probability],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    }
});

// Modal functionality
const helpModal = document.getElementById('helpModal');
const helpButton = document.getElementById('helpButton');
const closeModal = document.querySelector('.close');

helpButton.addEventListener('click', function() {
    helpModal.style.display = 'block';
});

closeModal.addEventListener('click', function() {
    helpModal.style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target === helpModal) {
        helpModal.style.display = 'none';
    }
});
//... existing code ...

analyzeButton.addEventListener('click', function() {
    //... existing code ...
    document.getElementById('copyButton').style.display = 'block';
});

document.getElementById('copyButton').addEventListener('click', function() {
    const resultText = document.getElementById('result').textContent;
    navigator.clipboard.writeText(resultText).then(function() {
        alert('Result copied to clipboard!');
    }).catch(function(err) {
        console.error('Could not copy text: ', err);
    });
});


