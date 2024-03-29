document.addEventListener('DOMContentLoaded',  () => {

    let filterForm = document.getElementById('filterForm');
    let filterInput = document.getElementById('filterInput');
    let filterInputUser = document.getElementById('filterInputUser');
    let whiteListInputFilter = document.getElementById('whiteListFilter');
    let softFilterCheckbox = document.getElementById('softFilterCheckbox');
    let minRatingInput = document.getElementById('minRatingInput');

    chrome.storage.local.get('filterString', function (data) {
        filterInput.value = data.filterString || '';
    });

    chrome.storage.local.get('filterStringUser', function (data) {
        filterInputUser.value = data.filterStringUser || '';
    });

    chrome.storage.local.get('whiteListFilter', function (data) {
        whiteListInputFilter.value = data.whiteListFilter || '';
    });

    chrome.storage.local.get('softFilter', function (data) {
        softFilterCheckbox.checked = data.softFilter || false;
    });

    chrome.storage.local.get('minRating', function (data) {
        minRatingInput.value = data.minRating || -10;
    });


    softFilterCheckbox.addEventListener('change',  (event) => {
        let isChecked = event.target.checked;
        chrome.storage.local.set({softFilter: isChecked});
    });

    minRatingInput.addEventListener('change',  (event) => {
        chrome.storage.local.set({minRating: event.target.value});
    });

    filterForm.addEventListener('submit',  (event) => {

        event.preventDefault();

        let filterValue = filterInput.value;
        let filterValueUser = filterInputUser.value;
        let whiteListFilter = whiteListInputFilter.value;

        chrome.storage.local.set({filterString: filterValue},  () => {});
        chrome.storage.local.set({filterStringUser: filterValueUser},  () => {});
        chrome.storage.local.set({whiteListFilter: whiteListFilter},  () => {});

    });
});