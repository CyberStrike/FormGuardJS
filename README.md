# FormGuardJS

A Simple Form Validation Library that comes with it's own error messages.

[Example](https://cyberstrike.github.io/FormGuardJS/)

## QuickStart

```html

<!-- Create a Form -->

<!-- Add A Container to show the errors -->

<div class="formGuardErrors"></div>
<form onsubmit="return validateForm()">
  <div>
    <label> E-mail
      <!-- Each input MUST have a “name” attribute -->

      <input type="text" name="email">
    </label>
  </div>
  <div>
    <label>  Password
      <input type="text" name="password">
    </label>
  </div>
  <div>
    <label>  Remember Me?
      <input type="checkbox" name="remember">
    </label>
  </div>
  <div>
    <button type="submit">Login</button>
  </div>
</form>

<!-- Include FormGuard -->
<script src="./FormGuard.js" charset="utf-8"></script>

<script type="text/javascript">

    var form = document.querySelectorAll('form')[0];

    // Initialize FormGuard and pass your form as an argument.

    var formGuard = FormGuard.init( form );

    // Register the inputs and traits you want to check for.

    formGuard.register( 'email', {
      required: true,
      type: 'email'
    })

    formGuard.register( 'password', {
      required: true,
      type: 'string',
      minimum: 8
    })

    // On Form Submit call validate on formGuard

    function validateForm () {
       formGuard.validate()
       return formGuard.isValid()
    }

    // Example using an event

    // FormGuard.validate()
    // returns a promise with the form object as the first argument
    // so you can do whatever you need.


    // form.addEventListener( 'submit', function (event) {
    //   event.preventDefault();
    //   formGuard.validate()
    //     .then( function (validForm) {
    //       console.log(validForm)
    //     })
    //     .catch(
    //       (value)=> console.log(value)
    //     )
    // });

</script>
```
