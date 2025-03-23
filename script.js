/* script.js */
document.addEventListener('DOMContentLoaded', function() {
    const analyzeButton = document.getElementById('analyzeButton');
    const promptChips = document.querySelectorAll('.prompt-chip');
    // const clearButton = document.getElementById('clearButton');
    const inputText = document.getElementById('inputText');
    const resultDiv = document.getElementById('result');
    const historyList = document.getElementById('historyList');
    const probabilityDiv = document.getElementById('probability');
    let queries = [];
    let probabilityChart;
    const loadingIndicator = document.createElement('div');
    loadingIndicator.textContent = 'Analyzing...';
    loadingIndicator.style.display = 'none';
    loadingIndicator.style.color = 'white';
    document.querySelector('.container').appendChild(loadingIndicator);

    analyzeButton.addEventListener('click', async function() {
        const text = inputText.value;
        if (!text.trim()) {
            alert('Please enter text to analyze.');
            return;
        }

        loadingIndicator.style.display = 'block';
        resultDiv.innerHTML = '';
        probabilityDiv.style.display = 'none';

        try {
            const response = await fetch('http://localhost:5001/api/setUserQuery', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const data = await response.json();

            loadingIndicator.style.display = 'none';
            resultDiv.innerHTML = data.message;
            resultDiv.className = '';
            resultDiv.classList.add('result-' + data.status);

            queries.push({ query: text, result: data.message, status: data.status, probability: data.probability });
            updateHistory();
            updateProbability(data.probability);
            // document.getElementById('copyButton').style.display = 'block';

        } catch (error) {
            loadingIndicator.style.display = 'none';
            console.error('Error:', error);
            resultDiv.innerHTML = 'An error occurred during analysis.';
            resultDiv.className = 'result-danger';
            probabilityDiv.style.display = 'none';
        }
    });

    // clearButton.addEventListener('click', function() {
    //     inputText.value = '';
    //     resultDiv.innerHTML = '';
    //     resultDiv.className = '';
    //     probabilityDiv.style.display = 'none';
    //     document.getElementById('copyButton').style.display = 'none';
    // });

    promptChips.forEach(chip => {
        chip.addEventListener('click', function() {
            inputText.value = this.dataset.prompt;
            // Optional: Focus the input after filling
            inputText.focus();
        });
    });
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
                    borderWidth: 1,
                }],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                    },
                },
            },
        });
    }

    // Modal functionality
    const helpModal = document.getElementById('helpModal');
    const helpButton = document.getElementById('helpButton');
    const closeModal = document.querySelector('.close');

    document.addEventListener('click', function(event) {
        if (event.target.id === 'helpButton') {
            helpModal.style.display = 'block';
        } else if (event.target === closeModal || event.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });

    // // Copy to clipboard functionality
    // const copyButton = document.createElement('button');
    // copyButton.id = 'copyButton';
    // copyButton.textContent = 'Copy';
    // copyButton.style.display = 'none';
    // document.querySelector('.input-group').appendChild(copyButton);

    // copyButton.addEventListener('click', function() {
    //     const resultText = document.getElementById('result').textContent;
    //     navigator.clipboard.writeText(resultText)
    //         .then(() => alert('Result copied to clipboard!'))
    //         .catch(err => console.error('Could not copy text: ', err));
    // });
});
