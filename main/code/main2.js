async function getFunctionList(endpoint) {
    const share = document.getElementById('share');
    share.disabled = true;

    try {
        const response = await fetch(endpoint);
        console.log(response);
        const functionData = await response.json();
        console.log('Function data:', functionData);

        if (!functionData.functions || !Array.isArray(functionData.functions)) {
            console.error('Invalid function data:', functionData);
            return;
        }

        const functionListDiv = document.getElementById('function-list');

        if (!functionListDiv) {
            console.error('Function list div not found');
            return;
        }
        functionListDiv.innerHTML = '';

        const ulElement = document.createElement('ul');

        functionData.functions.forEach(functionName => {
            const liElement = document.createElement('li');
            liElement.textContent = functionName;

            liElement.addEventListener('click', async () => {
                const modal = document.getElementById('myModal');
                modal.style.display = "block";

                // Display function name
                const selectedFunctionNameDisplay = document.getElementById('selectedFunctionName');
                selectedFunctionNameDisplay.textContent = `Selected function: ${functionName}`;

                // Display function syntax
                const functionSyntaxDisplay = document.getElementById('functionSyntax');
                const syntaxResponse = await fetch(`${endpoint}/${functionName}`);
                const syntaxData = await syntaxResponse.json();

                console.log('syntaxData:', syntaxData);

                let parsedSyntax = null;
                try {
                    parsedSyntax = JSON.parse(syntaxData.syntax);
                } catch {
                    parsedSyntax = syntaxData.syntax;
                }
                functionSyntaxDisplay.textContent = `Syntax: ${parsedSyntax}`;

                // Display input fields for function parameters
                if (syntaxData && syntaxData.length > 0 && syntaxData[0].parameters) {
                    const functionParametersDisplay = document.getElementById('functionParameters');
                    functionParametersDisplay.innerHTML = '';
                    // ... [Rest of your code]

                    const span = document.getElementsByClassName("close")[0];
                    span.onclick = () => {
                        modal.style.display = "none";
                    };

                    const runButton = document.getElementById('runButton');
                    runButton.onclick = async () => {
                        // ... [Code for runButton's onclick event]
                    };
                }
            });

            ulElement.appendChild(liElement);
        });

        functionListDiv.appendChild(ulElement);

    } catch (error) {
        console.error(error);
    }
}
