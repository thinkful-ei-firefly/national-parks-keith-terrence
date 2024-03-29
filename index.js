'use strict';

const apiKey = 'gTJUvuoXkWHZAkXlIhteCsQkTeDp9ysKTOqMHHlI';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

/** The user must be able to search for parks in one or more states.
The user must be able to set the max number of results, with a default of 10.
The search must trigger a call to NPS's API.
The parks in the given state must be displayed on the page. Include at least:
Full name
Description
Website URL
The user must be able to make multiple searches and see only the results for the current search.*/

/**
 * Creates a query string from a params object
 * @param {object} params 
 * @returns {string} query string
 */
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  return queryItems.join('&');
}
  
/**
   * Performs the fetch call to get news
   * @param {string} query 
   * @param {number} maxResults 
   */
function getNews(query, maxResults=10) {
  const params = {
    stateCode: query,
    limit: maxResults
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;
  
 
  
  fetch(`${url}&api_key=${apiKey}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, maxResults))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}
  
/**
   * Appends formatted HTML results to the page
   * @param {object} responseJson 
   * @param {number} maxResults 
   */ 
function displayResults(responseJson, maxResults) {
  console.log('responseJson: ',responseJson);
  // clear the error message
  $('#js-error-message').empty();
  // if there are previous results, remove them
  $('#results-list').empty();
  // iterate through the articles array, stopping at the max number of results
  responseJson.data.forEach(data => {
    // For each object in the articles array:
    // Add a list item to the results list with 
    // the article title, source, author,
    // description, and image
    $('#results-list').append(
      `
          <li><h3><a href="${data.url}">${data.name}</a></h3>
          <p>${data.fullName}</p>
          <p>${data.description}</p>
          </li>
        `
    );
  });
  // unhide the results section  
  $('#results').removeClass('hidden');
}
  
/**
   * Handles the form submission
   */
function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-search-term').val();
    const maxResults = $('#js-max-results').val();
    getNews(searchTerm, maxResults);
  });
}
  
$(watchForm);