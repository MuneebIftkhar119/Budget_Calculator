
document.addEventListener('DOMContentLoaded', function () {
    const select = document.querySelector('.select');
    const description = document.querySelector('.description');
    const value = document.querySelector('.value');
    const incomeList = document.querySelector('.incomelist');
    const expenseList = document.querySelector('.expenselist');
    const incomeDisplay = document.querySelector('.intaken');
    const expenseDisplay = document.querySelector('.extaken');
    const outputDisplay = document.querySelector('.output');
    const submitButton = document.querySelector('button[type="button"]');

    let incomeTotal = 0;
    let expenseTotal = 0;

    // Function to update the available budget
    function updateBudget() {
        const availableBudget = incomeTotal - expenseTotal;
        outputDisplay.textContent = `${availableBudget.toFixed(2)}`;
    }

    // Function to calculate and update the percentage of each expense
    function updateExpensePercentages() {
       
        const percentages = document.querySelectorAll('.percentage');
        percentages.forEach((percentage, index) => {
            const expenseAmount = parseFloat(expenseList.children[index].dataset.amount);
            const percent = (incomeTotal > 0) ? (expenseAmount / incomeTotal) * 100 : 0;
            //  percentage.textContent = incomeTotal > 0 ? `${percent.toFixed(1)}%` : '';
        });
    }

    
    

    function addEntry(event) {
        event.preventDefault();

        const type = select.value;
        const desc = description.value;
        const val = parseFloat(value.value);

        if (desc && !isNaN(val) && val > 0) {
            const entry = document.createElement('li');
            entry.classList.add('entry');
            entry.dataset.amount = val;

            const descSpan = document.createElement('span');
            descSpan.classList.add('description');
            descSpan.textContent = desc;

            const valSpan = document.createElement('span');
            valSpan.classList.add('value');
            valSpan.textContent = `${type}${val.toFixed(2)}`;

            const deleteIcon = document.createElement('i');
            deleteIcon.classList.add('fa', 'fa-times');
            deleteIcon.addEventListener('click', deleteEntry);

            entry.appendChild(descSpan);
            entry.appendChild(valSpan);
            entry.appendChild(deleteIcon);

            if (type === '+') {
                incomeTotal += val;
                incomeList.appendChild(entry); 
                incomeDisplay.textContent = `+${incomeTotal.toFixed(2)}`;
            } else if (type === '-') {
                expenseTotal += val;
                const percentage = document.createElement('div');
                percentage.classList.add('percentage');
                entry.appendChild(percentage);
                expenseList.appendChild(entry);
                expenseDisplay.textContent = `-${expenseTotal.toFixed(2)}`;
                updateExpensePercentages();
            }

            updateBudget();
            description.value = '';
            value.value = '';
        }
    }

    function deleteEntry(event) {
        const entry = event.target.parentElement;
        const amount = parseFloat(entry.dataset.amount);
        const parentList = entry.parentElement;

        // Remove the entry and update totals
        if (parentList === incomeList) {
            incomeTotal -= amount;
            incomeDisplay.textContent = `+${incomeTotal.toFixed(2)}`;
        } else if (parentList === expenseList) {
            expenseTotal -= amount;
            expenseDisplay.textContent = `-${expenseTotal.toFixed(2)}`;
            updateExpensePercentages();
        }

        // Remove the entry from the DOM
        entry.remove();

        // Update the available budget after deletion
        updateBudget();
    }

    // Use event delegation to handle clicks on delete icons
    incomeList.addEventListener('click', function(event) {
        if (event.target.classList.contains('fa-times')) {
            deleteEntry(event);
        }
    });

    expenseList.addEventListener('click', function(event) {
        if (event.target.classList.contains('fa-times')) {
            deleteEntry(event);
        }
    });

    // Function to update colors based on type selection
    function updateColors() {
        const type = select.value;
        if (type === '+') {
            description.style.borderColor = '#28B9B5';
            value.style.borderColor = '#28B9B5';
            submitButton.style.backgroundColor = '#28B9B5';
        } else if (type === '-') {
            description.style.borderColor = '#dc3545';
            value.style.borderColor = '#dc3545';
            submitButton.style.backgroundColor = '#dc3545';
        }
    }

    // Event listeners
    submitButton.addEventListener('click', addEntry);
    select.addEventListener('change', updateColors);

    // Initial color setup
    updateColors();
});

