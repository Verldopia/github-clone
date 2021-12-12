(() => {
    const app = {
        init () {
            this.cacheElements();
            this.generateUI();
        },
        cacheElements () {
            this.$users = document.querySelector('.users');
            this.$githubRepos = document.querySelector('.github--repos');
            this.$githubFollowers = document.querySelector('.github--followers');
            this.$h3Repos = document.querySelector('.h3-main');
            this.$githubUser = document.querySelector('.users-github');
        },
        generateUI () {
            this.fetchHtmlForUsers();
            this.fetchGithubRepositories();
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
        generateUsers (user) {
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
            this.generateListeners(user);
            }
        },
        async fetchGithubRepositories (username = "pgmgent") {
            await fetch(`https://api.github.com/users/${username}/repos?page=1&per_page=50`, {
                method: 'GET'
            })
            .then(result => {
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
        generateHtmlForRepositories (data, username) {
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
        async fetchGithubFollowers (username) {
            console.log('current user: ' + username)
            await fetch (` https://api.github.com/users/${username}/followers?page=1&per_page=100`, {
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
        generateHtmlForFollowers (followers) {
            if (followers.length === 0) {
                this.$githubFollowers.innerHTML = `
                <div class="p-box--center">
                    <p>No followers found!</p>
                </div>`
            } else {
               const followersHTML = followers.map((fol) => {
                return `
                <div class="box-follower">
                    <img src="${fol.avatar_url}">
                    <p>${fol.login}</p>
                </div>`
            }).join('');
            this.$githubFollowers.innerHTML = `<div class="container-followers">${followersHTML}</div>`; 
            }
        },
        async fetchGithubUsers (username = "pgm-michielwillems") {
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
        generateGithubUsers (data) {
            
            for (let i = 1; i < 2; i++) {
                this.githubHTML = data.map((user) => {
                    this.$githubUser.addEventListener('click', 
                        this.generateListenerGithub
                    )
                    return `
                    <div class="box-user box-github ${i++ % 2 !== 0 ? '' : 'user-light'}" data-user="${user.id}">
                        <img class="is-img" src="${user.avatar_url}">
                        <p>${user.login}</p>
                    </div>`
                }).join('')
                this.$githubUser.innerHTML = this.githubHTML;
            }
        },
        generateListenerGithub (data) {
            this.$uniqueUser = document.querySelectorAll('.box-user box-github');
                // console.log(this.$uniqueUser.dataset.user)
        },
        generateListeners () {
            this.$btn = document.getElementById("search-user");
            this.$btn.addEventListener('click', () => {
            const userName = document.getElementById("submit-user").value;
            this.fetchGithubUsers(userName)
            });
        },
        // generateInfoForUser ($user) {
        //     console.log(user)
        //     const uniqueUser = user.map((use) => use.login.uuid)
        //     for (const dataset of uniqueUser) {
        //     if ($user.dataset.user === dataset) {
        //         console.log(dataset)
        //     }
        // }}
    };
    app.init()
})();