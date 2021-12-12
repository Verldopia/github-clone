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
        },
        generateHtmlForWeather (city = 'ghent') {
            fetch(`http://api.weatherapi.com/v1/current.json?key=b50b7fae602444dab76165810211112&q=$${city}`, {
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
                <p>${data.location.name}, ${data.location.country}: <span class="temp">${data.location.tz_id.includes("Europe")  ? data.current.temp_c + "°C": data.current.temp_f + "°F"}</span></p>
                <img src="${data.current.condition.icon}" alt="Presenting current weather"></img>`
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
        eventListeners () {
            document.querySelector('.logo').addEventListener('click', () => {
                document.location.href = 'index.html';
            });
            this.$btn = document.getElementById("search-city");
            this.$btn.addEventListener('click', () => {
                const city = document.getElementById("submit-city").value;
                this.generateHtmlForWeather(city)
            });
        }
    };
    app.init()
})();