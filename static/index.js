class AddressTranslator {
    constructor() {
        this.cache = {};
        this.queue = [];
        this.geocoder = new google.maps.Geocoder();
        setInterval(() => {
            if (this.queue.length > 0)
                this.queue.pop()();
        }, 700);
    }

    translate = async address => {
        const promise = new Promise((resolve, reject) => {
            if (address in this.cache) {
                this.cache[address]
                    .then(result  => resolve(result))
                    .catch(status => reject(status));
            } else {
                this.queue.push(() => {
                    this.geocoder.geocode({ 'address': address }, (results, status) => {
                        if (status == 'OK') {
                            resolve(results[0].geometry.location);
                        } else {
                            reject(status);
                        }
                    });
                });
            }
        });
        this.cache[address] = promise;
        return promise;
    };
}

class ProgressBar {
    constructor(max) {
        this.progress = 0;
        this.max = max;
        this.bar = document.querySelector('.progress-bar');
        this.map = document.getElementById('map');
        this.map.style.display = 'none';
    }

    increment = () => {
        this.progress++;
        this.bar.style.width = Math.floor(this.progress / this.max * 100) + '%';
        this.bar.innerHTML = Math.floor(this.progress / this.max * 100) + '%';
        if (this.max == this.progress) {
            document.getElementById('map-loading-progress-bar').style.display = 'none';
            this.map.style.display = 'block';
        }
    }
}

class MarkersPlacer {
    constructor() {
        this.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 8,
            center: {
                lat: 31.945368,
                lng: 35.928371
            }
        });
        this.oms = new OverlappingMarkerSpiderfier(this.map, {
            markersWontMove: true,
            markersWontHide: true,
            basicFormatEvents: true
        });
        this.iw = new google.maps.InfoWindow();
    }

    placeMarker = (pos, title) => {
        let marker = new google.maps.Marker({
            position: {
                lat: pos.lat() + Math.random() / 100,
                lng: pos.lng() + Math.random() / 100
            }
        });
        google.maps.event.addListener(marker, 'spider_click', (e) => {
            this.iw.setContent(title);
            this.iw.open(this.map, marker);
        });
        this.oms.addMarker(marker);
    }
}