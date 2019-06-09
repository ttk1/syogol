const ser = require('./serde.js').ser;
const de = require('./serde.js').de;
const dict = require('./serde.js').dict;

const encode = require('./rle.js').encode;
const decode = require('./rle.js').decode;

const DEFAULT_WIDTH = 50;
const DEFAULT_HEIGHT = 50;
const DEFAULT_CELL_SIZE = 15;
const DEFAULT_INTERVAL = 100;

const MIN_POPULATION_TO_LIVE = 2;
const MAX_POPULATION_TO_LIVE = 3;
const MIN_POPULATION_TO_REPRODUCE = 3;
const MAX_POPULATION_TO_REPRODUCE = 3;

class Field {
    constructor(canvas, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT,
        cell_size = DEFAULT_CELL_SIZE, field = null, interval = DEFAULT_INTERVAL) {
        this.width = width;
        this.height = height;
        this.cell_size = cell_size;

        this.field = [];
        this.canvas = canvas;
        this.canvas.width = this.width * this.cell_size;
        this.canvas.height = this.height * this.cell_size;
        this.canvas.style.border = 'solid 1px black';
        this.ctx = this.canvas.getContext('2d');
        this.reset();

        this.canvas.addEventListener('click', (e) => {
            if (this.interval_id != null) {
                return;
            }

            let rect = e.target.getBoundingClientRect();
            let x = Math.floor((e.clientX - rect.left) / this.cell_size);
            let y = Math.floor((e.clientY - rect.top) / this.cell_size);
            if (this.get(x, y)) {
                this.unfill(x, y);
            } else {
                this.fill(x, y);
            }
            this.flip(x, y);
        })

        if (field) {
            this.field = field;
            this.draw();
        }

        this.interval = interval;
        this.interval_id = null;
    }

    step() {
        let next_field = [];
        for (let x = 0; x < this.width; x++) {
            next_field[x] = [];
            for (let y = 0; y < this.height; y++) {
                next_field[x][y] = isLiveCellNextStep(this.field, x, y);
            }
        }
        this.field = next_field;

        function isLiveCellNextStep(field, x, y) {
            let count = countLiveNeighbors(field, x, y);
            if (field[x][y]) {
                return MIN_POPULATION_TO_LIVE <= count &&
                    count <= MAX_POPULATION_TO_LIVE;
            }
            return MIN_POPULATION_TO_REPRODUCE <= count &&
                count <= MAX_POPULATION_TO_REPRODUCE;
        }

        function countLiveNeighbors(field, x, y) {
            let count = 0;
            for (let xo = -1; xo <= 1; xo++) {
                for (let yo = -1; yo <= 1; yo++) {
                    if ((xo != 0 || yo != 0) &&
                        field[x + xo] &&
                        field[x + xo][y + yo]) {
                        count++;
                    }
                }
            }
            return count;
        }
    }

    get(x, y) {
        return this.field[x][y];
    }

    set(x, y, val) {
        this.field[x][y] = val;
    }

    flip(x, y) {
        this.field[x][y] = !this.field[x][y];
    }

    start() {
        if (this.interval_id == null) {
            this.interval_id = window.setInterval(() => {
                this.step();
                this.refresh();
                this.draw();
            }, this.interval);
        }
    }

    stop() {
        if (this.interval_id != null) {
            window.clearInterval(this.interval_id)
            this.interval_id = null;
        }
    }

    reset() {
        this.stop();
        this.refresh();
        for (let x = 0; x < this.width; x++) {
            this.field[x] = [];
            for (let y = 0; y < this.height; y++) {
                this.field[x][y] = false;
            }
        }
    }

    refresh() {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.strokeStyle = 'gray';
        this.ctx.lineWidth = 1;
        for (let x = 1; x < this.width; x++) {
            this.ctx.beginPath();
            this.ctx.moveTo(x * this.cell_size + 0.5, 0);
            this.ctx.lineTo(x * this.cell_size + 0.5, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 1; y < this.height; y++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y * this.cell_size + 0.5);
            this.ctx.lineTo(this.canvas.height, y * this.cell_size + 0.5);
            this.ctx.stroke();
        }
    }

    draw() {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (this.get(x, y)) {
                    this.fill(x, y);
                }
            }
        }
    }

    fill(x, y) {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(x * this.cell_size + 0.5, y * this.cell_size + 0.5, this.cell_size - 0.5, this.cell_size - 0.5);
    }

    unfill(x, y) {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(x * this.cell_size + 0.5, y * this.cell_size + 0.5, this.cell_size - 0.5, this.cell_size - 0.5);
    }
}

function init_button(field) {
    const container = document.getElementById('container');
    const button_area = document.createElement('div');
    button_area.style.display = 'block';
    container.appendChild(button_area);

    const start_button = document.createElement('button');
    start_button.innerHTML = 'スタート';
    const stop_button = document.createElement('button');
    stop_button.innerHTML = 'ストップ';
    const reset_button = document.createElement('button');
    reset_button.innerHTML = 'リセット';
    const save_button = document.createElement('button');
    save_button.innerHTML = 'セーブ';

    button_area.appendChild(start_button);
    button_area.appendChild(stop_button);
    button_area.appendChild(reset_button);
    button_area.appendChild(save_button);

    start_button.addEventListener('click', () => field.start());
    stop_button.addEventListener('click', () => field.stop());
    reset_button.addEventListener('click', () => field.reset());
    save_button.addEventListener('click', () => {
        const field_data = {
            width: field.width,
            height: field.height,
            cell_size: field.cell_size,
            field: field.field
        };
        window.location.search = '?data=' + encode(ser(field_data), dict);
    });
}

exports.start = (canvas, data) => {
    var field;
    if (data) {
        const field_data = de(decode(data, dict));
        field = new Field(canvas, field_data.width, field_data.height,
            field_data.cell_size, field_data.field);
    } else {
        field = new Field(canvas);
    }
    init_button(field);
}