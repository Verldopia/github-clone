(() => {
    const app = {
        init () {
            this.cacheElements();
            this.generateUI();
        },
        cacheElements () {
            this.$users = document.querySelector('.users');
            this.$githubUser = document.querySelector('.users-github');
        },
        generateUI () {
            this.fetchHtmlForUsers();
            this.fetchGithubUsers();
        },
        async fetchHtmlForUsers () {
            await fetch("static/data/pgm.json")
            .then(result => {
                if (!result.ok) {
                    throw Error('ERROR! this API is not found!');
                }
                return result.json()
            })
            .then(data => this.generateUsers(data)) 
        },
        generateUsers(user) {
            for (let i = 1; i < 2; i++) {
            const userHTML = user.map((use) => {
                return `
                <div class="box-user ${i++ % 2 === 0 ? '' : 'user-light'}" data-user="${use.login.uuid}">
                    <img class="is-img" src="${use.picture.thumbnail}">
                    <div class="box-text">
                        <p>${use.name.first} ${use.name.last}</p>
                        <p class="smaller">${use.login.username}</p>
                    </div>
                </div>`
                
            }).join('')
            this.$users.innerHTML = `<div class="box-user--all">${userHTML}</div>`;
            this.generateListeners(user);
            }
        },
        async fetchGithubUsers (userName = "pgm-michielwillems") {
            await fetch(`https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=${userName}`, {
                method: 'GET'
            })
            .then(result => {
                if (!result.ok) {
                    throw Error('ERROR! this API is not found!');
                }
                return result.json()
            })
            .then(data => {
                this.generateGithubUsers(data.items)
            })
        },
        generateGithubUsers (data) {
            for (let i = 1; i < 2; i++) {
                const githubHTML = data.map((user) => {
                    return `
                    <div class="box-user ${i++ % 2 !== 0 ? '' : 'user-light'}">
                        <img class="is-img" src="${user.avatar_url}">
                        <p>${user.login}</p>
                    </div>`
                }).join('')
                this.$githubUser.innerHTML = githubHTML
            }
        },
        generateListeners (user) {
            this.$uniqueUser = document.querySelectorAll('.box-user');
            for (const $user of this.$uniqueUser) {
                $user.addEventListener('click', () => {
                    this.generateInfoForUser($user, user);
                })
            }
            this.$btn = document.getElementById("search-user");
            this.$btn.addEventListener('click', () => {
                const userName = document.getElementById("submit-user").value;
                this.fetchGithubUsers(userName)
            });
        },
        generateInfoForUser ($user, user) {
            console.log(user)
            const uniqueUser = user.map((use) => use.login.uuid)
            for (const dataset of uniqueUser) {
            if ($user.dataset.user === dataset) {
                console.log(dataset)
            }
        }}
    };
    app.init()
})();