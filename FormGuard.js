'use strict'

const FormGuard = {

  _valid: true,

  form: null,

  registeredTraits: [],

  errorMsgs: [],

  init: function ( el ) {
    // Set Errors Container
    window.formGuardErrorsEl = document.getElementsByClassName("formGuardErrors")[0];
    this.form = el;
    return this;
  },

  register: function ( inputName, traits ) {
    if ( exists(inputName) && exists(traits) ) {
      this.registeredTraits.push(
        {
          name: inputName,
          traits: traits
        }
      );
      return true
    }
    throw 'Requires input name and traits to check.'
  },

  isInputValid: function ( input, option ) {
    let valid = true;

    if (option.required) {
      if (!exists(input.value)) {
        valid = false;
        this.errorMsgs.push(input.name + ' is required.');
      }
    }
    // Validates typeof
    if (option.type && exists(input.value) ) {
      this.validation.typeOf.bind(this)(input, option);
    }

    // Minimum
    if ( option.minimum ) {
      this.validation.minimum.bind(this)(input, option)
    }

    // Maximum Number amount
    if (option.maximum && (typeof(input.value) === 'number')) {

    }

    return valid;
  },

  validation: {
    typeOf: ( input, option ) => {
      console.log(this);
      switch (option.type) {
        case 'number':
          if (!parseInt(input.value)) {
            console.log('typeof: number')
            this.valid = false;
            this.errorMsgs.push(input.name + ' is not a ' + option.type + '.');
          }
          break;
        case 'email':
          if ( typeof(input.value) === "string" ) {
            var emailRegEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

            if ( !emailRegEx.test( input.value ) ) {
              this._valid = false;
              this.errorMsgs.push(input.name + ' is not a valid e-mail address.');
            }

          }
          break;
        default:
          if ( typeof(input.value) != option.type ) {
            this._valid = false;
            this.errorMsgs.push(input.name + ' is not a ' + option.type + '.');
          }
      }
    },
    minimum: ( input, option ) => {
      switch ( typeof(input.value) ) {
        case 'number':
          if ( input.value <= option.minimum ) {
            this._valid = false;
            this.errorMsgs.push(input.name + 'must be greater than ' + option.minimum);
          }
          break;
        default:
          if ( input.value.length <= option.minimum ) {
            FormGuard._valid = false;
            FormGuard.errorMsgs.push(`${input.name} must be longer than ${option.minimum} characters.`);
          }
      }
    },
    maximum: ( input, option ) => {
      if (input.value <= option.minimum) {
        _valid = false;
        this.errorMsgs.push(input.name + 'must be less than ' + option.minimum);
      }
    }
  },

  validate: function () {
    for ( let el of this.registeredTraits ) {
      let formEl = this.form[el.name];
      this.isInputValid(formEl, el.traits)
    }

    if ( exists(this.errorMsgs) ) {
      this.renderErrors();
      this.errorMsgs = [];
      return Promise.reject('false');
    }

    this.renderErrors();
    this.errorMsgs = [];
    return Promise.resolve('true');
  },

  renderErrors: function () {
    var errorFragment = document.createDocumentFragment();

    forEach(this.errorMsgs, function(errorMsg) {
      var errorNode = document.createElement("p");

      // Add error node to fragment
      errorNode.innerHTML = errorMsg;
      errorNode.style.color = 'crimson';
      errorFragment.appendChild(errorNode);
    });

    formGuardErrorsEl.innerHTML = '';
    formGuardErrorsEl.appendChild(errorFragment);
  }
}

// Utilities

function forEach(array, callback) {
  for (var index = 0; index < array.length; index++) {
    callback(array[index], index, array);
  }
}

function exists(thing) {
  if (typeof thing === "object"){
    return Object.keys(thing).length > 0
  }

  return (typeof thing !== "undefined" && thing !== null && thing.length > 0);
}
