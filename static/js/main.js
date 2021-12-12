(() => {
    const app = {
        init () {
            this.cacheElements();
            this.generateHtmlForUsers();
        },
        cacheElements () {
            this.$users = document.querySelector('.users');
        },
        generateHtmlForUsers () {
            fetch("static/data/pgm.json")
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
        generateListeners (user) {
            this.$uniqueUser = document.querySelectorAll('.box-user');
            for (const $user of this.$uniqueUser) {
                $user.addEventListener('click', () => {
                    this.generateInfoForUser($user, user);
                })
            }
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