// class controls qty
class Control {
    constructor({
        el,
        editable,
        bind = null,
        step = 1,
        value = 1,
        drop = null,
        limit = 50,
        min = 1,
        first = false,
        classes = null,
        call = null
    }) {
        this.parent = document.querySelector(el) || el;
        this.editable = editable;
        this.parentID = el;
        this.limit = limit;
        this.initValue = value;
        this.min = parseInt(step);
        this.parentD = el.split('#').join('');
        this.drop = drop;
        this.name = this.parent.dataset.name;
        this.inputClass = classes;
        let callback = call;

        this.parent.removeAttribute('data-name');

        if (this.drop != null) {
            if (!window.controls.includes(el)) {
                window.controls.push(el);
            } else {
                alert('Este control ya esta registrado');
                document.querySelector(el).remove();
                delete this.drop;
            }
        }

        this.bind = bind;
        this.step = parseInt(this.parent.getAttribute('data-set-qty')) || parseInt(step);
        this.val = this.initValue < this.min ? this.min : this.initValue;
        this.bindValue = 0;

        if (this.parent.getAttribute('value') != undefined) {
            this.inputValue = parseInt(this.parent.getAttribute('value') || this.parent.getAttribute('value') || this.val || this.step);
        }

        this.inputID = `input-${el.split('#').join('')}`;

        this.template = `<div class="oh-flex oh-flex-center-v oh-flex-nowrap">
		<img is-icon-medium class="control-qty ${this.parentD}-qty-menos" src="/website-images/icons/product/menos-negro.svg">
		<input disabled name="${this.name}" type="text" id="${this.inputID}" class="oh-input oh-black ${this.inputClass}" placeholder="1" maxlength="2" value="{{value}}" ${this.inputClass === null ? 'style="min-width:80px; max-width: 80px; margin:0 1rem; padding: 0.25rem;text-align:center;"' : ''}>
		<img  class="control-qty ${this.parentD}-qty-mas" is-icon-medium src="/website-images/icons/product/mas-negro.svg"></div>`;

        this.init(callback);
    }

    init(callback) {
        let $template = this.template.replace(/\{\{value\}\}/g, this.getInputValue);
        this.parent.innerHTML = $template;
        this.updateInput(this.getInputValue, callback);
        this.watch(callback);
    }

    get idInput() {
        return '#' + this.inputID;
    }

    set inputValue(value) {
        this.val = 0;
        this.val = value;
    }
    set setLimit(value) {
        this.limit = value;
    }
    get getLimit() {
        return parseInt(this.limit);
    }
    set setMin(value) {
        this.min = value;
    }
    get getMin() {
        return parseInt(this.min);
    }
    get getInputValue() {
        return parseInt(this.val);
    }

    get getStep() {
        return parseInt(this.step);
    }

    set setStep(value) {
        this.step = value;
    }

    updateInput(value, callback) {
        this.inputValue = value;
        let $_id = `${this.parentID} #${this.inputID}`;
        let input = document.querySelector($_id);
        input.setAttribute('value', 0);
        $($_id).val(0);

        // console.log(this.getInputValue);

        if (callback !== null && this.first === true) {
            callback.call(this);
        } else {
            this.first = true;
        }
        input.setAttribute('value', value);
        $($_id).val(value);
        this.updateLabel(value);
    }

    updateLabel(value) {
        if (this.bind !== null) {
            let $__val = 0;
            let $label = document.querySelector(this.bind);
            $__val = parseFloat($label.getAttribute('data-base'));

            $__val = ($__val * value) / this.step;

            $__val = number_format($__val);
            $label.innerHTML = `$ ${$__val} ${getURL(0) == 'mx' ? 'MXN' : ''}`;
        }
    }

    watch(callback) {

        let qty_menos = this.parent.querySelector('.' + this.parentD + '-qty-menos');
        $(document).on('click', qty_menos, e => {

            let value = this.getInputValue || this.getStep;
            // console.log(value, this.getInputValue, this.getStep);

            if (e.target.classList.contains(this.parentD + '-qty-menos')) {
                if (value > this.getMin) {
                    console.log(this.getMin, value);
                    value -= this.getStep;
                    this.updateInput(value, callback);
                } else {
                    console.log('mayor');
                    value = this.getMin;
                }
                // console.log(this.getMin);
            }
        });

        let qty_mas = this.parent.querySelector('.' + this.parentD + '-qty-mas');
        $(document).on('click', qty_mas, e => {

            let value = this.getInputValue || this.getStep;
            // console.log(value, this.getInputValue, this.getStep);

            if (e.target.classList.contains(this.parentD + '-qty-mas')) {
                if (value < (this.getLimit - this.getStep)) {
                    value += this.getStep;
                } else {
                    value = this.getLimit;
                }
                this.updateInput(value, callback);
                // console.log(this.inputID);
            }
        });
    }
}
