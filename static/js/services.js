(() => {
    const app = {
        init () {
            this.cacheElements();
            this.generateHtmlForWeather();
            this.generateHtmlForCovidCases();
            this.eventListener();
        },
        cacheElements () {
            this.$weather = document.querySelector('.weather');
            this.$covidCases = document.querySelector('.covid-cases');
        },
        generateHtmlForWeather () {
            fetch('http://api.weatherapi.com/v1/current.json?key=b50b7fae602444dab76165810211112&q=$Ghent', {
                method: 'GET'
            })
            .then(result => {
                if (!result.ok) {
                    throw Error('ERROR! this API is not found!');
                }
                return result.json()
            })
            .then(data => {
                const weather = data.current;
                this.$weather.innerHTML = `
                <p>${weather.temp_c}°C</p>
                <img src="${weather.condition.icon}" alt="Presenting current weather"></img>`
            })
        },
        generateHtmlForCovidCases () {
            fetch('https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=.', {
                method: 'GET'
            })
            .then(result => {
                if (!result.ok) {
                    throw Error('ERROR! this API is not found!');
                }
                return result.json()
            })
            .then(data => {
                const cases = data.records[0].fields.cases;
                this.$covidCases.innerHTML = `
                <p>${cases}</p>
                <img src="static/media/images/virus--white.png" alt="Presenting virus"></img>`
            });
        },
        eventListener () {
            const home = document.querySelector('.logo');
            home.addEventListener('click', () => {
                document.location.href = 'index.html';
            });
        }
    };
    app.init()
})();