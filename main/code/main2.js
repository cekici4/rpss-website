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

async function getFunctionList(endpoint, itemName = "functions") {
    dom.share.disabled = true;
    const optionalParametersNames = ['Verbose', 'Debug', 'ErrorAction', 'WarningAction', 'InformationAction', 'ErrorVariable', 'WarningVariable', 'InformationVariable', 'OutVariable', 'OutBuffer', 'PipelineVariable'];

    try {
        const response = await fetch(endpoint);
        const functionData = await response.json();

        if (!functionData.functions || !Array.isArray(functionData.functions)) {
            console.error('Invalid function data:', functionData);
            return;
        }

        dom.functionList.style.display = "block";
        dom.functionList.innerHTML = '';

        const ulElement = document.createElement('ul');

        functionData.functions.forEach(functionName => {
            const liElement = document.createElement('li');
            liElement.textContent = functionName;

            liElement.addEventListener('click', async () => {
                dom.modal.style.display = "block";
                dom.selectedFunction.textContent = `Selected function: ${functionName}`;

                console.log("Client Side --->>>");
                console.log(functionName);

                if (functionDetailsData.parameters) {
                    dom.functionParameters.innerHTML = '';

                    const requiredParametersDiv = document.createElement('div');
                    const optionalParametersDiv = document.createElement('div');
                    const activeOptionalParametersDiv = document.createElement('div');
                    const optionalParametersList = document.createElement('ul');

                    // Initially hide optional parameters list
                    optionalParametersList.style.display = "none";

                    activeOptionalParametersDiv.innerHTML = '<h4>Active Optional Parameters:</h4>';
                    requiredParametersDiv.innerHTML = '<h4>Required Parameters:</h4>';
                    optionalParametersDiv.innerHTML = '<h4>Optional Parameters:</h4>';

                    // Create a button to toggle display of optional parameters
                    const toggleOptionalButton = document.createElement('button');
                    toggleOptionalButton.textContent = "Toggle Optional Parameters";

                    // Toggle the display when the button is clicked
                    toggleOptionalButton.addEventListener('click', () => {
                        if (optionalParametersList.style.display === "none") {
                            optionalParametersList.style.display = "block";
                        } else {
                            optionalParametersList.style.display = "none";
                        }
                    });

                    functionDetails.parameters.forEach(paramObj => {
                        const { Name: paramName, ParameterType: paramType, IsMandatory: isMandatory, Description: paramDescription } = paramObj;

                        const paramDiv = document.createElement('div');
                        paramDiv.setAttribute('data-param-name', paramName);

                        const paramLabel = document.createElement('label');
                        const paramInput = document.createElement('input');

                        paramLabel.textContent = `${paramName}:`;
                        paramInput.setAttribute('name', paramName);
                        paramInput.setAttribute('placeholder', paramType);

                        paramDiv.appendChild(paramLabel);
                        paramDiv.appendChild(paramInput);

                        const paramDescriptionP = document.createElement('p');
                        paramDescriptionP.textContent = `Description: ${paramDescription}`;
                        paramDiv.appendChild(paramDescriptionP);

                        if (!optionalParametersNames.includes(paramName)) {
                            requiredParametersDiv.appendChild(paramDiv);
                        } else {
                            const addButton = document.createElement('button');
                            addButton.textContent = '+';
                            addButton.addEventListener('click', () => {
                                activeOptionalParametersDiv.appendChild(paramDiv);
                                paramDiv.removeChild(addButton);

                                const removeButton = document.createElement('button');
                                removeButton.textContent = '-';
                                removeButton.addEventListener('click', () => {
                                    optionalParametersList.appendChild(paramDiv);
                                    paramDiv.removeChild(removeButton);
                                    paramDiv.appendChild(addButton);
                                });
                                paramDiv.appendChild(removeButton);
                            });
                            paramDiv.appendChild(addButton);
                            optionalParametersList.appendChild(paramDiv);
                        }
                    });

                    optionalParametersDiv.appendChild(toggleOptionalButton);
                    optionalParametersDiv.appendChild(optionalParametersList);
                    dom.functionParameters.appendChild(requiredParametersDiv);
                    dom.functionParameters.appendChild(activeOptionalParametersDiv);
                    dom.functionParameters.appendChild(optionalParametersDiv);

                    // Implementation of the Run button

                    dom.runButton.onclick = async () => {
                        dom.loadingIndicator.style.display = 'block';

                        const requiredParameters = Array.from(requiredParametersDiv.getElementsByTagName('input'));
                        const activeOptionalParameters = Array.from(activeOptionalParametersDiv.getElementsByTagName('input'));

                        const params = {};

                        // Add required parameters to the parameters object
                        requiredParameters.forEach(input => {
                            params[input.name] = [input.value];
                        });

                        // Add active optional parameters to the parameters object
                        activeOptionalParameters.forEach(input => {
                            params[input.name] = [input.value];
                        });

                        // POST request code here...
                        const apiUrl = `${endpoint}/${functionName}`; // Modify if needed
                        const requestBody = {
                            params: params,
                            functionArguments: [] // Add your function arguments here
                        };

                        try {
                            const response = await fetch(apiUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(requestBody)
                            });
                            dom.loadingIndicator.style.display = 'none';

                            const responseData = await response.text();
                            console.log('Server Response:', responseData);

                            // Display the server response inside the div with id 'output'
                            dom.outputList.style.display = "block";
                            dom.copyDiv.style.display = "block";
                            dom.outputDiv.innerText = responseData;

                            // Close the modal
                            dom.modal.style.display = "none";

                        } catch (error) {
                            console.error('Error sending request to the server:', error);
                        }
                    };

                    // Implementation of the Close button
                    const span = document.getElementsByClassName("close")[0];
                    span.onclick = () => {
                        dom.modal.style.display = "none";
                        dom.outputList.style.display = "none";
                        dom.copyDiv.style.display = "none";
                    };
                    dom.outputDiv.style.display = "none";
                    dom.copyDiv.style.display = "none";
                }
            });

            ulElement.appendChild(liElement);
        });

        dom.functionList.appendChild(ulElement);

    } catch (error) {
        console.error(error);
    }
    dom.share.disabled = false;
}

