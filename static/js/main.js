(() => {
    const app = {
        init() {
            this.cacheElements();
            this.generateUI();
        },
        cacheElements() {
            this.$users = document.querySelector('.users');
            this.$githubRepos = document.querySelector('.github--repos');
            this.$githubFollowers = document.querySelector('.github--followers');
            this.$h3Repos = document.querySelector('.h3-main');
            this.$h2Repos = document.querySelector('.h2-repos')
            this.$githubUser = document.querySelector('.users-github');
            this.$profile = document.querySelector('.box-profile');
            this.$toggle = document.querySelector('.switch');
            this.$boxGH = document.querySelector('.box-github--users');
            this.$boxPGM = document.querySelector('.box-users');
            this.$switch = document.querySelector('.switch__circle');
            this.$main = document.querySelector('.box-github--main')
        },
        generateUI() {
            this.fetchHtmlForUsers();
            this.fetchGithubRepositories();
            this.fetchGithubUsers();
            this.colorTheme();
        },
        async fetchHtmlForUsers() {
            await fetch("static/data/pgm.json", {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(result => {
                    if (!result.ok) {
                        throw Error('ERROR! this API is not found!');
                    }
                    return result.json()
                })
                .then(data => this.generateUsers(data))
        },
        generateUsers(user) {
            this.$profile.style.display = "block";
            for (let i = 1; i < 2; i++) {
                const userHTML = user.map((use) => {
                    return `
                <a class="box-user ${i++ % 2 === 0 ? '' : 'user-light'}" data-user="${use.portfolio.githubUserName}">
                    <img class="is-img" src="${use.thumbnail}">
                    <div class="box-text">
                        <p>${use.first} ${use.last}</p>
                        <p class="smaller">${use.portfolio.githubUserName}</p>
                    </div>
                </a>`

                }).join('')
                this.$users.innerHTML = `<div class="box-user--all">${userHTML}</div>`;
                this.generateListenersPGM(user);
            }
        },
        async fetchGithubRepositories(username = "pgmgent") {
            await fetch(`https://api.github.com/users/${username}/repos?page=1&per_page=25`, {
                    method: 'GET',
                    headers: {
                        'Authorization': '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'
                    }
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
        generateHtmlForRepositories(data, username) {
            const amountResults = data.length;
            const reposHTML = data.map((rep) => {
                return `
                <div class="box-repos">
                    <div class="repos--titles">
                        <a class="a-repos">${rep.full_name}</a>
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
                    <img src="${fol.avatar_url}" loading="lazy">
                    <p class="follower-login">${fol.login}</p>
                </div>`
                }).join('');
                this.$githubFollowers.innerHTML = `<div class="container-followers">${followersHTML}</div>`;
                this.generateListenersPGM(followers);
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
                this.generateGithubUsers(data.items);
            })
        },
        generateGithubUsers(data) {
            this.$profile.style.display = "block";
            for (let i = 1; i < 2; i++) {
            this.githubHTML = data.map((user) => {
                return `
                <a class="box-user box-github ${i++ % 2 !== 0 ? '' : 'user-light'}" data-user="${user.login}">
                    <img class="is-img" src="${user.avatar_url}">
                    <p>${user.login}</p>
                </a>`
            }).join('');
            this.$githubUser.innerHTML = this.githubHTML;
            this.generateListeners(data);
            }
        },
        generateListeners(data) {
            this.$btnUser = document.getElementById("search-user");
            this.$btnUser.addEventListener('click', () => {
                console.log(this.$btnUser)
                this.userName = document.getElementById("submit-user").value;
                this.fetchGithubUsers(this.userName);
            });
            this.$btnVideos = document.getElementById("search-video");
                this.$btnVideos.addEventListener('click', () => {
                this.userName = document.getElementById("submit-user").value;
                this.fetchYoutubeVideos(this.userName);
            });
            this.$uniqueUser = document.querySelectorAll(".box-github");
            for (const $filter of this.$uniqueUser) {
                $filter.addEventListener('click', () => {
                    const category = $filter.dataset.user;
                    this.fetchGithubRepositories(category);
                    this.generateProfileGH(data, category);
                })
            };
                
            
        },
        generateListenersPGM(users) {
            this.$uniquePGM = document.querySelectorAll(".box-user");
            for (const $filter of this.$uniquePGM) {
                $filter.addEventListener('click', () => {
                    const category = $filter.dataset.user;
                    this.generateProfilePGM(users, category);
                    this.fetchGithubRepositories(category);
                })
            };
            this.$uniqueFollower = document.querySelectorAll(".box-follower");
            for (const $filter of this.$uniqueFollower) {
                $filter.addEventListener('click', () => {
                    const category = $filter.dataset.follower;
                    this.fetchGithubRepositories(category);
                    this.generateProfileGH(users, category);
                })
            };
        },
        generateProfilePGM(users, dataset) {
            this.userPGM = users.map((u) => {
            if (u.portfolio.githubUserName === dataset) {
                return `
                <div class="container-pgm ${u.portfolio.githubUserName === dataset ? 'is-selected' : ''}">
                    <img src="${u.large}" alt="${dataset}"></img>
                    <div class="box-pgm">
                        <h2>${u.first} ${u.last}</h2>
                        <blockquote>"${u.quote}"</blockquote>
                        <div class="box-pgm--text">
                            <p>Born ${new Date(u.date).toLocaleDateString()}</p>
                            <p>${u.email}</p>
                            <div class="box-socials">
                                <a href="https://github.com/${u.portfolio.githubUserName}" target="_blank">GitHub</a>
                                <a href="https://linkedin.com/${u.portfolio.linkedInUserName}" target="_blank">LinkedIn</a>
                            </div>
                            <p class="teacher">${u.teacher === true ? 'Teacher' : 'Student'}</p>
                        </div>
                    </div>
                </div>`
            }}).join('')
            this.$profile.innerHTML = this.userPGM;
        },
        generateProfileGH(users, dataset) {
            this.userGH = users.map((u) => {
            if (u.login === dataset) {
                return `
                <div class="container-pgm">
                    <img src="${u.avatar_url}" alt="${u.login}"></img>
                <div class="box-pgm">
                    <h2>${u.login}</h2>
                    <div class="box-pgm--text">
                        <p>ID: ${u.id}</p>
                        <div class="box-socials">
                            <a href="${u.html_url}" target="_blank">GitHub</a>
                            <a href="https://linkedin.com/${u.login}" target="_blank">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </div>`
            }}).join('')
            this.$profile.innerHTML = this.userGH;
        },
        async fetchYoutubeVideos(searchField) {
            const key = "AIzaSyDIrCsu25cYlgw4qRhLhpMh9gLSrXKzdlk";
            await fetch(`https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet&maxResults=20&q=${searchField}`, {
                    method: 'GET',
                })
                .then(result => {
                    if (!result.ok) {
                        throw Error('ERROR! this API is not found!');
                    }
                    return result.json()
                })
                .then(data => {
                    this.generateInterfaceForVideos(data.items);
                })
        },
        generateInterfaceForVideos (allVideos) {
            if (allVideos.length === 0) {
                this.$main.innerHTML = `<h3>No videos! That's what happens when you input a weird search... Rethink your life choices and come again</h3>`
            }
            for (let i = 1; i < 2; i++) {
                this.videoHTML = allVideos.map((video) => {
                    return `
                    <a class="box-video box-github box-user ${i++ % 2 !== 0 ? '' : 'user-light'}" data-video="${video.etag}">
                        <img class="is-img" src="${video.snippet.thumbnails.default.url}">
                        <p>${video.snippet.title}</p>
                    </a>`
                }).join('');
                this.$githubUser.innerHTML = this.videoHTML;
                this.$video = document.querySelectorAll(".box-video")
                for (const $video of this.$video) {
                    $video.addEventListener('click', () => {
                        const videoDataSet = $video.dataset.video;
                        this.generateYoutubeVideo(videoDataSet, allVideos);
                    })
                }
            }
        },
        generateYoutubeVideo(uniqueVideo, videoData) {
            this.videoHTML = videoData.map((video) => {
                if (uniqueVideo === video.etag) {
                    console.log(video)
                    this.$h2Repos.innerHTML = "Youtube videos"
                    this.$h3Repos.innerHTML = video.snippet.title
                    return `
                    <iframe src="https://www.youtube.com/embed/${video.id.videoId}"></iframe>
                    <p class="video-time">Uploaded: ${new Date(video.snippet.publishTime).toDateString()}</p>
                    <p class="video-description">${video.snippet.description}</p>`
                }}).join('')
            this.$main.innerHTML = this.videoHTML;
            this.$profile.style.display = "none";
        },
        colorTheme() {
            this.$toggle.addEventListener('click', () => {
                if (this.$toggle) {
                    document.body.style.backgroundColor ="#FFFFFF";
                    document.body.style.color ="#010409";
                    this.$boxGH.style.backgroundColor = "#FFFFFF";
                    this.$boxPGM.style.backgroundColor = "#FFFFFF";
                    this.$switch.style.marginLeft= "calc(3.3rem - 0.15rem)";
                    this.$toggle = false;
                } else {
                    document.body.style.backgroundColor ="";
                    document.body.style.color ="";
                    this.$boxGH.style.backgroundColor = "";
                    this.$boxPGM.style.backgroundColor = "";
                    this.$switch.style.marginLeft ="";
                    this.$toggle = true;
                }
            })
        }
    };
    app.init()
})();