const mru_app = document.querySelector('[mru-app]');
const btn_run = document.querySelector('#btn-run');
const car_1 = document.querySelector('#car-1');
const car_2 = document.querySelector('#car-2');
const car_3 = document.querySelector('#car-3');
const space_legend = document.querySelectorAll('.s-legend');
const time_legend = document.querySelectorAll('.t-legend');
const v_inputs = document.querySelectorAll('.vctrl');
const a_inputs = document.querySelectorAll('.actrl');

const pfull_w  = document.querySelector('.car').clientWidth; // largura da esquerda do carro até o final do trajeto (pixel)
const proute_w = (pfull_w - 100); // largura da direita do carro ate o final do trajeto (pixel)
const mroute_w = 500; // largura da direita do carro ate o final do trajeto (metros)
const px_m = (proute_w / mroute_w); // constante de conversão

const interval_frame = 40; // define o intervalo de tempo da função setInterval
const fps = (1000 / interval_frame);

class Car {
    constructor (car, vm, am, id) {
        this.car = car;
        this.id = id;
        this.vm = vm;
        this.am = am;
        this.vp = this.converterToPixelSecond(this.vm);
        this.ap = this.converterToPixelSecond(this.am);
        this.vp_frame = (this.vp / fps);
        this.ap_frame = (this.ap / fps);

        this.space = space_legend[id - 1];
        this.time = time_legend[id - 1];
        this.ms = 0; this.s = 0;

        this.end = false;
    }

    get x () { return parseFloat(this.car.style.left.split('px')[0]); }
    set x (x) { this.car.style.left = `${x}px`; }

    animate () {
        
        if (!(this.spaceVaritaion() >= (proute_w - 1))) {
            this.x = this.spaceVaritaion();
            this.vp = this.velocityVariation();
            this.updateVpFrame();
            this.updateSpaceTime();
            this.updateTime();
        } else {
            if (!this.end) {
                this.x = proute_w;
                this.updateTime();
                this.updateSpaceTime();
                this.end = true;
            }
        }

    }

    updateVpFrame () {
        this.vp_frame = (this.vp / fps);
    }

    spaceVaritaion () {
        return (this.x + this.vp_frame);
    }

    velocityVariation () {
        return (this.vp + this.ap_frame);
    }

    updateTime () {
        this.ms += interval_frame;
        if (this.ms == 1000) {
            this.s++;
            this.ms = 0;
        }
    }

    updateSpaceTime () {
        // set space
        this.space.innerHTML = `S = ${this.converterToMeter(this.x).toFixed(2)}m`

        // set time
        let ms_string = (this.ms / 10) >= 10 ? `${this.ms / 10}s` : `0${this.ms / 10}s`;
        this.time.innerHTML = `t = ${this.s}.${ms_string}`;
    }

    converterToPixelSecond (v) {
        return (px_m * v)
    }

    converterToMeterSecond (vp) {
        return ((1 / px_m) * vp)
    }

    converterToMeter (px) {
        return (px / px_m)
    }

    converterToPixel (m) {
        return (m * px_m)
    }
}

function add (id) {
    const number_ctrl = document.getElementById(id);
    if (number_ctrl.value < 100) number_ctrl.value++;
}

function sub (id) {
    const number_ctrl = document.getElementById(id);
    if (number_ctrl.value > 0) number_ctrl.value--;
}

function clearSettings (...car) {
    car.forEach(c => {
        c.updateSpaceTime()
    });
}

function resetLeft (... car) {
    car.forEach(c => { c.style.left = '0px'; } );
}

function initSettings () {
    space_legend.forEach(space => space.innerHTML = 'S = 0.00')
    time_legend.forEach(time => time.innerHTML = 't = 0.00s')
}

initSettings()

let running = false;
function run () {
    resetLeft(car_1, car_2, car_3);
    running = !running;
    btn_run.firstChild.classList.toggle('pause');

    let speeds = []
    v_inputs.forEach(input => {
        speeds.push(input.value)
    })
    
    let accelerations = []
    a_inputs.forEach(input => {
        accelerations.push(input.value)
    })

    const car1 = new Car(car_1, speeds[0], accelerations[0], 1);
    const car2 = new Car(car_2, speeds[1], accelerations[1], 2);
    const car3 = new Car(car_3, speeds[2], accelerations[2], 3);

    const temp = setInterval(() => {
        if (running) {
            car1.animate();
            car2.animate();
            car3.animate();
        } else {
            // clearSettings(car1, car2, car3);
            clearInterval(temp);
        }
    }, interval_frame)
}