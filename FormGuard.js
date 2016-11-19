'use strict'

const FormGuard = {

  form: null,

  registeredTraits: [],

  errorMsgs: [],

  init: function ( el ) {
    // Set Errors Container
    window.formGuardErrorsEl = document.getElementsByClassName("formGuardErrors")[0];
    this.form = el;
    return this;
  },

  /**
   * Registers Input Traits to be checked by validate
   * @param {String} inputName
   * @param {Object} traits
   * @return {Boolean} true
   */

  register: function ( inputName, traits ) {

    // TODO: Handle unrecognised traits such as mispelled

    if ( this._exists(inputName) && this._exists(traits) ) {
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

  /**
   * Validates the input against registered traits.
   * @param {input} input
   * @param {traits} option
   * @return {Boolean} true
   */

  isInputValid: function ( input, option ) {

    if (option.required) {
      if (!this._exists(input.value)) {
        this.errorMsgs.push(input.name + ' is required.');
      }
    }
    // Validates typeof
    if (option.type && this._exists(input.value) ) {
      this.validation.typeOf.bind(this)(input, option);
    }

    // Minimum
    if ( option.minimum ) {
      this.validation.minimum.bind(this)(input, option)
    }

    // Maximum Number amount
    if (option.maximum && (typeof(input.value) === 'number')) {
      this.validation.maximum.bind(this)(input, option)
    }

  },

  /**
   * A collection of validation functions
   */

  validation: {
     typeOf: function ( input, option )  {
      switch (option.type) {
        case 'number':
          if (!parseInt(input.value)) {
            this.errorMsgs.push(input.name + ' is not a ' + option.type + '.');
          }
          break;
        case 'email':
          let msg = `${input.name} is not a valid e-mail address.`

          if ( typeof(input.value) === "string" ) {
            var emailRegEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

            if ( !emailRegEx.test( input.value ) ) {
              this.errorMsgs.push(msg);
            }
          }
          break;
        default:
          if ( typeof(input.value) != option.type ) {
            this.errorMsgs.push(input.name + ' is not a ' + option.type + '.');
          }
      }
    },
    minimum: function ( input, option ) {
      switch ( typeof(input.value) ) {
        case 'number':
          if ( input.value <= option.minimum ) {
            this.errorMsgs.push(input.name + 'must be greater than ' + option.minimum);
          }
          break;
        default:
          if ( input.value.length <= option.minimum ) {
            this.errorMsgs.push(`${input.name} must be longer than ${option.minimum} characters.`);
          }
      }
    },
    maximum: function ( input, option ) {
      switch ( typeof(input.value) ) {
        case 'number':
          if ( input.value <= option.minimum ) {
            this.errorMsgs.push(input.name + 'must be less than ' + option.minimum);
          }
          break;
        default:
          if ( input.value.length <= option.minimum ) {
            this.errorMsgs.push(`${input.name} must be less than ${option.minimum} characters.`);
          }
      }
    }
  },

  validate: function () {
    this.errorMsgs = [];

    for ( let el of this.registeredTraits ) {
      let formEl = this.form[el.name];
      this.isInputValid(formEl, el.traits)
    }

    if ( !this.isValid() ) {
      this.renderErrors();
      return Promise.reject(this.errorMsgs);
    }

    return Promise.resolve(this.form);
  },

  /**
   * Renders Error Message if they are any.
   * @return {undefined}
   */
  renderErrors: function () {
    if ( formGuardErrorsEl && this._exists(this.errorMsgs) ) {

      let errorFragment = document.createDocumentFragment();

      this._forEach(this.errorMsgs, function( errorMsg ) {
        let errorNode = document.createElement("p");

        // Add error node to fragment
        errorNode.innerHTML = errorMsg;
        errorNode.style.color = 'crimson';
        errorFragment.appendChild(errorNode);
      });

      formGuardErrorsEl.innerHTML = '';
      formGuardErrorsEl.appendChild(errorFragment);

    }

    if (formGuardErrorsEl && this.errorMsgs.length === 0) {
      formGuardErrorsEl.innerHTML = '';
    }
  },

  isValid: function(){ return this.errorMsgs.length <= 0 },

  _forEach: function ( array, callback ) {
    for (var index = 0; index < array.length; index++) {
      callback(array[index], index, array);
    }
  },

  _exists: function ( thing ) {
    if (typeof thing === "object"){
      return Object.keys(thing).length > 0
    }

    return (typeof thing !== "undefined" && thing !== null && thing.length > 0);
  }

}
