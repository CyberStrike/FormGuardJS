'use strict'

const FormGuard = {

  form: null,

  registeredTraits: [],

  errorMsgs: [],

  init: function ( formEl ) {
    // Set Errors Container
    window.formGuardErrorsEl = document.getElementsByClassName("formGuardErrors")[0];
    this.form = form;
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
      return this
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

    // TODO: Get input name from label text
    // TODO: Seperate Error messages into an object
    // TODO: Make validations more pure and only return Booleans
    //       and make isInputValid the error emitter. This will
    //       will allow us to use our own validators

    // Validates Field  is required
    if (option.required) {
      this.validation.required.bind(this)(input, option);
    }

    // Validates typeof
    if (option.type && this._exists(input.value) ) {
      this.validation.typeOf.bind(this)(input, option);
    }

    // Minimum Length or Amount
    if ( option.minimum ) {
      this.validation.minimum.bind(this)(input, option)
    }

    // Maximum Length or Amount
    if (option.maximum && (typeof(input.value) === 'number')) {
      this.validation.maximum.bind(this)(input, option)
    }

    // Check that Field Value is Equal to Supplied Value
    if (option.equals) {
      this.validation.equals.bind(this)(input, option)
    }

    // Check if Two Field Values are Equal
    if (option.isSameAs) {
      this.validation.isSameAs.bind(this)(input, option)
    }

  },

  /**
   * A collection of validation functions
   */

  validation: {
    required: function ( input, option ) {
      var msg = input.name + ' is required.'

      switch (input.type) {
        case 'checkbox':
          if (!input.checked) {
            this.addErrorMsg( input, msg );
          }
          break;
        default:
          if (!this._exists(input.value)) {
            this.addErrorMsg( input, msg );
          }
      }
    },
    typeOf:   function ( input, option ) {
      switch (option.type) {
        case 'number':
          var msg = input.name + ' is not a ' + option.type + '.'
          var valueType = parseInt(input.value)

          if ( isNaN(valueType) ) {
            this.addErrorMsg( input, msg );
          }

          break;
        case 'email':
          var msg = `${input.name} is not a valid e-mail address.`

          if ( typeof(input.value) === "string" ) {
            let emailRegEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

            if ( !emailRegEx.test( input.value ) ) {
              this.addErrorMsg( input, msg );
            }
          }
          break;
        case 'alphanumeric':
          var msg = `${input.name} must have only letters and numbers`
          let alphanumeric = /^[a-zA-Z0-9_]*$/;

          if ( !alphanumeric.test(input.value) ) {
            this.addErrorMsg( input, msg );
          }

          break;
        default:
          if ( typeof(input.value) != option.type ) {
            this.errorMsgs.push(input.name + ' is not a ' + option.type + '.');
          }
      }
    },
    minimum:  function ( input, option ) {
      switch ( typeof(input.value) ) {
        case 'number':
          if ( input.value <= option.minimum ) {
            msg =
            this.errorMsgs.push(input.name + 'must be greater than ' + option.minimum);
          }
          break;
        default:
          if ( input.value.length < option.minimum ) {
            this.errorMsgs.push(`${input.name} must be longer than ${option.minimum} characters.`);
          }
      }
    },
    maximum:  function ( input, option ) {
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
    },
    equals:   function ( input, option ) {
      var msg = `${input.name} is not equal to ${option.equals}`

      if ( !(input.value === option.equals) ) {
        this.addErrorMsg(msg);
      }
    },
    isSameAs: function ( input, option ) {
      var msg = `${input.name} is not equal to ${option.isSameAs}`

      if ( !(input.value === form[option.isSameAs].value) ) {
        this.addErrorMsg(msg);
      }
    },
  },

  validate: function () {
    this.errorMsgs = [];

    for ( let el of this.registeredTraits ) {
      let field = this.form[el.name];
      this.isInputValid(field, el.traits)
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

    // Remove Error Messages
    this._removeFgErrorMsgs()

    this._forEach(this.errorMsgs, function ( error ) {

      let errorNode = document.createElement("p");

      if ( typeof(error) === "object" ) {
        let inputContainer = error.input.parentElement.parentElement
        error.input.classList.add('hasError');

        // Add error node to GrandParent
        errorNode.innerHTML = error.msg;
        errorNode.classList.add('fgErrorMsg');
        errorNode.style.color = 'crimson';

        inputContainer.insertBefore(
          errorNode, inputContainer.firstChild
        );
      }

      if ( formGuardErrorsEl && typeof(error) !== "object" ) {

        let errorFragment = document.createDocumentFragment();

        // Add error node to fragment
        errorNode.innerHTML = error;
        errorNode.style.color = 'crimson';
        errorFragment.appendChild(errorNode);

        formGuardErrorsEl.appendChild(errorFragment);

      }

    })

  },

  isValid: function () { return this.errorMsgs.length <= 0 },

  addErrorMsg: function ( input, msg ) {
    this.errorMsgs.push({
      input: input,
      msg: msg
    });
  },

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
  },

  _removeFgErrorMsgs: function () {
    let fgErrorMsgs = document.querySelectorAll('.fgErrorMsg')

    if ( this._exists(fgErrorMsgs) ) {
      this._forEach( fgErrorMsgs, ( errorMsgEl ) => {
        errorMsgEl.parentElement.removeChild(errorMsgEl)
      })
    }

    if ( formGuardErrorsEl ) {
      formGuardErrorsEl.innerHTML = '';
    }
  }

}
