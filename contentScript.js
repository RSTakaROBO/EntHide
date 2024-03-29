let filterParams = {
    "softFiltering": true,
    "groups": "",
    "users": "",
    "whiteListFilter": "",
    "minRating": -10,
}

const opacityFactor = 0.1

let isFiltering = false;
let observerEnabled = true;

const filterPosts = () => {

    isFiltering = true;

    let groupList = filterParams.groups.length > 0 ? filterParams.groups.split('\n') : []
    let userList = filterParams.users.length > 0 ? filterParams.users.split('\n') : []
    let whiteList = filterParams.whiteListFilter.length > 0 ? filterParams.whiteListFilter.split('\n') : []

    userList = userList.filter(link => !whiteList.includes(link))

    let minRating = filterParams.minRating;

    let userLinks = []
    let groupLinks = []

    userList.forEach(user => {
        userLinks.push(...document.querySelectorAll('a[href="' + user + '"]'))
    })

    groupList.forEach(group => {
        groupLinks.push(...document.querySelectorAll('a[href="' + group + '"]'))
    })

    let votes = document.querySelectorAll('div[x-text="' + 'voteCount' + '"')

    const isPostInWhitelist = (postElement) => {
        let postLinks = postElement.querySelectorAll('a')
        postLinks.forEach(postLink => {
            if (whiteList.includes(postLink.getAttribute('href'))) {
                return true
            }
        })
        return false
    }

    votes.forEach((vote) => {
        if (parseInt(vote.textContent) < minRating && vote.parentNode.parentNode.parentNode) {

            if (isPostInWhitelist(vote.parentNode.parentNode.parentNode)) {return}

            if (filterParams.softFiltering) {
                vote.parentNode.parentNode.parentNode.style.opacity = opacityFactor;
                vote.parentNode.parentNode.parentNode.style.display = "block";
            } else {
                vote.parentNode.parentNode.parentNode.style.opacity = 1;
                vote.parentNode.parentNode.parentNode.style.display = "none";
            }
        } else {
            vote.parentNode.parentNode.parentNode.style.opacity = 1;
            vote.parentNode.parentNode.parentNode.style.display = "block";
        }
    })

    groupLinks.forEach(link => {
        if (link.parentNode.parentNode.parentNode.parentNode) {

            if (isPostInWhitelist(link.parentNode.parentNode.parentNode.parentNode)) {return}

            if (filterParams.softFiltering) {
                link.parentNode.parentNode.parentNode.parentNode.style.display = "block";
                link.parentNode.parentNode.parentNode.parentNode.style.opacity = opacityFactor;

            } else {
                link.parentNode.parentNode.parentNode.parentNode.style.display = "none";
                link.parentNode.parentNode.parentNode.parentNode.style.opacity = 1;

            }
        }
    })

    userLinks.forEach(link => {
        if (link.parentNode.parentNode) {
            if (filterParams.softFiltering) {
                link.parentNode.parentNode.style.opacity = opacityFactor
                link.parentNode.parentNode.style.display = "block"
            } else {
                link.parentNode.parentNode.style.opacity = 1
                link.parentNode.parentNode.style.display = "none"
            }
        }
    })

    setTimeout(function () {
        isFiltering = false;
        observerEnabled = true;
    }, 100);
    observerEnabled = false;

}


chrome.storage.local.get('softFilter', (data) => {
    filterParams.softFiltering = data.softFilter;
    filterPosts();
});

chrome.storage.local.get('filterString', (data) => {
    filterParams.groups = data.filterString;
    filterPosts();
});

chrome.storage.local.get('filterStringUser', (data) => {
    filterParams.users = data.filterStringUser
    filterPosts();
});

chrome.storage.local.get('minRating', (data) => {
    filterParams.minRating = data.minRating
    filterPosts();
});

chrome.storage.local.get('whiteListFilter', (data) => {
    filterParams.whiteListFilter = data.whiteListFilter
    filterPosts();
});

whiteListFilter

function handleFilterChange(changes, namespace) {
    if (namespace === 'local' && changes.filterString) {
        filterParams.groups = changes.filterString.newValue
    }
    if (namespace === 'local' && changes.filterStringUser) {
        filterParams.users = changes.filterStringUser.newValue
    }
    if (namespace === 'local' && changes.softFilter) {
        filterParams.softFiltering = changes.softFilter.newValue
    }
    if (namespace === 'local' && changes.minRating) {
        filterParams.minRating = changes.minRating.newValue
    }
    if (namespace === 'local' && changes.whiteListFilter) {
        filterParams.whiteListFilter = changes.whiteListFilter.newValue
    }
    filterPosts();
}

chrome.storage.onChanged.addListener(handleFilterChange);

const observer = new MutationObserver(function (mutationsList, observer) {
    if (!observerEnabled) return;

    for (let mutation of mutationsList) {
        if (mutation.type === 'childList' || (mutation.type === 'attributes' && mutation.attributeName === 'class')) {
            if (!isFiltering) {
                filterPosts();
            }
            break;
        }
    }
})


observer.observe(document.body, {attributes: true, childList: true, subtree: true});
