'use strict'

const FormGuard = {

  form: null,

  registeredTraits: [],

  errorMsgs: [],

  init: function (form) {
    // Set Errors Container
    window.formGrdErrEl = document.getElementsByClassName('formGuardErrors')[0]
    this.form = form
    return this
  },

  /**
   * Registers Input Traits to be checked by validate
   * @param {String} inputName
   * @param {Object} traits
   * @return {Boolean} true
   */

  register: function (inputName, traits) {
    // TODO: Handle unrecognised traits such as mispelled

    // Something like this maybe, the one issue is that the options are
    // not necessarily the same name as the validator name. For example type uses typeOf.
    // I don't want to create an array of options and have to update it
    // everytime we add a new one.

    // function checkTraits (traits, validators) {
    //   let arrayOfPossibleOptions
    //   let arrayOfPassedTraitOptions
    //
    //   BadOption = arrayOfPossibleOptions !== arrayOfPassedTraitOptions
    //
    //   if ( Bad Option) {
    //     throw A Message with the invalid option
    //   }
    // }

    if (this._exists(inputName) && this._exists(traits)) {
      this.registeredTraits.push(
        {
          name: inputName,
          traits: traits
        }
      )
      return this
    }

    let ArgumentError = {
      name: 'ArgumentError',
      message: 'Requires input name and traits to check.'
    }

    throw ArgumentError
  },

  /**
   * Validates the input against registered traits.
   * @param {input} input
   * @param {traits} option
   * @return {Boolean} true
   */

  isInputValid: function (input, option) {
    // TODO: Get input name from label text
    // TODO: Seperate Error messages into an object
    // TODO: Make validations more pure and only return Booleans
    //       and make isInputValid the error emitter. This will
    //       will allow us to use our own validators

    // Validates Field  is required
    if (option.required) {
      this.validation.required.call(this, input, option)
    }

    // Validates typeof
    if (option.type && this._exists(input.value)) {
      this.validation.typeOf.call(this, input, option)
    }

    // Minimum Length or Amount
    if (option.minimum) {
      this.validation.minimum.call(this, input, option)
    }

    // Maximum Length or Amount
    if (option.maximum) {
      this.validation.maximum.call(this, input, option)
    }

    // Check that Field Value is Equal to Supplied Value
    if (option.equals) {
      this.validation.equals.call(this, input, option)
    }

    // Check if Two Field Values are Equal
    if (option.isSameAs) {
      this.validation.isSameAs.call(this, input, option)
    }
  },

  /**
   * A collection of validation functions
   * @param {input} input
   * @param {traits} option
   * @return {undefined} undefined
   */

  validation: {
    required: function (input, option) {
      let msg = input.name + ' is required.'

      switch (input.type) {
        case 'checkbox':
          if (!input.checked) {
            this.addErrorMsg(input, msg)
          }
          break
        default:
          if (!this._exists(input.value)) {
            this.addErrorMsg(input, msg)
          }
      }
    },
    typeOf:   function (input, option) {
      switch (option.type) {
        case 'number' :
          let numberMsg = `${input.name} is not a ${option.type}.`
          let getNumber = parseInt(input.value)

          if (isNaN(getNumber)) {
            this.addErrorMsg(input, numberMsg)
          }

          break
        case 'email' :
          let emailMsg = `${input.name} is not a valid e-mail address.`

          if (typeof (input.value) === 'string') {
            let emailRegEx = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

            if (!emailRegEx.test(input.value)) {
              this.addErrorMsg(input, emailMsg)
            }
          }

          break
        case 'alphanumeric':
          let alphanumericMsg = `${input.name} must have only letters and numbers`
          let alphanumeric = /^[a-zA-Z0-9_]*$/

          if (!alphanumeric.test(input.value)) {
            this.addErrorMsg(input, alphanumericMsg)
          }

          break
        default:
          let typeofMsg = `${input.name} is not a ${option.type}.`

          if (typeof (input.value) !== option.type) {
            this.addErrorMsg(input, typeofMsg)
          }
      }
    },
    minimum:  function (input, option) {
      switch (input.type) {
        case 'number':
          let minNumberMsg = `${input.name} must be greater than ${option.minimum}.`

          if (parseInt(input.value) <= option.minimum) {
            this.addErrorMsg(input, minNumberMsg)
          }

          break
        default:
          let minimumMsg = `${input.name} must be longer than ${option.minimum} characters.`

          if (input.value.length < option.minimum) {
            this.addErrorMsg(input, minimumMsg)
          }
      }
    },
    maximum:  function (input, option) {
      switch (input.type) {
        case 'number':
          let maxNumberMsg = `${input.name} must not be more than ${option.maximum}`

          if (parseInt(input.value) > option.maximum) {
            this.addErrorMsg(input, maxNumberMsg)
          }

          break
        default:
          var maximumMsg = `${input.name} must not be longer than ${option.maximum} characters.`

          if (input.value.length > option.maximum) {
            this.addErrorMsg(input, maximumMsg)
          }
      }
    },
    equals:   function (input, option) {
      let equalsMsg = `${input.name} is not equal to ${option.equals}`

      if (!(input.value === option.equals)) {
        this.addErrorMsg(input, equalsMsg)
      }
    },
    isSameAs: function (input, option) {
      var msg = `${input.name} is not equal to ${option.isSameAs}`

      if (!(input.value === this.form[option.isSameAs].value)) {
        this.addErrorMsg(input, msg)
      }
    }
  },

  validate: function () {
    this.errorMsgs = []

    for (let el of this.registeredTraits) {
      let field = this.form[el.name]
      this.isInputValid(field, el.traits)
    }

    if (!this.isValid()) {
      this.renderErrors()
      return Promise.reject(this.errorMsgs)
    }

    return Promise.resolve(this.form)
  },

  /**
   * Renders Error Message if they are any.
   * @return {undefined}
   */
  renderErrors: function () {
    // Remove Error Messages
    this._removeFgErrorMsgs()

    this._forEach(this.errorMsgs, function (error) {
      // TODO: Extract the if statements into their own functions

      let errorNode = document.createElement('p')

      if ((typeof error) === 'object') {
        let inputContainer = error.input.parentElement

        // Add Classes
        error.input.parentElement.classList.add('has-error')
        error.input.classList.add('has-error')

        // Add error node to GrandParent
        errorNode.innerHTML = error.msg
        errorNode.classList.add('fgErrorMsg')
        errorNode.style.color = 'crimson'

        inputContainer.insertBefore(
          errorNode, error.input
        )
      }

      if (window.formGrdErrEl && (typeof error) !== 'object') {
        let errorFragment = document.createDocumentFragment()

        // Add error node to fragment
        errorNode.innerHTML = error
        errorNode.style.color = 'crimson'
        errorFragment.appendChild(errorNode)

        window.formGrdErrEl.appendChild(errorFragment)
      }
    })
  },

  isValid: function () { return this.errorMsgs.length <= 0 },

  addErrorMsg: function (input, msg) {
    this.errorMsgs.push({
      input: input,
      msg:   msg
    })
  },

  _forEach: function (array, callback) {
    for (var index = 0; index < array.length; index++) {
      callback(array[index], index, array)
    }
  },

  _exists: function (thing) {
    if ((typeof thing) === 'object') {
      return Object.keys(thing).length > 0
    }

    return (
      (typeof thing) !== 'undefined' && thing !== null && thing.length > 0
    )
  },

  _removeFgErrorMsgs: function () {
    let fgErrorMsgs = document.querySelectorAll('.fgErrorMsg')

    if (this._exists(fgErrorMsgs)) {
      this._forEach(fgErrorMsgs, (errorMsgEl) => {
        errorMsgEl.parentElement.removeChild(errorMsgEl)
      })
    }

    if (window.formGrdErrEl) {
      window.formGrdErrEl.innerHTML = ''
    }
  }

}
