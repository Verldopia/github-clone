(() => {
    const app = {
        // gitHubUser: null,
        init() {
            this.cacheElements();
            this.generateUI();
        },
        cacheElements() {
            this.$users = document.querySelector('.users');
            this.$githubRepos = document.querySelector('.github--repos');
            this.$githubFollowers = document.querySelector('.github--followers');
            this.$h3Repos = document.querySelector('.h3-main');
            this.$githubUser = document.querySelector('.users-github');
        },
        generateUI() {
            this.fetchHtmlForUsers();
            this.fetchGithubRepositories();
            this.fetchGithubUsers();
        },
        async fetchHtmlForUsers() {
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
                <div class="box-user ${i++ % 2 === 0 ? '' : 'user-light'}" data-user="${use.portfolio.githubUserName}">
                    <img class="is-img" src="${use.thumbnail}">
                    <div class="box-text">
                        <p>${use.first} ${use.last}</p>
                        <p class="smaller">${use.portfolio.githubUserName}</p>
                    </div>
                </div>`

                }).join('')
                this.$users.innerHTML = `<div class="box-user--all">${userHTML}</div>`;
                this.generateListenersPGM(user);
            }
        },
        async fetchGithubRepositories(username = "pgmgent") {
            console.log('fetching github ' + username)
            await fetch(`https://api.github.com/users/${username}/repos?page=1&per_page=25`, {
                    method: 'GET'
                })
                .then(result => {
                    console.log(result)
                    if (!result.ok) {
                        throw Error('ERROR! this API is not found!');
                    }
                    return result.json()
                })
                .then(data => {
                    this.generateHtmlForRepositories(data, username)
                    this.fetchGithubFollowers(username)
                })
        },
        generateHtmlForRepositories(data, username) {
            const amountResults = data.length;
            const reposHTML = data.map((rep) => {

                return `
                <div class="box-repos">
                    <div class="repos--titles">
                        <h3 class="h3-repos">${rep.full_name}</h3>
                        <p>${rep.description === null ? 'No description available' : rep.description}</p>
                    </div>
                    <div class="repos--smaller-info">
                        <p>${rep.language === null ? 'Unknown language' : rep.language}</p>
                        <p>Last modified: ${new Date(rep.updated_at).toLocaleDateString()}</p>
                        <p>${rep.visibility}</p>
                        <p>${rep.license === null ? 'No License' : rep.license.name}</p>
                        <p class="p-size">${rep.size > 999 ? (rep.size / 1000).toFixed(2) + ' MB' : rep.size + ' kB'}</p>
                    </div>
                </div>`
            }).join('');
            this.$h3Repos.innerHTML = `${amountResults} repository results for ${username}.`;
            this.$githubRepos.innerHTML = reposHTML;
        },
        async fetchGithubFollowers(username) {
            console.log('current user: ' + username)
            await fetch(` https://api.github.com/users/${username}/followers?page=1&per_page=100`, {
                    method: 'GET'
                })
                .then(result => {
                    if (!result.ok) {
                        throw Error('ERROR! this API is not found!');
                    }
                    return result.json()
                })
                .then(data => {
                    this.generateHtmlForFollowers(data)
                })
        },
        generateHtmlForFollowers(followers) {
            if (followers.length === 0) {
                this.$githubFollowers.innerHTML = `
                <div class="p-box--center">
                    <p>No followers found!</p>
                </div>`
            } else {
                const followersHTML = followers.map((fol) => {
                    return `
                <div class="box-follower" data-follower="${fol.login}">
                    <img src="${fol.avatar_url}">
                    <p class="follower-login">${fol.login}</p>
                </div>`
                }).join('');
                this.$githubFollowers.innerHTML = `<div class="container-followers">${followersHTML}</div>`;
                this.generateListeners();
            }
        },
        async fetchGithubUsers(username = "pgm-michielwillems") {
            await fetch(`https://api.github.com/search/users?sort=desc&page=1&per_page=100&q=${username}`, {
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
        generateGithubUsers(data) {
            for (let i = 1; i < 2; i++) {
                this.githubHTML = data.map((user) => {
                    return `
                    <div class="box-user box-github ${i++ % 2 !== 0 ? '' : 'user-light'}" data-user="${user.login}">
                        <img class="is-img" src="${user.avatar_url}">
                        <p>${user.login}</p>
                    </div>`
                }).join('');
                this.$githubUser.innerHTML = this.githubHTML;
                this.generateListeners();
            }
        },
        generateListeners() {
            this.$btn = document.getElementById("search-user");
            this.$btn.addEventListener('click', () => {
                const userName = document.getElementById("submit-user").value;
                this.fetchGithubUsers(userName)
            });
            this.$uniqueUser = document.querySelectorAll(".box-github");
            for (const $filter of this.$uniqueUser) {
                $filter.addEventListener('click', () => {
                    const category = $filter.dataset.user;
                    this.fetchGithubRepositories(category);
                })
            };
            this.$uniqueFollower = document.querySelectorAll(".box-follower");
            for (const $filter of this.$uniqueFollower) {
                $filter.addEventListener('click', () => {
                    const category = $filter.dataset.follower;
                    this.fetchGithubRepositories(category)
                    document.body.scrollTop = 0;
                    document.documentElement.scrollTop = 0;
                })
            };
        },
        generateListenersPGM(user) {
            this.$uniquePGM = document.querySelectorAll(".box-user");
            for (const $filter of this.$uniquePGM) {
                $filter.addEventListener('click', () => {
                    const category = $filter.dataset.user;
                    this.generateProfilePGM (user, category)
                    this.fetchGithubRepositories(category);
                })
            };
        },
        generateProfilePGM (allUsers, user) {
            this.$profilePGM = document.querySelectorAll(".box-user");
            for (const u of allUsers) {
                if (u.portfolio.githubUserName === user) {
                    this.$profilePGM.innerHTML = `
                    <h2>${u.first} ${u.last}</h2>
                    <p>${u.date}</p>
                    <p>${u.email}</p>
                    <blockquote>${u.quote}</blockquote>
                    <p>${u.teacher}</p>
                    <img src="${u.thumbnail}" alt="${user}"></img>`
                }
            }
        }
    };
    app.init()
})();