(() => {
    const app = {
        init () {
            this.cacheElements();
            this.generateHtmlForWeather();
            this.generateHtmlForCovidCases();
            this.eventListeners();
        },
        cacheElements () {
            this.$weather = document.querySelector('.weather');
            this.$covidCases = document.querySelector('.covid-cases');
            this.$btn = document.getElementById("search-city");
            this.$city = document.getElementById("submit-city");
        },
        async generateHtmlForWeather (city = 'Ghent') {
            await fetch(`https://api.weatherapi.com/v1/current.json?key=b50b7fae602444dab76165810211112&q=$${city}`, {
                method: 'GET'
            })
            .then(result => {
                if (!result.ok) {
                    throw Error('ERROR! this API is not found!');
                }
                return result.json()
            })
            .then(data => {
                this.$weather.innerHTML = `
                <p>${data.location.name}, ${data.location.country}: <span class="temp">${data.location.country.includes('United States of America') ? data.current.temp_f + "°F": data.current.temp_c + "°C"}</span></p>
                <img src="https:${data.current.condition.icon}" alt="${data.current.condition.text}"></img>`
            })
        },
        async generateHtmlForCovidCases () {
            await fetch('https://data.stad.gent/api/records/1.0/search/?dataset=dataset-of-cumulative-number-of-confirmed-cases-by-municipality&q=.', {
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
        eventListeners () {
            document.querySelector('.logo').addEventListener('click', () => {
                document.location.href = 'index.html';
            });
            this.$btn.addEventListener('click', () => {
                this.generateHtmlForWeather(this.$city.value);
            });
            this.$city.addEventListener('keypress', (event) => {
                if (event.keyCode === 13) {
                    this.generateHtmlForWeather(this.$city.value);
                }
            })
        }
    };
    app.init()
})();