// Cache DOM elements for performance
var dom = dom || {
    outputDiv: document.getElementById('output'),
    functionList: document.getElementById('function-list'),
    outputList: document.getElementById('output'),
    headerText: document.getElementById("function-header"),
    copyDiv: document.getElementById('copy-button'),
    breadcrumbDiv: document.getElementById('breadcrumb'),
    fileListDiv: document.getElementById('fileList'),
    share: document.getElementById('share'),
    selectedFunction: document.getElementById('selectedFunctionName'),
    modal: document.getElementById('myModal'),
    functionSynopsis: document.getElementById('functionSynopsis'),
    functionParameters: document.getElementById('functionParameters'),
    runButton: document.getElementById('runButton'),
    loadingIndicator: document.getElementById('loadingIndicator'),
};


[dom.headerText, dom.functionList, dom.outputList, dom.copyDiv].forEach(el => {
  if (el) {
    el.style.display = "none";
  } else {
    console.warn('Element is null');
  }
});

var navigationHistory = navigationHistory || [];
var breadcrumbTrail = breadcrumbTrail || [];

// Function to create a bootstrap modal
function createParameterModal() {
  const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));
  myModal.toggle();
  console.log('run');
}

// Function to render the breadcrumb trail on the page
function renderBreadcrumbTrail() {
  dom.breadcrumbDiv.innerHTML = breadcrumbTrail.join(' > ');
}

// Function to handle folder click
function handleFolderClick(event) {
  event.preventDefault(); // prevent the default behavior of the link
  const target = event.target;
  if (target.tagName === 'A') { // check if the clicked element is a link
    const folderName = target.textContent;
    if (!breadcrumbTrail.includes(folderName)) {
      breadcrumbTrail.push(folderName); // Update breadcrumb
      renderBreadcrumbTrail(); // Render the updated breadcrumb trail
    }

    // Modify this line to correctly build the folderEndpoint URL
    const folderEndpoint = target.dataset.url ? `https://rpss:8443${target.dataset.url}` : target.href;
    
    console.log('Folder endpoint:', folderEndpoint);
    
    // Determine which function to call based on the level of the folder
    if (breadcrumbTrail.length === 1) {
      getFirstLevelFolders(folderEndpoint);
    } else {
      getSecondLevelFolders(folderEndpoint);
    }
  }
}

// The function `getContent` retrieves and handles content based on the provided endpoint, type, and itemName.
// It is an asynchronous function, meaning it returns a Promise.
async function getContent(endpoint = 'https://rpss:8443/share', type = 0, itemName="root") {
    
    // Add the current endpoint to the navigation history stack
    navigationHistory.push(endpoint); 

    try {
        // Fetch the response from the endpoint
        const response = await fetch(endpoint);
        
        // Parse the response as JSON
        const responseJSON = await response.json();

        // Switch statement to handle different types of data
        switch(type) {
            // If type is 0 or 1, we are dealing with a folder
            case 0: // default type (folder)
            case 1: // folder type
                datasetType = 'folder';
                
            // If type is 2, we are dealing with a file
            case 2: // file type

                // Create a new div to hold the file list
                const ListDiv = document.createElement('div');
                ListDiv.setAttribute('id','folderDiv');
                
                // Loop through the JSON response and create an anchor for each file
                responseJSON.forEach(folder => {

                    const A = document.createElement('a');
                    const fname = folder.fileName;
                    A.setAttribute("id", fname);
                    A.innerHTML = fname;
                    A.href ="#";
                    A.dataset.type = folder.fileType;
                    A.dataset.url = folder.fileUrl; // Add this line

                    // Append each anchor to the div
                    ListDiv.appendChild(A);
                });

                // Clear any existing content from the file list div
                dom.fileListDiv.innerHTML = ''; 
                
                // Append the newly created list div to the file list div
                dom.fileListDiv.appendChild(ListDiv);

                // Log for debugging
                console.log('file event created');
                
                // Add event listener for click events on the file list div
                dom.fileListDiv.addEventListener('click', async (event) => {
                    
                    // Prevent the default action of the click event
                    event.preventDefault(); 
                    
                    // Get the target of the click event
                    const target = event.target;
                    
                    // Check if the target was a file
                    if (target.dataset.type === 'file') { 
                        console.log('ran');
                        
                        // Clear any existing content in the output div
                        dom.outputDiv.innerHTML = '';
                        
                        // Create a new div for function parameters and append it to the file list div
                        const funcPara = document.createElement('div');
                        funcPara.id = "function-params";
                        dom.fileListDiv.appendChild(funcPara);

                        // Make the header text visible
                        dom.headerText.style.display = "block";
                        
                        // Fetch and display the function list for the clicked file
                        await getFunctionList("https://rpss:8443"+target.dataset.url+ "/" +target.innerHTML);
                    }
                });
                
                // Add another event listener for click events on the file list div
                dom.fileListDiv.addEventListener('click', async (event) => {
                    
                    // Prevent the default action of the click event
                    event.preventDefault();
                    
                    // Get the target of the click event
                    const target = event.target;
                    
                    // Check if the target was a folder
                    if (target.dataset.type === 'folder') {
                        
                        // Get the folder name from the target's text content
                        const folderName = target.textContent;
                        
                        // If the breadcrumb trail does not already include this folder, add it
                        if (!breadcrumbTrail.includes(folderName)) {
                            breadcrumbTrail.push(folderName);
                            
                            // Render the updated breadcrumb trail
                            renderBreadcrumbTrail(); 
                        }
                        
                        // Fetch and display the content for the clicked folder
                        await getContent("https://rpss:8443" + target.dataset.url);
                    }
                });

                break;
        }
    } catch (error) {
        // If there was an error during the fetch operation, log the error
        console.error('Error fetching content:', error);
    }
}

// The function `getFirstLevelFolders` retrieves the first level folders from the provided endpoint.

async function getFirstLevelFolders(endpoint = 'https://rpss:8443/share', itemName="firstLevel") {
    
    // Add the current endpoint to the navigation history stack
    navigationHistory.push(endpoint); 

    // Disable the share button during the execution of the function
    dom.share.disabled = true;

    try {
        // Fetch the response from the endpoint
        const response = await fetch(endpoint);

        // Parse the response as JSON to get the list of first level folders
        const folderList = await response.json();

        // Log the list of first level folders for debugging
        console.log('First level folder list:', folderList);

        // Create an unordered list element to hold the list of folders
        const folderListDiv = document.createElement('ul');

        // Loop through the list of folders
        folderList.forEach(folder => {

            // Create a list item and an anchor for each folder
            const folderNameLI = document.createElement('li');
            const folderNameA = document.createElement('a');

            // Log the current folder for debugging
            console.log(folder);

            // Set the innerHTML of the anchor to the folder name and set its href attribute
            folderNameA.innerHTML = folder.fileName;
            folderNameA.href ="#";
            folderNameA.dataset.url = folder.folderUrl; 

            // Append the anchor to the list item and the list item to the unordered list
            folderNameLI.appendChild(folderNameA);
            folderListDiv.appendChild(folderNameLI);
        });

        // Clear any existing content from the file list div
        dom.fileListDiv.innerHTML = '';

        // Append the newly created unordered list to the file list div
        dom.fileListDiv.appendChild(folderListDiv);

        // Add an event listener to the file list div to handle clicks on the folder links
        dom.fileListDiv.addEventListener('click', async (event) => {
            
            // Prevent the default action of the click event
            event.preventDefault();

            // Get the target of the click event
            const target = event.target;

            // Check if the target of the click was a link (an anchor tag)
            if (target.tagName === 'A') {

                // Log the href of the clicked link for debugging
                console.log('Clicked second level folder link:', target.href);

                // Get the folder name from the text content of the target
                const folderName = target.textContent;

                // If the breadcrumb trail does not already include this folder, add it
                if (!breadcrumbTrail.includes(folderName)) {
                    breadcrumbTrail.push(folderName);

                    // Render the updated breadcrumb trail
                    renderBreadcrumbTrail();
                }

                // Construct the URL for the folder endpoint from the dataset URL of the target, if it exists
                const folderEndpoint = target.dataset.url ? `https://rpss:8443${target.dataset.url}` : target.href;

                // Log the URL of the folder endpoint for debugging
                console.log('Second level folder endpoint:', folderEndpoint);

                // Fetch and display the function list for the clicked folder
                await getFunctionList(folderEndpoint);
            }

            // Update the breadcrumbs with the current navigation history
            updateBreadcrumbs(navigationHistory);
        });

    } catch (error) {
        // If there was an error during the fetch operation, log the error
        console.error(error);
    }

    // Re-enable the share button at the end of the function
    dom.share.disabled = false;
}

// The function `getSecondLevelFolders` retrieves the second level folders from the provided endpoint.

async function getSecondLevelFolders(endpoint, itemName="secondLevel") {
    
    // Add the current endpoint to the navigation history stack
    navigationHistory.push(endpoint); 

    // Disable the share button during the execution of the function
    dom.share.disabled = true;

    try {
        // Fetch the response from the endpoint
        const response = await fetch(endpoint);

        // Parse the response as JSON to get the list of second level folders
        const secondLevelFolderList = await response.json();

        // Log the list of second level folders for debugging
        console.log('Second level folder list:', secondLevelFolderList);

        // Create an unordered list element to hold the list of folders
        const secondLevelFolderListDiv = document.createElement('ul');

        // Loop through the list of second level folders
        secondLevelFolderList.forEach(folder => {

            // Create a list item and an anchor for each folder
            const folderNameLI = document.createElement('li');
            const folderNameA = document.createElement('a');

            // Set the textContent of the anchor to the folder name and set its href attribute
            folderNameA.textContent = folder.folderName;
            folderNameA.href = "#";
            folderNameA.dataset.url = folder.folderUrl; 

            // Append the anchor to the list item and the list item to the unordered list
            folderNameLI.appendChild(folderNameA);
            secondLevelFolderListDiv.appendChild(folderNameLI);
        });

        // Clear any existing content from the file list div
        dom.fileListDiv.innerHTML = '';

        // Append the newly created unordered list to the file list div
        dom.fileListDiv.appendChild(secondLevelFolderListDiv);

        // Add an event listener to the file list div to handle clicks on the folder links
        dom.fileListDiv.addEventListener('click', async (event) => {
            
            // Prevent the default action of the click event
            event.preventDefault();

            // Get the target of the click event
            const target = event.target;

            // Check if the target of the click was a link (an anchor tag)
            if (target.tagName === 'A') {

                // Log the href of the clicked link for debugging
                console.log('Clicked second level folder link:', target.href);

                // Construct the URL for the folder endpoint from the dataset URL of the target, if it exists
                const folderEndpoint = target.dataset.url ? `https://rpss:8443${target.dataset.url}` : target.href;

                // Log the URL of the folder endpoint for debugging
                console.log('Second level folder endpoint:', folderEndpoint);
					
                // Fetch and display the function list for the clicked folder
                await getFunctionList(folderEndpoint);
				// Update the breadcrumbs with the current navigation history
				updateBreadcrumbs(navigationHistory);
            }

            
        });

    } catch (error) {
        // If there was an error during the fetch operation, log the error
        console.error(error);
    }

    // Re-enable the share button at the end of the function
    dom.share.disabled = false;
}

// Asynchronous function to fetch and display a list of functions from a specified endpoint
async function getFunctionList(endpoint, itemName = "functions") {

    // Disable the share button
    dom.share.disabled = true;

    // List of names of optional parameters
    const optionalParametersNames = [
        'Verbose',
        'Debug',
        'ErrorAction',
        'WarningAction',
        'InformationAction',
        'ErrorVariable',
        'WarningVariable',
        'InformationVariable',
        'OutVariable',
        'OutBuffer',
        'PipelineVariable'
    ];

    try {
        // Fetch the response from the endpoint
        const response = await fetch(endpoint);

        // Log the response
        console.log('response-->');
        console.log(response);

        // Convert the response to JSON
        const functionData = await response.json();

        // Log the function data
        console.log('functionData');
        console.log(functionData);

        // Check if functionData is valid
        if (!functionData.functions || !Array.isArray(functionData.functions)) {
            // Log error message if invalid
            console.error('Invalid function data:', functionData);
            return;
        }

        // Show the function list and clear any previous content
        dom.functionList.style.display = "block";
        dom.functionList.innerHTML = '';

        // Create a new unordered list element
        const ulElement = document.createElement('ul');

        // Loop through each function name in functionData
        functionData.functions.forEach(functionName => {

            // Create a new list item for each function
            const liElement = document.createElement('li');
            liElement.textContent = functionName;

            // Add an event listener for a click on the list item
            liElement.addEventListener('click', async () => {

                // Show the modal
                dom.modal.style.display = "block";

                // Display the selected function name
                dom.selectedFunction.textContent = `Selected function: ${functionName}`;

                // Fetch the syntax for the selected function
                const syntaxResponse = await fetch(`${endpoint}/${functionName}`);

                // Log the syntax response
                console.log("syntaxResponse -->")
                console.log(syntaxResponse);

                // Convert the syntax response to JSON
                const syntaxData = await syntaxResponse.json();

                // Log the syntax data
                console.log("syntaxData -->")
                console.log(syntaxData);

                // Get the function info from syntaxData
                let functionInfo = syntaxData.functions[0];

                // Get the synopsis from the function info
                const synopsis = functionInfo.synopsis;
                console.log("synopsis:", synopsis);

                // Display the function synopsis
                dom.functionSynopsis.textContent = `Synopsis: ${synopsis}`;

                // If syntaxData contains valid function parameters
                if (syntaxData && syntaxData.functions && syntaxData.functions.length > 0 && syntaxData.functions[0].parameters) {
                    // Log a message indicating this
                    console.log("true");

                    // Log the function info
                    console.log("functioninfo:" + functionInfo);

                    // Get the display element for function parameters
                    const functionParametersDisplay = document.getElementById('functionParameters');

                    // Clear any previous content
                    functionParametersDisplay.innerHTML = '';

                    // Create new div elements for required and optional parameters
                    const requiredParametersDiv = document.createElement('div');
                    const optionalParametersDiv = document.createElement('div');
                    const activeOptionalParametersDiv = document.createElement('div');

                    // Create a new unordered list element for the optional parameters list
                    const optionalParametersList = document.createElement('ul');

                    // Initially hide the optional parameters list
                    optionalParametersList.style.display = "none";

                    // Set the headings for the different parameter sections
                    activeOptionalParametersDiv.innerHTML = '<h4>Active Optional Parameters:</h4>';
                    requiredParametersDiv.innerHTML = '<h4>Required Parameters:</h4>';
                    optionalParametersDiv.innerHTML = '<h4>Optional Parameters:</h4>';

                    // Create a button to toggle the display of optional parameters
                    const toggleOptionalButton = document.createElement('button');
                    toggleOptionalButton.textContent = "Toggle Optional Parameters";

                    // Add event listener to the button to toggle the display of the optional parameters list
                    toggleOptionalButton.addEventListener('click', () => {
                        if (optionalParametersList.style.display === "none") {
                            optionalParametersList.style.display = "block";
                        } else {
                            optionalParametersList.style.display = "none";
                        }
                    });

                    // Get the parameters from the function info
                    const functionParameters = functionInfo.parameters;
                    console.log(functionParameters);

                    // Loop through each parameter object
                    functionParameters.forEach(paramObj => {
                        const paramName = paramObj.Name;
                        const paramType = paramObj.ParameterType;

                        // Create a new div element for the parameter
                        const paramDiv = document.createElement('div');
                        paramDiv.setAttribute('data-param-name', paramName);

                        // Create a new label and input for the parameter
                        const paramLabel = document.createElement('label');
                        const paramInput = document.createElement('input');

                        // Set the text of the label and the placeholder of the input
                        paramLabel.textContent = `${paramName}:`;
                        paramInput.setAttribute('name', paramName);
                        paramInput.setAttribute('placeholder', paramType);

                        // Append the label and input to the div
                        paramDiv.appendChild(paramLabel);
                        paramDiv.appendChild(paramInput);

                        // If the parameter name is not in the list of optional parameters names
                        if (!optionalParametersNames.includes(paramName)) {
                            // Append the parameter div to the required parameters div
                            requiredParametersDiv.appendChild(paramDiv);
                        } else {
                            // Otherwise, create an add button and append it to the parameter div
                            const addButton = document.createElement('button');
                            addButton.textContent = '+';
                            addButton.addEventListener('click', () => {
                                // When the add button is clicked, move the parameter div to the active optional parameters div and replace the add button with a remove button
                                activeOptionalParametersDiv.appendChild(paramDiv);
                                paramDiv.removeChild(addButton);

                                const removeButton = document.createElement('button');
                                removeButton.textContent = '-';
                                removeButton.addEventListener('click', () => {
                                    // When the remove button is clicked, move the parameter div back to the optional parameters list and replace the remove button with the add button
                                    optionalParametersList.appendChild(paramDiv);
                                    paramDiv.removeChild(removeButton);
                                    paramDiv.appendChild(addButton);
                                });
                                paramDiv.appendChild(removeButton);
                            });
                            paramDiv.appendChild(addButton);

                            // Append the parameter div to the optional parameters list
                            optionalParametersList.appendChild(paramDiv);
                        }
                    });

                    // Append the toggle button and the optional parameters list to the optional parameters div
                    optionalParametersDiv.appendChild(toggleOptionalButton);
                    optionalParametersDiv.appendChild(optionalParametersList);

                    // Append the required parameters div, active optional parameters div, and optional parameters div to the function parameters display
                    functionParametersDisplay.appendChild(requiredParametersDiv);
                    functionParametersDisplay.appendChild(activeOptionalParametersDiv);
                    functionParametersDisplay.appendChild(optionalParametersDiv);

                    // Implementation of the Run button
                    const runButton = document.getElementById('runButton');
                    runButton.onclick = async () => {
                        // Show the loading indicator
                        const loadingIndicator = document.getElementById('loadingIndicator');
                        loadingIndicator.style.display = 'block';

                        // Get the required parameters and active optional parameters
                        const requiredParameters = Array.from(requiredParametersDiv.getElementsByTagName('input'));
                        const activeOptionalParameters = Array.from(activeOptionalParametersDiv.getElementsByTagName('input'));

                        // Initialize an empty object to hold the parameters
                        const params = {};

                        // Add required parameters to the parameters object
                        requiredParameters.forEach(input => {
                            params[input.name] = [input.value];
                        });

                        // Add active optional parameters to the parameters object
                        activeOptionalParameters.forEach(input => {
                            params[input.name] = [input.value];
                        });

                        // Prepare the URL and request body for the POST request
                        const apiUrl = `${endpoint}/${functionName}`; // Modify if needed
                        const requestBody = {
                            params: params,
                            functionArguments: [] // Add your function arguments here
                        };

                        try {
                            // Send the POST request
                            const response = await fetch(apiUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(requestBody)
                            });

                            // Hide the loading indicator
                            loadingIndicator.style.display = 'none';

                            // Convert the response to text
                            const responseData = await response.text();
                            console.log('Server Response:', responseData);

                            // Display the server response
                            dom.outputList.style.display = "block";
                            dom.copyDiv.style.display = "block";
                            dom.outputDiv.innerText = responseData;

                            // Close the modal
                            dom.modal.style.display = "none";

                        } catch (error) {
                            // Log any error message
                            console.error('Error sending request to the server:', error);
                        }
                    };

                    // Implementation of the Close button
                    const span = document.getElementsByClassName("close")[0];
                    span.onclick = () => {
                        // When the Close button is clicked, hide the modal and output
                        dom.modal.style.display = "none";
                        dom.outputList.style.display = "none";
                        dom.copyDiv.style.display = "none";
                    };
                    dom.outputDiv.style.display = "none";
                    dom.copyDiv.style.display = "none";
                }
            });

            // Append the list item to the unordered list
            ulElement.appendChild(liElement);
        });

        // Append the unordered list to the function list
        dom.functionList.appendChild(ulElement);

    } catch (error) {
        // Log any error message
        console.error(error);
    }

    // Enable the share button
    dom.share.disabled = false;
}
